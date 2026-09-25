import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import taskService from '../services/taskService';
import routineService from '../services/routineService';
import { formatDateKey } from '../utils/dateUtils';

const getInitialDemoTasks = () => {
  const today = formatDateKey(new Date());
  return [
    {
      id: 'demo-1',
      title: 'Morning Exercise & Cardio',
      description: '30 minutes high intensity workout and stretch',
      category: 'Exercise',
      date: today,
      startTime: '06:45',
      endTime: '07:15',
      plannedDuration: 30,
      actualDuration: 32,
      priority: 'High',
      status: 'Completed',
      completed: true,
      completedAt: new Date().toISOString(),
      repeatType: 'Daily',
      reminderEnabled: true,
      reminderTime: '15 mins before',
      reminderType: 'browser',
      color: '#10B981',
    },
    {
      id: 'demo-2',
      title: 'Deep Work: React Architecture Review',
      description: 'Build components, state management and Firestore integration',
      category: 'Work',
      date: today,
      startTime: '09:00',
      endTime: '11:00',
      plannedDuration: 120,
      actualDuration: 105,
      priority: 'High',
      status: 'In Progress',
      completed: false,
      repeatType: 'Weekdays',
      reminderEnabled: true,
      reminderTime: '10 mins before',
      reminderType: 'browser',
      color: '#3B82F6',
    },
    {
      id: 'demo-3',
      title: 'Healthy Protein Lunch & Walk',
      description: 'Nutritious meal and 15 minute afternoon fresh air walk',
      category: 'Food',
      date: today,
      startTime: '12:30',
      endTime: '13:15',
      plannedDuration: 45,
      actualDuration: 0,
      priority: 'Medium',
      status: 'Pending',
      completed: false,
      repeatType: 'Daily',
      reminderEnabled: false,
      color: '#F59E0B',
    },
    {
      id: 'demo-4',
      title: 'Study System Design & Algorithms',
      description: 'Review database partitioning and indexing techniques',
      category: 'Study',
      date: today,
      startTime: '14:30',
      endTime: '16:00',
      plannedDuration: 90,
      actualDuration: 0,
      priority: 'Medium',
      status: 'Pending',
      completed: false,
      repeatType: 'Does not repeat',
      reminderEnabled: true,
      color: '#6366F1',
    },
    {
      id: 'demo-5',
      title: 'Evening Journaling & Wind Down',
      description: 'Reflect on today achievements and plan tomorrow goals',
      category: 'Personal',
      date: today,
      startTime: '21:30',
      endTime: '22:00',
      plannedDuration: 30,
      actualDuration: 0,
      priority: 'Low',
      status: 'Pending',
      completed: false,
      repeatType: 'Daily',
      reminderEnabled: false,
      color: '#EC4899',
    },
  ];
};

const getInitialDemoRoutines = () => [
  {
    id: 'rot-1',
    title: 'Morning High-Productivity Routine',
    description: 'Start the day with focus, exercise and planning',
    category: 'Personal',
    startTime: '06:30',
    endTime: '08:00',
    duration: 90,
    priority: 'High',
    enabled: true,
    activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    color: '#10B981',
    items: [
      { title: 'Hydration & Stretch', startTime: '06:30', endTime: '06:45', duration: 15 },
      { title: 'Cardio Workout', startTime: '06:45', endTime: '07:15', duration: 30 },
      { title: 'Healthy Breakfast', startTime: '07:15', endTime: '07:45', duration: 30 },
      { title: 'Plan Top 3 Daily Goals', startTime: '07:45', endTime: '08:00', duration: 15 },
    ],
  },
  {
    id: 'rot-2',
    title: 'Evening Reflection & Unwind',
    description: 'Disconnect from screens and prepare for rest',
    category: 'Sleep',
    startTime: '21:30',
    endTime: '22:30',
    duration: 60,
    priority: 'Medium',
    enabled: true,
    activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    color: '#8B5CF6',
    items: [
      { title: 'Log Completed Tasks', startTime: '21:30', endTime: '21:45', duration: 15 },
      { title: 'Reading & Mindful Wind Down', startTime: '21:45', endTime: '22:30', duration: 45 },
    ],
  },
];

