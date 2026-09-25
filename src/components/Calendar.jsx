import React, { useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
} from 'lucide-react';
import { formatDateKey } from '../utils/dateUtils';
import TaskCard from './TaskCard';

const Calendar = ({
  tasks = [],
  onSelectDate,
  onAddTaskOnDate,
  onStatusChange,
  onEditTask,
  onDeleteTask,
  onStartTimer,
}) => {
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'week' | 'day'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const activeDateKey = formatDateKey(selectedDate);
  const tasksForSelectedDate = tasks.filter((t) => t.date === activeDateKey);

  // Month navigation
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // Week navigation
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

  // Day navigation
  const prevDay = () => {
    const d = subDays(selectedDate, 1);
    setSelectedDate(d);
    setCurrentDate(d);
  };
  const nextDay = () => {
    const d = addDays(selectedDate, 1);
    setSelectedDate(d);
    setCurrentDate(d);
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
    if (onSelectDate) onSelectDate(day);
  };

  // Build grid days for Month View
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const monthDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Build grid days for Week View
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Helper to calculate tasks completed vs total for a given date
  const getDaySummary = (dayObj) => {
    const dayKey = formatDateKey(dayObj);
    const dayTasks = tasks.filter((t) => t.date === dayKey);
    const total = dayTasks.length;
    const completed = dayTasks.filter((t) => t.status === 'Completed' || t.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const isAllCompleted = total > 0 && completed === total;

    return { total, completed, percent, isAllCompleted };
  };

  return (
    <div className="space-y-6">
      
      {/* Calendar Header Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Month/Date Header & Prev/Next */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {viewMode === 'month' && format(currentDate, 'MMMM yyyy')}
              {viewMode === 'week' && `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`}
              {viewMode === 'day' && format(selectedDate, 'EEEE, MMM d, yyyy')}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500">
              Routines & task schedule across dates
            </p>
          </div>
        </div>

        {/* View Switcher & Month Navigation - Scrollable on small screens */}
        <div className="flex items-center flex-wrap gap-2 overflow-x-auto pb-1 sm:pb-0">
          
          {/* Today Button */}
          <button
            onClick={() => {
              const now = new Date();
              setCurrentDate(now);
              setSelectedDate(now);
            }}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            Today
          </button>

          {/* Prev / Next Arrows */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-700/60 rounded-xl p-1">
            <button
              onClick={viewMode === 'month' ? prevMonth : viewMode === 'week' ? prevWeek : prevDay}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-white dark:hover:bg-slate-600"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={viewMode === 'month' ? nextMonth : viewMode === 'week' ? nextWeek : nextDay}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-white dark:hover:bg-slate-600"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setViewMode('month')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewMode === 'month'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'hover:text-slate-900'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewMode === 'week'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'hover:text-slate-900'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewMode === 'day'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'hover:text-slate-900'
              }`}
            >
              Day
            </button>
          </div>

        </div>
      </div>

      {/* MONTH VIEW GRID */}
      {viewMode === 'month' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-3 sm:p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm">
          
          {/* Day Names Header */}
          <div className="grid grid-cols-7 gap-1 mb-2 text-center text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
            <span>S</span>
          </div>

          {/* Days Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {monthDays.map((day) => {
              const summary = getDaySummary(day);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isCurrentDay = isToday(day);

              return (
                <div
                  key={day.toString()}
                  onClick={() => handleDateClick(day)}
                  className={`min-h-[58px] sm:min-h-[95px] p-1 sm:p-2.5 rounded-xl sm:rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    !isCurrentMonth
                      ? 'opacity-30 bg-slate-50/50 dark:bg-slate-900/30 border-transparent'
                      : isSelected
                      ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/30 shadow-sm ring-2 ring-indigo-500/20'
                      : isCurrentDay
                      ? 'border-indigo-300 dark:border-indigo-800 bg-slate-50 dark:bg-slate-900/60'
                      : 'border-slate-100 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-700/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs sm:text-sm font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center ${
                        isCurrentDay
                          ? 'bg-indigo-600 text-white'
                          : isSelected
                          ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>

                    {/* Completion Badge */}
                    {summary.total > 0 && summary.isAllCompleted && (
                      <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                    )}
                  </div>

                  {/* Task Count & Completion Bar */}
                  {summary.total > 0 ? (
                    <div className="mt-0.5 space-y-0.5">
                      <div className="hidden sm:flex items-center justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        <span>{summary.completed}/{summary.total}</span>
                        <span>{summary.percent}%</span>
                      </div>
                      <div className="w-full h-1 sm:h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            summary.isAllCompleted
                              ? 'bg-emerald-500'
                              : 'bg-indigo-500'
                          }`}
                          style={{ width: `${summary.percent}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="hidden sm:inline text-[10px] text-slate-300 dark:text-slate-600 font-medium">
                      No tasks
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK VIEW GRID */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 sm:gap-3">
          {weekDays.map((day) => {
            const dayKey = formatDateKey(day);
            const dayTasks = tasks.filter((t) => t.date === dayKey);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={day.toString()}
                onClick={() => handleDateClick(day)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer bg-white dark:bg-slate-800 ${
                  isSelected
                    ? 'border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-500/20'
                    : 'border-slate-200/80 dark:border-slate-700 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{format(day, 'EEE')}</p>
                    <p className={`text-sm font-extrabold ${isCurrentDay ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-100'}`}>
                      {format(day, 'MMM d')}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-md">
                    {dayTasks.length}
                  </span>
                </div>

                <div className="space-y-1 mt-2">
                  {dayTasks.slice(0, 2).map((t) => (
                    <div
                      key={t.id}
                      className="p-1 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700/60 text-[10px] truncate font-medium text-slate-700 dark:text-slate-300"
                    >
                      {t.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <p className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400">
                      +{dayTasks.length - 2} more
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SELECTED DATE TASKS DETAIL SECTION */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Tasks for {format(selectedDate, 'EEEE, MMM d, yyyy')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {tasksForSelectedDate.length} tasks scheduled for this day
            </p>
          </div>

          <button
            onClick={() => onAddTaskOnDate(selectedDate)}
            className="flex items-center justify-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task for Date</span>
          </button>
        </div>

        {tasksForSelectedDate.length > 0 ? (
          <div className="space-y-3">
            {tasksForSelectedDate.map((task) => (
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
          <div className="py-8 text-center bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">No tasks scheduled for this day.</p>
            <button
              onClick={() => onAddTaskOnDate(selectedDate)}
              className="mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              + Create a new task for {format(selectedDate, 'MMM d')}
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Calendar;
