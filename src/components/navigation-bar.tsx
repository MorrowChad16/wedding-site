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
import { useMediaQuery, useTheme } from '@mui/material';

function NavigationBar() {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(location.pathname);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const isOnPage = (page: Page) => {
        return currentPage.includes(page.displayName) || currentPage.includes(page.path);
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
                                </Box>
                            </Drawer>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </div>
    );
}

export default NavigationBar;
