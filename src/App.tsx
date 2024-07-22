import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import Food from './pages/Food';
import Travel from './pages/Travel';
import FAQ from './pages/FAQ';
import NavigationBar from './components/navigation-bar';
import { ThemeProvider, createTheme } from '@mui/material';
import OurStory from './pages/OurStory';
import Gallery from './pages/Gallery';
import Rsvp from './pages/RSVP';

export type Page = {
    path: string;
    component: JSX.Element;
    displayName: string;
};

export const pages: Page[] = [
    { path: '/', component: <Home />, displayName: 'Home' },
    { path: '/our-story', component: <OurStory />, displayName: 'Our Story' },
    { path: '/gallery', component: <Gallery />, displayName: 'Gallery' },
    { path: '/schedule', component: <Schedule />, displayName: 'Schedule' },
    { path: '/travel', component: <Travel />, displayName: 'Travel' },
    { path: '/food', component: <Food />, displayName: 'Food' },
    // { path: '/registry', component: <Registry />, displayName: 'Registry' },
    { path: '/faq', component: <FAQ />, displayName: 'FAQs' },
];

export default function App() {
    const myTheme = createTheme({
        palette: {
            background: {
                // default: '#f5f5f5',
            },
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

    return (
        <ThemeProvider theme={myTheme}>
            <BrowserRouter>
                <NavigationBar />
                <Routes>
                    {pages.map((route) => (
                        <Route key={route.path} path={route.path} element={route.component} />
                    ))}
                    <Route key={'/rsvp'} path={'/rsvp'} element={<Rsvp />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}
