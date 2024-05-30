import { createContext } from 'react';

interface ThemeContextType {
    theme: any;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: {},
});

export default ThemeContext;
