import PageContainer from '../components/page-container';
import { Box, Button, Paper, Typography, useTheme } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PhoneIcon from '@mui/icons-material/Phone';
import { generateGoogleMapsLink, openInNewWindow } from '../utils/utilities';
import HorizontalScroll from '../components/horizontal-scroll';
import hotel from '../assets/images/hotel.jpeg';
import payette_brewery from '../assets/images/travel/payette_brewery.jpeg';
import atlas from '../assets/images/travel/atlas.jpg';
import amano from '../assets/images/travel/amano.jpg';
import barbacoa from '../assets/images/travel/barbacoa.jpg';
import coadejima from '../assets/images/travel/coadejima.jpg';
import motherearth from '../assets/images/travel/motherearth.png';
import lesbois from '../assets/images/travel/lesbois.jpg';
import wyldchild from '../assets/images/travel/wyldchild.webp';
import tarbush from '../assets/images/travel/tarbush.jpg';
import sofias from '../assets/images/travel/sofias.jpg';
import americana from '../assets/images/travel/americana.jpg';
import tangos from '../assets/images/travel/tangos.jpg';
import alyonka from '../assets/images/travel/alyonka.jpg';
import wepa from '../assets/images/travel/wepa.jpg';
import lucianos from '../assets/images/travel/lucianos.jpg';
import janjou from '../assets/images/travel/janjou-patisserie.jpg';
import stil from '../assets/images/travel/stil.jpg';
import wylder from '../assets/images/travel/wylder.webp';
import suite from '../assets/images/travel/104.jpg';
import waterbear from '../assets/images/travel/waterbear.jpg';
import quail from '../assets/images/travel/quail.webp';
import shadow from '../assets/images/travel/shadow.jpeg';
import hike from '../assets/images/travel/hike.avif';
import rafting from '../assets/images/travel/rafting.jpeg';
import warmsprings from '../assets/images/travel/warmsprings.jpg';
import terrace from '../assets/images/travel/terracelakes.jpg';
import greenbelt from '../assets/images/travel/greenbelt.jpg';
import camelsback from '../assets/images/travel/camelsback.jpeg';

// TODO: add distance to venue
interface TravelInfo {
    name: string;
    image?: string;
    address?: string;
    phone?: string;
    description: string;
    websiteUrl?: string;
}

interface TravelSection {
    title: string;
    info: TravelInfo[];
}

