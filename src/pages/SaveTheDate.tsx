import { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    Grid,
    IconButton,
    TextField,
    Typography,
    Alert,
    Snackbar,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import PageContainer from '../components/page-container';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

interface GuestForm {
    id: string;
    fullName: string;
    guestType: 'PRIMARY' | 'PLUS_ONE' | 'CHILD';
    isOfDrinkingAge: boolean;
}

export default function SaveTheDate() {
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [guests, setGuests] = useState<GuestForm[]>([
        { id: crypto.randomUUID(), fullName: '', guestType: 'PRIMARY', isOfDrinkingAge: true },
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const addGuest = (guestType: 'PLUS_ONE' | 'CHILD') => {
        const newGuest: GuestForm = {
            id: crypto.randomUUID(),
            fullName: '',
            guestType,
            isOfDrinkingAge: false,
        };
        setGuests([...guests, newGuest]);
    };

    const removeGuest = (id: string) => {
        setGuests(guests.filter((guest) => guest.id !== id));
    };

    const updateGuest = (id: string, field: keyof GuestForm, value: string | boolean) => {
        setGuests(guests.map((guest) => (guest.id === id ? { ...guest, [field]: value } : guest)));
    };

    const validateForm = () => {
        // Email validation
        if (!email.trim()) {
            setErrorMessage('Email is required');
            return false;
        }

        // Email format validation using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setErrorMessage('Please enter a valid email address');
            return false;
        }

        // Address validation
        if (!address.trim()) {
            setErrorMessage('Street address is required');
            return false;
        }

        if (!city.trim()) {
            setErrorMessage('City is required');
            return false;
        }

        if (!state.trim()) {
            setErrorMessage('State is required');
            return false;
        }

        // State validation (2-letter format)
        if (state.trim().length !== 2) {
            setErrorMessage('State must be a 2-letter code (e.g., CA, NY, TX)');
            return false;
        }

        if (!zipCode.trim()) {
            setErrorMessage('Zip code is required');
            return false;
        }

        // Zip code validation (basic US format)
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (!zipRegex.test(zipCode.trim())) {
            setErrorMessage('Please enter a valid zip code (e.g., 12345 or 12345-6789)');
            return false;
        }

        // Check if address has basic components (at least one number for street address)
        const hasStreetNumber = /\d/.test(address.trim());
        if (!hasStreetNumber) {
            setErrorMessage('Please include a street number in your address');
            return false;
        }

        // Guest name validation
        if (guests.some((guest) => !guest.fullName.trim())) {
            setErrorMessage('All guest names are required');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            setShowError(true);
            return;
        }

        setIsSubmitting(true);
        try {
            // Combine address fields
            const fullAddress = `${address.trim()}, ${city.trim()}, ${state.trim().toUpperCase()} ${zipCode.trim()}`;

            // Save all guests to the database
            for (const guest of guests) {
                await client.models.WeddingGuests.create({
                    guestId: crypto.randomUUID(),
                    email: email.toLowerCase().trim(), // GSI, so tight matching
                    guestType: guest.guestType,
                    fullName: guest.fullName.toLowerCase().trim(), // GSI, so tight matching
                    address: fullAddress,
                    attendanceStatus: 'PENDING',
                    isBridalParty: false,
                    isOfDrinkingAge: guest.isOfDrinkingAge,
                });
            }

            setShowSuccess(true);
            // Reset form
            setEmail('');
            setAddress('');
            setCity('');
            setState('');
            setZipCode('');
            setGuests([
                {
                    id: crypto.randomUUID(),
                    fullName: '',
                    guestType: 'PRIMARY',
                    isOfDrinkingAge: true,
                },
            ]);
        } catch (error) {
            console.error('Error saving guests:', error);
            setErrorMessage('Failed to save registration. Please try again.');
            setShowError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <PageContainer>
                <Container maxWidth="md">
                    <Box textAlign="center" mb={4}>
                        <Typography variant="h6" color="text.secondary" mb={1}>
                            We're getting married and you're invited!
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Please register below so we can send you more details as we get closer
                            to the big day.
                        </Typography>
                    </Box>

                    <Card elevation={3}>
                        <CardContent>
                            <Grid container spacing={3}>
                                {/* Contact Information */}
                                <Grid item xs={12}>
                                    <Typography variant="h5" gutterBottom>
                                        Contact Information
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        helperText="For wedding updates"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Street Address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        required
                                        helperText="Street address for sending invitations"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="City"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        fullWidth
                                        label="State"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        required
                                        inputProps={{ maxLength: 2 }}
                                        helperText="2-letter code"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        fullWidth
                                        label="Zip Code"
                                        value={zipCode}
                                        onChange={(e) => setZipCode(e.target.value)}
                                        required
                                        inputProps={{ maxLength: 10 }}
                                    />
                                </Grid>

                                {/* Guest Information */}
                                <Grid item xs={12}>
                                    <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                                        Guest Information
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                </Grid>

                                {guests.map((guest, index) => (
                                    <Grid item xs={12} key={guest.id}>
                                        <Card variant="outlined" sx={{ p: 2 }}>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={12} sm={5}>
                                                    <TextField
                                                        fullWidth
                                                        label="Full Name"
                                                        value={guest.fullName}
                                                        onChange={(e) =>
                                                            updateGuest(
                                                                guest.id,
                                                                'fullName',
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>Guest Type</InputLabel>
                                                        <Select
                                                            value={guest.guestType}
                                                            label="Guest Type"
                                                            onChange={(e) =>
                                                                updateGuest(
                                                                    guest.id,
                                                                    'guestType',
                                                                    e.target.value as any
                                                                )
                                                            }
                                                            disabled={true}
                                                        >
                                                            <MenuItem value="PRIMARY">
                                                                Primary Guest
                                                            </MenuItem>
                                                            <MenuItem value="PLUS_ONE">
                                                                Plus One
                                                            </MenuItem>
                                                            <MenuItem value="CHILD">Child</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sm={3}>
                                                    {index > 0 && (
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => removeGuest(guest.id)}
                                                            sx={{ ml: 1 }}
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    )}
                                                </Grid>
                                                {(guest.guestType === 'PLUS_ONE' ||
                                                    guest.guestType === 'CHILD') && (
                                                    <Grid item xs={12}>
                                                        <Box
                                                            display="flex"
                                                            alignItems="center"
                                                            gap={2}
                                                            mt={1}
                                                        >
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                            >
                                                                Of Drinking Age:
                                                            </Typography>
                                                            <ToggleButtonGroup
                                                                value={
                                                                    guest.isOfDrinkingAge
                                                                        ? 'yes'
                                                                        : 'no'
                                                                }
                                                                exclusive
                                                                onChange={(_e, newValue) => {
                                                                    if (newValue !== null) {
                                                                        updateGuest(
                                                                            guest.id,
                                                                            'isOfDrinkingAge',
                                                                            newValue === 'yes'
                                                                        );
                                                                    }
                                                                }}
                                                                size="small"
                                                            >
                                                                <ToggleButton value="yes">
                                                                    Yes
                                                                </ToggleButton>
                                                                <ToggleButton value="no">
                                                                    No
                                                                </ToggleButton>
                                                            </ToggleButtonGroup>
                                                        </Box>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </Card>
                                    </Grid>
                                ))}

                                {/* Add Guest Buttons */}
                                <Grid item xs={12}>
                                    <Box display="flex" gap={2} flexWrap="wrap">
                                        {!guests.some(
                                            (guest) => guest.guestType === 'PLUS_ONE'
                                        ) && (
                                            <Button
                                                variant="outlined"
                                                startIcon={<Add />}
                                                onClick={() => addGuest('PLUS_ONE')}
                                            >
                                                Add Plus One
                                            </Button>
                                        )}
                                        <Button
                                            variant="outlined"
                                            startIcon={<Add />}
                                            onClick={() => addGuest('CHILD')}
                                        >
                                            Add Child
                                        </Button>
                                    </Box>
                                </Grid>

                                {/* Submit Button */}
                                <Grid item xs={12}>
                                    <Box textAlign="center" mt={3}>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            sx={{
                                                px: 4,
                                                py: 1.5,
                                                fontSize: '1.1rem',
                                            }}
                                        >
                                            {isSubmitting ? 'Registering...' : 'Save The Date'}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Box textAlign="center" mt={4}>
                        <Typography variant="body2" color="text.secondary">
                            Questions? Feel free to reach out to us directly!
                        </Typography>
                    </Box>
                </Container>
            </PageContainer>

            {/* Success/Error Snackbars */}
            <Snackbar
                open={showSuccess}
                autoHideDuration={6000}
                onClose={() => setShowSuccess(false)}
            >
                <Alert onClose={() => setShowSuccess(false)} severity="success">
                    Registration successful! We'll be in touch with more details soon.
                </Alert>
            </Snackbar>

            <Snackbar open={showError} autoHideDuration={6000} onClose={() => setShowError(false)}>
                <Alert onClose={() => setShowError(false)} severity="error">
                    {errorMessage}
                </Alert>
            </Snackbar>
        </>
    );
}
