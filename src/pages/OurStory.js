import * as React from 'react';
import PageContainer from '../components/PageContainer';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent, } from '@mui/lab';
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
    return (React.createElement(PageContainer, null,
        React.createElement(Box, { sx: { width: 'fit-content', margin: '0 auto', maxWidth: '60%' } },
            React.createElement(Timeline, { position: "alternate" }, timelineData.map((event, index) => (React.createElement(TimelineItem, { key: index },
                React.createElement(TimelineOppositeContent, null,
                    React.createElement(Card, null,
                        React.createElement(CardMedia, { component: "img", height: "100%", image: event.image, alt: event.title }))),
                React.createElement(TimelineSeparator, null,
                    React.createElement(TimelineDot, null),
                    React.createElement(TimelineConnector, null)),
                React.createElement(TimelineContent, null,
                    React.createElement("h4", null, event.title),
                    React.createElement("p", null, event.description)))))))));
}
