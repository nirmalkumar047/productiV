import React, { useState } from 'react';
import { User, Mail, Globe, Calendar, Flame, CheckCircle2, Award, Edit3, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { calculateStreaks, calculateProductivityScore } from '../utils/dateUtils';

const Profile = ({ tasks = [] }) => {
  const { currentUser, userDoc, updateProfile } = useAuth();

  const [name, setName] = useState(userDoc?.name || currentUser?.displayName || '');
  const [photoURL, setPhotoURL] = useState(userDoc?.photoURL || currentUser?.photoURL || '');
  const [timezone, setTimezone] = useState(userDoc?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { currentStreak, longestStreak, daysActive } = calculateStreaks(tasks);
  const totalCompleted = tasks.filter((t) => t.status === 'Completed' || t.completed).length;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    try {
      await updateProfile({
        name,
        photoURL,
        timezone,
      });
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const displayName = userDoc?.name || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  const avatarUrl = photoURL || userDoc?.photoURL || currentUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;
  const createdAtFormatted = userDoc?.createdAt?.toDate
    ? userDoc.createdAt.toDate().toLocaleDateString()
    : 'Recently';

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          User Profile
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          Manage your account info, avatar, timezone, and view productivity metrics.
        </p>
      </div>

      {message && (
        <div className="flex items-center space-x-2 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 rounded-2xl text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 p-3.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 text-center md:text-left">
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-24 h-24 rounded-3xl border-4 border-indigo-500/30 object-cover bg-indigo-50 shadow-md"
        />

        <div className="flex-1 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {displayName}
              </h2>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {currentUser?.email || 'user@example.com'}
              </p>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-bold rounded-xl transition-colors self-center sm:self-auto"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>

          <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-1">
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>Timezone: {timezone}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>Member since: {createdAtFormatted}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            Update Profile Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Avatar Image URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Preferred Timezone
            </label>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {/* Lifetime Productivity Statistics Summary */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
          Lifetime Productivity Overview
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-100 dark:border-amber-900/40">
            <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase">Current Streak</span>
            </div>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100">{currentStreak} Days</p>
          </div>

          <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/40">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-1">
              <Award className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase">Longest Streak</span>
            </div>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100">{longestStreak} Days</p>
          </div>

          <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase">Completed Tasks</span>
            </div>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100">{totalCompleted}</p>
          </div>

          <div className="p-4 bg-purple-50/60 dark:bg-purple-950/30 rounded-2xl border border-purple-100 dark:border-purple-900/40">
            <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase">Active Days</span>
            </div>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100">{daysActive}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Profile;
