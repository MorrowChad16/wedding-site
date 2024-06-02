import { createContext, useState } from 'react';

interface SharedVariableContextType {
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
}

export const SharedVariableContext = createContext<SharedVariableContextType>({
    email: '',
    setEmail: () => {},
});

export function SharedVariableProvider({ children }: { children: React.ReactNode }) {
    const [email, setEmail] = useState(localStorage.getItem('email') || '');

    return (
        <SharedVariableContext.Provider value={{ email, setEmail }}>
            {children}
        </SharedVariableContext.Provider>
    );
}
