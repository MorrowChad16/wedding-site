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
import taco_tuesday from '../assets/images/story/taco_tuesday.jpeg';
import roadtrip from '../assets/images/story/roadtrip.jpeg';
import chicago from '../assets/images/story/chicago.jpeg';
import russia from '../assets/images/story/russia.jpeg';
import boise from '../assets/images/story/boise.jpeg';
import mallorca from '../assets/images/story/mallorca.jpeg';
import engagement from '../assets/images/story/engagement.jpeg';


export default function OurStory() {
    const timelineData = [
        {
            title: 'Taco Tuesday',
            description: 'Our story began at Iowa State during the onset of COVID. Chad\'s taco night for friends unexpectedly became the recipe for romance. For Ciara, it was love at first bite.',
            image: taco_tuesday,
        },
        {
            title: 'Road Trip! w/Mom',
            description: 'In a bold move, Chad introduced Ciara to his mom right before whisking her away on a three-week cross-country adventure. Surprisingly, this whirlwind start didn\'t end in disaster—it was just the beginning of their journey together.',
            image: roadtrip,
        },
        {
            title: 'Chicago Bound',
            description: 'We made our first big move together, venturing out of state to Oak Park.',
            image: chicago,
        },
        {
            title: 'Russian Cosmonauts',
            description: 'After COVID restrictions eased, we made our first trip to see Ciara\'s family in Russia. Vodka was plentiful.',
            image: russia,
        },
        {
            title: 'Boise Bound',
            description: 'Idaho? no you da hoe. Ciara\'s job brought us out to Boise and we haven\'t looked back since.',
            image: boise,
        },
        {
            title: 'Fuimos a España',
            description: 'Following our recent move from Russia, we made our first trip to visit Ciara\'s family in Mallorca.',
            image: mallorca,
        },
        {
            title: 'Engagement',
            description: 'Oceanside dinner in an old Spanish fort, her family waiting on a boat? It was the perfect ending to our dating lives.',
            image: engagement,
        },
    ];

    return (
        <PageContainer>
            <Box m={'0 auto'} width={{ xs: '100%', sm: '100%', md: '60%', lg: '60%' }}>
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
