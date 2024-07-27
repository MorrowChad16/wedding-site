import PageContainer from '../components/page-container';
import ScheduleIcon from '../components/schedule-icon';
import gathering from '../assets/icons/gathering.png';
import weddingCeremony from '../assets/icons/wedding-ceremony.png';
import { Grid } from '@mui/material';

interface ScheduleItem {
    uid: string;
    startTime: Date;
    endTime: Date;
    title: string;
    description: string;
    locationName: string;
    location: string;
    iconAsset: string;
    formality: string;
}

export default function Schedule() {
    const scheduleItems: ScheduleItem[] = [
        // TODO: bring this back
        // {
        //     uid: '1712020056342-73242',
        //     startTime: new Date(2025, 5, 13, 17),
        //     endTime: new Date(2025, 5, 13, 18),
        //     title: 'Welcome Party',
        //     description: 'say hi to everybody',
        //     locationName: 'Highlander',
        //     location: '1110 W Grove St, Boise, ID 83702',
        //     iconAsset: gathering,
        //     formality: 'Semi-Formal',
        // },
        {
            uid: '1712020056342-73241',
            startTime: new Date(2025, 5, 14, 14),
            endTime: new Date(2025, 5, 14, 22),
            title: 'Wedding Ceremony',
            description: 'have fun',
            location: '9600 W Brookside Ln, Boise, ID 83714',
            locationName: 'Stone Crossing',
            iconAsset: weddingCeremony,
            formality: 'Formal',
        },
    ];

    return (
        <PageContainer>
            <Grid container spacing={2} justifyContent="center">
                {scheduleItems.map((item) => (
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
