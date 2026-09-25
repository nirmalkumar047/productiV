import {
  createTask,
  updateTask,
  deleteTask,
  subscribeToTasks,
} from '../firebase/firestore';

export const taskService = {
  subscribe: (userId, onNext, onError) => {
    return subscribeToTasks(userId, onNext, onError);
  },

  add: async (userId, taskData) => {
    return await createTask(userId, taskData);
  },

  update: async (userId, taskId, updates) => {
    return await updateTask(userId, taskId, updates);
  },

  delete: async (userId, taskId) => {
    return await deleteTask(userId, taskId);
  },
};
export default taskService;
