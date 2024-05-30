import * as React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page, pages } from '../App';
import ThemeContext from './use-theme-context';
import homeIconUrl from '../assets/icons/home-icon.svg';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from '@mui/material';

const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

function NavigationBar() {
    const { theme } = React.useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = React.useState(location.pathname);

    const [open, setOpen] = React.useState(false);
    const [email, setEmail] = React.useState(localStorage.getItem('email'));
    const [openSignIn, setOpenSignIn] = React.useState(email === null);
    const [error, setError] = React.useState('');

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const RsvpButton = (
        <Button
            color="primary"
            variant="contained"
            onClick={() => {
                setCurrentPage('RSVP');
                navigate('/rsvp');
            }}
            sx={{ width: '100%' }}
        >
            RSVP
        </Button>
    );

    const SignInButton = (
        <Button
            color="primary"
            variant="outlined"
            onClick={() => setOpenSignIn(true)}
            sx={{ width: '100%' }}
        >
            Sign in
        </Button>
    );

    const isOnPage = (page: Page) => {
        return currentPage === page.displayName || currentPage === page.path;
    };

    return (
        <div>
            <AppBar
                position="fixed"
                sx={{
                    boxShadow: 0,
                    bgcolor: 'transparent',
                    backgroundImage: 'none',
                    mt: 2,
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar
                        variant="regular"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexShrink: 0,
                            borderRadius: '10px',
                            bgcolor: 'rgba(255, 255, 255, 0.4)',
                            backdropFilter: 'blur(24px)',
                            maxHeight: 40,
                            border: '1px solid',
                            borderColor: 'divider',
                            boxShadow: `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`,
                        }}
                    >
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: 'flex',
                                alignItems: 'center',
                                ml: '-18px',
                                px: 0,
                            }}
                        >
                            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                                {pages.map((page) => (
                                    <MenuItem
                                        key={page.displayName}
                                        onClick={() => {
                                            setCurrentPage(page.displayName);
                                            navigate(page.path);
                                        }}
                                        sx={{
                                            py: '6px',
                                            px: '12px',
                                            '&:hover': {
                                                backgroundColor: '#fafafa',
                                                borderRadius: '5px',
                                            },
                                        }}
                                    >
                                        {page.displayName === 'Home' ? (
                                            <img src={homeIconUrl} alt="Home" />
                                        ) : (
                                            <Typography
                                                variant="body2"
                                                color="text.primary"
                                                sx={{
                                                    borderBottom: isOnPage(page)
                                                        ? `2px solid ${theme.palette.primary.main}`
                                                        : '',
                                                }}
                                            >
                                                {page.displayName}
                                            </Typography>
                                        )}
                                    </MenuItem>
                                ))}
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                gap: 0.5,
                                alignItems: 'center',
                            }}
                        >
                            {email === null ? SignInButton : RsvpButton}
                        </Box>
                        <Box sx={{ display: { sm: '', md: 'none' } }}>
                            <Button
                                variant="text"
                                color="primary"
                                aria-label="menu"
                                onClick={toggleDrawer(true)}
                                sx={{ minWidth: '30px', p: '4px' }}
                            >
                                <MenuIcon />
                            </Button>
                            <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                                <Box
                                    sx={{
                                        minWidth: '60dvw',
                                        p: 2,
                                        backgroundColor: 'background.paper',
                                        flexGrow: 1,
                                    }}
                                >
                                    {pages.map((page) => (
                                        <MenuItem
                                            key={page.displayName}
                                            onClick={() => {
                                                setCurrentPage(page.displayName);
                                                navigate(page.path);
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                color="text.primary"
                                                sx={{
                                                    borderBottom: isOnPage(page)
                                                        ? `2px solid ${theme.palette.primary.main}`
                                                        : '',
                                                }}
                                            >
                                                {page.displayName}
                                            </Typography>
                                        </MenuItem>
                                    ))}
                                    <Divider />
                                    <MenuItem>
                                        {email === null ? SignInButton : RsvpButton}
                                    </MenuItem>
                                </Box>
                            </Drawer>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Dialog open={openSignIn} onClose={() => setOpenSignIn(false)}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ marginBottom: 2 }}>
                        Enter your email to view your selections.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="email"
                        label="Email"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!error}
                        helperText={error}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            if (email) {
                                if (emailRegex.test(email!)) {
                                    localStorage.setItem('email', email!);
                                    setOpenSignIn(false);
                                } else {
                                    setError('Invalid email address');
                                }
                            } else {
                                setError('You must provide an email');
                            }
                        }}
                    >
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default NavigationBar;
