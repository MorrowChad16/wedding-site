import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import Food from './pages/Food';
import Travel from './pages/Travel';
import FAQ from './pages/FAQ';
import Registry from './pages/Registry';
import NavigationBar from './components/NavigationBar';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import ThemeContext from './components/use-theme-context';
import OurStory from './pages/OurStory';
import Photos from './pages/Photos';
import Rsvp from './pages/RSVP';
export const pages = [
    { path: '/', component: React.createElement(Home, null), displayName: 'Home' },
    { path: '/our-story', component: React.createElement(OurStory, null), displayName: 'Our Story' },
    { path: '/photos', component: React.createElement(Photos, null), displayName: 'Photos' },
    { path: '/schedule', component: React.createElement(Schedule, null), displayName: 'Schedule' },
    { path: '/travel', component: React.createElement(Travel, null), displayName: 'Travel' },
    { path: '/food', component: React.createElement(Food, null), displayName: 'Food' },
    { path: '/registry', component: React.createElement(Registry, null), displayName: 'Registry' },
    { path: '/faq', component: React.createElement(FAQ, null), displayName: 'FAQs' },
];
export default function App() {
    const myTheme = createTheme({
        palette: {
            primary: {
                main: '#B5651D',
                contrastText: '#fff',
            },
            secondary: {
                main: '#f50057',
                contrastText: '#fff',
            },
        },
        typography: {
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 16,
            fontWeightLight: 300,
            fontWeightRegular: 400,
            fontWeightMedium: 500,
            fontWeightBold: 700,
        },
    });
    return (React.createElement(ThemeProvider, { theme: myTheme },
        React.createElement(ThemeContext.Provider, { value: { theme: myTheme } },
            React.createElement(BrowserRouter, null,
                React.createElement(NavigationBar, null),
                React.createElement(Routes, null,
                    pages.map((route) => (React.createElement(Route, { key: route.path, path: route.path, element: route.component }))),
                    React.createElement(Route, { key: '/rsvp', path: '/rsvp', element: React.createElement(Rsvp, null) }))))));
}
