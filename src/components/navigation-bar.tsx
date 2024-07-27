import { useState } from 'react';
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
import { isValidEmail } from '../api/use-guests';
import { useStore } from '../api/use-store';

function NavigationBar() {
    const theme = useTheme();
    const { email, setEmail } = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(location.pathname);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [open, setOpen] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(email === '');
    const [error, setError] = useState('');

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    // const RsvpButton = (
    //     <Button
    //         color="primary"
    //         variant="contained"
    //         onClick={() => {
    //             setCurrentPage('RSVP');
    //             navigate('/rsvp');
    //         }}
    //         fullWidth
    //     >
    //         {PAST_DUE_DATE ? 'See Details' : 'RSVP'}
    //     </Button>
    // );

    const isOnPage = (page: Page) => {
        return currentPage === page.displayName || currentPage === page.path;
    };

    const handleLoginClick = async () => {
        if (email) {
            const isValid = await isValidEmail(email);
            if (isValid) {
                localStorage.setItem('email', email!);
                setEmail(email);
                setOpenSignIn(false);
            } else {
                setError('Invalid email address');
            }
        } else {
            setError('You must provide an email');
        }
    };

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
                        {/* TODO: bring back when RSVP is ready */}
                        {/* <Box display={{ xs: 'none', md: 'flex' }} gap={0.5} alignItems={'center'}>
                            {RsvpButton}
                        </Box> */}

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
                                    {/* TODO: bring back when RSVP is ready */}
                                    {/* <MenuItem>{RsvpButton}</MenuItem> */}
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
                        Enter your email to view your selections. Each 'party' will share the same
                        email across all guests.
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
                    <Button onClick={handleLoginClick}>Login</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default NavigationBar;
