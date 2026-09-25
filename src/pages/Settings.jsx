import React, { useState } from 'react';
import { Settings as SettingsIcon, Sun, Moon, Bell, Shield, Trash2, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [defaultDuration, setDefaultDuration] = useState('60');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderLeadTime, setReminderLeadTime] = useState('15');
  const [savedMessage, setSavedMessage] = useState('');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('timeloop_default_duration', defaultDuration);
    localStorage.setItem('timeloop_notifications_enabled', String(notificationsEnabled));
    localStorage.setItem('timeloop_reminder_lead', reminderLeadTime);

    if (notificationsEnabled && 'Notification' in window) {
      Notification.requestPermission();
    }

    setSavedMessage('Settings saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleClearLocalData = () => {
    if (window.confirm('Are you sure you want to reset local offline data? This will restore sample default tasks.')) {
      localStorage.removeItem('timeloop_local_tasks');
      localStorage.removeItem('timeloop_local_routines');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Application Settings
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          Customize themes, task defaults, and notification preferences.
        </p>
      </div>

      {savedMessage && (
        <div className="flex items-center space-x-2 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 rounded-2xl text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* Appearance Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          {darkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
          <span>Appearance & Theme</span>
        </h3>

        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Dark Mode</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Switch between light dynamic UI and dark mode theme
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              darkMode
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-200 text-slate-800'
            }`}
          >
            {darkMode ? 'Dark Enabled' : 'Light Enabled'}
          </button>
        </div>
      </div>

      {/* Preferences Form */}
      <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-6">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Task Defaults & Notifications</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Default Task Duration (Minutes)
            </label>
            <select
              value={defaultDuration}
              onChange={(e) => setDefaultDuration(e.target.value)}
              className="w-full sm:w-64 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="15">15 Minutes</option>
              <option value="30">30 Minutes</option>
              <option value="45">45 Minutes</option>
              <option value="60">60 Minutes (1 Hour)</option>
              <option value="90">90 Minutes (1.5 Hours)</option>
              <option value="120">120 Minutes (2 Hours)</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Browser Notifications</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Receive browser alert popups for upcoming tasks
              </p>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            Save Settings
          </button>
        </div>
      </form>

      {/* Advanced Reset Data Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-rose-600 dark:text-rose-400 flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Data Management</span>
        </h3>

        <div className="flex items-center justify-between p-4 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-100 dark:border-rose-900/40">
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Reset Local Storage Data</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Clear offline cache and restore sample tasks
            </p>
          </div>

          <button
            onClick={handleClearLocalData}
            className="flex items-center space-x-1 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default Settings;
