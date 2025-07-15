import { useEffect, useState } from 'react';
import {
    Box,
    Divider,
    Grid,
    IconButton,
    MobileStepper,
    Typography,
    useMediaQuery,
    useTheme,
    CircularProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Paper,
} from '@mui/material';
import PageContainer from '../components/page-container';
import CountdownClock from '../components/countdown-clock';
import { ArrowBack, ArrowForward, Delete } from '@mui/icons-material';
import { COUPLE_NAMES, WEDDING_DATE, WEDDING_LOCATION } from '../utils/constants';
import { list, getUrl, remove } from 'aws-amplify/storage';
import { useStore } from '../api/use-store';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';

interface ImageWithUrl {
    src: string;
    title: string;
    fullPath: string;
}

export default function Home() {
    const theme = useTheme();
    const { isAdmin } = useStore();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(WEDDING_DATE);

    const [images, setImages] = useState<ImageWithUrl[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeStep, setActiveStep] = useState(0);
    const [imageLoading, setImageLoading] = useState(true);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<ImageWithUrl | null>(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    const maxSteps = images.length;

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize); // Cleanup on unmount
    }, []);

    useEffect(() => {
        fetchImages();
    }, []);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleDeleteImage = (image: ImageWithUrl) => {
        setImageToDelete(image);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteImage = async () => {
        if (!imageToDelete) return;

        try {
            // Use the fullPath for reliable deletion
            await remove({
                path: imageToDelete.fullPath,
            });

            setSnackbar({
                open: true,
                message: 'Image deleted successfully!',
                severity: 'success',
            });

            // Refresh images
            await fetchImages();

            // Reset active step if necessary
            if (activeStep >= images.length - 1) {
                setActiveStep(Math.max(0, images.length - 2));
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            setSnackbar({
                open: true,
                message: 'Failed to delete image. Please try again.',
                severity: 'error',
            });
        } finally {
            setDeleteDialogOpen(false);
            setImageToDelete(null);
        }
    };

    const fetchImages = async () => {
        try {
            setLoading(true);
            // List all files in the home/* directory
            const result = await list({
                path: 'home/',
            });

            // Get URLs for each image file using AWS Amplify's built-in caching options
            const imagePromises = result.items.map(async (item) => {
                if (item.path) {
                    // Use AWS Amplify's built-in caching and performance options
                    const urlResult = await getUrl({
                        path: item.path,
                        options: {
                            validateObjectExistence: false, // Skip validation for faster loading
                            expiresIn: 3600, // 1 hour expiration (default but explicit)
                        },
                    });

                    return {
                        src: urlResult.url.toString(),
                        title: item.eTag,
                        fullPath: item.path,
                    };
                }
                return null;
            });

            const imageResults = await Promise.all(imagePromises);
            const validImages = imageResults.filter((img): img is ImageWithUrl => img !== null);

            setImages(validImages);
        } catch (error) {
            console.error('Error fetching images from storage:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    if (loading) {
        return (
            <PageContainer>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            </PageContainer>
        );
    }

    if (images.length === 0 && !isAdmin) {
        return (
            <PageContainer>
                <Box textAlign="center" p={4}>
                    <Typography variant="h6" color="text.secondary">
                        No images available at this time.
                    </Typography>
                </Box>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <div
                style={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {/* Admin Controls - Moved to Top */}
                {isAdmin && (
                    <Box width={{ xs: '100%', sm: '100%', md: '650px', lg: '650px' }} mb={4}>
                        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Home Admin Controls
                            </Typography>

                            {/* Upload Section */}
                            <Box mb={3}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Upload New Photo
                                </Typography>
                                <FileUploader
                                    acceptedFileTypes={['image/webp']}
                                    path="home/"
                                    maxFileCount={1}
                                    isResumable
                                    onUploadSuccess={() => {
                                        setSnackbar({
                                            open: true,
                                            message: 'Image uploaded successfully!',
                                            severity: 'success',
                                        });
                                        fetchImages();
                                    }}
                                    onUploadError={(error) => {
                                        console.error('Upload error:', error);
                                        setSnackbar({
                                            open: true,
                                            message: 'Failed to upload image. Please try again.',
                                            severity: 'error',
                                        });
                                    }}
                                />
                            </Box>
                        </Paper>
                    </Box>
                )}

                <Box
                    width={{ xs: '100%', sm: '100%', md: '650px', lg: '650px' }}
                    flexGrow={1}
                    position={'relative'}
                >
                    <Box
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        position={'relative'}
                    >
                        <div
                            style={{
                                width: '100%',
                                height: windowWidth < 450 ? windowWidth : '500px',
                                backgroundColor: 'lightgray',
                                borderRadius: '10px',
                                display: imageLoading ? 'block' : 'none',
                            }}
                        />
                        {images[activeStep] && (
                            <>
                                <img
                                    key={images[activeStep].src}
                                    src={images[activeStep].src}
                                    alt={images[activeStep].title}
                                    style={{
                                        objectFit: 'cover',
                                        aspectRatio: 'auto',
                                        width: '100%',
                                        height: '500px',
                                        borderRadius: '10px',
                                        display: imageLoading ? 'none' : 'block',
                                    }}
                                    loading="eager"
                                    onLoadStart={() => setImageLoading(true)}
                                    onLoad={() => setImageLoading(false)}
                                />
                                {/* Delete Icon Overlay */}
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        },
                                        zIndex: 2,
                                        visibility: isAdmin ? 'visible' : 'hidden',
                                        pointerEvents: isAdmin ? 'auto' : 'none',
                                    }}
                                    size="small"
                                    onClick={() => handleDeleteImage(images[activeStep])}
                                >
                                    <Delete fontSize="small" color="error" />
                                </IconButton>
                            </>
                        )}
                    </Box>
                    <MobileStepper
                        variant="dots"
                        steps={maxSteps}
                        position="static"
                        activeStep={activeStep}
                        nextButton={
                            <IconButton onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                                <ArrowForward />
                            </IconButton>
                        }
                        backButton={
                            <IconButton onClick={handleBack} disabled={activeStep === 0}>
                                <ArrowBack />
                            </IconButton>
                        }
                    />
                </Box>

                <Box textAlign={'center'}>
                    <Typography
                        variant="h2"
                        fontWeight={'bold'}
                        fontSize={isSmallScreen ? '3rem' : '4rem'}
                    >
                        {COUPLE_NAMES}
                    </Typography>

                    <Box pt={'20px'}>
                        <Grid container spacing={2} alignItems="center" justifyContent="center">
                            <Grid item>
                                <Typography variant="body2">{WEDDING_LOCATION}</Typography>
                            </Grid>
                            <Grid item>
                                <Divider
                                    orientation="vertical"
                                    flexItem
                                    sx={{
                                        height: '15px',
                                        borderRightWidth: '1px',
                                        borderColor: 'black',
                                    }}
                                />
                            </Grid>
                            <Grid item>
                                <Typography variant="body2">{formattedDate}</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                <Grid container spacing={2} alignItems="center" justifyContent="center" p={2}>
                    <Grid item xs={12} sm={10} md={6} lg={5}>
                        <Divider sx={{ borderRightWidth: '1px' }} />
                    </Grid>
                </Grid>

                <Box mb="40">
                    <CountdownClock />
                </Box>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete this image? This action cannot be
                            undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button onClick={confirmDeleteImage} color="error" variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Success/Error Snackbar */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Box
                        sx={{
                            backgroundColor:
                                snackbar.severity === 'success' ? 'success.main' : 'error.main',
                            color: 'white',
                            px: 2,
                            py: 1,
                            borderRadius: 1,
                        }}
                    >
                        {snackbar.message}
                    </Box>
                </Snackbar>
            </div>
        </PageContainer>
    );
}
