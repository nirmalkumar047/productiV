import {
  createRoutine,
  updateRoutine,
  deleteRoutine,
  subscribeToRoutines,
  createTask,
} from '../firebase/firestore';
import { formatDateKey } from '../utils/dateUtils';

export const routineService = {
  subscribe: (userId, onNext, onError) => {
    return subscribeToRoutines(userId, onNext, onError);
  },

  add: async (userId, routineData) => {
    return await createRoutine(userId, routineData);
  },

  update: async (userId, routineId, updates) => {
    return await updateRoutine(userId, routineId, updates);
  },

  delete: async (userId, routineId) => {
    return await deleteRoutine(userId, routineId);
  },

  /**
   * Convert a routine or routine template items into daily tasks for a target date
   */
  convertToTasks: async (userId, routine, targetDateStr = null) => {
    const dateKey = targetDateStr || formatDateKey(new Date());

    if (routine.items && Array.isArray(routine.items) && routine.items.length > 0) {
      // Routine with itemized sub-tasks
      const createdTasks = [];
      for (const item of routine.items) {
        const taskPayload = {
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
          repeatType: 'Daily',
          reminderEnabled: routine.reminderEnabled || false,
          reminderTime: routine.reminderTime || '15 mins before',
          reminderType: 'browser',
          color: routine.color || '#3B82F6',
        };
        const res = await createTask(userId, taskPayload);
        createdTasks.push(res);
      }
      return createdTasks;
    } else {
      // Single routine converted to task
      const taskPayload = {
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
        repeatType: 'Daily',
        reminderEnabled: routine.reminderEnabled || false,
        reminderTime: routine.reminderTime || '15 mins before',
        reminderType: 'browser',
        color: routine.color || '#3B82F6',
      };
      const res = await createTask(userId, taskPayload);
      return [res];
    }
  },
};
export default routineService;
