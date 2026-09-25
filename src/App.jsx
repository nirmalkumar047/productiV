import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import TaskFormModal from './components/TaskFormModal';
import TimerModal from './components/TimerModal';
import Toast from './components/Toast';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import CalendarPage from './pages/CalendarPage';
import Routines from './pages/Routines';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

import useTasks from './hooks/useTasks';
import { calculateStreaks } from './utils/dateUtils';

import MobileBottomNav from './components/MobileBottomNav';

const MainLayout = ({ children, onOpenAddTask }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { tasks } = useTasks();
  const { currentStreak } = calculateStreaks(tasks);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors flex flex-col font-sans">
      <Navbar
        onOpenAddTask={onOpenAddTask}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentStreak={currentStreak}
        />

        <main className="flex-1 lg:pl-64 p-3.5 sm:p-6 lg:p-8 pb-24 lg:pb-8 min-w-0">
          {children}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};


function AppContent() {
  const {
    tasks,
    routines,
    loading,
    addTask,
    updateTask,
    deleteTask,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    convertRoutineToScheduledTasks,
  } = useTasks();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedDateForNewTask, setSelectedDateForNewTask] = useState(null);

  const [activeTimerTask, setActiveTimerTask] = useState(null);
  const [isTimerOpen, setIsTimerOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  const handleOpenAddTask = (date = null) => {
    setEditingTask(null);
    setSelectedDateForNewTask(date);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSubmitTaskForm = async (taskPayload) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskPayload);
        showToast('Task updated successfully!');
      } else {
        await addTask(taskPayload);
        showToast('New task added!');
      }
    } catch (err) {
      showToast('Failed to save task', 'error');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      if (newStatus === 'Completed') {
        showToast('Task completed! Streak updated 🔥');
      } else {
        showToast(`Task status set to ${newStatus}`);
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      showToast('Task deleted');
    } catch (err) {
      showToast('Failed to delete task', 'error');
    }
  };

  const handleStartTimer = (task) => {
    setActiveTimerTask(task);
    setIsTimerOpen(true);
  };

  const handleCompleteTimerTask = async (taskId, actualMinutes, markCompleted) => {
    try {
      await updateTask(taskId, {
        actualDuration: actualMinutes,
        status: markCompleted ? 'Completed' : 'In Progress',
      });
      showToast(`Logged ${actualMinutes} mins actual duration!`);
    } catch (err) {
      showToast('Failed to update timer duration', 'error');
    }
  };

  const handleConvertRoutine = async (routine, dateStr = null) => {
    try {
      const generated = await convertRoutineToScheduledTasks(routine, dateStr);
      showToast(`Generated ${generated.length} task(s) from ${routine.title}!`);
    } catch (err) {
      showToast('Failed to convert routine to tasks', 'error');
    }
  };

  return (
    <>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected App Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout onOpenAddTask={() => handleOpenAddTask()}>
                <Dashboard
                  tasks={tasks}
                  routines={routines}
                  onOpenAddTask={() => handleOpenAddTask()}
                  onStatusChange={handleStatusChange}
                  onEditTask={handleOpenEditTask}
                  onDeleteTask={handleDeleteTask}
                  onStartTimer={handleStartTimer}
                  onConvertRoutine={handleConvertRoutine}
                />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <MainLayout onOpenAddTask={() => handleOpenAddTask()}>
                <Tasks
                  tasks={tasks}
                  onOpenAddTask={() => handleOpenAddTask()}
                  onStatusChange={handleStatusChange}
                  onEditTask={handleOpenEditTask}
                  onDeleteTask={handleDeleteTask}
                  onStartTimer={handleStartTimer}
                />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <MainLayout onOpenAddTask={() => handleOpenAddTask()}>
                <CalendarPage
                  tasks={tasks}
                  onAddTaskOnDate={(date) => handleOpenAddTask(date)}
                  onStatusChange={handleStatusChange}
                  onEditTask={handleOpenEditTask}
                  onDeleteTask={handleDeleteTask}
                  onStartTimer={handleStartTimer}
                />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/routines"
          element={
            <ProtectedRoute>
              <MainLayout onOpenAddTask={() => handleOpenAddTask()}>
                <Routines
                  routines={routines}
                  onAddRoutine={addRoutine}
                  onUpdateRoutine={updateRoutine}
                  onDeleteRoutine={deleteRoutine}
                  onConvertRoutine={handleConvertRoutine}
                />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <MainLayout onOpenAddTask={() => handleOpenAddTask()}>
                <Analytics tasks={tasks} />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <MainLayout onOpenAddTask={() => handleOpenAddTask()}>
                <Reports tasks={tasks} />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout onOpenAddTask={() => handleOpenAddTask()}>
                <Profile tasks={tasks} />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout onOpenAddTask={() => handleOpenAddTask()}>
                <Settings />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Modals */}
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleSubmitTaskForm}
        initialData={editingTask}
        selectedDate={selectedDateForNewTask}
      />

      <TimerModal
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
        task={activeTimerTask}
        onCompleteTask={handleCompleteTimerTask}
      />

      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
