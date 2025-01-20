import PageContainer from '../components/page-container';
import { Box, Button, Paper, Typography, useTheme } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PhoneIcon from '@mui/icons-material/Phone';
import { generateGoogleMapsLink, openInNewWindow } from '../utils/utilities';
import HorizontalScroll from '../components/horizontal-scroll';
import payette_brewery from '../assets/images/travel/payette_brewery.webp';
import atlas from '../assets/images/travel/atlas.webp';
import amano from '../assets/images/travel/amano.webp';
import barbacoa from '../assets/images/travel/barbacoa.webp';
import coadejima from '../assets/images/travel/coadejima.webp';
import motherearth from '../assets/images/travel/motherearth.webp';
import lesbois from '../assets/images/travel/lesbois.webp';
import wyldchild from '../assets/images/travel/wyldchild.webp';
import tarbush from '../assets/images/travel/tarbush.webp';
import sofias from '../assets/images/travel/sofias.webp';
import americana from '../assets/images/travel/americana.webp';
import tangos from '../assets/images/travel/tangos.webp';
import alyonka from '../assets/images/travel/alyonka.webp';
import wepa from '../assets/images/travel/wepa.webp';
import lucianos from '../assets/images/travel/lucianos.webp';
import janjou from '../assets/images/travel/janjou-patisserie.webp';
import stil from '../assets/images/travel/stil.webp';
import wylder from '../assets/images/travel/wylder.webp';
import suite from '../assets/images/travel/104.webp';
import waterbear from '../assets/images/travel/waterbear.webp';
import highlander from '../assets/images/travel/highlander.webp';
import haphap from '../assets/images/travel/haphap.webp';
import quail from '../assets/images/travel/quail.webp';
import shadow from '../assets/images/travel/shadow.webp';
import hike from '../assets/images/travel/hike.webp';
import rafting from '../assets/images/travel/rafting.webp';
import warmsprings from '../assets/images/travel/warmsprings.webp';
import greenbelt from '../assets/images/travel/greenbelt.webp';
import osprey from '../assets/images/travel/osprey.webp';
import airbnb from '../assets/images/travel/airbnb.webp';
import avery from '../assets/images/travel/avery.webp';
import hilton from '../assets/images/travel/hilton.webp';
import trattoria from '../assets/images/travel/trattoria.webp';
import lucky_peak from '../assets/images/travel/lucky_peak.webp';
import hot_springs from '../assets/images/travel/hot_springs.webp';
import teton from '../assets/images/travel/teton.webp';
import fishing from '../assets/images/travel/fishing.webp';
import sun_valley from '../assets/images/travel/sun_valley.webp';
import mccall from '../assets/images/travel/mccall.webp';
import stanley from '../assets/images/travel/stanley.webp';
import bogus from '../assets/images/travel/bogus.webp';
import { useState } from 'react';
import { MapListFab } from '../components/map-list-fab';
import TravelMap from '../components/snazzy-map';

export type LocationType =
    | 'restaurant'
    | 'bar'
    | 'brewery'
    | 'golf'
    | 'hotel'
    | 'airport'
    | 'park'
    | 'outdoor'
    | 'ceremony'
    | 'event';

export interface TravelInfo {
    name: string;
    type?: LocationType;
    image?: string;
    address?: string;
    phone?: string;
    description?: string;
    websiteUrl?: string;
    coordinates?: google.maps.LatLng | google.maps.LatLngLiteral;
}

interface TravelSection {
    title: string;
    info: TravelInfo[];
}

