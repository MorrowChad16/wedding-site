import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import Travel from './pages/Travel';
import FAQ from './pages/FAQ';
import NavigationBar from './components/navigation-bar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import WeddingParty from './pages/WeddingParty';
import Gallery from './pages/Gallery';
import Rsvp from './pages/RSVP';
import Registry from './pages/Registry';
import SaveTheDate from './pages/SaveTheDate';
import Admin from './pages/Admin';
import ProtectedRoute from './components/protected-route';

export type Page = {
    path: string;
    component: JSX.Element;
    displayName: string;
};

export const pages: Page[] = [
    { path: '/', component: <Home />, displayName: 'Home' },
    { path: '/wedding-party', component: <WeddingParty />, displayName: 'Wedding Party' },
    { path: '/gallery', component: <Gallery />, displayName: 'Gallery' },
    { path: '/schedule', component: <Schedule />, displayName: 'Schedule' },
    { path: '/travel', component: <Travel />, displayName: 'Travel' },
    { path: '/registry', component: <Registry />, displayName: 'Registry' },
    { path: '/faq', component: <FAQ />, displayName: 'FAQs' },
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

    return (
        <ThemeProvider theme={myTheme}>
            <BrowserRouter>
                <NavigationBar />
                {/* <ChatBot /> */}
                <Routes>
                    {pages.map((route) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={<ProtectedRoute>{route.component}</ProtectedRoute>}
                        />
                    ))}
                    <Route
                        key={'/save-the-date'}
                        path={'/save-the-date'}
                        element={<SaveTheDate />}
                    />
                    <Route
                        key={'/rsvp'}
                        path={'/rsvp'}
                        element={
                            <ProtectedRoute>
                                <Rsvp />
                            </ProtectedRoute>
                        }
                    />
                    <Route key={'/admin'} path={'/admin'} element={<Admin />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}
