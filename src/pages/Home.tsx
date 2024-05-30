import * as React from 'react';
import { Box, Divider, Grid, IconButton, MobileStepper, Typography } from '@mui/material';
import PageContainer from '../components/PageContainer';
import CountdownClock from '../components/countdown-clock';
import { importAllImages } from '../components/utilities';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

export default function Home() {
    const weddingDate = new Date(1748217600000);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(weddingDate);
    const [activeStep, setActiveStep] = React.useState(0);
    const images = importAllImages(
        import.meta.glob('../assets/images/display/**/*.{png,jpeg,jpg,svg}', {
            eager: true,
            import: 'default',
        })
    );
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
                            key={Object.entries(images)[activeStep][0]}
                            src={Object.entries(images)[activeStep][1]}
                            alt={Object.entries(images)[activeStep][0]}
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
