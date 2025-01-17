import PageContainer from '../components/page-container';
import ScheduleIcon from '../components/schedule-icon';
import weddingCeremony from '../assets/icons/wedding-ceremony.png';
import gathering from '../assets/icons/gathering.png';
import romanticDinner from '../assets/icons/romantic-dinner.png';
import { CircularProgress, Grid } from '@mui/material';
import { useStore } from '../api/use-store';
import { getGuests } from '../api/use-guests';

type Formailty = 'Casual' | 'Semi-Formal' | 'Formal';
interface ScheduleItem {
    uid: string;
    startTime: Date;
    endTime: Date;
    title: string;
    description?: string;
    locationName: string;
    location: string;
    iconAsset: string;
    formality: Formailty;
    isPrivate: boolean;
}

export const SCHEDULE_ITEMS: ScheduleItem[] = [
    {
        uid: '1712020056342-73240',
        startTime: new Date(2025, 5, 13, 15),
        endTime: new Date(2025, 5, 13, 18),
        title: 'Rehearsal Dinner',
        description: 'Rehearse for the wedding over dinner',
        location: '2355 N Old Penitentiary Rd, Boise, ID 83712',
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
