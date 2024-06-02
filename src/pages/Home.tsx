import { useState } from 'react';
import { Box, Divider, Grid, IconButton, MobileStepper, Typography, useMediaQuery, useTheme } from '@mui/material';
import PageContainer from '../components/PageContainer';
import CountdownClock from '../components/countdown-clock';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import image0 from '../assets/images/display/IMG_5772.jpeg';
import image10 from '../assets/images/display/IMG_9220.jpeg';
import { extractFilenameFromImport } from '../utils/utilities';
import { WEDDING_DATE } from '../utils/constants';

export default function Home() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(WEDDING_DATE);
    const [activeStep, setActiveStep] = useState(0);
    const images = [image0, image10];
    const maxSteps = images ? Object.entries(images).length : 0;
    const [imageLoading, setImageLoading] = useState(true);
    
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

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
                <Box width={{ xs: '100%', sm: '100%', md: '600px', lg: '600px' }} flexGrow={1} position={'relative'}>
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        <div
                            style={{
                                width: '100%',
                                height: isSmallScreen ? 'auto' : '450px',
                                backgroundColor: 'lightgray',
                                borderRadius: '10px',
                                display: imageLoading ? 'block' : 'none',
                            }}
                        />
                        <img
                            key={extractFilenameFromImport(images[activeStep])}
                            src={images[activeStep]}
                            alt={extractFilenameFromImport(images[activeStep])}
                            style={{
                                width: '100%',
                                height: isSmallScreen ? 'auto' : '450px',
                                borderRadius: '10px',
                                display: imageLoading ? 'none' : 'block',
                            }}
                            loading="eager"
                            onLoadStart={() => setImageLoading(true)}
                            onLoad={() => setImageLoading(false)}
                        />
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
                    <Typography variant="h2" fontWeight={'bold'} fontSize={isSmallScreen ? '3rem' : '4rem'}>
                        Ciara and Chad
                    </Typography>

                    <Box pt={'20px'}>
                        <Grid container spacing={2} alignItems="center" justifyContent="center">
                            <Grid item>
                                <Typography variant="body2">Mallorca, Spain</Typography>
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
