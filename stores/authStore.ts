import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  username: string;
  password: string;
}

interface AuthState {
  // Auth state
  users: User[];
  currentUser: User | null;
  authMode: 'signin' | 'signup';
  
  // Actions
  setAuthMode: (mode: 'signin' | 'signup') => void;
  signUp: (username: string, password: string, verifyPassword: string) => boolean;
  signIn: (username: string, password: string) => boolean;
  signOut: () => void;
  
  // Validation
  validateSignUp: (username: string, password: string, verifyPassword: string) => { isValid: boolean; errors: string[] };
  validateSignIn: (username: string, password: string) => { isValid: boolean; errors: string[] };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      users: [],
      currentUser: null,
      authMode: 'signin',

      // Set authentication mode (signin/signup)
      setAuthMode: (mode) => set({ authMode: mode }),

      // Sign up functionality
      signUp: (username, password, verifyPassword) => {
        const { isValid, errors } = get().validateSignUp(username, password, verifyPassword);
        
        if (!isValid) {
          console.log('Sign up validation failed:', errors);
          return false;
        }

        // Check if username already exists
        const existingUser = get().users.find(user => user.username === username.trim());
        if (existingUser) {
          console.log('Username already exists');
          return false;
        }

        const newUser: User = { username: username.trim(), password: password.trim() };
        set((state) => ({ 
          users: [...state.users, newUser],
          currentUser: newUser,
          authMode: 'signin'
        }));
        return true;
      },

      // Sign in functionality
      signIn: (username, password) => {
        const { isValid, errors } = get().validateSignIn(username, password);
        
        if (!isValid) {
          console.log('Sign in validation failed:', errors);
          return false;
        }

        // Check if user exists and password matches
        const storedUser = get().users.find(
          user => user.username === username.trim() && user.password === password.trim()
        );
        
        if (storedUser) {
          set({ currentUser: storedUser });
          return true;
        }
        
        return false;
      },

      // Sign out functionality
      signOut: () => set({ 
        currentUser: null 
      }),

      // Validation for sign up
      validateSignUp: (username, password, verifyPassword) => {
        const errors: string[] = [];
        
        // Check if fields are empty or only contain spaces
        if (!username || !username.trim()) {
          errors.push('Username is required');
        }
        if (!password || !password.trim()) {
          errors.push('Password is required');
        }
        if (!verifyPassword || !verifyPassword.trim()) {
          errors.push('Verify password is required');
        }

        // Check if username and password are trimmed
        if (username && username !== username.trim()) {
          errors.push('Username cannot start or end with spaces');
        }
        if (password && password !== password.trim()) {
          errors.push('Password cannot start or end with spaces');
        }

        // Check password length
        if (password && password.trim().length < 6) {
          errors.push('Password must be at least 6 characters');
        }

        // Check if passwords match
        if (password && verifyPassword && password.trim() !== verifyPassword.trim()) {
          errors.push('Passwords do not match');
        }

        return {
          isValid: errors.length === 0,
          errors
        };
      },

      // Validation for sign in
      validateSignIn: (username, password) => {
        const errors: string[] = [];
        
        // Check if fields are empty or only contain spaces
        if (!username || !username.trim()) {
          errors.push('Username is required');
        }
        if (!password || !password.trim()) {
          errors.push('Password is required');
        }

        return {
          isValid: errors.length === 0,
          errors
        };
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        users: state.users,
        currentUser: state.currentUser,
      }),
    }
  )
);
