import {
  format,
  parseISO,
  differenceInMinutes,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isPast,
  isFuture,
} from 'date-fns';

/**
 * Format date to YYYY-MM-DD
 */
export const formatDateKey = (date) => {
  if (!date) return format(new Date(), 'yyyy-MM-dd');
  if (typeof date === 'string') return date.slice(0, 10);
  return format(date, 'yyyy-MM-dd');
};

/**
 * Format pretty readable date (e.g., "Friday, Sept 25, 2026")
 */
export const formatPrettyDate = (date) => {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, 'EEEE, MMM d, yyyy');
  } catch (e) {
    return date;
  }
};

/**
 * Calculate duration in minutes between startTime ("HH:mm") and endTime ("HH:mm")
 */
export const calculateMinutesDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  const startTotalMinutes = startH * 60 + startM;
  const endTotalMinutes = endH * 60 + endM;

  if (endTotalMinutes < startTotalMinutes) {
    // Crosses midnight e.g. 23:00 to 01:00
    return 24 * 60 - startTotalMinutes + endTotalMinutes;
  }

  return endTotalMinutes - startTotalMinutes;
};

/**
 * Format duration minutes into "1h 30m" or "45m"
 */
export const formatDurationHoursMinutes = (minutes) => {
  if (!minutes || minutes <= 0) return '0m';
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
};

/**
 * Calculate current streak & longest streak from tasks list
 */
export const calculateStreaks = (tasks) => {
  if (!tasks || tasks.length === 0) return { currentStreak: 0, longestStreak: 0, daysActive: 0 };

  // Group completed tasks by date
  const completedDates = new Set();
  tasks.forEach((t) => {
    if (t.status === 'Completed' || t.completed) {
      completedDates.add(t.date);
    }
  });

  const uniqueDaysActive = completedDates.size;
  if (uniqueDaysActive === 0) return { currentStreak: 0, longestStreak: 0, daysActive: 0 };

  const sortedDates = Array.from(completedDates).sort();

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Check if today or yesterday has a completed task for active current streak
  const todayStr = formatDateKey(new Date());
  const yesterdayStr = formatDateKey(subDays(new Date(), 1));

  let checkDate = new Date();
  if (!completedDates.has(todayStr) && completedDates.has(yesterdayStr)) {
    checkDate = subDays(new Date(), 1);
  }

  while (completedDates.has(formatDateKey(checkDate))) {
    currentStreak++;
    checkDate = subDays(checkDate, 1);
  }

  // Calculate longest streak across history
  let prevDate = null;
  sortedDates.forEach((dateStr) => {
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diff = Math.round((new Date(dateStr) - new Date(prevDate)) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDate = dateStr;
  });

  return {
    currentStreak,
    longestStreak,
    daysActive: uniqueDaysActive,
  };
};

/**
 * Calculate Productivity Score (0 - 100)
 */
export const calculateProductivityScore = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed' || t.completed).length;

  if (totalTasks === 0) return 0;

  const completionRate = completedTasks / totalTasks; // 0 to 1

  // Time efficiency ratio
  let plannedTimeSum = 0;
  let actualTimeSum = 0;

  tasks.forEach((t) => {
    plannedTimeSum += t.plannedDuration || 0;
    actualTimeSum += t.actualDuration || t.plannedDuration || 0;
  });

  let timeRatio = 1;
  if (plannedTimeSum > 0 && actualTimeSum > 0) {
    timeRatio = Math.min(1.2, plannedTimeSum / actualTimeSum); // close to planned time is good
  }

  const baseScore = Math.round(completionRate * 85 + timeRatio * 15);
  return Math.min(100, Math.max(0, baseScore));
};
