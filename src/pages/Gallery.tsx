import PageContainer from '../components/page-container';
import {
    ImageList,
    ImageListItem,
    styled,
    useMediaQuery,
    useTheme,
    CircularProgress,
    Box,
    Typography,
} from '@mui/material';
import LazyLoad from 'react-lazyload';
import { useState, useEffect } from 'react';
import { list, getUrl } from 'aws-amplify/storage';
import { useStore } from '../api/use-store';
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
    // const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    // const [imageToDelete, setImageToDelete] = useState<ImageWithUrl | null>(null);
    // const [snackbar, setSnackbar] = useState({
    //     open: false,
    //     message: '',
    //     severity: 'success' as 'success' | 'error',
    // });

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

    const handleImageLoad = (src: string) => {
        setLoadedImages((prev) => new Set(prev).add(src));
    };

    // const handleDeleteImage = (image: ImageWithUrl) => {
    //     setImageToDelete(image);
    //     setDeleteDialogOpen(true);
    // };

    // const confirmDeleteImage = async () => {
    //     if (!imageToDelete) return;

    //     try {
    //         // Use the fullPath for reliable deletion
    //         await remove({
    //             path: imageToDelete.fullPath,
    //         });

    //         setSnackbar({
    //             open: true,
    //             message: 'Image deleted successfully!',
    //             severity: 'success',
    //         });

    //         // Refresh images
    //         await fetchImages();
    //     } catch (error) {
    //         console.error('Error deleting image:', error);
    //         setSnackbar({
    //             open: true,
    //             message: 'Failed to delete image. Please try again.',
    //             severity: 'error',
    //         });
    //     } finally {
    //         setDeleteDialogOpen(false);
    //         setImageToDelete(null);
    //     }
    // };

    // const handleCloseSnackbar = () => {
    //     setSnackbar((prev) => ({ ...prev, open: false }));
    // };

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
        <PageContainer>
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
                                    className={loadedImages.has(item.src) ? 'loaded' : 'loading'}
                                    onLoad={() => handleImageLoad(item.src)}
                                />
                            </Box>
                        </LazyLoad>
                    </StyledImageListItem>
                ))}
            </ImageList>
        </PageContainer>
    );
}
