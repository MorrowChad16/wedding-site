import React from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { LocationCategory } from '../pages/Travel';
import { getTravelItems } from '../api/use-travel';
import { getVisibleScheduleItems } from '../api/use-schedule';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import SportsGolfIcon from '@mui/icons-material/SportsGolf';
import HotelIcon from '@mui/icons-material/Hotel';
import ParkIcon from '@mui/icons-material/Park';
import FlightIcon from '@mui/icons-material/Flight';
import { renderToString } from 'react-dom/server';
import { Celebration, Landscape, People } from '@mui/icons-material';
import { StorageImage } from '@aws-amplify/ui-react-storage';

export const LOCATION_ICONS: Record<
    LocationCategory,
    {
        icon: typeof RestaurantIcon;
        color: string;
    }
> = {
    RESTAURANT: {
        icon: RestaurantIcon,
        color: '#6F4E37', // coffee
    },
    BAR: {
        icon: LocalBarIcon,
        color: '#990012', // wine red
    },
    BREWERY: {
        icon: SportsBarIcon,
        color: '#dc7633', // dark orange
    },
    GOLF: {
        icon: SportsGolfIcon,
        color: '#7dcea0', // light green
    },
    HOTEL: {
        icon: HotelIcon,
        color: '#36454F', // charcoal
    },
    AIRPORT: {
        icon: FlightIcon,
        color: '#000000', // black
    },
    PARK: {
        icon: ParkIcon,
        color: '#229954', // light green
    },
    OUTDOOR_ACTIVITY: {
        icon: Landscape,
        color: '#0E87CC', // forest green
    },
    EVENT_VENUE: {
        icon: People,
        color: '#d2b4de', // light purple
    },
    CEREMONY_VENUE: {
        icon: Celebration,
        color: '#FFD700', // gold
    },
    TRANSPORTATION: {
        icon: FlightIcon,
        color: '#666666', // grey
    },
};

const createMarkerIcon = (type: LocationCategory): google.maps.Icon => {
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

interface MapTravelItem {
    name: string;
    type?: LocationCategory;
    image?: string;
    address?: string;
    description?: string;
    coordinatesLat?: number;
    coordinatesLng?: number;
}

const TravelMap = () => {
    const [selectedLocation, setSelectedLocation] = React.useState<MapTravelItem | null>(null);
    const { isLoading, error, travelItems } = getTravelItems();
    const {
        isLoading: isScheduleLoading,
        error: scheduleError,
        scheduleItems,
    } = getVisibleScheduleItems();

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY || '',
    });

    // Map schedule item types to location categories
    const mapScheduleTypeToLocationCategory = (type: string): LocationCategory => {
        switch (type) {
            case 'CEREMONY':
                return 'CEREMONY_VENUE';
            case 'RECEPTION':
                return 'EVENT_VENUE';
            case 'EVENT':
                return 'EVENT_VENUE';
            case 'ACTIVITY':
                return 'OUTDOOR_ACTIVITY';
            default:
                return 'EVENT_VENUE';
        }
    };

    // Convert schedule items to MapTravelItem format
    const scheduleLocations: MapTravelItem[] = (scheduleItems || [])
        .filter((item) => item.coordinatesLat && item.coordinatesLng)
        .map((item) => ({
            name: item.title,
            type: mapScheduleTypeToLocationCategory(item.type),
            address: item.location || item.locationName || undefined,
            description: item.description || undefined,
            coordinatesLat: item.coordinatesLat!,
            coordinatesLng: item.coordinatesLng!,
        }));

    // Filter travel items that have coordinates and convert to MapTravelItem format
    const dbLocations: MapTravelItem[] = (travelItems || [])
        .filter((item) => item.coordinatesLat && item.coordinatesLng)
        .map((item) => ({
            name: item.name,
            type: item.category as LocationCategory,
            image: item.image || undefined,
            address: item.address || undefined,
            description: item.description || undefined,
            coordinatesLat: item.coordinatesLat!,
            coordinatesLng: item.coordinatesLng!,
        }));

    const locations = [...dbLocations, ...scheduleLocations];

    // Show loading spinner while data is loading
    if (isLoading || isScheduleLoading || !isLoaded) {
        return (
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // Show error message if there's an error loading data
    if (error || scheduleError) {
        return (
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h6" color="error">
                    Error loading map data
                </Typography>
            </Box>
        );
    }

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
                        // TODO: update center of map
                        center={{
                            lat: 43.61725313860506,
                            lng: -116.20628518469191,
                        }}
                        zoom={14}
                        options={options}
                    >
                        {locations
                            .filter(
                                (location) =>
                                    location.coordinatesLat &&
                                    location.coordinatesLng &&
                                    location.type
                            )
                            .map((location, index) => (
                                <Marker
                                    key={index}
                                    position={{
                                        lat: Number(location.coordinatesLat!),
                                        lng: Number(location.coordinatesLng!),
                                    }}
                                    onClick={() => setSelectedLocation(location)}
                                    title={location.name}
                                    icon={createMarkerIcon(location.type!)}
                                />
                            ))}

                        {selectedLocation &&
                            selectedLocation.coordinatesLat &&
                            selectedLocation.coordinatesLng && (
                                <InfoWindow
                                    position={{
                                        lat: selectedLocation.coordinatesLat,
                                        lng: selectedLocation.coordinatesLng,
                                    }}
                                    onCloseClick={() => setSelectedLocation(null)}
                                >
                                    <Box sx={{ p: 1, maxWidth: 250 }}>
                                        {selectedLocation.image && (
                                            <Box sx={{ mb: 1 }}>
                                                <StorageImage
                                                    alt={selectedLocation.name}
                                                    path={selectedLocation.image}
                                                    style={{
                                                        width: '100%',
                                                        height: 150,
                                                        objectFit: 'cover',
                                                        borderRadius: 4,
                                                    }}
                                                    validateObjectExistence={false}
                                                />
                                            </Box>
                                        )}
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ fontWeight: 'bold', mb: 0.5 }}
                                        >
                                            {selectedLocation.name}
                                        </Typography>
                                        {selectedLocation.address && (
                                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                {selectedLocation.address}
                                            </Typography>
                                        )}
                                        {selectedLocation.description && (
                                            <Typography variant="body2">
                                                {selectedLocation.description}
                                            </Typography>
                                        )}
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
