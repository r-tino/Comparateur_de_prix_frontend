// store/authStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      auth: {
        username: '',
        active: false,
        isAuthenticated: false,
        user: null,
      },
      setUsername: (name) =>
        set((state) => ({
          auth: {
            ...state.auth,
            username: name,
          },
        })),
      setActive: (status) =>
        set((state) => ({
          auth: {
            ...state.auth,
            active: status,
          },
        })),
      setIsAuthenticated: (authenticate) =>
        set((state) => ({
          auth: {
            ...state.auth,
            isAuthenticated: authenticate,
          },
        })),
      setUser: (user) => 
        set((state) => ({
          auth: {
            ...state.auth,
            user,
          },
        })),
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({ auth: state.auth }),
    }
  )
);

export default useAuthStore;