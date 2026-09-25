import {
  filterTasksByDateRange,
  getDailyCompletionData,
  getCategoryDistributionData,
  getPlannedVsActualData,
  calculateReportSummary,
} from '../utils/analyticsUtils';
import { calculateStreaks, calculateProductivityScore } from '../utils/dateUtils';

export const analyticsService = {
  getAnalytics: (tasks, filterRange = '7days', customRange = null) => {
    const filtered = filterTasksByDateRange(tasks, filterRange, customRange);
    const streakInfo = calculateStreaks(tasks);
    const score = calculateProductivityScore(filtered);

    return {
      dailyCompletion: getDailyCompletionData(filtered, filterRange === '30days' ? 30 : filterRange === '90days' ? 90 : 7),
      categoryDistribution: getCategoryDistributionData(filtered),
      plannedVsActual: getPlannedVsActualData(filtered, filterRange === '30days' ? 30 : 7),
      streakInfo,
      productivityScore: score,
      filteredTasksCount: filtered.length,
    };
  },

  getReport: (tasks, period = 'daily', targetDateStr = null) => {
    return calculateReportSummary(tasks, period, targetDateStr);
  },
};
export default analyticsService;