export const useTasks = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissionWarning, setPermissionWarning] = useState(false);

  // Helper to sync local fallback state
  const syncLocal = (updatedTasks, updatedRoutines) => {
    if (updatedTasks) {
      setTasks(updatedTasks);
      localStorage.setItem('timeloop_local_tasks', JSON.stringify(updatedTasks));
    }
    if (updatedRoutines) {
      setRoutines(updatedRoutines);
      localStorage.setItem('timeloop_local_routines', JSON.stringify(updatedRoutines));
    }
  };

  const loadLocalFallback = () => {
    const savedTasks = localStorage.getItem('timeloop_local_tasks');
    const savedRoutines = localStorage.getItem('timeloop_local_routines');

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const demo = getInitialDemoTasks();
      setTasks(demo);
      localStorage.setItem('timeloop_local_tasks', JSON.stringify(demo));
    }

    if (savedRoutines) {
      setRoutines(JSON.parse(savedRoutines));
    } else {
      const demoR = getInitialDemoRoutines();
      setRoutines(demoR);
      localStorage.setItem('timeloop_local_routines', JSON.stringify(demoR));
    }
  };

  useEffect(() => {
    if (currentUser) {
      setLoading(true);

      const unsubTasks = taskService.subscribe(
        currentUser.uid,
        (fetchedTasks) => {
          setTasks(fetchedTasks);
          setPermissionWarning(false);
          setLoading(false);
        },
        (err) => {
          console.warn('Firestore tasks permission notice:', err.message);
          setPermissionWarning(true);
          loadLocalFallback();
          setLoading(false);
        }
      );

      const unsubRoutines = routineService.subscribe(
        currentUser.uid,
        (fetchedRoutines) => {
          setRoutines(fetchedRoutines);
        },
        (err) => {
          console.warn('Firestore routines permission notice:', err.message);
        }
      );

      return () => {
        unsubTasks();
        unsubRoutines();
      };
    } else {
      loadLocalFallback();
      setLoading(false);
    }
  }, [currentUser]);

  const addTask = async (taskData) => {
    if (currentUser && !permissionWarning) {
      try {
        return await taskService.add(currentUser.uid, taskData);
      } catch (err) {
        console.warn('Falling back to local task creation:', err.message);
      }
    }
    const newTask = {
      id: 'task_' + Date.now(),
      ...taskData,
      completed: taskData.status === 'Completed',
      completedAt: taskData.status === 'Completed' ? new Date().toISOString() : null,
      actualDuration: taskData.actualDuration || 0,
      createdAt: new Date().toISOString(),
    };
    const newTasks = [newTask, ...tasks];
    syncLocal(newTasks, null);
    return newTask;
  };

  const updateTask = async (taskId, updates) => {
    if (currentUser && !permissionWarning) {
      try {
        return await taskService.update(currentUser.uid, taskId, updates);
      } catch (err) {
        console.warn('Falling back to local task update:', err.message);
      }
    }
    const newTasks = tasks.map((t) => {
      if (t.id === taskId) {
        const updatedStatus = updates.status !== undefined ? updates.status : t.status;
        return {
          ...t,
          ...updates,
          completed: updatedStatus === 'Completed',
          completedAt: updatedStatus === 'Completed' ? t.completedAt || new Date().toISOString() : t.completedAt,
        };
      }
      return t;
    });
    syncLocal(newTasks, null);
  };

  const deleteTask = async (taskId) => {
    if (currentUser && !permissionWarning) {
      try {
        return await taskService.delete(currentUser.uid, taskId);
      } catch (err) {
        console.warn('Falling back to local task deletion:', err.message);
      }
    }
    const newTasks = tasks.filter((t) => t.id !== taskId);
    syncLocal(newTasks, null);
  };

  const addRoutine = async (routineData) => {
    if (currentUser && !permissionWarning) {
      try {
        return await routineService.add(currentUser.uid, routineData);
      } catch (err) {
        console.warn('Falling back to local routine creation:', err.message);
      }
    }
    const newRoutine = {
      id: 'rot_' + Date.now(),
      ...routineData,
      enabled: routineData.enabled ?? true,
      createdAt: new Date().toISOString(),
    };
    const newRoutines = [...routines, newRoutine];
    syncLocal(null, newRoutines);
    return newRoutine;
  };

  const updateRoutine = async (routineId, updates) => {
    if (currentUser && !permissionWarning) {
      try {
        return await routineService.update(currentUser.uid, routineId, updates);
      } catch (err) {
        console.warn('Falling back to local routine update:', err.message);
      }
    }
    const newRoutines = routines.map((r) => (r.id === routineId ? { ...r, ...updates } : r));
    syncLocal(null, newRoutines);
  };

  const deleteRoutine = async (routineId) => {
    if (currentUser && !permissionWarning) {
      try {
        return await routineService.delete(currentUser.uid, routineId);
      } catch (err) {
        console.warn('Falling back to local routine deletion:', err.message);
      }
    }
    const newRoutines = routines.filter((r) => r.id !== routineId);
    syncLocal(null, newRoutines);
  };

  const convertRoutineToScheduledTasks = async (routine, dateStr) => {
    if (currentUser && !permissionWarning) {
      try {
        return await routineService.convertToTasks(currentUser.uid, routine, dateStr);
      } catch (err) {
        console.warn('Falling back to local routine conversion:', err.message);
      }
    }
    const dateKey = dateStr || formatDateKey(new Date());
    let generated = [];

    if (routine.items && routine.items.length > 0) {
      generated = routine.items.map((item, idx) => ({
        id: 'gen_' + Date.now() + '_' + idx,
        title: item.title,
        description: routine.description || `Generated from ${routine.title}`,
        category: routine.category || 'Personal',
        date: dateKey,
        startTime: item.startTime || routine.startTime || '09:00',
        endTime: item.endTime || routine.endTime || '10:00',
        plannedDuration: item.duration || routine.duration || 60,
        actualDuration: 0,
        priority: routine.priority || 'Medium',
        status: 'Pending',
        completed: false,
        repeatType: 'Daily',
        reminderEnabled: routine.reminderEnabled || false,
        color: routine.color || '#3B82F6',
      }));
    } else {
      generated = [
        {
          id: 'gen_' + Date.now(),
          title: routine.title,
          description: routine.description || '',
          category: routine.category || 'Personal',
          date: dateKey,
          startTime: routine.startTime || '09:00',
          endTime: routine.endTime || '10:00',
          plannedDuration: routine.duration || 60,
          actualDuration: 0,
          priority: routine.priority || 'Medium',
          status: 'Pending',
          completed: false,
          repeatType: 'Daily',
          reminderEnabled: routine.reminderEnabled || false,
          color: routine.color || '#3B82F6',
        },
      ];
    }

    const updatedTasks = [...generated, ...tasks];
    syncLocal(updatedTasks, null);
    return generated;
  };

  return {
    tasks,
    routines,
    loading,
    permissionWarning,
    addTask,
    updateTask,
    deleteTask,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    convertRoutineToScheduledTasks,
  };
};

export default useTasks;
