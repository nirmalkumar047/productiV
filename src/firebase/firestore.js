import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './config';

/**
 * Task CRUD Services
 */
export const getUserTasksCollection = (userId) => {
  return collection(db, 'users', userId, 'tasks');
};

export const createTask = async (userId, taskData) => {
  const tasksRef = getUserTasksCollection(userId);
  const docRef = await addDoc(tasksRef, {
    ...taskData,
    completed: taskData.status === 'Completed',
    completedAt: taskData.status === 'Completed' ? new Date().toISOString() : null,
    actualDuration: taskData.actualDuration || 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: docRef.id, ...taskData };
};

export const updateTask = async (userId, taskId, updates) => {
  const taskRef = doc(db, 'users', userId, 'tasks', taskId);
  const payload = {
    ...updates,
    updatedAt: serverTimestamp(),
  };

  if (updates.status !== undefined) {
    payload.completed = updates.status === 'Completed';
    if (updates.status === 'Completed' && !updates.completedAt) {
      payload.completedAt = new Date().toISOString();
    }
  }

  await updateDoc(taskRef, payload);
};

export const deleteTask = async (userId, taskId) => {
  const taskRef = doc(db, 'users', userId, 'tasks', taskId);
  await deleteDoc(taskRef);
};

export const subscribeToTasks = (userId, onNext, onError) => {
  const tasksRef = getUserTasksCollection(userId);
  const q = query(tasksRef, orderBy('startTime', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const tasks = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      onNext(tasks);
    },
    onError
  );
};

/**
 * Routine CRUD Services
 */
export const getUserRoutinesCollection = (userId) => {
  return collection(db, 'users', userId, 'routines');
};

export const createRoutine = async (userId, routineData) => {
  const routinesRef = getUserRoutinesCollection(userId);
  const docRef = await addDoc(routinesRef, {
    ...routineData,
    enabled: routineData.enabled ?? true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: docRef.id, ...routineData };
};

export const updateRoutine = async (userId, routineId, updates) => {
  const routineRef = doc(db, 'users', userId, 'routines', routineId);
  await updateDoc(routineRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteRoutine = async (userId, routineId) => {
  const routineRef = doc(db, 'users', userId, 'routines', routineId);
  await deleteDoc(routineRef);
};

export const subscribeToRoutines = (userId, onNext, onError) => {
  const routinesRef = getUserRoutinesCollection(userId);
  return onSnapshot(
    routinesRef,
    (snapshot) => {
      const routines = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      onNext(routines);
    },
    onError
  );
};

/**
 * User Profile Firestore Services
 */
export const getUserDocument = async (userId) => {
  const userDocRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};
