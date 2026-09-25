import React, { useState } from 'react';
import { Plus, CheckSquare, Sparkles, Filter, Calendar as CalendarIcon, Repeat, TrendingUp } from 'lucide-react';
import ProgressCard from '../components/ProgressCard';
import TaskCard from '../components/TaskCard';
import StatsCard from '../components/StatsCard';
import { formatDateKey } from '../utils/dateUtils';
import { calculateStreaks, calculateProductivityScore } from '../utils/dateUtils';

const Dashboard = ({
  tasks = [],
  routines = [],
  onOpenAddTask,
  onStatusChange,
  onEditTask,
  onDeleteTask,
  onStartTimer,
  onConvertRoutine,
}) => {
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const todayStr = formatDateKey(new Date());
  const tasksToday = tasks.filter((t) => t.date === todayStr);

  // Chronological sorting by startTime
  const sortedTasksToday = [...tasksToday].sort((a, b) => {
    return (a.startTime || '00:00').localeCompare(b.startTime || '00:00');
  });

  // Filtered view
  const filteredTasks = sortedTasksToday.filter((task) => {
    const matchCat = filterCategory === 'All' || task.category === filterCategory;
    const matchStat = filterStatus === 'All' || task.status === filterStatus;
    return matchCat && matchStat;
  });

  const { currentStreak, daysActive } = calculateStreaks(tasks);
  const productivityScore = calculateProductivityScore(tasksToday);

  return (
    <div className="space-y-8">
      
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Track your daily routine, execution time, and habits.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {routines.length > 0 && (
            <button
              onClick={() => onConvertRoutine(routines[0])}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 text-xs font-bold hover:bg-indigo-100 transition-colors"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Sync Today's Routines</span>
            </button>
          )}

          <button
            onClick={onOpenAddTask}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-600/25 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Today's Progress Overview Component */}
      <ProgressCard
        tasksToday={tasksToday}
        currentStreak={currentStreak}
        productivityScore={productivityScore}
      />

      {/* Today's Tasks Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Today's Tasks ({sortedTasksToday.length})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sorted chronologically by start time
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center flex-wrap gap-2 text-xs font-semibold">
            {/* Status Filter */}
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {['All', 'Pending', 'In Progress', 'Completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    filterStatus === st
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Study">Study</option>
              <option value="Work">Work</option>
              <option value="Exercise">Exercise</option>
              <option value="Personal">Personal</option>
              <option value="Sleep">Sleep</option>
              <option value="Food">Food</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Task Cards List */}
        {filteredTasks.length > 0 ? (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={onStatusChange}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onStartTimer={onStartTimer}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 p-6">
            <Sparkles className="w-10 h-10 text-indigo-400 mx-auto mb-3 animate-pulse" />
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              {tasksToday.length === 0 ? "No tasks scheduled for today!" : "No tasks match your filters."}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {tasksToday.length === 0
                ? "Start your day with intent. Create a new task or generate tasks from your saved routine."
                : "Try resetting your category or status filters to view all tasks."}
            </p>
            <button
              onClick={onOpenAddTask}
              className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Task</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
