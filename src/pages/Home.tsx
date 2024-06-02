import { useState } from 'react';
import { Box, Divider, Grid, IconButton, MobileStepper, Typography } from '@mui/material';
import PageContainer from '../components/PageContainer';
import CountdownClock from '../components/countdown-clock';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import image0 from '../assets/images/display/IMG_5772.jpeg';
import image10 from '../assets/images/display/IMG_9220.jpeg';
import { extractFilenameFromImport } from '../utils/utilities';
import { WEDDING_DATE } from '../utils/constants';

export default function Home() {
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
                <Box sx={{ width: 600, flexGrow: 1, position: 'relative' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div
                            style={{
                                width: '100%',
                                height: '450px',
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
                                height: '450px',
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

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                        Ciara and Chad
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
                    <CountdownClock />
                </Box>
            </div>
        </PageContainer>
    );
}