const hotels: TravelInfo[] = [
    {
        name: 'AirBnB',
        type: 'hotel',
        image: airbnb,
        description:
            'We recommend AirBnB\'s for Boise. They are a much better bang for your buck compared to hotels. You can look up the Venue location in the "Schedule" tab to understand how far away it will be. Our recommended areas are: Hyde Park, Downtown, Warm Springs/Southeast Boise, and anywhere in the foothills. We provided a sample list below, but this is by no means a comprehensive list. There are plenty more options if none of these are what you are looking for.',
        websiteUrl: 'https://www.airbnb.com/wishlists/v/1570378408?viralityEntryPoint=49&s=76',
    },
    {
        name: 'The Avery Hotel',
        type: 'hotel',
        image: avery,
        description:
            "Discount code coming soon. The Avery hotel is newly renovated classic hotel. It originally opened in 1911 and was recently renovated and reopened in 2023. We have a 15% discount on all rooms. They stressed to us that guests should book the rooms as soon as possible since the President's cup is in town our wedding weekend.",
        websiteUrl:
            'https://theaveryboise.windsurfercrs.com/ibe/details.aspx?propertyid=17309&rate=IDO&lang=en-us',
        coordinates: {
            lat: 43.61723232042245,
            lng: -116.20628518512909,
        },
    },
    {
        name: 'Hilton Garden Inn Boise/Eagle',
        type: 'hotel',
        image: hilton,
        description:
            'This hotel is conveniently located 10 minutes from the Venue. If we get 10 guests who stay at this hotel, then we will have a shuttle service here to the venue.',
        websiteUrl:
            'https://www.hilton.com/en/attend-my-event/boiehgi-mmw-c9ec10c0-51ca-419c-a325-ea3034150cee/',
        coordinates: {
            lat: 43.68690738496907,
            lng: -116.35327286580734,
        },
    },
];

const airports: TravelInfo[] = [
    {
        name: 'Boise Airport',
        type: 'airport',
        address: '3201 W Airport Way #1000, Boise, ID 83705',
        description: 'Only option you got',
        coordinates: {
            lat: 43.56111236580705,
            lng: -116.21747075773654,
        },
    },
];

const transportation: TravelInfo[] = [
    {
        name: 'Uber',
        websiteUrl: 'https://www.uber.com/',
    },
    {
        name: 'Lyft',
        websiteUrl: 'https://www.lyft.com/rider',
    },
    {
        name: 'Turo',
        websiteUrl: 'https://turo.com/',
    },
];

