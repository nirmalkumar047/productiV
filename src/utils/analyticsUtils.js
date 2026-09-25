import {
  subDays,
  format,
  parseISO,
  isAfter,
  isBefore,
  startOfDay,
  endOfDay,
  eachDayOfInterval,
} from 'date-fns';
import { formatDateKey } from './dateUtils';

export const CATEGORY_COLORS = {
  Study: '#6366F1', // Indigo
  Work: '#3B82F6', // Blue
  Exercise: '#10B981', // Emerald
  Personal: '#EC4899', // Pink
  Sleep: '#8B5CF6', // Purple
  Food: '#F59E0B', // Amber
  Other: '#64748B', // Slate
};

/**
 * Filter tasks by date range: '7days', '30days', '90days', or custom {startDate, endDate}
 */
export const filterTasksByDateRange = (tasks, filterRange, customRange = null) => {
  if (!tasks) return [];
  const today = new Date();
  let start = subDays(today, 7);
  let end = today;

  if (filterRange === '7days') {
    start = subDays(today, 6);
  } else if (filterRange === '30days') {
    start = subDays(today, 29);
  } else if (filterRange === '90days') {
    start = subDays(today, 89);
  } else if (filterRange === 'custom' && customRange?.startDate && customRange?.endDate) {
    start = parseISO(customRange.startDate);
    end = parseISO(customRange.endDate);
  }

  const startDateStr = formatDateKey(start);
  const endDateStr = formatDateKey(end);

  return tasks.filter((t) => {
    return t.date >= startDateStr && t.date <= endDateStr;
  });
};

/**
 * Generate daily completion trend data for Recharts
 */
export const getDailyCompletionData = (filteredTasks, daysCount = 7) => {
  const endDate = new Date();
  const startDate = subDays(endDate, daysCount - 1);
  const daysInterval = eachDayOfInterval({ start: startDate, end: endDate });

  return daysInterval.map((day) => {
    const dayStr = formatDateKey(day);
    const dayTasks = filteredTasks.filter((t) => t.date === dayStr);

    const total = dayTasks.length;
    const completed = dayTasks.filter((t) => t.status === 'Completed' || t.completed).length;
    const skipped = dayTasks.filter((t) => t.status === 'Skipped').length;
    const pending = dayTasks.filter((t) => t.status === 'Pending' || t.status === 'In Progress').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      date: dayStr,
      displayDate: format(day, 'MMM d'),
      dayOfWeek: format(day, 'EEE'),
      completed,
      skipped,
      pending,
      total,
      rate,
    };
  });
};

/**
 * Generate Category Distribution Data for Donut/Pie Chart
 */
export const getCategoryDistributionData = (filteredTasks) => {
  const categoryMap = {};

  filteredTasks.forEach((task) => {
    const cat = task.category || 'Other';
    if (!categoryMap[cat]) {
      categoryMap[cat] = {
        name: cat,
        minutes: 0,
        tasksCount: 0,
        color: CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other,
      };
    }

    const duration = task.actualDuration || task.plannedDuration || 0;
    categoryMap[cat].minutes += duration;
    categoryMap[cat].tasksCount += 1;
  });

  const totalMinutes = Object.values(categoryMap).reduce((acc, c) => acc + c.minutes, 0);

  return Object.values(categoryMap).map((item) => ({
    ...item,
    hours: Number((item.minutes / 60).toFixed(1)),
    percentage: totalMinutes > 0 ? Math.round((item.minutes / totalMinutes) * 100) : 0,
  }));
};

/**
 * Generate Planned vs Actual Duration comparison by Day or Category
 */
export const getPlannedVsActualData = (filteredTasks, daysCount = 7) => {
  const dailyTrend = getDailyCompletionData(filteredTasks, daysCount);

  return dailyTrend.map((dayItem) => {
    const dayTasks = filteredTasks.filter((t) => t.date === dayItem.date);
    let plannedTotal = 0;
    let actualTotal = 0;

    dayTasks.forEach((t) => {
      plannedTotal += t.plannedDuration || 0;
      actualTotal += t.actualDuration || (t.status === 'Completed' ? t.plannedDuration || 0 : 0);
    });

    return {
      date: dayItem.displayDate,
      planned: Math.round(plannedTotal / 60 * 10) / 10, // hours
      actual: Math.round(actualTotal / 60 * 10) / 10, // hours
      plannedMins: plannedTotal,
      actualMins: actualTotal,
    };
  });
};

/**
 * Generate Summary Stats for Reports Page (Daily, Weekly, Monthly)
 */
export const calculateReportSummary = (tasks, period = 'daily', targetDateStr = null) => {
  const activeDate = targetDateStr ? new Date(targetDateStr) : new Date();

  let filtered = [];
  if (period === 'daily') {
    const dateKey = formatDateKey(activeDate);
    filtered = tasks.filter((t) => t.date === dateKey);
  } else if (period === 'weekly') {
    const start = formatDateKey(subDays(activeDate, 6));
    const end = formatDateKey(activeDate);
    filtered = tasks.filter((t) => t.date >= start && t.date <= end);
  } else if (period === 'monthly') {
    const monthPrefix = formatDateKey(activeDate).slice(0, 7); // "YYYY-MM"
    filtered = tasks.filter((t) => t.date?.startsWith(monthPrefix));
  }

  const totalTasks = filtered.length;
  const completedTasks = filtered.filter((t) => t.status === 'Completed' || t.completed).length;
  const skippedTasks = filtered.filter((t) => t.status === 'Skipped').length;
  const pendingTasks = filtered.filter((t) => t.status === 'Pending' || t.status === 'In Progress').length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  let totalPlannedMins = 0;
  let totalActualMins = 0;

  filtered.forEach((t) => {
    totalPlannedMins += t.plannedDuration || 0;
    totalActualMins += t.actualDuration || (t.status === 'Completed' ? t.plannedDuration || 0 : 0);
  });

  // Calculate Most Productive & Least Productive day
  const dayTotals = {};
  filtered.forEach((t) => {
    if (!dayTotals[t.date]) {
      dayTotals[t.date] = { completed: 0, mins: 0, date: t.date };
    }
    if (t.status === 'Completed' || t.completed) {
      dayTotals[t.date].completed += 1;
      dayTotals[t.date].mins += t.actualDuration || t.plannedDuration || 0;
    }
  });

  const dayEntries = Object.values(dayTotals);
  dayEntries.sort((a, b) => b.completed - a.completed || b.mins - a.mins);

  const bestDay = dayEntries.length > 0 ? format(new Date(dayEntries[0].date), 'EEEE, MMM d') : 'N/A';
  const worstDay = dayEntries.length > 0 ? format(new Date(dayEntries[dayEntries.length - 1].date), 'EEEE, MMM d') : 'N/A';

  return {
    period,
    totalTasks,
    completedTasks,
    skippedTasks,
    pendingTasks,
    completionPercentage,
    totalPlannedHours: (totalPlannedMins / 60).toFixed(1),
    totalActualHours: (totalActualMins / 60).toFixed(1),
    totalPlannedMins,
    totalActualMins,
    bestDay,
    worstDay,
    categoryBreakdown: getCategoryDistributionData(filtered),
  };
};
