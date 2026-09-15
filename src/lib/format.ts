const pad2 = (n: number) => n.toString().padStart(2, '0');

/** 125 -> "02:05" */
export const formatClock = (totalSeconds: number) =>
  `${pad2(Math.floor(totalSeconds / 60))}:${pad2(totalSeconds % 60)}`;

/** 5 -> "05:00" */
export const formatMinutes = (minutes: number) => formatClock(minutes * 60);

/** "Sin-Flexion-Profunda" -> "Sin Flexion Profunda" */
export const humanize = (value: string) => value.replace(/-/g, ' ');
