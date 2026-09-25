import React from 'react';
import { CheckCircle2, Clock, Flame, Award, Calendar as CalendarIcon, TrendingUp } from 'lucide-react';
import { formatPrettyDate, formatDurationHoursMinutes } from '../utils/dateUtils';

const ProgressCard = ({
  tasksToday = [],
  currentStreak = 0,
  productivityScore = 0,
}) => {
  const totalCount = tasksToday.length;
  const completedCount = tasksToday.filter((t) => t.status === 'Completed' || t.completed).length;
  const pendingCount = tasksToday.filter((t) => t.status === 'Pending' || t.status === 'In Progress').length;
  const skippedCount = tasksToday.filter((t) => t.status === 'Skipped').length;

  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  let plannedTimeMins = 0;
  let completedTimeMins = 0;

  tasksToday.forEach((t) => {
    plannedTimeMins += t.plannedDuration || 0;
    if (t.status === 'Completed' || t.completed) {
      completedTimeMins += t.actualDuration || t.plannedDuration || 0;
    }
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
      
      {/* Date & Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
            <CalendarIcon className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Today's Progress</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
            {formatPrettyDate(new Date())}
          </h3>
        </div>

        {/* Productivity Score Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-md shadow-indigo-500/20 self-start sm:self-auto">
          <Award className="w-4 h-4" />
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-indigo-100 leading-tight">Productivity Score</p>
            <p className="text-sm font-black leading-tight">{productivityScore}/100</p>
          </div>
        </div>
      </div>

      {/* Main Visual Progress Bar */}
      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-sm font-bold">
          <span className="text-slate-700 dark:text-slate-200">Task Completion</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-base">
            {completionPercent}%
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-4 bg-slate-100 dark:bg-slate-700/80 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 rounded-full transition-all duration-700 shadow-sm"
            style={{ width: `${completionPercent}%` }}
          />
        </div>

        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-right">
          {completedCount} / {totalCount} tasks completed
        </p>
      </div>

      {/* Grid Metrics */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-700/60">
          <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Scheduled</p>
          <p className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">{totalCount} tasks</p>
        </div>

        <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
          <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Completed</p>
          <p className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300 mt-0.5">{completedCount} tasks</p>
        </div>

        <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/40">
          <p className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">Planned Time</p>
          <p className="text-lg font-extrabold text-indigo-700 dark:text-indigo-300 mt-0.5">
            {formatDurationHoursMinutes(plannedTimeMins)}
          </p>
        </div>

        <div className="p-3 bg-purple-50/60 dark:bg-purple-950/30 rounded-2xl border border-purple-100 dark:border-purple-900/40">
          <p className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400">Completed Time</p>
          <p className="text-lg font-extrabold text-purple-700 dark:text-purple-300 mt-0.5">
            {formatDurationHoursMinutes(completedTimeMins)}
          </p>
        </div>

      </div>
    </div>
  );
};

export default ProgressCard;
