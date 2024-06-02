import PageContainer from '../components/PageContainer';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent,
} from '@mui/lab';
import { Box, Card, CardMedia } from '@mui/material';
import potatoes from '../assets/images/potatoes.jpeg';
import veggie from '../assets/images/veggie.jpeg';
import dessert from '../assets/images/dessert.jpeg';

export default function OurStory() {
    const timelineData = [
        {
            title: 'Event 1',
            description: 'This is the description for the first event.',
            image: potatoes,
        },
        {
            title: 'Event 2',
            description: 'This is the description for the second event.',
            image: veggie,
        },
        {
            title: 'Event 3',
            description: 'This is the description for the third event.',
            image: dessert,
        },
    ];

    return (
        <PageContainer>
            <Box width={'fit-content'} m={'0 auto'} maxWidth={'60%'}>
                <Timeline position="alternate">
                    {timelineData.map((event, index) => (
                        <TimelineItem key={index}>
                            <TimelineOppositeContent>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="100%"
                                        image={event.image}
                                        alt={event.title}
                                    />
                                </Card>
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot />
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                                <h4>{event.title}</h4>
                                <p>{event.description}</p>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
            </Box>
        </PageContainer>
    );
}
