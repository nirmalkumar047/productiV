import React from 'react';
import Calendar from '../components/Calendar';

const CalendarPage = ({
  tasks = [],
  onAddTaskOnDate,
  onStatusChange,
  onEditTask,
  onDeleteTask,
  onStartTimer,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Routine Calendar
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          View and schedule your daily tasks across months, weeks, and days.
        </p>
      </div>

      <Calendar
        tasks={tasks}
        onAddTaskOnDate={onAddTaskOnDate}
        onStatusChange={onStatusChange}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onStartTimer={onStartTimer}
      />
    </div>
  );
};

export default CalendarPage;
