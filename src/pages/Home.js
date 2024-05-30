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
    const images = importAllImages(import.meta.glob('../assets/images/display/**/*.{png,jpeg,jpg,svg}', {
        eager: true,
        import: 'default',
    }));
    const maxSteps = images ? Object.entries(images).length : 0;
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    return (React.createElement(PageContainer, null,
        React.createElement("div", { style: {
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            } },
            React.createElement(Box, { sx: { maxWidth: 600, flexGrow: 1, position: 'relative' } },
                React.createElement(Box, { sx: { display: 'flex', justifyContent: 'center', alignItems: 'center' } },
                    React.createElement("img", { key: Object.entries(images)[activeStep][0], src: Object.entries(images)[activeStep][1], alt: Object.entries(images)[activeStep][0], style: { maxWidth: '100%', height: 'auto' } })),
                React.createElement(MobileStepper, { variant: "dots", steps: maxSteps, position: "static", activeStep: activeStep, nextButton: React.createElement(IconButton, { onClick: handleNext, disabled: activeStep === maxSteps - 1 },
                        React.createElement(ArrowForward, null)), backButton: React.createElement(IconButton, { onClick: handleBack, disabled: activeStep === 0 },
                        React.createElement(ArrowBack, null)) })),
            React.createElement(Box, { sx: { textAlign: 'center' } },
                React.createElement(Typography, { variant: "h2", sx: { fontWeight: 'bold' } }, "Chad and Ciara"),
                React.createElement(Box, { paddingTop: '20px' },
                    React.createElement(Grid, { container: true, spacing: 2, alignItems: "center", justifyContent: "center" },
                        React.createElement(Grid, { item: true },
                            React.createElement(Typography, { variant: "body2" }, "Mallorca, Spain")),
                        React.createElement(Grid, { item: true },
                            React.createElement(Divider, { orientation: "vertical", flexItem: true, sx: {
                                    height: '15px',
                                    borderRightWidth: '1px',
                                    borderColor: 'black',
                                } })),
                        React.createElement(Grid, { item: true },
                            React.createElement(Typography, { variant: "body2" }, formattedDate))))),
            React.createElement(Grid, { container: true, spacing: 2, alignItems: "center", justifyContent: "center", padding: '10px' },
                React.createElement(Grid, { item: true },
                    React.createElement(Divider, { sx: { width: '500px', borderRightWidth: '1px' } }))),
            React.createElement(Box, { marginBottom: '40px' },
                React.createElement(CountdownClock, { targetEpochDate: weddingDate.getTime() })))));
}
