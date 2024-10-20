import React from 'react';
import {
    Checkbox,
    Typography,
    Container,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from '@mui/material';

const activities = ['Golf', 'White Water Rafting', 'Hiking'];

interface ActivityFormProps {
    selectedActivities: string[];
    setSelectedActivities: React.Dispatch<React.SetStateAction<string[]>>;
}

export function ActivityForm({ selectedActivities, setSelectedActivities }: ActivityFormProps) {
    const handleActivityToggle = (activity: string) => {
        setSelectedActivities((prevSelected) =>
            prevSelected.includes(activity)
                ? prevSelected.filter((a) => a !== activity)
                : [...prevSelected, activity]
        );
    };

    return (
        <Container maxWidth="sm">
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'}>
                <Typography mb={2}>
                    If we arranged any planned activites, which would you prefer?
                </Typography>
                <List>
                    {activities.map((activity) => (
                        <ListItem key={activity} onClick={() => handleActivityToggle(activity)}>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={selectedActivities.includes(activity)}
                                    tabIndex={-1}
                                    disableRipple
                                />
                            </ListItemIcon>
                            <ListItemText primary={activity} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Container>
    );
}

export default ActivityForm;
