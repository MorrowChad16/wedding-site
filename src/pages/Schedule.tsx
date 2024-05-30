// @ts-ignore
import React from 'react';
import PageContainer from '../components/PageContainer';
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
    location: string;
    iconAsset: string;
    formality: string;
}

export default function Schedule() {
    const scheduleItems: ScheduleItem[] = [
        {
            uid: '1712020056342-73242',
            startTime: new Date(2025, 8, 26, 17),
            endTime: new Date(2025, 8, 26, 18),
            title: 'Welcome Party',
            description: 'say hi to everybody',
            location: 'Example Conference Room, 123 Main St, Anytown, CA 12345',
            iconAsset: gathering,
            formality: 'Casual',
        },
        {
            uid: '1712020056342-73241',
            startTime: new Date(2025, 8, 27, 17),
            endTime: new Date(2025, 8, 27, 22),
            title: 'Wedding Ceremony',
            description: 'have fun',
            location: 'Example Conference Room, 123 Main St, Anytown, CA 12345',
            iconAsset: weddingCeremony,
            formality: 'Formal',
        },
    ];

    return (
        <PageContainer
            sxOverrides={{
                width: 'fit-content',
            }}
        >
            <Grid
                container
                direction="column"
                spacing={2}
                justifyContent="center"
                alignItems="center"
            >
                {scheduleItems.map((item) => (
                    <ScheduleIcon
                        key={item.uid}
                        uid={item.uid}
                        startTime={item.startTime}
                        endTime={item.endTime}
                        title={item.title}
                        description={item.description}
                        location={item.location}
                        iconAsset={item.iconAsset}
                        formality={item.formality}
                    />
                ))}
            </Grid>
        </PageContainer>
    );
}
