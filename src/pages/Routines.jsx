import React, { useState } from 'react';
import {
  Plus,
  Repeat,
  Play,
  Edit2,
  Trash2,
  Copy,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import RoutineFormModal from '../components/RoutineFormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { CATEGORY_COLORS } from '../utils/analyticsUtils';

const Routines = ({
  routines = [],
  onAddRoutine,
  onUpdateRoutine,
  onDeleteRoutine,
  onConvertRoutine,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleOpenAdd = () => {
    setEditingRoutine(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (routine) => {
    setEditingRoutine(routine);
    setIsModalOpen(true);
  };

  const handleDuplicate = (routine) => {
    const copyData = {
      ...routine,
      title: `${routine.title} (Copy)`,
    };
    delete copyData.id;
    onAddRoutine(copyData);
  };

  const handleToggleEnable = (routine) => {
    onUpdateRoutine(routine.id, { enabled: !routine.enabled });
  };

  const handleSubmitForm = (formData) => {
    if (editingRoutine) {
      onUpdateRoutine(editingRoutine.id, formData);
    } else {
      onAddRoutine(formData);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            My Routines
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Build reusable routine templates & convert them into daily scheduled tasks.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-600/25 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Routine</span>
        </button>
      </div>

      {/* Routine Cards Grid */}
      {routines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {routines.map((routine) => {
            const categoryColor = CATEGORY_COLORS[routine.category] || '#3B82F6';
            const isEnabled = routine.enabled ?? true;

            return (
              <div
                key={routine.id}
                className={`group relative bg-white dark:bg-slate-800 rounded-3xl p-6 border transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between ${
                  isEnabled
                    ? 'border-slate-200/80 dark:border-slate-700'
                    : 'border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50/50 dark:bg-slate-900/30'
                }`}
              >
                {/* Category Bar Accent */}
                <div
                  className="absolute top-0 left-6 right-6 h-1 rounded-t-full"
                  style={{ backgroundColor: categoryColor }}
                />

                <div className="space-y-4 pt-1">
                  
                  {/* Top Bar: Title & Enable Switch */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {routine.title}
                        </h3>
                      </div>

                      {routine.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {routine.description}
                        </p>
                      )}
                    </div>

                    {/* Enable / Disable Toggle */}
                    <button
                      onClick={() => handleToggleEnable(routine)}
                      className={`p-1 rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors ${
                        isEnabled
                          ? 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={isEnabled ? 'Disable Routine' : 'Enable Routine'}
                    >
                      {isEnabled ? (
                        <ToggleRight className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-slate-400" />
                      )}
                    </button>
                  </div>

                  {/* Days Active & Category */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className="px-2.5 py-0.5 rounded-md font-bold text-[11px] text-white"
                      style={{ backgroundColor: categoryColor }}
                    >
                      {routine.category || 'Personal'}
                    </span>

                    <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{routine.startTime || '06:30'} - {routine.endTime || '08:00'} ({routine.duration || 60}m)</span>
                    </div>
                  </div>

                  {/* Active Days Pills */}
                  <div className="flex flex-wrap gap-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                      const isActiveDay = (routine.activeDays || []).includes(day);
                      return (
                        <span
                          key={day}
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                            isActiveDay
                              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'
                              : 'bg-slate-100 text-slate-400 dark:bg-slate-700/40 dark:text-slate-600'
                          }`}
                        >
                          {day}
                        </span>
                      );
                    })}
                  </div>

                  {/* Items list preview */}
                  {routine.items && routine.items.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1">
                      <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">
                        Steps ({routine.items.length})
                      </p>
                      <div className="space-y-1">
                        {routine.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 font-medium px-2.5 py-1 bg-slate-50 dark:bg-slate-900/60 rounded-lg"
                          >
                            <span>{item.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {item.startTime || '00:00'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Routine Action Bar */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  
                  {/* Convert to scheduled daily tasks */}
                  <button
                    onClick={() => onConvertRoutine(routine)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
                    title="Generate today's tasks from this routine"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Generate Today's Tasks</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    {/* Duplicate Button */}
                    <button
                      onClick={() => handleDuplicate(routine)}
                      className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      title="Duplicate Routine"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleOpenEdit(routine)}
                      className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      title="Edit Routine"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => setDeletingId(routine.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Routine"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 p-8">
          <Repeat className="w-12 h-12 text-indigo-400 mx-auto mb-3 animate-spin-slow" />
          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">No routines created yet</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Design recurring daily or weekly routine templates for morning rituals, study schedules, or work workflows.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Routine</span>
          </button>
        </div>
      )}

      {/* Routine Edit/Create Modal */}
      <RoutineFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitForm}
        initialData={editingRoutine}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => onDeleteRoutine(deletingId)}
        title="Delete Routine"
        message="Are you sure you want to delete this routine template?"
        confirmText="Delete"
      />

    </div>
  );
};

export default Routines;
