import { useState, useEffect } from 'react';
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
import homeIconUrl from '../assets/icons/home-icon.svg';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { isValidFullName } from '../api/use-guests';
import { useStore } from '../api/use-store';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const getClient = () => generateClient<Schema>();

function NavigationBar() {
    const theme = useTheme();
    // used across screens
    const { storeEmail, setStoreEmail, isAdmin, setIsAdmin } = useStore();
    // used for visualizations
    const [fullName, setFullName] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(location.pathname);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [open, setOpen] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(
        storeEmail === '' &&
            location.pathname !== '/save-the-date' &&
            location.pathname !== '/admin'
    );
    const [openAdminLogin, setOpenAdminLogin] = useState(
        !isAdmin && location.pathname === '/admin'
    );
    const [error, setError] = useState('');
    const [adminError, setAdminError] = useState('');

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const SaveTheDateButton = (
        <Button
            color="primary"
            variant="contained"
            onClick={() => {
                setCurrentPage('/save-the-date');
                navigate('/save-the-date');
            }}
            fullWidth
        >
            Save The Date
        </Button>
    );

    const isOnPage = (page: Page) => {
        return currentPage === page.path;
    };

    const handleLoginClick = async () => {
        if (fullName) {
            const isValid = await isValidFullName(fullName.toLowerCase().trim());
            if (isValid) {
                try {
                    // Get the email associated with this fullName for backward compatibility
                    const response =
                        await getClient().models.WeddingGuests.listWeddingGuestsByFullName({
                            fullName: fullName.toLowerCase().trim(),
                        });

                    if (response.data && response.data.length > 0) {
                        const email = response.data[0].email;
                        setStoreEmail(email);
                        setOpenSignIn(false);
                    } else {
                        setError('Unable to find associated email');
                    }
                } catch (error) {
                    console.error('Error getting email for fullName:', error);
                    setError('Login failed. Please try again.');
                }
            } else {
                setError('Full name not found. Please check your spelling or contact us.');
            }
        } else {
            setError('You must provide your full name');
        }
    };

    const handleAdminLogin = async () => {
        if (!adminPassword) {
            setAdminError('Please enter the admin password');
            return;
        }

        try {
            const result = await getClient().queries.validateAdminPassword({
                password: adminPassword,
            });

            if (result.data) {
                setIsAdmin(true);
                setOpenAdminLogin(false);
                setAdminError('');
            } else {
                setAdminError('Invalid admin password');
            }
        } catch (error) {
            console.error('Error during admin login:', error);
            setAdminError('Admin login failed. Please try again.');
        }
    };

    // Handle admin login requirement when navigating to admin page
    useEffect(() => {
        if (location.pathname === '/admin' && !isAdmin) {
            setOpenAdminLogin(true);
        } else {
            setOpenAdminLogin(false);
        }
        setCurrentPage(location.pathname);
    }, [location.pathname, isAdmin]);

    const toolbarStyle = isMobile
        ? {}
        : {
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
                <Container maxWidth="xl">
                    <Toolbar variant="regular" sx={toolbarStyle}>
                        {/* Only displays for computers */}
                        <Box flexGrow={1} display={'flex'} ml={'-18px'}>
                            <Box display={{ xs: 'none', md: 'flex' }}>
                                {pages.map((page) => (
                                    <MenuItem
                                        key={page.displayName}
                                        onClick={() => {
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
                        <Box display={{ xs: 'none', md: 'flex' }} gap={0.5} alignItems={'center'}>
                            {SaveTheDateButton}
                        </Box>

                        {/* Only displays for mobile */}
                        <Box display={{ sm: '', md: 'none' }}>
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
                                    minWidth={'60dvw'}
                                    p={2}
                                    bgcolor={'background.paper'}
                                    flexGrow={1}
                                >
                                    {pages.map((page) => (
                                        <MenuItem
                                            key={page.displayName}
                                            onClick={() => {
                                                navigate(page.path);
                                                setOpen(false);
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
                                    <MenuItem>{SaveTheDateButton}</MenuItem>
                                </Box>
                            </Drawer>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Dialog
                open={openSignIn}
                onClose={(_, reason: string) => {
                    if (reason !== 'backdropClick') {
                        setOpenSignIn(false);
                    }
                }}
            >
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <DialogContentText mb={2}>
                        Please enter your full name as submitted in the "Save the Date" form. You
                        will be able to view your RSVP status, food choices, and song requests. If
                        you have any issues, please contact us.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="fullName"
                        label="Full Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleLoginClick();
                            }
                        }}
                        error={!!error}
                        helperText={error}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpenSignIn(false);
                            navigate('/save-the-date');
                        }}
                        color="secondary"
                    >
                        Not registered yet?
                    </Button>
                    <Button onClick={handleLoginClick} variant="contained">
                        Login
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Admin Login Dialog */}
            <Dialog
                open={openAdminLogin}
                onClose={(_, reason: string) => {
                    if (reason !== 'backdropClick') {
                        setOpenAdminLogin(false);
                        navigate('/'); // Redirect to home if admin login is cancelled
                    }
                }}
            >
                <DialogTitle>Admin Login Required</DialogTitle>
                <DialogContent>
                    <DialogContentText mb={2}>
                        This page requires administrator access. Please enter the admin password to
                        continue.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="adminPassword"
                        label="Admin Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleAdminLogin();
                            }
                        }}
                        error={!!adminError}
                        helperText={adminError}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpenAdminLogin(false);
                            navigate('/');
                        }}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleAdminLogin} variant="contained">
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default NavigationBar;
