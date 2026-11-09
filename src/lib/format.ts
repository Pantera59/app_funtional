const pad2 = (n: number) => n.toString().padStart(2, '0');

/** 125 -> "02:05" */
export const formatClock = (totalSeconds: number) =>
  `${pad2(Math.floor(totalSeconds / 60))}:${pad2(totalSeconds % 60)}`;

/** 5 -> "05:00" */
export const formatMinutes = (minutes: number) => formatClock(minutes * 60);

/** 22 -> "22", 13.5 -> "13:30": whole minutes read better as a plain number (Plan B can leave fractions). */
export const formatShortMinutes = (minutes: number) =>
  Number.isInteger(minutes) ? String(minutes) : formatMinutes(minutes);

/** "Sin-Flexion-Profunda" -> "Sin Flexion Profunda" */
export const humanize = (value: string) => value.replace(/-/g, ' ');
