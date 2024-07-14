import { create } from 'zustand';

interface UserState {
    email: string;
    setEmail: (email: string) => void;
}

export const useStore = create<UserState>((set) => ({
    email: localStorage.getItem('email') || '',
    setEmail: (email) => set(() => ({ email: email })),
}));