const restaurants: TravelInfo[] = [
    {
        name: 'Amano',
        type: 'restaurant',
        image: amano,
        address: '702 Main St, Caldwell, ID 83605',
        phone: '(208) 453-6410',
        description: 'Fantastic Authentic Mexican Restaurant',
        websiteUrl: 'https://www.amanorestaurante.com/',
        coordinates: {
            lat: 43.667025785894324,
            lng: -116.68820653327502,
        },
    },
    {
        name: 'Barbacoa',
        type: 'restaurant',
        image: barbacoa,
        address: '276 Bobwhite Ct, Boise, ID 83706',
        phone: '(208) 338-5000',
        description: 'Spanish-Mexican Steak House',
        websiteUrl: 'https://barbacoa-boise.com/',
        coordinates: {
            lat: 43.59776960710453,
            lng: -116.18352859082441,
        },
    },
    {
        name: 'Coa de Jima',
        type: 'restaurant',
        image: coadejima,
        address: '615 W Main St, Boise, ID 83702',
        phone: '(208) 519-1213',
        description: 'Downtown Mexican Restaurant',
        websiteUrl: 'https://coadejimaboise.com/',
        coordinates: {
            lat: 43.61478252390041,
            lng: -116.20183773699775,
        },
    },
    {
        name: 'Wyld Child',
        type: 'restaurant',
        image: wyldchild,
        address: '13 S Latah St Suite 103, Boise, ID 83705',
        phone: '(208) 789-4639',
        description: 'Great Simple Burgers',
        websiteUrl: 'https://www.wyldchildboise.com/',
        coordinates: {
            lat: 43.60403922442944,
            lng: -116.22879243811718,
        },
    },
    {
        name: 'Tarbush Kitchen',
        type: 'restaurant',
        image: tarbush,
        address: '2757 S Broadway Ave, Boise, ID 83706',
        phone: '(208) 608-5601',
        description: 'Mediterranean Restaurant',
        websiteUrl: 'https://www.tarbushkitchenidaho.com/',
        coordinates: {
            lat: 43.577481039852024,
            lng: -116.19516838308111,
        },
    },
    {
        name: 'Vincenzo Trattoria',
        type: 'restaurant',
        image: trattoria,
        address: '6970 W State St, Garden City, ID 83714',
        phone: '(208) 853-6292',
        description: 'Classic South Italian Restaurant',
        websiteUrl: 'https://vincenzotrattoria.com/',
        coordinates: {
            lat: 43.66718835407103,
            lng: -116.27546925656767,
        },
    },
    {
        name: "Sofia's Greek Bistro",
        type: 'restaurant',
        image: sofias,
        address: '6748 N Glenwood St, Garden City, ID 83714',
        phone: '(208) 853-0844',
        description: 'Greek Restaurant',
        websiteUrl: 'https://sofiasgreekbistro.com/',
        coordinates: {
            lat: 43.665805162870726,
            lng: -116.27795326453429,
        },
    },
    {
        name: 'Americana Pizza',
        type: 'restaurant',
        image: americana,
        address: '304 S Americana Blvd, Boise, ID 83702',
        phone: '(208) 336-6432',
        description: 'Pizza',
        websiteUrl: 'http://places.singleplatform.com/americana-pizza-8/menu?ref=google',
        coordinates: {
            lat: 43.61865758498935,
            lng: -116.2146437934396,
        },
    },
    {
        name: "Tango's Empenadas",
        type: 'restaurant',
        image: tangos,
        address: '701 N Orchard St, Boise, ID 83706',
        phone: '(208) 322-3090',
        description: 'Argentinian Empandas',
        websiteUrl: 'https://tangos-empanadas.com/',
        coordinates: {
            lat: 43.6154668565536,
            lng: -116.24259709915943,
        },
    },
    {
        name: 'Alyonka Russian Cuisine',
        type: 'restaurant',
        image: alyonka,
        address: '2870 W State St, Boise, ID 83702',
        phone: '(208) 344-8996',
        description: 'Russian Restaurant',
        websiteUrl: 'https://alyonkarussiancuisine.com/',
        coordinates: {
            lat: 43.632911186893836,
            lng: -116.22429449476849,
        },
    },
    {
        name: 'Wepa Cafe',
        type: 'restaurant',
        image: wepa,
        address: '175 E 35th St, Garden City, ID 83714',
        phone: '(208) 207-2962',
        description: 'Puerto Rican Restaurant',
        websiteUrl: 'https://wepaprcuisine.com/',
        coordinates: {
            lat: 43.624484571679865,
            lng: -116.23802440999687,
        },
    },
    {
        name: "Caffè Luciano's",
        type: 'restaurant',
        image: lucianos,
        address: '3588 N Prospect Way, Garden City, ID 83714',
        phone: '(208) 577-6010',
        description: 'River-side Italian Restaurant',
        websiteUrl: 'https://caffelucianos.com/',
        coordinates: {
            lat: 43.626939391153456,
            lng: -116.23524624757225,
        },
    },
    {
        name: 'Janjou Patisserie',
        type: 'restaurant',
        image: janjou,
        address: '1754 W State St, Boise, ID 83702',
        phone: '(208) 297-5853',
        description: 'French Bakery',
        websiteUrl: 'https://www.janjou.com/',
        coordinates: {
            lat: 43.62557643917295,
            lng: -116.21095099700538,
        },
    },
    {
        name: 'The STIL',
        type: 'restaurant',
        image: stil,
        address: '786 W Broad St, Boise, ID 83702',
        phone: '(208) 809-8888',
        description: 'Seasonal Flavor Ice Cream Shop',
        websiteUrl: 'https://ilovethestil.com/',
        coordinates: {
            lat: 43.62557643917295,
            lng: -116.20510840956435,
        },
    },
    {
        name: 'The Wylder',
        type: 'restaurant',
        image: wylder,
        address: '501 W Broad St, Boise, ID 83702',
        phone: '(208) 209-3837',
        description: 'Wood Fire Pizza',
        websiteUrl: 'https://the-wylder.club/',
        coordinates: {
            lat: 43.61165137959021,
            lng: -116.20250759109511,
        },
    },
];

