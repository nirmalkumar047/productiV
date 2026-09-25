import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, CheckCircle, Clock, X, Flame } from 'lucide-react';
import { formatDurationHoursMinutes } from '../utils/dateUtils';

const TimerModal = ({ isOpen, onClose, task, onCompleteTask }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  useEffect(() => {
    if (isOpen && task) {
      // Start with existing actual duration if any
      setSeconds((task.actualDuration || 0) * 60);
      setIsActive(true);
    } else {
      setIsActive(false);
      setSeconds(0);
    }
  }, [isOpen, task]);

  if (!isOpen || !task) return null;

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const handleStopAndSave = (markCompleted = false) => {
    setIsActive(false);
    const actualMins = Math.max(1, Math.round(seconds / 60));
    onCompleteTask(task.id, actualMins, markCompleted);
    onClose();
  };

  const formatTimerDigits = (totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = (n) => String(n).padStart(2, '0');

    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  const plannedMins = task.plannedDuration || 60;
  const currentActualMins = Math.round(seconds / 60);
  const progressPercent = Math.min(100, Math.round((currentActualMins / plannedMins) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden text-center p-6 sm:p-8">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Task Badge & Category */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold mb-3">
          <Clock className="w-3.5 h-3.5" />
          <span>Active Task Timer</span>
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-1 line-clamp-1">
          {task.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Category: <span className="font-semibold">{task.category || 'General'}</span>
        </p>

        {/* Digital Clock Display */}
        <div className="relative my-6 py-6 bg-slate-50 dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-inner flex flex-col items-center justify-center">
          <span className="font-mono text-5xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            {formatTimerDigits(seconds)}
          </span>

          <div className="mt-4 w-3/4 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 dark:bg-indigo-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-3 flex items-center space-x-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Planned: {formatDurationHoursMinutes(plannedMins)}</span>
            <span>•</span>
            <span className="text-indigo-600 dark:text-indigo-400">
              Actual: {formatDurationHoursMinutes(currentActualMins)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={toggleTimer}
            className={`flex items-center justify-center w-14 h-14 rounded-2xl text-white shadow-lg transition-transform active:scale-95 ${
              isActive
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'
            }`}
            title={isActive ? 'Pause' : 'Start / Resume'}
          >
            {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => handleStopAndSave(false)}
            className="flex items-center justify-center w-12 h-12 rounded-2xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            title="Stop & Save Duration"
          >
            <Square className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={() => handleStopAndSave(true)}
            className="flex items-center space-x-1.5 px-4 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
            title="Complete Task"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Complete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerModal;
