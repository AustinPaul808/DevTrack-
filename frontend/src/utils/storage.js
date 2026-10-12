/**
 * Safe local storage wrapper with fallback
 */

export function getStoredItem(key, fallbackValue) {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return fallbackValue;
    return JSON.parse(item);
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return fallbackValue;
  }
}

export function setStoredItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing to localStorage key "${key}":`, err);
  }
}

export function removeStoredItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`Error removing localStorage key "${key}":`, err);
  }
}
