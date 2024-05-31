import * as React from 'react';
import { Box, Divider, Grid, IconButton, MobileStepper, Typography } from '@mui/material';
import PageContainer from '../components/PageContainer';
import CountdownClock from '../components/countdown-clock';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import image0 from '../assets/images/display/IMG_5772.jpeg';
import image1 from '../assets/images/display/IMG_5841.jpeg';
import image2 from '../assets/images/display/IMG_6574.jpeg';
import image3 from '../assets/images/display/IMG_6622.jpeg';
import image4 from '../assets/images/display/IMG_7415.jpeg';
import image5 from '../assets/images/display/IMG_7556.jpeg';
import image6 from '../assets/images/display/IMG_8086.jpeg';
import image7 from '../assets/images/display/IMG_8636.jpeg';
import image8 from '../assets/images/display/IMG_9055.jpeg';
import image9 from '../assets/images/display/IMG_9191.jpeg';
import image10 from '../assets/images/display/IMG_9220.jpeg';
import image11 from '../assets/images/display/IMG_9238.jpeg';
import { extractFilenameFromImport } from '../components/utilities';

export default function Home() {
    const weddingDate = new Date(1748217600000);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(weddingDate);
    const [activeStep, setActiveStep] = React.useState(0);
    const images = [
        image0,
        image1,
        image2,
        image3,
        image4,
        image5,
        image6,
        image7,
        image8,
        image9,
        image10,
        image11,
    ];
    const maxSteps = images ? Object.entries(images).length : 0;

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
                <Box sx={{ maxWidth: 600, flexGrow: 1, position: 'relative' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img
                            key={extractFilenameFromImport(images[activeStep])}
                            src={images[activeStep]}
                            alt={extractFilenameFromImport(images[activeStep])}
                            style={{ maxWidth: '100%', height: 'auto' }}
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

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                        Chad and Ciara
                    </Typography>

                    <Box paddingTop={'20px'}>
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

                <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                    padding={'10px'}
                >
                    <Grid item>
                        <Divider sx={{ width: '500px', borderRightWidth: '1px' }} />
                    </Grid>
                </Grid>

                <Box marginBottom={'40px'}>
                    <CountdownClock targetEpochDate={weddingDate.getTime()} />
                </Box>
            </div>
        </PageContainer>
    );
}
