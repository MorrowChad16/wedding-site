import React, { useState, useMemo } from 'react';
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Button,
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
    NewReleases,
    Email,
    ContentCopy,
    FileDownload,
} from '@mui/icons-material';
import { getAllWeddingGuests } from '../api/use-guests';
import { AttendanceStatus, FoodChoice, GuestType } from '../utils/types';
import PageContainer from '../components/page-container';
import { useStore } from '../api/use-store';

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

type Order = 'asc' | 'desc';
type SortableKeys =
    | 'fullName'
    | 'email'
    | 'attendanceStatus'
    | 'guestType'
    | 'foodChoice'
    | 'dietaryRestrictions'
    | 'songRequests'
    | 'isOfDrinkingAge'
    | 'bridalPartyRole';

const Admin: React.FC = () => {
    const { isAdmin } = useStore();
    const { isLoading, error, guests } = getAllWeddingGuests();
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<SortableKeys>('fullName');

    const handleRequestSort = (property: SortableKeys) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedGuests = useMemo(() => {
        if (!guests) return [];

        return [...guests].sort((a, b) => {
            let aValue: any = a[orderBy];
            let bValue: any = b[orderBy];

            // Handle null/undefined values
            if (aValue == null) aValue = '';
            if (bValue == null) bValue = '';

            // Handle boolean values
            if (typeof aValue === 'boolean') {
                aValue = aValue ? 1 : 0;
                bValue = bValue ? 1 : 0;
            }

            // Convert to strings for consistent comparison
            aValue = aValue.toString().toLowerCase();
            bValue = bValue.toString().toLowerCase();

            if (aValue < bValue) {
                return order === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return order === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [guests, order, orderBy]);

    const handleCopyEmails = async () => {
        try {
            if (!guests) {
                alert('No guest data available.');
                return;
            }

            // Get unique emails, filter out null/undefined values
            const uniqueEmails = [
                ...new Set(
                    guests.map((guest) => guest.email).filter((email) => email && email.trim())
                ),
            ];

            // Join emails with commas and spaces for mass email format
            const emailString = uniqueEmails.join(', ');

            // Copy to clipboard
            await navigator.clipboard.writeText(emailString);

            alert(`Copied ${uniqueEmails.length} unique email addresses to clipboard!`);
        } catch (error) {
            console.error('Error copying emails:', error);
            alert('Failed to copy emails to clipboard. Please try again.');
        }
    };

    const handleCopyPendingEmails = async () => {
        try {
            if (!guests) {
                alert('No guest data available.');
                return;
            }

            // Filter for pending guests and get unique emails
            const pendingGuestEmails = pendingGuests
                .map((guest) => guest.email)
                .filter((email) => email && email.trim());

            const uniquePendingEmails = [...new Set(pendingGuestEmails)];

            if (uniquePendingEmails.length === 0) {
                alert('No pending guests with email addresses found.');
                return;
            }

            // Join emails with commas and spaces for mass email format
            const emailString = uniquePendingEmails.join(', ');

            // Copy to clipboard
            await navigator.clipboard.writeText(emailString);

            alert(
                `Copied ${uniquePendingEmails.length} pending guest email addresses to clipboard!`
            );
        } catch (error) {
            console.error('Error copying pending emails:', error);
            alert('Failed to copy pending emails to clipboard. Please try again.');
        }
    };

    const handleDownloadCSV = () => {
        try {
            if (!guests) {
                alert('No guest data available.');
                return;
            }

            // Define CSV headers
            const headers = [
                'Guest ID',
                'Full Name',
                'Email',
                'Address',
                'Attendance Status',
                'Guest Type',
                'Food Choice',
                'Dietary Restrictions',
                'Song Requests',
                'Is of Drinking Age',
                'Bridal Party Role',
                'Created At',
                'Updated At',
            ];

            // Convert guest data to CSV rows
            const csvRows = guests.map((guest) => [
                guest.guestId || '',
                guest.fullName || '',
                guest.email || '',
                guest.address || '',
                guest.attendanceStatus || '',
                guest.guestType || '',
                guest.foodChoice || '',
                guest.dietaryRestrictions || '',
                guest.songRequests || '',
                guest.isOfDrinkingAge ? 'Yes' : 'No',
                guest.bridalPartyRole || '',
                guest.createdAt || '',
                guest.updatedAt || '',
            ]);

            // Escape CSV fields that contain commas, quotes, or newlines
            const escapeCSVField = (field: string): string => {
                if (field.includes(',') || field.includes('"') || field.includes('\n')) {
                    return `"${field.replace(/"/g, '""')}"`;
                }
                return field;
            };

            // Create CSV content
            const csvContent = [
                headers.join(','),
                ...csvRows.map((row) => row.map(escapeCSVField).join(',')),
            ].join('\n');

            // Create and trigger download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute(
                'download',
                `wedding-guests-${new Date().toISOString().split('T')[0]}.csv`
            );
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            alert(`Downloaded CSV file with ${guests.length} guest records!`);
        } catch (error) {
            console.error('Error downloading CSV:', error);
            alert('Failed to download CSV file. Please try again.');
        }
    };

    const parseAddress = (address: string) => {
        if (!address || !address.trim()) {
            return {
                streetAddress1: '',
                streetAddress2: '',
                city: '',
                state: '',
                postalCode: '',
            };
        }

        // Clean up the address
        const cleanAddress = address.trim();

        // Try to match common US address formats
        // Pattern: Street, City, State ZIP
        const fullAddressRegex = /^(.+?),\s*(.+?),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/i;
        const match = cleanAddress.match(fullAddressRegex);

        if (match) {
            return {
                streetAddress1: match[1].trim(),
                streetAddress2: '',
                city: match[2].trim(),
                state: match[3].toUpperCase().trim(),
                postalCode: match[4].trim(),
            };
        }

        // Try alternative pattern: Street City, State ZIP (no comma after street)
        const altAddressRegex = /^(.+?)\s+(.+?),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/i;
        const altMatch = cleanAddress.match(altAddressRegex);

        if (altMatch) {
            // Split street and city more intelligently
            const streetAndCity = `${altMatch[1]} ${altMatch[2]}`;
            const parts = streetAndCity.split(' ');

            // Assume last 1-2 words before state are city
            if (parts.length >= 3) {
                const streetParts = parts.slice(0, -1);
                const cityParts = parts.slice(-1);

                return {
                    streetAddress1: streetParts.join(' ').trim(),
                    streetAddress2: '',
                    city: cityParts.join(' ').trim(),
                    state: altMatch[3].toUpperCase().trim(),
                    postalCode: altMatch[4].trim(),
                };
            }
        }

        // If no regex match, try to extract ZIP code at least
        const zipRegex = /(\d{5}(?:-\d{4})?)$/;
        const zipMatch = cleanAddress.match(zipRegex);

        if (zipMatch) {
            const remainingAddress = cleanAddress.replace(zipRegex, '').trim();

            // Try to extract state (2 letter code before ZIP)
            const stateRegex = /,?\s*([A-Z]{2})\s*$/i;
            const stateMatch = remainingAddress.match(stateRegex);

            if (stateMatch) {
                const addressWithoutState = remainingAddress.replace(stateRegex, '').trim();

                // Split remaining by comma - last part is likely city
                const parts = addressWithoutState.split(',').map((p) => p.trim());

                if (parts.length >= 2) {
                    const street = parts.slice(0, -1).join(', ');
                    const city = parts[parts.length - 1];

                    return {
                        streetAddress1: street,
                        streetAddress2: '',
                        city: city,
                        state: stateMatch[1].toUpperCase(),
                        postalCode: zipMatch[1],
                    };
                }
            }
        }

        // Fallback: put entire address in street address 1
        return {
            streetAddress1: cleanAddress,
            streetAddress2: '',
            city: '',
            state: '',
            postalCode: '',
        };
    };

    const handleDownloadZolaCSV = () => {
        try {
            if (!guests) {
                alert('No guest data available.');
                return;
            }

            // Group guests by email (same party)
            const guestsByEmail = guests.reduce((acc: Record<string, any[]>, guest) => {
                if (!acc[guest.email]) {
                    acc[guest.email] = [];
                }
                acc[guest.email].push(guest);
                return acc;
            }, {});

            // Find the maximum number of additional guests needed
            const maxAdditionalGuests = Math.max(
                0,
                ...Object.values(guestsByEmail).map((partyGuests: any[]) => {
                    const primaryGuest =
                        partyGuests.find((g: any) => g.guestType === 'PRIMARY') || partyGuests[0];
                    const otherGuests = partyGuests.filter((g: any) => g !== primaryGuest);
                    // Subtract 1 for the "Plus One" column, so we only count truly additional guests
                    return Math.max(0, otherGuests.length - 1);
                })
            );

            // Create dynamic headers
            const baseHeaders = [
                'Name',
                'Plus One',
                'Email Address',
                'Phone Number',
                'Street Address 1',
                'Street Address 2',
                'City',
                'State/Region',
                'Postal Code',
            ];

            const additionalGuestHeaders = [];
            for (let i = 1; i <= maxAdditionalGuests; i++) {
                additionalGuestHeaders.push(`Additional Guest ${i}`);
            }

            const headers = [...baseHeaders, ...additionalGuestHeaders];

            // Convert guest data to Zola format
            const csvRows: string[][] = [];

            Object.values(guestsByEmail).forEach((partyGuests: any[]) => {
                const primaryGuest =
                    partyGuests.find((g: any) => g.guestType === 'PRIMARY') || partyGuests[0];
                const otherGuests = partyGuests.filter((g: any) => g !== primaryGuest);

                // Parse address into components
                const parsedAddress = parseAddress(primaryGuest.address || '');

                // Build the base row
                const baseRow = [
                    primaryGuest.fullName || '',
                    otherGuests.length > 0 ? otherGuests[0].fullName || '' : '',
                    primaryGuest.email || '',
                    '', // Phone Number - not in our schema
                    parsedAddress.streetAddress1,
                    parsedAddress.streetAddress2,
                    parsedAddress.city,
                    parsedAddress.state,
                    parsedAddress.postalCode,
                ];

                // Add additional guests dynamically
                const additionalGuestNames = [];
                for (let i = 1; i < otherGuests.length; i++) {
                    additionalGuestNames.push(otherGuests[i].fullName || '');
                }

                // Pad with empty strings to match header count
                while (additionalGuestNames.length < maxAdditionalGuests) {
                    additionalGuestNames.push('');
                }

                const row = [...baseRow, ...additionalGuestNames];
                csvRows.push(row);
            });

            // Escape CSV fields that contain commas, quotes, or newlines
            const escapeCSVField = (field: string): string => {
                if (field.includes(',') || field.includes('"') || field.includes('\n')) {
                    return `"${field.replace(/"/g, '""')}"`;
                }
                return field;
            };

            // Create CSV content
            const csvContent = [
                headers.join(','),
                ...csvRows.map((row) => row.map(escapeCSVField).join(',')),
            ].join('\n');

            // Create and trigger download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute(
                'download',
                `zola-guest-import-${new Date().toISOString().split('T')[0]}.csv`
            );
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            alert(`Downloaded Zola CSV file with ${csvRows.length} party records!`);
        } catch (error) {
            console.error('Error downloading Zola CSV:', error);
            alert('Failed to download Zola CSV file. Please try again.');
        }
    };

    // Check if user is authenticated as admin
    if (!isAdmin) {
        return (
            <PageContainer>
                <Container maxWidth="lg">
                    <Alert severity="error" sx={{ mt: 4 }}>
                        Access denied. Administrator authentication required to view this page.
                    </Alert>
                </Container>
            </PageContainer>
        );
    }

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

    const bridalParty = guests.filter((g) => g.bridalPartyRole);

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

    // Recent updates (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentUpdates = guests.filter((guest) => {
        // Check if guest has updatedAt field and it's within the last week
        if (guest.updatedAt) {
            const updatedDate = new Date(guest.updatedAt);
            return updatedDate > oneWeekAgo;
        }
        // Check if guest has createdAt field and it's within the last week (new users)
        if (guest.createdAt) {
            const createdDate = new Date(guest.createdAt);
            return createdDate > oneWeekAgo;
        }
        return false;
    });

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

                        {/* Song Requests */}
                        {songRequests.length > 0 && (
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Song Requests ({songRequests.length})
                                    </Typography>
                                    <List dense>
                                        {songRequests.map((guest) => (
                                            <ListItem key={guest.guestId}>
                                                <ListItemText
                                                    primary={guest.fullName}
                                                    secondary={guest.songRequests}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    {/* Recent Updates */}
                    {recentUpdates.length > 0 && (
                        <>
                            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                                Recent Updates (Last 7 Days)
                            </Typography>
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12}>
                                    <Paper sx={{ p: 3 }}>
                                        <Typography variant="h6" gutterBottom>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <NewReleases color="primary" />
                                                Latest Activity ({recentUpdates.length})
                                            </Box>
                                        </Typography>
                                        <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                                            {recentUpdates
                                                .sort((a, b) => {
                                                    const aDate = new Date(
                                                        a.updatedAt || a.createdAt || 0
                                                    );
                                                    const bDate = new Date(
                                                        b.updatedAt || b.createdAt || 0
                                                    );
                                                    return bDate.getTime() - aDate.getTime();
                                                })
                                                .slice(0, 15)
                                                .map((guest) => {
                                                    const isNew =
                                                        guest.createdAt &&
                                                        new Date(guest.createdAt) > oneWeekAgo;
                                                    const updateDate =
                                                        guest.updatedAt || guest.createdAt;
                                                    return (
                                                        <ListItem key={guest.guestId}>
                                                            <ListItemText
                                                                primary={
                                                                    <Box
                                                                        display="flex"
                                                                        alignItems="center"
                                                                        gap={1}
                                                                    >
                                                                        <Typography
                                                                            variant="body2"
                                                                            fontWeight="medium"
                                                                        >
                                                                            {guest.fullName}
                                                                        </Typography>
                                                                        {isNew && (
                                                                            <Chip
                                                                                label="New"
                                                                                size="small"
                                                                                color="success"
                                                                                variant="outlined"
                                                                            />
                                                                        )}
                                                                    </Box>
                                                                }
                                                                secondary={
                                                                    <Box>
                                                                        <Typography
                                                                            variant="caption"
                                                                            color="text.secondary"
                                                                        >
                                                                            {isNew
                                                                                ? 'Joined'
                                                                                : 'Updated'}
                                                                            :{' '}
                                                                            {updateDate
                                                                                ? new Date(
                                                                                      updateDate
                                                                                  ).toLocaleDateString(
                                                                                      'en-US',
                                                                                      {
                                                                                          month: 'short',
                                                                                          day: 'numeric',
                                                                                          hour: '2-digit',
                                                                                          minute: '2-digit',
                                                                                      }
                                                                                  )
                                                                                : 'Recently'}
                                                                        </Typography>
                                                                        <Box mt={0.5}>
                                                                            <Chip
                                                                                label={
                                                                                    guest.attendanceStatus
                                                                                }
                                                                                size="small"
                                                                                color={
                                                                                    guest.attendanceStatus ===
                                                                                    AttendanceStatus.ATTENDING
                                                                                        ? 'success'
                                                                                        : guest.attendanceStatus ===
                                                                                            AttendanceStatus.PENDING
                                                                                          ? 'warning'
                                                                                          : 'default'
                                                                                }
                                                                            />
                                                                        </Box>
                                                                    </Box>
                                                                }
                                                            />
                                                        </ListItem>
                                                    );
                                                })}
                                        </List>
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Divider sx={{ my: 4 }} />
                        </>
                    )}

                    {/* Utilities */}
                    <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                        Utilities
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Email color="primary" />
                                        Email Management
                                    </Box>
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Copy email addresses to clipboard for mass email campaigns
                                </Typography>
                                <Box display="flex" flexDirection="column" gap={1}>
                                    <Button
                                        variant="contained"
                                        startIcon={<ContentCopy />}
                                        onClick={handleCopyEmails}
                                        color="primary"
                                        size="small"
                                    >
                                        Copy All Email Addresses
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<PendingActions />}
                                        onClick={handleCopyPendingEmails}
                                        color="warning"
                                        size="small"
                                    >
                                        Copy Pending Emails Only
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <FileDownload color="secondary" />
                                        Data Export
                                    </Box>
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Download guest data in different formats for analysis or import
                                </Typography>
                                <Box display="flex" flexDirection="column" gap={1}>
                                    <Button
                                        variant="contained"
                                        startIcon={<FileDownload />}
                                        onClick={handleDownloadCSV}
                                        color="secondary"
                                        size="small"
                                    >
                                        Download Guest Data CSV
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<FileDownload />}
                                        onClick={handleDownloadZolaCSV}
                                        color="error"
                                        size="small"
                                    >
                                        Download Zola Import CSV
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    {/* All Guests Table */}
                    <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                        All Guests ({totalGuests})
                    </Typography>
                    <TableContainer component={Paper} sx={{ mb: 4 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'fullName'}
                                            direction={orderBy === 'fullName' ? order : 'asc'}
                                            onClick={() => handleRequestSort('fullName')}
                                        >
                                            Name
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'email'}
                                            direction={orderBy === 'email' ? order : 'asc'}
                                            onClick={() => handleRequestSort('email')}
                                        >
                                            Email
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'attendanceStatus'}
                                            direction={
                                                orderBy === 'attendanceStatus' ? order : 'asc'
                                            }
                                            onClick={() => handleRequestSort('attendanceStatus')}
                                        >
                                            Status
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'guestType'}
                                            direction={orderBy === 'guestType' ? order : 'asc'}
                                            onClick={() => handleRequestSort('guestType')}
                                        >
                                            Type
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'foodChoice'}
                                            direction={orderBy === 'foodChoice' ? order : 'asc'}
                                            onClick={() => handleRequestSort('foodChoice')}
                                        >
                                            Food Choice
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'dietaryRestrictions'}
                                            direction={
                                                orderBy === 'dietaryRestrictions' ? order : 'asc'
                                            }
                                            onClick={() => handleRequestSort('dietaryRestrictions')}
                                        >
                                            Dietary Restrictions
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'songRequests'}
                                            direction={orderBy === 'songRequests' ? order : 'asc'}
                                            onClick={() => handleRequestSort('songRequests')}
                                        >
                                            Song Requests
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'isOfDrinkingAge'}
                                            direction={
                                                orderBy === 'isOfDrinkingAge' ? order : 'asc'
                                            }
                                            onClick={() => handleRequestSort('isOfDrinkingAge')}
                                        >
                                            Drinking Age
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'bridalPartyRole'}
                                            direction={
                                                orderBy === 'bridalPartyRole' ? order : 'asc'
                                            }
                                            onClick={() => handleRequestSort('bridalPartyRole')}
                                        >
                                            Bridal Party Role
                                        </TableSortLabel>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedGuests.map((guest) => (
                                    <TableRow key={guest.guestId}>
                                        <TableCell component="th" scope="row">
                                            <Typography variant="body2" fontWeight="medium">
                                                {guest.fullName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {guest.email || 'N/A'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={guest.attendanceStatus}
                                                size="small"
                                                color="primary"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={guest.guestType}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {guest.foodChoice ? (
                                                <Chip
                                                    label={guest.foodChoice}
                                                    size="small"
                                                    color={
                                                        guest.foodChoice === FoodChoice.Beef
                                                            ? 'error'
                                                            : guest.foodChoice ===
                                                                FoodChoice.Chicken
                                                              ? 'warning'
                                                              : 'success'
                                                    }
                                                />
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    Not selected
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ maxWidth: 200 }}>
                                                {guest.dietaryRestrictions &&
                                                guest.dietaryRestrictions !== 'None'
                                                    ? guest.dietaryRestrictions
                                                    : 'None'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ maxWidth: 200 }}>
                                                {guest.songRequests || 'None'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={guest.isOfDrinkingAge ? 'Yes' : 'No'}
                                                size="small"
                                                color={
                                                    guest.isOfDrinkingAge ? 'success' : 'default'
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {guest.bridalPartyRole ? (
                                                <Chip
                                                    label={guest.bridalPartyRole.replace(/_/g, ' ')}
                                                    size="small"
                                                    color="primary"
                                                />
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    -
                                                </Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Container>
        </PageContainer>
    );
};

export default Admin;
