import React from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { LocationType, TRAVEL_SECTIONS, TravelInfo } from '../pages/Travel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import SportsGolfIcon from '@mui/icons-material/SportsGolf';
import HotelIcon from '@mui/icons-material/Hotel';
import ParkIcon from '@mui/icons-material/Park';
import FlightIcon from '@mui/icons-material/Flight';
import { renderToString } from 'react-dom/server';
import { Celebration, Landscape, People } from '@mui/icons-material';

export const LOCATION_ICONS: Record<
    LocationType,
    {
        icon: typeof RestaurantIcon;
        color: string;
    }
> = {
    restaurant: {
        icon: RestaurantIcon,
        color: '#6F4E37', // coffee
    },
    bar: {
        icon: LocalBarIcon,
        color: '#990012', // wine red
    },
    brewery: {
        icon: SportsBarIcon,
        color: '#dc7633', // dark orange
    },
    golf: {
        icon: SportsGolfIcon,
        color: '#7dcea0', // light reen
    },
    hotel: {
        icon: HotelIcon,
        color: '#36454F', // charcoal
    },
    airport: {
        icon: FlightIcon,
        color: '#000000', // black
    },
    park: {
        icon: ParkIcon,
        color: '#229954', // light green
    },
    outdoor: {
        icon: Landscape,
        color: '#0E87CC', // forest green
    },
    event: {
        icon: People,
        color: '#d2b4de', // light purple
    },
    ceremony: {
        icon: Celebration,
        color: '#FFD700', // gold
    },
};

const createMarkerIcon = (type: LocationType): google.maps.Icon => {
    const iconConfig = LOCATION_ICONS[type];
    const IconComponent = iconConfig.icon;

    const svgString = renderToString(
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
            <IconComponent
                style={{
                    fill: iconConfig.color,
                    width: '100%',
                    height: '100%',
                }}
            />
        </svg>
    );

    const encodedSvg = window.btoa(unescape(encodeURIComponent(svgString)));

    return {
        url: `data:image/svg+xml;base64,${encodedSvg}`,
        scaledSize: new google.maps.Size(36, 36),
        anchor: new google.maps.Point(18, 18),
    };
};

const TravelMap = () => {
    const [selectedLocation, setSelectedLocation] = React.useState<TravelInfo | null>(null);

    console.log(process.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY)
    console.log(process.env.VITE_CLAUDE_API_KEY)
    console.log(import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY)
    console.log(import.meta.env.VITE_CLAUDE_API_KEY)
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''
    });

    const schedule: TravelInfo[] = [
        {
            name: 'Welcome Party',
            type: 'event',
            coordinates: {
                lat: 43.61706109262501,
                lng: -116.20200166581762,
            },
            description: 'Come celebrate with us!',
            address: '280 N 8th St Suite 104, Boise, ID 83702',
        },
        {
            name: 'Wedding Ceremony',
            type: 'ceremony',
            coordinates: {
                lat: 43.73675347623313,
                lng: -116.29977025186639,
            },
            description: 'have fun',
            address: '9600 W Brookside Ln, Boise, ID 83714',
        },
    ];

    const locations = TRAVEL_SECTIONS.map((section) => {
        return section.info.filter((location) => location.coordinates !== undefined);
    }).flat();
    locations.push(...schedule);

    const mapStyles = [
        {
            featureType: 'administrative',
            elementType: 'all',
            stylers: [
                {
                    visibility: 'on',
                },
                {
                    lightness: 33,
                },
            ],
        },
        {
            featureType: 'landscape',
            elementType: 'all',
            stylers: [
                {
                    color: '#f2e5d4',
                },
            ],
        },
        {
            featureType: 'poi',
            elementType: 'all',
            stylers: [
                {
                    visibility: 'off',
                },
            ],
        },
        {
            featureType: 'road',
            elementType: 'all',
            stylers: [
                {
                    lightness: 20,
                },
            ],
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#c5c6c6',
                },
            ],
        },
        {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#e4d7c6',
                },
            ],
        },
        {
            featureType: 'road.local',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#fbfaf7',
                },
            ],
        },
        {
            featureType: 'water',
            elementType: 'all',
            stylers: [
                {
                    visibility: 'on',
                },
                {
                    color: '#acbcc9',
                },
            ],
        },
    ];

    const options = {
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: true,
    };

    return (
        isLoaded && (
            <Box
                sx={{
                    position: 'fixed', // Makes the box position fixed
                    top: 0, // Aligns to top of viewport
                    left: 0, // Aligns to left of viewport
                    right: 0, // Extends to right edge
                    bottom: 0, // Extends to bottom edge
                    zIndex: 1000, // Ensures map appears above other content
                }}
            >
                <Paper
                    sx={{
                        width: '100%',
                        height: '100%', // Takes full height of viewport
                        borderRadius: 0, // Removes rounded corners
                    }}
                >
                    <GoogleMap
                        mapContainerStyle={{
                            width: '100%',
                            height: '100%', // Takes full height of Paper
                        }}
                        center={{
                            lat: 43.61725313860506,
                            lng: -116.20628518469191,
                        }}
                        zoom={14}
                        options={options}
                    >
                        {locations.map((location, index) => (
                            <Marker
                                key={index}
                                position={location.coordinates!}
                                onClick={() => setSelectedLocation(location)}
                                icon={createMarkerIcon(location.type!)}
                            />
                        ))}

                        {selectedLocation && (
                            <InfoWindow
                                position={selectedLocation.coordinates}
                                onCloseClick={() => setSelectedLocation(null)}
                            >
                                <Box sx={{ p: 1 }}>
                                    {selectedLocation.image && (
                                        <img
                                            src={selectedLocation.image}
                                            alt={selectedLocation.name}
                                            style={{
                                                width: '100%',
                                                height: 150,
                                                objectFit: 'cover',
                                                borderRadius: 4,
                                            }}
                                        />
                                    )}
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                        {selectedLocation.name}
                                    </Typography>
                                    <Typography variant="body2">
                                        {selectedLocation.address}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        {selectedLocation.description}
                                    </Typography>
                                </Box>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </Paper>
            </Box>
        )
    );
};

export default TravelMap;
