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
import { useState, useEffect } from 'react';
import { list, getUrl, remove } from 'aws-amplify/storage';
import { useStore } from '../api/use-store';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import { Delete } from '@mui/icons-material';
import '@aws-amplify/ui-react/styles.css';

interface MediaWithUrl {
    src: string;
    title: string;
    fullPath: string;
    type: 'image' | 'video';
}

// Styled component for the image with all necessary styles
const AnimatedImg = styled('img')({
    width: '100%',
    height: 'auto',
    display: 'block',
    objectFit: 'cover',
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

    const [images, setImages] = useState<MediaWithUrl[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<MediaWithUrl | null>(null);
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

            // Get URLs for each media file using AWS Amplify's built-in caching options
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

                    // Determine if it's a video or image based on file extension
                    const isVideo = item.path.toLowerCase().endsWith('.mp4');

                    return {
                        src: urlResult.url.toString(),
                        title: item.eTag,
                        fullPath: item.path,
                        type: isVideo ? 'video' : 'image',
                    } as MediaWithUrl;
                }
                return null;
            });

            const imageResults = await Promise.all(imagePromises);
            const validImages = imageResults.filter((img): img is MediaWithUrl => img !== null);

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

    const handleDeleteImage = (image: MediaWithUrl) => {
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
                message: 'Media deleted successfully!',
                severity: 'success',
            });

            // Refresh images
            await fetchImages();
        } catch (error) {
            console.error('Error deleting image:', error);
            setSnackbar({
                open: true,
                message: 'Failed to delete media. Please try again.',
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
                        No media available in the gallery at this time.
                    </Typography>
                </Box>
            </PageContainer>
        );
    }

    return (
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
                                    Upload New Photos & Videos (WebP images (use
                                    https://squoosh.app/) and MP4 videos)
                                </Typography>
                                <FileUploader
                                    acceptedFileTypes={['image/webp', 'video/mp4']}
                                    path="gallery/"
                                    maxFileCount={10}
                                    isResumable
                                    onUploadSuccess={() => {
                                        setSnackbar({
                                            open: true,
                                            message: 'Media uploaded successfully!',
                                            severity: 'success',
                                        });
                                        fetchImages();
                                    }}
                                    onUploadError={(error) => {
                                        console.error('Upload error:', error);
                                        setSnackbar({
                                            open: true,
                                            message: 'Failed to upload media. Please try again.',
                                            severity: 'error',
                                        });
                                    }}
                                />
                            </Box>
                        </Paper>
                    </Box>
                )}

                {/* Media Gallery */}
                <ImageList variant="masonry" cols={cols} gap={8}>
                    {images.map((item) => (
                        <ImageListItem
                            key={item.src}
                            sx={{
                                overflow: 'hidden',
                                position: 'relative',
                            }}
                        >
                            <Box sx={{ position: 'relative', width: '100%' }}>
                                {item.type === 'video' ? (
                                    <video
                                        src={item.src}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            display: 'block',
                                            objectFit: 'cover',
                                        }}
                                        onLoadedData={() => handleImageLoad(item.src)}
                                    />
                                ) : (
                                    <AnimatedImg
                                        src={item.src}
                                        alt={item.title}
                                        loading="lazy"
                                        className={
                                            loadedImages.has(item.src) ? 'loaded' : 'loading'
                                        }
                                        onLoad={() => handleImageLoad(item.src)}
                                    />
                                )}
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
                        </ImageListItem>
                    ))}
                </ImageList>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete this{' '}
                            {imageToDelete?.type === 'video' ? 'video' : 'image'}? This action
                            cannot be undone.
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
        </PageContainer>
    );
}
