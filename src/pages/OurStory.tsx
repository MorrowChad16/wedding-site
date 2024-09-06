import PageContainer from '../components/page-container';
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
import LazyLoad from 'react-lazyload';
import taco_tuesday from '../assets/images/story/taco_tuesday.webp';
import roadtrip from '../assets/images/story/roadtrip.webp';
import chicago from '../assets/images/story/chicago.webp';
import russia from '../assets/images/story/russia.webp';
import boise from '../assets/images/story/boise.webp';
import mallorca from '../assets/images/story/mallorca.webp';
import engagement from '../assets/images/story/engagement.webp';

export default function OurStory() {
    const timelineData = [
        {
            title: 'Taco Tuesday',
            description:
                "Our story began at Iowa State during the onset of COVID. Chad's taco night for friends unexpectedly became the recipe for romance. For Ciara, it was love at first bite.",
            image: taco_tuesday,
        },
        {
            title: 'Road Trip! w/Mom',
            description:
                "In a bold move, Chad introduced Ciara to his mom right before whisking her away on a three-week cross-country adventure. Surprisingly, this whirlwind start didn't end in disaster—it was just the beginning of their journey together.",
            image: roadtrip,
        },
        {
            title: 'Chicago Bound',
            description: 'We made our first big move together, venturing out of state to Oak Park.',
            image: chicago,
        },
        {
            title: 'Russian Cosmonauts',
            description:
                "After COVID restrictions eased, we made our first trip to see Ciara's family in Russia. Vodka was plentiful.",
            image: russia,
        },
        {
            title: 'Boise Bound',
            description:
                "Idaho, more like Ida-woah! Ciara's job brought us out to Boise and we haven't looked back since.",
            image: boise,
        },
        {
            title: 'Fuimos a España',
            description:
                "Following their recent move from Russia, we made our first trip to visit Ciara's family in Mallorca.",
            image: mallorca,
        },
        {
            title: 'Engagement',
            description:
                'Oceanside dinner in an old Spanish fort, her family waiting on a boat? It was the perfect start to the next chapter in our lives.',
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
                                    <LazyLoad height={'100%'}>
                                        <CardMedia
                                            component="img"
                                            image={event.image}
                                            alt={event.title}
                                        />
                                    </LazyLoad>
                                </Card>
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot />
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent fontSize={{ xs: 12, md: 16 }}>
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
