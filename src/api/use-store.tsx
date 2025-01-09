import { create } from 'zustand';

interface UserState {
    storeEmail: string;
    setStoreEmail: (email: string) => void;
}

export const useStore = create<UserState>((set) => ({
    storeEmail: localStorage.getItem('email') || '',
    setStoreEmail: (email) => {
        localStorage.setItem('email', email);
        set(() => ({ storeEmail: email }));
    },
}));