const bars: TravelInfo[] = [
    {
        name: 'The Atlas Bar',
        type: 'bar',
        image: atlas,
        address: '108 S 11th St, Boise, ID 83702',
        phone: '(208) 385-0189',
        description: 'Tiny Rotating Menu Cocktail Bar',
        websiteUrl: '',
        coordinates: {
            lat: 43.61710261550519,
            lng: -116.20715339676902,
        },
    },
    {
        name: 'Les Bois Wines',
        type: 'bar',
        image: lesbois,
        address: '813 W Bannock St, Boise, ID 83702',
        phone: '',
        description: 'Tiny Great Wine Tasting Shop',
        websiteUrl: '',
        coordinates: {
            lat: 43.61749501731586,
            lng: -116.20265472143818,
        },
    },
    {
        name: 'Suite 104',
        type: 'bar',
        image: suite,
        address: '4720 N 36th St, Boise, ID 83703',
        phone: '(208) 972-8590',
        description: '"Speakeasy" Cocktail Bar',
        websiteUrl: 'https://the-wylder.club/',
        coordinates: {
            lat: 43.61713099946636,
            lng: -116.20203384960078,
        },
    },
    {
        name: 'Water Bear Bar',
        type: 'bar',
        image: waterbear,
        address: '350 N 9th St STE 100, Boise, ID 83702',
        phone: '',
        description: 'Cocktail Bar',
        websiteUrl: 'https://www.waterbearbar.com/',
        coordinates: {
            lat: 43.61838358045393,
            lng: -116.20244061295017,
        },
    },
    {
        name: 'Hap Hap Lounge',
        type: 'bar',
        image: haphap,
        address: '722 W Broad St Second Floor, Boise, ID 83702',
        phone: '',
        description: 'House Music Cocktail Bar',
        websiteUrl: 'https://treefortmusichall.com/hap-hap/',
        coordinates: {
            lat: 43.61325312606416,
            lng: -116.20445842143751,
        },
    },
    {
        name: 'The Highlander',
        type: 'bar',
        image: highlander,
        address: '1110 W Grove St, Boise, ID 83702',
        phone: '',
        description: 'Cocktail Bar with a great view',
        websiteUrl: 'https://www.highlanderboise.com/',
        coordinates: {
            lat: 43.61700475207636,
            lng: -116.207716405177,
        },
    },
];

const breweries: TravelInfo[] = [
    {
        name: 'Payette Brewery',
        type: 'brewery',
        image: payette_brewery,
        address: '733 S Pioneer St, Boise, ID 83702',
        phone: '(208) 344-0011',
        description: 'Outdoor Patio Brewery',
        websiteUrl: 'https://www.payettebrewing.com/',
        coordinates: {
            lat: 43.61370326122861,
            lng: -116.21515937853559,
        },
    },
    {
        name: 'Mother Earth Brewery',
        type: 'brewery',
        image: motherearth,
        address: '406 S 3rd St, Boise, ID 83702',
        phone: '(986) 200-4594',
        description: 'Smaller Outdoor Patio Brewery',
        websiteUrl: 'https://www.motherearthbrewco.com/boise',
        coordinates: {
            lat: 43.61687826410494,
            lng: -116.20094329452387,
        },
    },
];

const parks: TravelInfo[] = [
    {
        name: 'Bogus Basin',
        type: 'park',
        image: bogus,
        address: 'Bogus Basin',
        description:
            'Bogus Basin is a ski resort in the winter, but in the Summer they have hiking, mountain biking, yoga, and other outdoor activities.',
        coordinates: {
            lat: 43.76573979603422,
            lng: -116.10364487697707,
        },
    },
    {
        name: 'Lucky Peak State Park',
        type: 'park',
        image: lucky_peak,
        address: '9725 ID-21, Boise, ID 83716',
        description:
            'Lucky Peak is great for grilling, hanging out near the water, or renting a boat for the day.',
        coordinates: {
            lat: 43.53215511678034,
            lng: -116.05950754379059,
        },
    },
    {
        name: 'Stanley',
        type: 'park',
        image: stanley,
        address: 'Stanley, Idaho',
        description:
            "Stanley is nestled in the nearby Sawtooth mountain range. You'll get great mountain views with horseback riding, camping, and other lake activities.",
        coordinates: {
            lat: 44.148007728237445,
            lng: -114.92564234407185,
        },
    },
    {
        name: 'Teton Valley',
        type: 'park',
        image: teton,
        address: 'Grand Teton',
        description:
            "Eastern Idaho has Teton Valley and Yellowstone. Both are incredibly beautiful in the Summer. The have hiking in the National Parks and in Jackson Hole, you'll get a mountain resort town vibe.",
        coordinates: {
            lat: 43.79999716073268,
            lng: -110.6823550163299,
        },
    },
    {
        name: 'Sun Valley',
        type: 'park',
        image: sun_valley,
        address: 'Sun Valley',
        description:
            'Sun Valley is a few hours east of Boise. It is a resort town with great golf courses, shopping, and summer activities.',
        coordinates: {
            lat: 43.695958829035796,
            lng: -114.35379860296348,
        },
    },
    {
        name: 'McCall',
        type: 'park',
        image: mccall,
        address: 'McCall',
        description:
            'McCall is a few hours north of Boise. It is a resort town with great golf courses, shopping, and summer activities.',
        coordinates: {
            lat: 44.913292441329496,
            lng: -116.12044272803912,
        },
    },
    {
        name: 'Boise Greenbelt',
        type: 'park',
        image: greenbelt,
        address: '1375 W Shoreline Dr, Boise, ID  83702',
        phone: '',
        description:
            'Boise has a great paved trail that rides along the Boise River through town. It goes 10+ miles in both directions. Going east it rides until the city dam which has a great park, Lucky Peak.',
    },
];

