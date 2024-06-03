import { useContext } from 'react';
import PageContainer from '../components/PageContainer';
import { Box, Button, Paper, Typography } from '@mui/material';
import { openInNewWindow } from '../utils/utilities';
import hotel from '../assets/images/hotel.jpeg';
import lyft from '../assets/images/lyft.jpeg';
import uber from '../assets/images/uber.webp';
import ThemeContext from '../components/use-theme-context';
import HorizontalScroll from '../components/horizontal-scroll';

// TODO: add distance to venue
interface HotelInfo {
    name: string;
    image: string;
    address: string;
    phone: string;
    description: string;
    websiteUrl: string;
}

interface AiportInfo {
    name: string;
    address: string;
    description: string;
}

interface TransportationInfo {
    name: string;
    image: string;
    description: string;
    websiteUrl: string;
}

export default function Travel() {
    const { theme } = useContext(ThemeContext);

    const hotels: HotelInfo[] = [
        {
            name: 'EAGLE RIDGE RESORT',
            image: hotel,
            address: '444 EAGLE RIDGE DR, GALENA, IL 61036, USA',
            phone: '(815) 777-5000',
            description:
                'Luxury resort, spa, and rental homes located 8 miles from downtown Galena',
            websiteUrl:
                'http://www.eagleridge.com/?wwpath=www.theknot.com%2Fus%2Fmadison-williams-and-boyan-kirby-jun-2024',
        },
        {
            name: 'EAGLE RIDGE SPA',
            image: hotel,
            address: '444 EAGLE RIDGE DR, GALENA, IL 61036, USA',
            phone: '(815) 777-5000',
            description:
                'Luxury resort, spa, and rental homes located 8 miles from downtown Galena',
            websiteUrl:
                'http://www.eagleridge.com/?wwpath=www.theknot.com%2Fus%2Fmadison-williams-and-boyan-kirby-jun-2024',
        },
        {
            name: 'EAGLE RIDGE RESORT & SPA',
            image: hotel,
            address: '444 EAGLE RIDGE DR, GALENA, IL 61036, USA',
            phone: '(815) 777-5000',
            description:
                'Luxury resort, spa, and rental homes located 8 miles from downtown Galena',
            websiteUrl:
                'http://www.eagleridge.com/?wwpath=www.theknot.com%2Fus%2Fmadison-williams-and-boyan-kirby-jun-2024',
        },
    ];

    const airports: AiportInfo[] = [
        {
            name: "O'hare Airport",
            address: '444 EAGLE RIDGE DR, GALENA, IL 61036, USA',
            description: 'Cream of the crop',
        },
        {
            name: 'Midway Airport',
            address: '444 EAGLE RIDGE DR, GALENA, IL 61036, USA',
            description: "A worse alternative to O'hare",
        },
    ];

    const transportation: TransportationInfo[] = [
        {
            name: 'Uber',
            image: uber,
            description: 'Mobile forward way to ride around',
            websiteUrl: 'https://www.uber.com/',
        },
        {
            name: 'Lyft',
            image: lyft,
            description:
                'Alternative to Uber. Usually a worse experience, but can be cheaper than Uber during peak times.',
            websiteUrl: 'https://www.lyft.com/rider',
        },
    ];

    return (
        <PageContainer>
            <div>
                <Typography variant="h3">Hotels</Typography>
                <HorizontalScroll>
                    {hotels.map((hotel, index) => (
                        <Paper
                            key={hotel.name}
                            elevation={4}
                            sx={{
                                bborder: `1px solid ${theme.palette.primary.main}`,
                                borderRadius: '10px',
                                mr: '24px',
                                width: '400px',
                            }}
                        >
                            <Box p={2}>
                                <Typography variant="h5" gutterBottom mb={2} textAlign={'center'}>
                                    {hotel.name}
                                </Typography>
                                <Box display="flex" justifyContent="center" mb={2}>
                                    <img
                                        src={hotel.image}
                                        alt={`hotel-${index}`}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            borderRadius: '10px',
                                        }}
                                    />
                                </Box>
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    textAlign={'center'}
                                    mb={2}
                                >
                                    {hotel.address}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    textAlign={'center'}
                                    mb={2}
                                >
                                    {hotel.phone}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    textAlign={'center'}
                                    mb={2}
                                    whiteSpace={'normal'}
                                >
                                    {hotel.description}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    aria-label="website-link"
                                    onClick={() => openInNewWindow(hotel.websiteUrl)}
                                    sx={{
                                        display: 'block',
                                        m: '0 auto',
                                    }}
                                >
                                    Website
                                </Button>
                            </Box>
                        </Paper>
                    ))}
                </HorizontalScroll>

                <Typography variant="h3" mt={5}>
                    Airports
                </Typography>
                <HorizontalScroll>
                    {airports.map((airport) => (
                        <Paper
                            key={airport.name}
                            elevation={4}
                            sx={{
                                border: `1px solid ${theme.palette.primary.main}`,
                                borderRadius: '10px',
                                mr: '24px',
                                width: '400px',
                            }}
                        >
                            <Box p={2}>
                                <Typography variant="h5" gutterBottom textAlign={'center'} mb={2}>
                                    {airport.name}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    textAlign={'center'}
                                    mb={2}
                                >
                                    {airport.address}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    textAlign={'center'}
                                    mb={2}
                                    whiteSpace={'normal'}
                                >
                                    {airport.description}
                                </Typography>
                            </Box>
                        </Paper>
                    ))}
                </HorizontalScroll>

                <Typography variant="h3" mt={5}>
                    Transportation
                </Typography>
                <HorizontalScroll>
                    {transportation.map((service, index) => (
                        <Paper
                            key={service.name}
                            elevation={4}
                            sx={{
                                border: `1px solid ${theme.palette.primary.main}`,
                                borderRadius: '10px',
                                mr: '24px',
                                width: '400px',
                                minWidth: '250px',
                            }}
                        >
                            <Box p={2}>
                                <Typography variant="h5" gutterBottom textAlign={'center'} mb={2}>
                                    {service.name}
                                </Typography>
                                <Box
                                    display={'flex'}
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                    mb={2}
                                >
                                    <img
                                        src={service.image}
                                        alt={`transportation-${index}`}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            borderRadius: '10px',
                                        }}
                                    />
                                </Box>
                                <Typography
                                    variant="body2"
                                    display={'flex'}
                                    justifyContent={'center'}
                                    whiteSpace={'normal'}
                                    textAlign="center"
                                    mb={2}
                                >
                                    {service.description}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    aria-label="website-link"
                                    onClick={() => openInNewWindow(service.websiteUrl)}
                                    sx={{
                                        display: 'block',
                                        m: '0 auto',
                                    }}
                                >
                                    Website
                                </Button>
                            </Box>
                        </Paper>
                    ))}
                </HorizontalScroll>
            </div>
        </PageContainer>
    );
}
