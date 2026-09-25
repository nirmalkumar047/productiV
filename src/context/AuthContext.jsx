import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  updateUserProfileData,
} from '../firebase/auth';
import { getUserDocument } from '../firebase/firestore';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const docData = await getUserDocument(user.uid);
          setUserDoc(docData);
        } catch (error) {
          console.warn('Notice: Could not fetch user document (check Firestore security rules):', error.message);
          setUserDoc(null);
        }
      } else {
        setCurrentUser(null);
        setUserDoc(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      try {
        const docData = await getUserDocument(user.uid);
        setUserDoc(docData);
      } catch (err) {
        console.warn('Notice: Firestore user doc read skipped:', err.message);
      }
      setLoading(false);
      return user;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const user = await registerUser(name, email, password);
      try {
        const docData = await getUserDocument(user.uid);
        setUserDoc(docData);
      } catch (err) {
        console.warn('Notice: Firestore user doc read skipped:', err.message);
      }
      setLoading(false);
      return user;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setUserDoc(null);
  };

  const resetUserPassword = async (email) => {
    return resetPassword(email);
  };

  const updateProfile = async (updates) => {
    if (!currentUser) return;
    await updateUserProfileData(currentUser.uid, updates);
    try {
      const updatedDoc = await getUserDocument(currentUser.uid);
      setUserDoc(updatedDoc);
    } catch (err) {
      console.warn('Notice: Profile doc update check skipped:', err.message);
    }
  };

  const value = {
    currentUser,
    userDoc,
    loading,
    login,
    register,
    logout,
    resetPassword: resetUserPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