const otherOutdoor: TravelInfo[] = [
    {
        name: 'Hot Springs',
        type: 'outdoor',
        image: hot_springs,
        description:
            "There are natural hot springs scattered across the state. We can send over some recommended ones if you're interested! We also recommend the resort The Springs, which is 45 minutes from Boise.",
    },
    {
        name: 'Hiking',
        type: 'outdoor',
        image: hike,
        description:
            "There are a great hikes across Idaho, but most of the accessible ones are in the local foothills. We reccommend you use AllTrails to find one that fits what you're looking for. If you would like recommendations, feel free to reach out.",
        websiteUrl: 'https://www.alltrails.com/',
    },
    {
        name: 'White Water Rafting',
        type: 'outdoor',
        image: rafting,
        address: '7050 ID-55, Horseshoe Bend, ID 83629',
        phone: '(208) 793-2221',
        description:
            'The Lower Payette River north of Boise is great for entry level white water rafting while taking in the Boise National Forest. We\'ve used Cascade Rafting before and they are great. We recommend the "Thrill" options since they are the most fun and have the best views. They seem scary, but they cater to everyone.',
        websiteUrl: 'https://www.cascaderaft.com/payette-river-rafting-idaho',
        coordinates: {
            lat: 44.00004324100675,
            lng: -116.18492448657821,
        },
    },
    {
        name: 'Fishing',
        type: 'outdoor',
        image: fishing,
        description:
            "Idaho has a ton of great fishing spots across the state. If you're interested in spots, feel free to reach out!",
    },
];

const golf: TravelInfo[] = [
    {
        name: 'Quail Hollow Golf Course',
        type: 'golf',
        image: quail,
        address: '4720 N 36th St, Boise, ID 83703',
        phone: '(208) 972-8590',
        description:
            "The best bang for your buck in the Boise area. It's a public course tucked in to the foothills. Awesome views of the high dessert.",
        websiteUrl: 'https://www.quailhollowboise.com/',
        coordinates: {
            lat: 43.663495654141116,
            lng: -116.2228437080145,
        },
    },
    {
        name: 'Osprey Meadows Golf Course',
        type: 'golf',
        image: osprey,
        address: '75 Arling Center Ct Suite 150, Tamarack, ID 83615',
        phone: '(208) 325-1458',
        description:
            "One of the best courses in Idaho. It's located up near McCall at Tamarack Resort. Next door you have Lake Cascade, which is great for everyone.",
        coordinates: {
            lat: 44.66805993502218,
            lng: -116.12217043395789,
        },
    },
    {
        name: 'Shadow Valley Golf Course',
        type: 'golf',
        image: shadow,
        address: '15711 N Horseshoe Bend Rd, Garden City, ID 83714',
        phone: '(208) 939-6699',
        description:
            'Another great course that takes advantage of the foothills. The front 9 zig zag through the hills. The back 9 flattens out for an easier time.',
        websiteUrl: 'https://www.shadowvalley.com/',
        coordinates: {
            lat: 43.746196901533,
            lng: -116.2951383662049,
        },
    },
    {
        name: 'Warm Springs Golf Course',
        type: 'golf',
        image: warmsprings,
        address: '2495 E Warm Springs Ave, Boise, ID 83712',
        phone: '(208) 972-8600',
        description:
            "This is your classic public subdivision course. It's very forgiving with flat hills and spaced out trees.",
        websiteUrl: 'https://www.warmspringsgolfcourse.com/',
        coordinates: {
            lat: 43.592493313989536,
            lng: -116.16478674388074,
        },
    },
];

