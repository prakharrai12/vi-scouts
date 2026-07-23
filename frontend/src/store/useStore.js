import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token: token || null });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
  setUser: (user) => set({ user }),
}));

export default useStore;
