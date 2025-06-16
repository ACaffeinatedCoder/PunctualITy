import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  getAuth,
  signOut,
} from 'firebase/auth';
import { auth, firebaseConfig, db } from './config/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { initializeApp, deleteApp } from 'firebase/app';

/** create a context */
const AuthContext = createContext();

/** let the context be usable in other pages */
export const useAuth = () => useContext(AuthContext);

/** create an auth wrapper for the app */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // catcher for auth checking

  const login = async (email, password) => {
    console.log('Attempting login...');
    if (email !== '' && password !== '') {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        setCurrentUser(userCredential.user);
        console.log('Log in successful.');
        return { success: true };
      } catch (error) {
        console.error('Login failed');
        return { success: false, message: error.message };
      }
    } else {
      return {
        success: false,
        message: 'Incomplete credentials. Please try again.',
      };
    }
  };

  const registerUser = async (email, password, role, displayName) => {
    const secondaryApp = initializeApp(firebaseConfig, 'Secondary');
    const secondaryAuth = getAuth(secondaryApp);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, 'User-Information', user.uid), {
        email: user.email,
        role: role,
        displayName: displayName,
      });
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        return {
          success: false,
          message: 'Email already exists. Please use a different one.',
        };
      }
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed. Please try again later.',
      };
    } finally {
      await deleteApp(secondaryApp);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isLoggedIn: !!currentUser,
    login,
    registerUser,
    logout,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'User-Information', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            ...userDocSnap.data(),
          });
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
