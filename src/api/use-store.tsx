import { create } from 'zustand';

interface UserState {
    storeEmail: string;
    setStoreEmail: (email: string) => void;
    isAdmin: boolean;
    setIsAdmin: (isAdmin: boolean) => void;
}

export const useStore = create<UserState>((set) => ({
    storeEmail: localStorage.getItem('email') || '',
    setStoreEmail: (email) => {
        localStorage.setItem('email', email);
        set(() => ({ storeEmail: email }));
    },
    isAdmin: localStorage.getItem('isAdmin') === 'true',
    setIsAdmin: (isAdmin) => {
        localStorage.setItem('isAdmin', isAdmin.toString());
        set(() => ({ isAdmin }));
    },
}));
