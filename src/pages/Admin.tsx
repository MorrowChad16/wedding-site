import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    Paper,
} from '@mui/material';
import {
    People,
    PersonAdd,
    Restaurant,
    LocalBar,
    ChildCare,
    Group,
    PendingActions,
    MusicNote,
    Warning,
} from '@mui/icons-material';
import { getAllWeddingGuests } from '../api/use-guests';
import { AttendanceStatus, FoodChoice, GuestType } from '../utils/types';
import PageContainer from '../components/page-container';

const StatCard: React.FC<{
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}> = ({ title, value, icon, color = 'primary' }) => {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                    <Box color={`${color}.main`}>{icon}</Box>
                    <Box>
                        <Typography variant="h4" component="div" color={`${color}.main`}>
                            {value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {title}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

const Admin: React.FC = () => {
    const { isLoading, error, guests } = getAllWeddingGuests();

    if (isLoading) {
        return (
            <PageContainer>
                <Container maxWidth="lg">
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        minHeight="60vh"
                    >
                        <CircularProgress size={60} />
                    </Box>
                </Container>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <Container maxWidth="lg">
                    <Alert severity="error" sx={{ mt: 4 }}>
                        Error loading guest data. Please try again later.
                    </Alert>
                </Container>
            </PageContainer>
        );
    }

    if (!guests || guests.length === 0) {
        return (
            <PageContainer>
                <Container maxWidth="lg">
                    <Alert severity="info" sx={{ mt: 4 }}>
                        No guest data available yet.
                    </Alert>
                </Container>
            </PageContainer>
        );
    }

    // Calculate statistics
    const totalGuests = guests.length;
    const attendingGuests = guests.filter((g) => g.attendanceStatus === AttendanceStatus.ATTENDING);
    const totalAttending = attendingGuests.length;
    const pendingGuests = guests.filter((g) => g.attendanceStatus === AttendanceStatus.PENDING);

    const adults = guests.filter((g) => g.guestType !== GuestType.CHILD);
    const children = guests.filter((g) => g.guestType === GuestType.CHILD);
    const attendingAdults = attendingGuests.filter((g) => g.guestType !== GuestType.CHILD);
    const attendingChildren = attendingGuests.filter((g) => g.guestType === GuestType.CHILD);

    const drinkingAge = guests.filter((g) => g.isOfDrinkingAge);
    const attendingDrinkingAge = attendingGuests.filter((g) => g.isOfDrinkingAge);

    const bridalParty = guests.filter((g) => g.isBridalParty);

    // Food choices
    const beefChoice = attendingGuests.filter((g) => g.foodChoice === FoodChoice.Beef);
    const chickenChoice = attendingGuests.filter((g) => g.foodChoice === FoodChoice.Chicken);
    const vegetarianChoice = attendingGuests.filter((g) => g.foodChoice === FoodChoice.Vegetarian);
    const noFoodChoice = attendingGuests.filter((g) => !g.foodChoice);

    // Dietary restrictions
    const dietaryRestrictions = attendingGuests.filter(
        (g) =>
            g.dietaryRestrictions !== 'None' &&
            g.dietaryRestrictions &&
            g.dietaryRestrictions.trim()
    );

    // Song requests
    const songRequests = guests.filter((g) => g.songRequests && g.songRequests.trim());

    // Attendance rate
    const attendanceRate = totalGuests > 0 ? Math.round((totalAttending / totalGuests) * 100) : 0;

    return (
        <PageContainer>
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom align="center">
                        Wedding Admin Dashboard
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        align="center"
                        gutterBottom
                    >
                        Comprehensive guest statistics and insights
                    </Typography>

                    <Divider sx={{ my: 4 }} />

                    {/* Overview Stats */}
                    <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                        Overview
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Total Guests"
                                value={totalGuests}
                                icon={<People />}
                                color="primary"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Attending"
                                value={totalAttending}
                                icon={<PersonAdd />}
                                color="success"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Pending RSVP"
                                value={pendingGuests.length}
                                icon={<PendingActions />}
                                color="warning"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Attendance Rate"
                                value={`${attendanceRate}%`}
                                icon={<Group />}
                                color="primary"
                            />
                        </Grid>
                    </Grid>

                    {/* Demographics */}
                    <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                        Demographics
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Adults (Total)"
                                value={adults.length}
                                icon={<People />}
                                color="primary"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Adults (Attending)"
                                value={attendingAdults.length}
                                icon={<People />}
                                color="success"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Children (Total)"
                                value={children.length}
                                icon={<ChildCare />}
                                color="primary"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Children (Attending)"
                                value={attendingChildren.length}
                                icon={<ChildCare />}
                                color="success"
                            />
                        </Grid>
                    </Grid>

                    {/* Drinking Age & Bridal Party */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={4}>
                            <StatCard
                                title="Drinking Age (Total)"
                                value={drinkingAge.length}
                                icon={<LocalBar />}
                                color="secondary"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <StatCard
                                title="Drinking Age (Attending)"
                                value={attendingDrinkingAge.length}
                                icon={<LocalBar />}
                                color="success"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <StatCard
                                title="Bridal Party"
                                value={bridalParty.length}
                                icon={<Group />}
                                color="secondary"
                            />
                        </Grid>
                    </Grid>

                    {/* Food Choices */}
                    <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                        Food Choices (Attending Guests)
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Beef"
                                value={beefChoice.length}
                                icon={<Restaurant />}
                                color="error"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Chicken"
                                value={chickenChoice.length}
                                icon={<Restaurant />}
                                color="warning"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Vegetarian"
                                value={vegetarianChoice.length}
                                icon={<Restaurant />}
                                color="success"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="No Choice Yet"
                                value={noFoodChoice.length}
                                icon={<Warning />}
                                color="warning"
                            />
                        </Grid>
                    </Grid>

                    {/* Additional Stats */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6}>
                            <StatCard
                                title="Dietary Restrictions"
                                value={dietaryRestrictions.length}
                                icon={<Warning />}
                                color="warning"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <StatCard
                                title="Song Requests"
                                value={songRequests.length}
                                icon={<MusicNote />}
                                color="secondary"
                            />
                        </Grid>
                    </Grid>

                    {/* Detailed Lists */}
                    <Grid container spacing={3}>
                        {/* Pending RSVPs */}
                        {pendingGuests.length > 0 && (
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Pending RSVPs ({pendingGuests.length})
                                    </Typography>
                                    <List dense>
                                        {pendingGuests.map((guest) => (
                                            <ListItem key={guest.guestId}>
                                                <ListItemText
                                                    primary={guest.fullName}
                                                    secondary={
                                                        <Box>
                                                            <Chip
                                                                label={guest.guestType}
                                                                size="small"
                                                                sx={{ mr: 1 }}
                                                            />
                                                            {guest.email}
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            </Grid>
                        )}

                        {/* Dietary Restrictions */}
                        {dietaryRestrictions.length > 0 && (
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Dietary Restrictions ({dietaryRestrictions.length})
                                    </Typography>
                                    <List dense>
                                        {dietaryRestrictions.map((guest) => (
                                            <ListItem key={guest.guestId}>
                                                <ListItemText
                                                    primary={guest.fullName}
                                                    secondary={guest.dietaryRestrictions}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </Container>
        </PageContainer>
    );
};

export default Admin;
