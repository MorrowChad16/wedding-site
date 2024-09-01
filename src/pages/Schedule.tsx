import PageContainer from '../components/page-container';
import ScheduleIcon from '../components/schedule-icon';
import weddingCeremony from '../assets/icons/wedding-ceremony.png';
import gathering from '../assets/icons/gathering.png';
import { Grid } from '@mui/material';

interface ScheduleItem {
    uid: string;
    startTime?: Date;
    endTime?: Date;
    title: string;
    description?: string;
    locationName: string;
    location?: string;
    iconAsset: string;
    formality?: string;
}

export const SCHEDULE_ITEMS: ScheduleItem[] = [
    {
        uid: '1712020056342-73242',
        title: 'Welcome Party',
        locationName: 'TBD',
        iconAsset: gathering,
    },
    {
        uid: '1712020056342-73241',
        startTime: new Date(2025, 5, 14, 16),
        endTime: new Date(2025, 5, 14, 22),
        title: 'Wedding Ceremony',
        description: 'have fun',
        location: '9600 W Brookside Ln, Boise, ID 83714',
        locationName: 'Stone Crossing',
        iconAsset: weddingCeremony,
        formality: 'Formal',
    },
] as const;

export default function Schedule() {
    return (
        <PageContainer>
            <Grid container spacing={2} justifyContent="center">
                {SCHEDULE_ITEMS.map((item) => (
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
                ))}
            </Grid>
        </PageContainer>
    );
}
