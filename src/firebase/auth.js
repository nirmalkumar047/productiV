import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

/**
 * Register a new user with email/password and create user doc in Firestore
 */
export const registerUser = async (name, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update display name on Firebase auth user
  try {
    await updateProfile(user, {
      displayName: name,
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || email)}`,
    });
  } catch (err) {
    console.warn('Error updating profile displayName:', err);
  }

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  // Create user document in Firestore users/{userId}
  try {
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      name: name,
      email: email,
      photoURL: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || email)}`,
      createdAt: serverTimestamp(),
      role: 'user',
      timezone: userTimezone,
      lastLogin: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Firestore user doc creation notice (check security rules):', err.message);
  }

  return user;
};

/**
 * Login existing user
 */
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update lastLogin timestamp safely without crashing if rules pending
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      await updateDoc(userDocRef, {
        lastLogin: serverTimestamp(),
      });
    } else {
      await setDoc(userDocRef, {
        uid: user.uid,
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        photoURL: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email)}`,
        createdAt: serverTimestamp(),
        role: 'user',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        lastLogin: serverTimestamp(),
      });
    }
  } catch (err) {
    console.warn('Firestore lastLogin update notice (check security rules):', err.message);
  }

  return user;
};

/**
 * Logout current user
 */
export const logoutUser = () => {
  return signOut(auth);
};

/**
 * Send password reset email
 */
export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};

/**
 * Update User Profile in Auth & Firestore
 */
export const updateUserProfileData = async (uid, updates) => {
  const user = auth.currentUser;
  if (user) {
    if (updates.name || updates.photoURL) {
      await updateProfile(user, {
        displayName: updates.name || user.displayName,
        photoURL: updates.photoURL || user.photoURL,
      });
    }
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Firestore profile update notice:', err.message);
  }
};