export const TRAVEL_SECTIONS: TravelSection[] = [
    {
        title: 'Hotels',
        info: hotels,
    },
    {
        title: 'Airport',
        info: airports,
    },
    {
        title: 'Transporation',
        info: transportation,
    },
    {
        title: 'Restaurants',
        info: restaurants,
    },
    {
        title: 'Bars',
        info: bars,
    },
    {
        title: 'Breweries',
        info: breweries,
    },
    {
        title: 'Parks',
        info: parks,
    },
    {
        title: 'Golf',
        info: golf,
    },
    {
        title: 'Other Outdoor Activities',
        info: otherOutdoor,
    },
] as const;

export default function Travel() {
    const theme = useTheme();
    const [isListView, setIsListView] = useState(true);

    return (
        <PageContainer display="block" justifyContent="flex-start">
            <div>
                {isListView ? (
                    <div>
                        {TRAVEL_SECTIONS.map((section, index) => {
                            return (
                                <div key={section.title + index}>
                                    <Typography variant="h3" mt={index === 0 ? 0 : 5}>
                                        {section.title}
                                    </Typography>
                                    <HorizontalScroll>
                                        {section.info.map((location, index) => (
                                            <Paper
                                                key={location.name}
                                                elevation={4}
                                                sx={{
                                                    border: `1px solid ${theme.palette.primary.main}`,
                                                    borderRadius: '10px',
                                                    mr:
                                                        index === section.info.length - 1
                                                            ? '0px'
                                                            : '24px',
                                                    width: '400px',
                                                    minWidth: '400px',
                                                }}
                                            >
                                                <Box p={2}>
                                                    <Typography
                                                        variant="h5"
                                                        gutterBottom
                                                        mb={2}
                                                        textAlign={'center'}
                                                    >
                                                        {location.name}
                                                    </Typography>
                                                    {location.image && (
                                                        <Box
                                                            display="flex"
                                                            justifyContent="center"
                                                            mb={2}
                                                        >
                                                            <img
                                                                src={location.image}
                                                                alt={`travel-${index}`}
                                                                style={{
                                                                    width: '100%',
                                                                    height: '300px',
                                                                    objectFit: 'cover',
                                                                    objectPosition: 'center',
                                                                    borderRadius: '10px',
                                                                }}
                                                            />
                                                        </Box>
                                                    )}
                                                    {location.address && (
                                                        <Button
                                                            variant="text"
                                                            onClick={() =>
                                                                openInNewWindow(
                                                                    generateGoogleMapsLink(
                                                                        location.address!
                                                                    )
                                                                )
                                                            }
                                                            style={{
                                                                display: 'flex',
                                                                marginBottom: 2,
                                                                justifyContent: 'center',
                                                                width: '100%',
                                                            }}
                                                        >
                                                            <LocationOnIcon fontSize="inherit" />
                                                            {location.address}
                                                            <OpenInNewIcon
                                                                style={{ marginLeft: 2 }}
                                                                fontSize="inherit"
                                                            />
                                                        </Button>
                                                    )}
                                                    {location.phone && (
                                                        <Typography
                                                            variant="body1"
                                                            gutterBottom
                                                            textAlign={'center'}
                                                            mb={2}
                                                        >
                                                            <PhoneIcon fontSize="inherit" />
                                                            {location.phone}
                                                        </Typography>
                                                    )}
                                                    {location.description && (
                                                        <Typography
                                                            variant="body2"
                                                            textAlign={'center'}
                                                            mb={2}
                                                            whiteSpace={'normal'}
                                                        >
                                                            {location.description}
                                                        </Typography>
                                                    )}
                                                    {location.websiteUrl && (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            aria-label="website-link"
                                                            onClick={() =>
                                                                openInNewWindow(
                                                                    location.websiteUrl!
                                                                )
                                                            }
                                                            sx={{
                                                                display: 'block',
                                                                m: '0 auto',
                                                            }}
                                                        >
                                                            Website
                                                        </Button>
                                                    )}
                                                </Box>
                                            </Paper>
                                        ))}
                                    </HorizontalScroll>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <TravelMap />
                )}
                <MapListFab isListView={isListView} setIsListView={setIsListView} />
            </div>
        </PageContainer>
    );
}
