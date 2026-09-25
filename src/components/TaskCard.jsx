import React from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Edit2,
  Trash2,
  Play,
} from 'lucide-react';
import { formatDurationHoursMinutes } from '../utils/dateUtils';
import { CATEGORY_COLORS } from '../utils/analyticsUtils';

const priorityColors = {
  High: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-900',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-900',
  Low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
};

const statusColors = {
  Completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
  'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-900',
  Pending: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/60 dark:border-amber-900/40',
  Skipped: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700 line-through',
};

const TaskCard = ({
  task,
  onStatusChange,
  onEdit,
  onDelete,
  onStartTimer,
}) => {
  const isCompleted = task.status === 'Completed' || task.completed;
  const categoryColor = CATEGORY_COLORS[task.category] || '#6366F1';

  return (
    <div
      className={`group relative bg-white dark:bg-slate-800/90 rounded-2xl p-3.5 sm:p-5 border transition-all duration-200 shadow-sm hover:shadow-md ${
        isCompleted
          ? 'border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10'
          : 'border-slate-200 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-800'
      }`}
    >
      {/* Category Accent Line */}
      <div
        className="absolute top-0 left-4 right-4 h-1 rounded-t-full opacity-80"
        style={{ backgroundColor: categoryColor }}
      />

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pt-1">
        
        {/* Checkbox & Details */}
        <div className="flex items-start space-x-2.5 sm:space-x-3.5 flex-1 min-w-0">
          <button
            onClick={() => onStatusChange(task.id, isCompleted ? 'Pending' : 'Completed')}
            className="mt-0.5 p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors focus:outline-none shrink-0"
            title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950/80" />
            ) : (
              <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600 hover:text-emerald-500" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            {/* Title & Priority / Status Badges */}
            <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
              <h4
                className={`text-sm sm:text-base font-bold truncate max-w-full ${
                  isCompleted
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-900 dark:text-slate-100'
                }`}
              >
                {task.title}
              </h4>

              <span
                className={`px-2 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-md border ${
                  priorityColors[task.priority] || priorityColors.Low
                }`}
              >
                {task.priority || 'Low'}
              </span>

              <span
                className={`px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold rounded-md border ${
                  statusColors[task.status] || statusColors.Pending
                }`}
              >
                {task.status || 'Pending'}
              </span>
            </div>

            {/* Description */}
            {task.description && (
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Time & Meta Details */}
            <div className="mt-2.5 flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              
              {/* Category */}
              <div className="flex items-center space-x-1 font-semibold">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: categoryColor }}
                />
                <span className="text-[11px] sm:text-xs">{task.category || 'Personal'}</span>
              </div>

              {/* Time Range */}
              {(task.startTime || task.endTime) && (
                <div className="flex items-center space-x-1 text-[11px] sm:text-xs">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {task.startTime} {task.endTime ? `- ${task.endTime}` : ''}
                  </span>
                </div>
              )}

              {/* Duration & Actual spent */}
              <div className="flex items-center space-x-1 font-medium text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                <span>Planned: {formatDurationHoursMinutes(task.plannedDuration || 0)}</span>
                {task.actualDuration > 0 && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    • Actual: {formatDurationHoursMinutes(task.actualDuration)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls - Mobile Touch Optimized */}
        <div className="flex items-center justify-end space-x-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700/60">
          
          {/* Start Timer Button */}
          {onStartTimer && !isCompleted && (
            <button
              onClick={() => onStartTimer(task)}
              className="p-2 rounded-xl text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 transition-colors"
              title="Start Timer"
            >
              <Play className="w-4 h-4 fill-current" />
            </button>
          )}

          {/* Quick Status Selector Menu */}
          <select
            value={task.status || 'Pending'}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className="text-[11px] sm:text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2 py-1 border border-slate-200 dark:border-slate-600 focus:outline-none cursor-pointer"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Skipped">Skipped</option>
          </select>

          {/* Edit Button */}
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Edit Task"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}

          {/* Delete Button */}
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
