import PageContainer from '../components/page-container';
import ScheduleIcon from '../components/schedule-icon';
import weddingCeremony from '../assets/icons/wedding-ceremony.png';
import gathering from '../assets/icons/gathering.png';
import romanticDinner from '../assets/icons/romantic-dinner.png';
import rehearsal from '../assets/icons/rehearsal.png';
import chip from '../assets/icons/chip.png';
import golf from '../assets/icons/golf.png';
import rafting from '../assets/icons/rafting.png';
import gun from '../assets/icons/gun.png';
import { CircularProgress, Grid } from '@mui/material';
import { useStore } from '../api/use-store';
import { getGuests } from '../api/use-guests';
import { LocationType } from './Travel';

type Formailty = 'Casual' | 'Semi-Formal' | 'Formal';
interface ScheduleItem {
    uid: string;
    startTime: Date;
    endTime: Date;
    title: string;
    description?: string;
    locationName: string;
    location: string;
    coordinates: google.maps.LatLng | google.maps.LatLngLiteral;
    type: LocationType;
    iconAsset: string;
    formality: Formailty;
    isPrivate: boolean;
}

export const SCHEDULE_ITEMS: ScheduleItem[] = [
    {
        uid: '1712020056342-73276',
        startTime: new Date(2025, 5, 11, 11),
        endTime: new Date(2025, 5, 11, 13),
        title: 'Paintball/GoKarting',
        description: 'grow up',
        location: '11809 Ustick Rd, Caldwell, ID 83605',
        coordinates: {
            lat: 43.646421890050306,
            lng: -116.62932628416462,
        },
        type: 'outdoor',
        locationName: 'PYRRHIC TACTICAL SPORTS',
        iconAsset: gun,
        formality: 'Casual',
        isPrivate: true,
    },
    {
        uid: '1712020056342-73270',
        startTime: new Date(2025, 5, 11, 14),
        endTime: new Date(2025, 5, 11, 16),
        title: 'White Water Rafting',
        description: 'wicked waves',
        location: '7050 ID-55, Horseshoe Bend, ID 83629',
        coordinates: {
            lat: 44.005380943667824,
            lng: -116.18596590588838,
        },
        type: 'outdoor',
        locationName: 'Cascade Raft & Kayak',
        iconAsset: rafting,
        formality: 'Casual',
        isPrivate: false,
    },
    {
        uid: '1712020056342-73268',
        startTime: new Date(2025, 5, 12, 9),
        endTime: new Date(2025, 5, 12, 10),
        title: 'Micron Tour',
        description: 'tiny tiny chips',
        location: '8000 S Federal Way, Boise, ID 83716',
        coordinates: {
            lat: 43.5241107717883,
            lng: -116.14565798342704,
        },
        type: 'event',
        locationName: 'Micron',
        iconAsset: chip,
        formality: 'Casual',
        isPrivate: true,
    },
    {
        uid: '1712020056342-73269',
        startTime: new Date(2025, 5, 12, 12),
        endTime: new Date(2025, 5, 12, 16),
        title: 'Golf',
        description: 'hit the links',
        location: '4720 N 36th St, Boise, ID 83703',
        coordinates: {
            lat: 43.66348783641772,
            lng: -116.22284372271747,
        },
        type: 'outdoor',
        locationName: 'Quail Hollow Golf Course',
        iconAsset: golf,
        formality: 'Semi-Formal',
        isPrivate: false,
    },
    {
        uid: '1712020056342-73241',
        startTime: new Date(2025, 5, 13, 10),
        endTime: new Date(2025, 5, 13, 11),
        title: 'Wedding Rehearsal',
        description: 'go through day-of schedule',
        location: '9600 W Brookside Ln, Boise, ID 83714',
        coordinates: {
            lat: 43.73675347623313,
            lng: -116.29977025186639,
        },
        type: 'event',
        locationName: 'Stone Crossing',
        iconAsset: rehearsal,
        formality: 'Semi-Formal',
        isPrivate: true,
    },
    {
        uid: '1712020056342-73240',
        startTime: new Date(2025, 5, 13, 15),
        endTime: new Date(2025, 5, 13, 18),
        title: 'Rehearsal Dinner',
        description: 'Rehearse for the wedding over dinner',
        location: '2355 N Old Penitentiary Rd, Boise, ID 83712',
        coordinates: {
            lat: 43.60046969761995,
            lng: -116.16229284551895,
        },
        type: 'event',
        locationName: 'Idaho Botanical Gardens',
        iconAsset: romanticDinner,
        formality: 'Semi-Formal',
        isPrivate: true,
    },
    {
        uid: '1712020056342-73242',
        startTime: new Date(2025, 5, 13, 19),
        endTime: new Date(2025, 5, 13, 24),
        title: 'Welcome Party',
        description: 'Come celebrate with us!',
        location: '280 N 8th St Suite 104, Boise, ID 83702',
        coordinates: {
            lat: 43.61706109262501,
            lng: -116.20200166581762,
        },
        type: 'event',
        locationName: 'Suite 104',
        iconAsset: gathering,
        formality: 'Semi-Formal',
        isPrivate: false,
    },
    {
        uid: '1712020056342-73241',
        startTime: new Date(2025, 5, 14, 16, 30),
        endTime: new Date(2025, 5, 14, 22),
        title: 'Wedding Ceremony',
        description: 'have fun',
        location: '9600 W Brookside Ln, Boise, ID 83714',
        coordinates: {
            lat: 43.73675347623313,
            lng: -116.29977025186639,
        },
        type: 'ceremony',
        locationName: 'Stone Crossing',
        iconAsset: weddingCeremony,
        formality: 'Formal',
        isPrivate: false,
    },
];

export default function Schedule() {
    const { storeEmail } = useStore();
    const { isLoading, guests } = getGuests(storeEmail);

    return (
        <PageContainer>
            <Grid container spacing={2} justifyContent="center">
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    SCHEDULE_ITEMS.filter(
                        (item) =>
                            item.isPrivate === false ||
                            item.isPrivate === guests?.some((guest) => guest.isBridalParty)
                    ).map((item) => (
                        <ScheduleIcon
                            key={item.uid}
                            uid={item.uid}
                            startTime={item.startTime}
                            endTime={item.endTime}
                            title={item.title}
                            description={item.description}
                            location={item.location}
                            locationName={item.locationName}
                            iconAsset={item.iconAsset}
                            formality={item.formality}
                        />
                    ))
                )}
            </Grid>
        </PageContainer>
    );
}
