import PageContainer from '../components/page-container';
import {
    ImageList,
    ImageListItem,
    styled,
    useMediaQuery,
    useTheme,
    CircularProgress,
    Box,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    IconButton,
} from '@mui/material';
import LazyLoad from 'react-lazyload';
import { useState, useEffect } from 'react';
import { list, getUrl, remove } from 'aws-amplify/storage';
import { useStore } from '../api/use-store';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import { Delete } from '@mui/icons-material';
import '@aws-amplify/ui-react/styles.css';

interface ImageWithUrl {
    src: string;
    title: string;
    fullPath: string;
}

const StyledImageListItem = styled(ImageListItem)({
    overflow: 'hidden',
    position: 'relative',
    '& img': {
        width: '100%',
        height: 'auto',
        display: 'block',
        objectFit: 'cover',
        transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
    },
});

// Styled component for the image
const AnimatedImg = styled('img')({
    transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
    '&.loading': {
        opacity: 0,
        transform: 'scale(0.8)',
    },
    '&.loaded': {
        opacity: 1,
        transform: 'scale(1)',
    },
});

export default function Gallery() {
    const theme = useTheme();
    const { isAdmin } = useStore();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const cols = isMobile ? 1 : isMediumScreen ? 2 : isLargeScreen ? 3 : 4;

    const [images, setImages] = useState<ImageWithUrl[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<ImageWithUrl | null>(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            setLoading(true);
            // List all files in the gallery/* directory
            const result = await list({
                path: 'gallery/',
            });

            // Get URLs for each image file
            const imagePromises = result.items.map(async (item) => {
                if (item.path) {
                    const urlResult = await getUrl({
                        path: item.path,
                    });

                    return {
                        src: urlResult.url.toString(),
                        title:
                            item.path
                                .split('/')
                                .pop()
                                ?.replace(/\.(webp)$/i, '') || '',
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

    const handleImageLoad = (src: string) => {
        setLoadedImages((prev) => new Set(prev).add(src));
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
                        No images available in the gallery at this time.
                    </Typography>
                </Box>
            </PageContainer>
        );
    }

    return (
        <>
            <PageContainer>
                <>
                    {/* Admin Controls */}
                    {isAdmin && (
                        <Box mb={3}>
                            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Gallery Admin Controls
                                </Typography>

                                {/* Upload Section */}
                                <Box>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Upload New Photos
                                    </Typography>
                                    <FileUploader
                                        acceptedFileTypes={['image/webp']}
                                        path="gallery/"
                                        maxFileCount={10}
                                        isResumable
                                        onUploadSuccess={() => {
                                            setSnackbar({
                                                open: true,
                                                message: 'Images uploaded successfully!',
                                                severity: 'success',
                                            });
                                            fetchImages();
                                        }}
                                        onUploadError={(error) => {
                                            console.error('Upload error:', error);
                                            setSnackbar({
                                                open: true,
                                                message:
                                                    'Failed to upload images. Please try again.',
                                                severity: 'error',
                                            });
                                        }}
                                    />
                                </Box>
                            </Paper>
                        </Box>
                    )}

                    {/* Image Gallery */}
                    <ImageList variant="masonry" cols={cols} gap={8}>
                        {images.map((item) => (
                            <StyledImageListItem key={item.src}>
                                <LazyLoad height={200} offset={100}>
                                    <Box sx={{ position: 'relative', width: '100%' }}>
                                        <AnimatedImg
                                            src={item.src}
                                            alt={item.title}
                                            loading="lazy"
                                            className={
                                                loadedImages.has(item.src) ? 'loaded' : 'loading'
                                            }
                                            onLoad={() => handleImageLoad(item.src)}
                                        />
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
                                            onClick={() => handleDeleteImage(item)}
                                        >
                                            <Delete fontSize="small" color="error" />
                                        </IconButton>
                                    </Box>
                                </LazyLoad>
                            </StyledImageListItem>
                        ))}
                    </ImageList>
                </>
            </PageContainer>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this image? This action cannot be undone.
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
        </>
    );
}
