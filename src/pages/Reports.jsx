import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Award,
  Clock,
  TrendingUp,
  Download,
  CheckCircle2,
  XCircle,
  Clock3,
  BarChart3,
  Flame,
} from 'lucide-react';
import analyticsService from '../services/analyticsService';
import { calculateStreaks, formatPrettyDate, formatDateKey } from '../utils/dateUtils';

const Reports = ({ tasks = [] }) => {
  const [reportPeriod, setReportPeriod] = useState('daily'); // 'daily' | 'weekly' | 'monthly'
  const [selectedDateStr, setSelectedDateStr] = useState(formatDateKey(new Date()));

  const report = analyticsService.getReport(tasks, reportPeriod, selectedDateStr);
  const streakInfo = calculateStreaks(tasks);

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      
      {/* Title & Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Productivity Reports
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Comprehensive daily, weekly, and monthly performance reviews.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrintReport}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-2xl text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export / Print PDF</span>
          </button>
        </div>
      </div>

      {/* Period Tab Switcher */}
      <div className="bg-white dark:bg-slate-800 p-2 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl">
          {['daily', 'weekly', 'monthly'].map((p) => (
            <button
              key={p}
              onClick={() => setReportPeriod(p)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                reportPeriod === p
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {p} Report
            </button>
          ))}
        </div>

        {/* Date Selector */}
        <div className="flex items-center space-x-2 px-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Target Date:</label>
          <input
            type="date"
            value={selectedDateStr}
            onChange={(e) => setSelectedDateStr(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
          />
        </div>
      </div>

      {/* REPORT CONTENT CARD FOR PRINT & DISPLAY */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-8">
        
        {/* Header Branding */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-6 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-5 h-5" />
              <span className="text-xs font-extrabold uppercase tracking-wider">
                Timeloop {reportPeriod.toUpperCase()} Report
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
              Performance & Time Investment Summary
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluated on {formatPrettyDate(selectedDateStr)}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm rounded-xl border border-indigo-100 dark:border-indigo-900">
              Completion Rate: {report.completionPercentage}%
            </span>
          </div>
        </div>

        {/* Primary Metric Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-700/60">
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Scheduled</p>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">{report.totalTasks} Tasks</p>
          </div>

          <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
            <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Completed Tasks</p>
            <p className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-1">{report.completedTasks} Tasks</p>
          </div>

          <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/40">
            <p className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">Planned Duration</p>
            <p className="text-xl font-black text-indigo-700 dark:text-indigo-300 mt-1">{report.totalPlannedHours} Hours</p>
          </div>

          <div className="p-4 bg-purple-50/60 dark:bg-purple-950/30 rounded-2xl border border-purple-100 dark:border-purple-900/40">
            <p className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400">Actual Time Spent</p>
            <p className="text-xl font-black text-purple-700 dark:text-purple-300 mt-1">{report.totalActualHours} Hours</p>
          </div>
        </div>

        {/* Specific Period Details */}
        {reportPeriod === 'daily' && (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Daily Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                <p className="text-xs font-semibold text-slate-500">Pending Tasks</p>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-0.5">{report.pendingTasks}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                <p className="text-xs font-semibold text-slate-500">Skipped Tasks</p>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-0.5">{report.skippedTasks}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                <p className="text-xs font-semibold text-slate-500">Current Streak</p>
                <p className="text-lg font-bold text-amber-500 mt-0.5">{streakInfo.currentStreak} Days</p>
              </div>
            </div>
          </div>
        )}

        {(reportPeriod === 'weekly' || reportPeriod === 'monthly') && (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Period Performance Insights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900">
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Most Productive Day</p>
                <p className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-1">{report.bestDay}</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-500">Least Productive Day</p>
                <p className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-1">{report.worstDay}</p>
              </div>

              <div className="p-4 bg-amber-50/40 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900">
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Longest Streak</p>
                <p className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-1">{streakInfo.longestStreak} Days</p>
              </div>
            </div>
          </div>
        )}

        {/* Category Breakdown Table */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            Category Time Allocation
          </h3>

          {report.categoryBreakdown.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-4 py-3 rounded-l-xl">Category</th>
                    <th className="px-4 py-3">Tasks Executed</th>
                    <th className="px-4 py-3">Time Invested</th>
                    <th className="px-4 py-3 rounded-r-xl">Share %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {report.categoryBreakdown.map((cat) => (
                    <tr key={cat.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                      <td className="px-4 py-3 font-bold flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span>{cat.name}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold">{cat.tasksCount} tasks</td>
                      <td className="px-4 py-3 font-semibold">{cat.hours} hrs</td>
                      <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">{cat.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4">No task activity logged for this period.</p>
          )}
        </div>

      </div>

    </div>
  );
};

export default Reports;
