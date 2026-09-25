import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  Flame,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  PieChart as PieIcon,
  BarChart2,
  Calendar,
  Award,
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import analyticsService from '../services/analyticsService';
import { CATEGORY_COLORS } from '../utils/analyticsUtils';

const Analytics = ({ tasks = [] }) => {
  const [filterRange, setFilterRange] = useState('7days');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const customRange = customStart && customEnd ? { startDate: customStart, endDate: customEnd } : null;
  const analyticsData = analyticsService.getAnalytics(tasks, filterRange, customRange);

  const {
    dailyCompletion,
    categoryDistribution,
    plannedVsActual,
    streakInfo,
    productivityScore,
    filteredTasksCount,
  } = analyticsData;

  const totalProductiveHours = categoryDistribution
    .reduce((acc, cat) => acc + cat.hours, 0)
    .toFixed(1);

  return (
    <div className="space-y-8">
      
      {/* Title & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Productivity Analytics
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Data insights on time investment, task completion rates, and streak records.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center flex-wrap gap-2 text-xs font-semibold">
          <div className="flex items-center bg-white dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            {['7days', '30days', '90days', 'custom'].map((range) => (
              <button
                key={range}
                onClick={() => setFilterRange(range)}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  filterRange === range
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {range === '7days' && 'Last 7 Days'}
                {range === '30days' && 'Last 30 Days'}
                {range === '90days' && 'Last 3 Months'}
                {range === 'custom' && 'Custom Range'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Date Range Picker Input */}
      {filterRange === 'custom' && (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center space-x-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Start Date</label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">End Date</label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>
        </div>
      )}

      {/* Key Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <StatsCard
          title="Current Streak"
          value={`${streakInfo.currentStreak} Days`}
          subtitle={`Longest: ${streakInfo.longestStreak} days`}
          icon={Flame}
          color="amber"
        />

        <StatsCard
          title="Productive Hours"
          value={`${totalProductiveHours} hrs`}
          subtitle={`${filteredTasksCount} tasks evaluated`}
          icon={Clock}
          color="indigo"
        />

        <StatsCard
          title="Productivity Score"
          value={`${productivityScore} / 100`}
          subtitle="Based on completion & timing"
          icon={Award}
          color="purple"
        />

        <StatsCard
          title="Active Days"
          value={`${streakInfo.daysActive} Days`}
          subtitle="Total recorded activity"
          icon={Calendar}
          color="emerald"
        />

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Daily Completion Trend */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Daily Completion Trend</span>
              </h3>
              <p className="text-xs text-slate-400">Completed vs Pending/Skipped tasks</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyCompletion} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="displayDate" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#334155',
                    borderRadius: '16px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="completed" name="Completed" fill="#10B981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#6366F1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="skipped" name="Skipped" fill="#94A3B8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Distribution Donut Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <PieIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Time Spent by Category</span>
              </h3>
              <p className="text-xs text-slate-400">Proportional breakdown of time</p>
            </div>
          </div>

          {categoryDistribution.length > 0 ? (
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    dataKey="minutes"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name, item) => [`${item.payload.hours} hrs (${item.payload.percentage}%)`, name]}
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderRadius: '16px',
                      color: '#FFF',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400">
              No category data recorded for this range.
            </div>
          )}
        </div>

        {/* Chart 3: Planned vs Actual Time */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <BarChart2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Planned vs Actual Time (Hours)</span>
              </h3>
              <p className="text-xs text-slate-400">Compare scheduled time vs actual execution time</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={plannedVsActual} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#334155',
                    borderRadius: '16px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="planned" name="Planned (hrs)" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="actual" name="Actual (hrs)" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Productivity Trend % */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span>Productivity Rate Trend (%)</span>
              </h3>
              <p className="text-xs text-slate-400">Completion percentage trajectory</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyCompletion} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="displayDate" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Completion Rate']}
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#334155',
                    borderRadius: '16px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  name="Completion %"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Analytics;
