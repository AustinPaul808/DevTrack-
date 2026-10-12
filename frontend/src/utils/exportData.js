/**
 * Client-side data export to JSON & CSV
 */

export function exportToJson(data, filename = 'devtrack-backup.json') {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportSessionsToCsv(sessions, projects, filename = 'devtrack-sessions.csv') {
  const projectMap = (projects || []).reduce((acc, p) => {
    acc[p.id] = p.name;
    return acc;
  }, {});

  const headers = ['ID', 'Project', 'Started At', 'Ended At', 'Duration (Hours)', 'Note'];
  const rows = (sessions || []).map(s => {
    const projName = projectMap[s.projectId] || s.projectId || 'Unassigned';
    const hours = (s.durationSeconds / 3600).toFixed(2);
    const note = (s.note || '').replace(/"/g, '""');
    return [
      `"${s.id}"`,
      `"${projName}"`,
      `"${s.startedAt || ''}"`,
      `"${s.endedAt || ''}"`,
      `"${hours}"`,
      `"${note}"`
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
