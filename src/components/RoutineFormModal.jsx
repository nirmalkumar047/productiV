import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Repeat, Clock, AlertCircle } from 'lucide-react';
import { calculateMinutesDuration } from '../utils/dateUtils';
import { CATEGORY_COLORS } from '../utils/analyticsUtils';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const CATEGORIES = ['Study', 'Work', 'Exercise', 'Personal', 'Sleep', 'Food', 'Other'];

const RoutineFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [startTime, setStartTime] = useState('06:30');
  const [endTime, setEndTime] = useState('08:00');
  const [priority, setPriority] = useState('Medium');
  const [activeDays, setActiveDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  const [enabled, setEnabled] = useState(true);
  const [items, setItems] = useState([
    { title: 'Morning Hydration & Stretch', startTime: '06:30', endTime: '06:45', duration: 15 },
  ]);
  const [error, setError] = useState('');

  const duration = calculateMinutesDuration(startTime, endTime);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setCategory(initialData.category || 'Personal');
      setStartTime(initialData.startTime || '06:30');
      setEndTime(initialData.endTime || '08:00');
      setPriority(initialData.priority || 'Medium');
      setActiveDays(initialData.activeDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
      setEnabled(initialData.enabled ?? true);
      setItems(initialData.items || []);
    } else {
      setTitle('');
      setDescription('');
      setCategory('Personal');
      setStartTime('06:30');
      setEndTime('08:00');
      setPriority('Medium');
      setActiveDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
      setEnabled(true);
      setItems([
        { title: 'Morning Exercise', startTime: '06:30', endTime: '07:15', duration: 45 },
        { title: 'Breakfast', startTime: '07:15', endTime: '07:45', duration: 30 },
      ]);
    }
    setError('');
  }, [initialData, isOpen]);

  const toggleDay = (day) => {
    if (activeDays.includes(day)) {
      if (activeDays.length === 1) return; // Must keep at least one day
      setActiveDays(activeDays.filter((d) => d !== day));
    } else {
      setActiveDays([...activeDays, day]);
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { title: '', startTime: '08:00', endTime: '08:30', duration: 30 },
    ]);
  };

  const handleUpdateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'startTime' || field === 'endTime') {
      newItems[index].duration = calculateMinutesDuration(
        newItems[index].startTime,
        newItems[index].endTime
      );
    }
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Routine title is required.');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      category,
      startTime,
      endTime,
      duration: duration > 0 ? duration : 60,
      priority,
      activeDays,
      enabled,
      items: items.filter((it) => it.title.trim() !== ''),
      color: CATEGORY_COLORS[category] || '#3B82F6',
    };

    onSubmit(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Repeat className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {initialData ? 'Edit Routine Template' : 'Create Routine Template'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Routine Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Morning High-Productivity Routine"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Active Days Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Active Days
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => {
                const isActive = activeDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-items list */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Routine Steps / Sub-Tasks
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center space-x-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2 p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  <input
                    type="text"
                    placeholder="Step name"
                    value={item.title}
                    onChange={(e) => handleUpdateItem(idx, 'title', e.target.value)}
                    className="flex-1 bg-transparent text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                  <input
                    type="time"
                    value={item.startTime || '08:00'}
                    onChange={(e) => handleUpdateItem(idx, 'startTime', e.target.value)}
                    className="px-2 py-1 bg-white dark:bg-slate-800 border rounded text-[11px] font-medium"
                  />
                  <input
                    type="time"
                    value={item.endTime || '08:30'}
                    onChange={(e) => handleUpdateItem(idx, 'endTime', e.target.value)}
                    className="px-2 py-1 bg-white dark:bg-slate-800 border rounded text-[11px] font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
            >
              {initialData ? 'Save Routine' : 'Create Routine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoutineFormModal;
