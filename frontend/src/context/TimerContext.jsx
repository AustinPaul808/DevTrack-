import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useApp } from './AppContext';
import { getStoredItem, setStoredItem, removeStoredItem } from '../utils/storage';

const TimerContext = createContext(null);
const TIMER_STORAGE_KEY = 'devtrack_active_timer';

export function TimerProvider({ children }) {
  const { addSession, projects } = useApp();

  // Load recoverable timer state from localStorage
  const [timerState, setTimerState] = useState(() => {
    const saved = getStoredItem(TIMER_STORAGE_KEY, null);
    if (saved && (saved.status === 'running' || saved.status === 'paused')) {
      return saved;
    }
    return {
      status: 'idle', // 'idle' | 'running' | 'paused'
      projectId: '',
      note: '',
      segmentStartTime: null, // timestamp in ms
      accumulatedSeconds: 0,
      sessionStartTimeISO: null
    };
  });

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef(null);

  // Compute live elapsed time using timestamps
  const calculateElapsed = (state = timerState) => {
    if (state.status === 'idle') return 0;
    let total = state.accumulatedSeconds || 0;
    if (state.status === 'running' && state.segmentStartTime) {
      const liveSegment = Math.max(0, Math.floor((Date.now() - state.segmentStartTime) / 1000));
      total += liveSegment;
    }
    return total;
  };

  // Sync elapsed seconds every second when running
  useEffect(() => {
    if (timerState.status === 'running') {
      setElapsedSeconds(calculateElapsed(timerState));
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(calculateElapsed(timerState));
      }, 1000);
    } else {
      setElapsedSeconds(calculateElapsed(timerState));
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState.status, timerState.segmentStartTime, timerState.accumulatedSeconds]);

  // Persist timer state to storage for recovery across refresh
  useEffect(() => {
    if (timerState.status !== 'idle') {
      setStoredItem(TIMER_STORAGE_KEY, timerState);
    } else {
      removeStoredItem(TIMER_STORAGE_KEY);
    }
  }, [timerState]);

  const startTimer = (projectId, note = '') => {
    if (timerState.status === 'running') return; // Prevent duplicate active sessions

    const now = Date.now();
    const newState = {
      status: 'running',
      projectId: projectId || (projects[0]?.id || ''),
      note: note.trim(),
      segmentStartTime: now,
      accumulatedSeconds: 0,
      sessionStartTimeISO: new Date(now).toISOString()
    };
    setTimerState(newState);
  };

  const pauseTimer = () => {
    if (timerState.status !== 'running') return;

    const now = Date.now();
    const segment = Math.max(0, Math.floor((now - timerState.segmentStartTime) / 1000));
    const newAccumulated = (timerState.accumulatedSeconds || 0) + segment;

    setTimerState(prev => ({
      ...prev,
      status: 'paused',
      segmentStartTime: null,
      accumulatedSeconds: newAccumulated
    }));
  };

  const resumeTimer = () => {
    if (timerState.status !== 'paused') return;

    setTimerState(prev => ({
      ...prev,
      status: 'running',
      segmentStartTime: Date.now()
    }));
  };

  const stopTimer = async () => {
    if (timerState.status === 'idle') return null;

    const totalDuration = calculateElapsed(timerState);
    const sessionRecord = {
      projectId: timerState.projectId || (projects[0]?.id || ''),
      startedAt: timerState.sessionStartTimeISO || new Date().toISOString(),
      endedAt: new Date().toISOString(),
      durationSeconds: Math.max(1, totalDuration),
      note: timerState.note || 'Coding session'
    };

    // Reset timer
    setTimerState({
      status: 'idle',
      projectId: '',
      note: '',
      segmentStartTime: null,
      accumulatedSeconds: 0,
      sessionStartTimeISO: null
    });
    setElapsedSeconds(0);
    removeStoredItem(TIMER_STORAGE_KEY);

    // Save session via AppContext
    const createdSession = await addSession(sessionRecord);
    return createdSession;
  };

  const updateActiveNote = (note) => {
    setTimerState(prev => ({ ...prev, note }));
  };

  const updateActiveProject = (projectId) => {
    setTimerState(prev => ({ ...prev, projectId }));
  };

  const activeProject = projects.find(p => p.id === timerState.projectId);

  const value = {
    timerState,
    elapsedSeconds,
    activeProject,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    updateActiveNote,
    updateActiveProject
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) throw new Error('useTimer must be used within a TimerProvider');
  return context;
}
