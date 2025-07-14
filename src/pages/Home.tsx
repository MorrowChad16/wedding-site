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
} from '@mui/material';
import PageContainer from '../components/page-container';
import CountdownClock from '../components/countdown-clock';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { COUPLE_NAMES, WEDDING_DATE, WEDDING_LOCATION } from '../utils/constants';
import { list, getUrl } from 'aws-amplify/storage';

interface ImageWithUrl {
    src: string;
    title: string;
}

export default function Home() {
    const theme = useTheme();
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

    const maxSteps = images.length;

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize); // Cleanup on unmount
    }, []);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                setLoading(true);
                // List all files in the home/* directory
                const result = await list({
                    path: 'home/',
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

        fetchImages();
    }, []);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
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

    if (images.length === 0) {
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
                <Box
                    width={{ xs: '100%', sm: '100%', md: '650px', lg: '650px' }}
                    flexGrow={1}
                    position={'relative'}
                >
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
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
            </div>
        </PageContainer>
    );
}