export default function Travel() {
    const theme = useTheme();

    const hotels: TravelInfo[] = [
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

    const airports: TravelInfo[] = [
        {
            name: 'Boise Airport',
            address: '3201 W Airport Way #1000, Boise, ID 83705',
            description: 'Only option you got',
        },
    ];

    const transportation: TravelInfo[] = [
        {
            name: 'Uber',
            description: 'Mobile forward way to ride around',
            websiteUrl: 'https://www.uber.com/',
        },
        {
            name: 'Lyft',
            description:
                'Alternative to Uber. Usually a worse experience, but can be cheaper than Uber during peak times.',
            websiteUrl: 'https://www.lyft.com/rider',
        },
    ];

    const food: TravelInfo[] = [
        {
            name: 'Payette Brewery',
            image: payette_brewery,
            address: '733 S Pioneer St, Boise, ID 83702',
            phone: '(208) 344-0011',
            description: 'Outdoor Patio Brewery',
            websiteUrl: 'https://www.payettebrewing.com/',
        },
        {
            name: 'The Atlas Bar',
            image: atlas,
            address: '108 S 11th St, Boise, ID 83702',
            phone: '(208) 385-0189',
            description: 'Tiny Rotating Menu Cocktail Bar',
            websiteUrl: '',
        },
        {
            name: 'Amano',
            image: amano,
            address: '702 Main St, Caldwell, ID 83605',
            phone: '(208) 453-6410',
            description: 'Fantastic Authentic Mexican Restaurant',
            websiteUrl: 'https://www.amanorestaurante.com/',
        },
        {
            name: 'Barbacoa',
            image: barbacoa,
            address: '276 Bobwhite Ct, Boise, ID 83706',
            phone: '(208) 338-5000',
            description: 'Spanish-Mexican Steak House',
            websiteUrl: 'https://barbacoa-boise.com/',
        },
        {
            name: 'Coa de Jima',
            image: coadejima,
            address: '615 W Main St, Boise, ID 83702',
            phone: '(208) 519-1213',
            description: 'Downtown Mexican Restaurant',
            websiteUrl: 'https://coadejimaboise.com/',
        },
        {
            name: 'Mother Earth Brewery',
            image: motherearth,
            address: '406 S 3rd St, Boise, ID 83702',
            phone: '(986) 200-4594',
            description: 'Smaller Outdoor Patio Brewery',
            websiteUrl: 'https://www.motherearthbrewco.com/boise',
        },
        {
            name: 'Les Bois Wines',
            image: lesbois,
            address: '813 W Bannock St, Boise, ID 83702',
            phone: '',
            description: 'Tiny Great Wine Tasting Shop',
            websiteUrl: '',
        },
        {
            name: 'Wyld Child',
            image: wyldchild,
            address: '13 S Latah St Suite 103, Boise, ID 83705',
            phone: '(208) 789-4639',
            description: 'Great Simple Burgers',
            websiteUrl: 'https://www.wyldchildboise.com/',
        },
        {
            name: 'Tarbush Kitchen',
            image: tarbush,
            address: '2757 S Broadway Ave, Boise, ID 83706',
            phone: '(208) 608-5601',
            description: 'Mediterranean Restaurant',
            websiteUrl: 'https://www.tarbushkitchenidaho.com/',
        },
        {
            name: "Sofia's Greek Bistro",
            image: sofias,
            address: '6748 N Glenwood St, Garden City, ID 83714',
            phone: '(208) 853-0844',
            description: 'Greek Restaurant',
            websiteUrl: 'https://sofiasgreekbistro.com/',
        },
        {
            name: 'Americana Pizza',
            image: americana,
            address: '304 S Americana Blvd, Boise, ID 83702',
            phone: '(208) 336-6432',
            description: 'Pizza',
            websiteUrl: 'http://places.singleplatform.com/americana-pizza-8/menu?ref=google',
        },
        {
            name: "Tango's Empenadas",
            image: tangos,
            address: '701 N Orchard St, Boise, ID 83706',
            phone: '(208) 322-3090',
            description: 'Argentinian Empandas',
            websiteUrl: 'https://tangos-empanadas.com/',
        },
        {
            name: 'Alyonka Russian Cuisine',
            image: alyonka,
            address: '2870 W State St, Boise, ID 83702',
            phone: '(208) 344-8996',
            description: 'Russian Restaurant',
            websiteUrl: 'https://alyonkarussiancuisine.com/',
        },
        {
            name: 'Wepa Cafe',
            image: wepa,
            address: '175 E 35th St, Garden City, ID 83714',
            phone: '(208) 207-2962',
            description: 'Puerto Rican Restaurant',
            websiteUrl: 'https://wepaprcuisine.com/',
        },
        {
            name: "Caffè Luciano's",
            image: lucianos,
            address: '3588 N Prospect Way, Garden City, ID 83714',
            phone: '(208) 577-6010',
            description: 'River-side Italian Restaurant',
            websiteUrl: 'https://caffelucianos.com/',
        },
        {
            name: 'Janjou Patisserie',
            image: janjou,
            address: '1754 W State St, Boise, ID 83702',
            phone: '(208) 297-5853',
            description: 'French Bakery',
            websiteUrl: 'https://www.janjou.com/',
        },
        {
            name: 'The STIL',
            image: stil,
            address: '786 W Broad St, Boise, ID 83702',
            phone: '(208) 809-8888',
            description: 'Seasonal Flavor Ice Cream Shop',
            websiteUrl: 'https://ilovethestil.com/',
        },
        {
            name: 'The Wylder',
            image: wylder,
            address: '501 W Broad St, Boise, ID 83702',
            phone: '(208) 209-3837',
            description: 'Wood Fire Pizza',
            websiteUrl: 'https://the-wylder.club/',
        },
        {
            name: 'Suite 104',
            image: suite,
            address: '4720 N 36th St, Boise, ID 83703',
            phone: '(208) 972-8590',
            description: '"Speakeasy" Cocktail Bar',
            websiteUrl: 'https://the-wylder.club/',
        },
        {
            name: 'Water Bear Bar',
            image: waterbear,
            address: '350 N 9th St STE 100, Boise, ID 83702',
            phone: '',
            description: 'Cocktail Bar',
            websiteUrl: 'https://www.waterbearbar.com/',
        },
    ];

    const activities: TravelInfo[] = [
        {
            name: 'Quail Hollow Golf Course',
            image: quail,
            address: '4720 N 36th St, Boise, ID 83703',
            phone: '(208) 972-8590',
            description:
                "The best bang for your buck in the Boise area. It's a public course tucked in to the foothills. Awesome views of the high dessert.",
            websiteUrl: 'https://www.quailhollowboise.com/',
        },
        {
            name: 'Public Parks',
            image: camelsback,
            description: 'Boise has a ton of great public parks.',
        },
        {
            name: 'Shadow Valley Golf Course',
            image: shadow,
            address: '15711 N Horseshoe Bend Rd, Garden City, ID 83714',
            phone: '(208) 939-6699',
            description:
                'Another great course that takes advantage of the foothills. The front 9 zig zag through the hills. The back 9 flattens out for an easier time.',
            websiteUrl: 'https://www.shadowvalley.com/',
        },
        {
            name: 'Hiking',
            image: hike,
            address: '',
            phone: '',
            description:
                "There are a great hikes across Idaho, but most of the accessible ones are in the local foothills. We reccommend you use AllTrails to find one that fits what you're looking for. If you would like recommendations, feel free to reach out.",
            websiteUrl: 'https://www.alltrails.com/',
        },
        {
            name: 'White Water Rafting',
            image: rafting,
            address: '7050 ID-55, Horseshoe Bend, ID 83629',
            phone: '(208) 793-2221',
            description:
                'The Lower Payette River north of Boise is great for entry level white water rafting while taking in the Boise National Forest. We\'ve used Cascade Rafting before and they are great. We recommend the "Thrill" options since they are the most fun and have the best views. They seem scary, but they cater to everyone.',
            websiteUrl: 'https://www.cascaderaft.com/payette-river-rafting-idaho',
        },
        {
            name: 'Warm Springs Golf Course',
            image: warmsprings,
            address: '2495 E Warm Springs Ave, Boise, ID 83712',
            phone: '(208) 972-8600',
            description:
                "This is your classic public subdivision course. It's very forgiving with flat hills and spaced out trees.",
            websiteUrl: 'https://www.warmspringsgolfcourse.com/',
        },
        {
            name: 'Terrace Lakes Golf Course',
            image: terrace,
            address: '2101 Holiday Dr, Garden Valley, ID 83622',
            phone: '(208) 462-3250',
            description:
                "If you're willing to make the drive, this course is on the edge of the Boise National Forest, so you get great views of the surrounding nature.",
            websiteUrl: 'http://www.terracelakes.com/-golf-course',
        },
        {
            name: 'Boise Greenbelt',
            image: greenbelt,
            address: '1375 W Shoreline Dr, Boise, ID  83702',
            phone: '',
            description:
                'Boise has a great paved trail that rides along the Boise River through town. It goes 10+ miles in both directions. Going east it rides until the city dam which has a great park, Lucky Peak.',
        },
    ];

    const sections: TravelSection[] = [
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
            title: 'Restaurants and Bars',
            info: food,
        },
        {
            title: 'Activities',
            info: activities,
        },
    ];

    // TODO: have addresses link to google maps
    return (
        <PageContainer display="block" justifyContent="flex-start">
            <div>
                {sections.map((section, index) => {
                    return (
                        <div>
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
                                            mr: index === section.info.length - 1 ? '0px' : '24px',
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
                                                <Box display="flex" justifyContent="center" mb={2}>
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
                                            <Typography
                                                variant="body2"
                                                textAlign={'center'}
                                                mb={2}
                                                whiteSpace={'normal'}
                                            >
                                                {location.description}
                                            </Typography>
                                            {location.websiteUrl && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    aria-label="website-link"
                                                    onClick={() =>
                                                        openInNewWindow(location.websiteUrl!)
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
        </PageContainer>
    );
}
