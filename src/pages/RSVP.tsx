import { useState, useLayoutEffect, useEffect } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PageContainer from '../components/page-container';
import { useNavigate } from 'react-router-dom';
import { getGuests, updateGuest } from '../api/use-guests';
import { FoodChoice, Relationship, Status } from '../utils/types';
import { useStore } from '../api/use-store';
import { Info } from '@mui/icons-material';

type DisplayFoodChoice = {
    name: string;
    guestId: string;
    choice: FoodChoice;
    allergies: string;
};

const Rsvp = () => {
    const { storeEmail } = useStore();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [isToastOpen, setIsToastOpen] = useState(false);

    const { isLoading, error, guests } = getGuests(storeEmail);
    const [attending, setAttending] = useState(false);
    const [foodChoices, setFoodChoices] = useState<DisplayFoodChoice[]>([]);
    const [songs, setSongs] = useState<string[]>([]);
    const [newSong, setNewSong] = useState('');
    const steps = ['Attending?', 'Food Choice', 'Song Requests'];

    const addSong = () => {
        if (newSong.trim() !== '') {
            setSongs([...songs, newSong.trim()]);
            setNewSong('');
        }
    };

    const handleRemoveSong = (index: number) => {
        const updatedSongs = [...songs];
        updatedSongs.splice(index, 1);
        setSongs(updatedSongs);
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSubmit = () => {
        foodChoices.forEach(async (item) => {
            await updateGuest(
                storeEmail,
                item.guestId,
                item.allergies,
                attending ? Status.COMING : Status.NOT_ATTENDING,
                item.choice,
                songs.join(',')
            );
        });

        setIsToastOpen(true);
    };

    useLayoutEffect(() => {
        if (!isLoading && guests) {
            const primaryGuest = guests.find(
                (guest) => guest.relationship === Relationship.PRIMARY_GUEST
            )!;
            const attendingStatus = primaryGuest.status;
            setAttending(attendingStatus === Status.COMING ? true : false);

            const displayFoodItems = guests.map<DisplayFoodChoice>((guest) => ({
                name: `${guest.firstName} ${guest.lastName}`,
                guestId: guest.guestId,
                choice: guest.foodChoice as FoodChoice,
                allergies: guest.foodAllergies || 'None',
            }));
            setFoodChoices(displayFoodItems);

            const songs = primaryGuest.songRequests?.split(',');
            if (songs) {
                setSongs(songs);
            }
        }
    }, [guests]);

    useEffect(() => {
        if (error instanceof Error) {
            console.log(error);
        }
    }, [error]);

    return (
        <PageContainer>
            {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center">
                    <CircularProgress />
                </Box>
            ) : (
                <Box>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <Box p={2}>
                        {activeStep === 0 && (
                            <Box
                                display={'flex'}
                                flexDirection={'column'}
                                alignItems={'center'}
                                width={'100%'}
                            >
                                <Typography mb={2}>Are you attending the wedding?</Typography>
                                <Box>
                                    <Button
                                        variant={attending ? 'contained' : 'outlined'}
                                        onClick={() => setAttending(true)}
                                        sx={{ mr: 2 }}
                                    >
                                        Yes
                                    </Button>
                                    <Button
                                        variant={!attending ? 'contained' : 'outlined'}
                                        onClick={() => setAttending(false)}
                                    >
                                        No
                                    </Button>
                                </Box>
                            </Box>
                        )}
                        {activeStep === 1 && (
                            <div>
                                <Card
                                    sx={{
                                        maxWidth: 800,
                                        margin: 'auto',
                                        mt: 2,
                                        mb: 2,
                                    }}
                                    elevation={2}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Info
                                                sx={{
                                                    color: 'primary.main',
                                                    fontSize: 28,
                                                    mt: 0.5,
                                                }}
                                            />
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    component="h3"
                                                    gutterBottom
                                                    sx={{
                                                        fontWeight: 500,
                                                        color: 'text.primary',
                                                    }}
                                                >
                                                    Dinner Service Information
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    sx={{ color: 'text.secondary' }}
                                                >
                                                    Dinner will be served buffet-style, offering a
                                                    variety of dishes for you to enjoy at your own
                                                    pace. To help us with kitchen planning, please
                                                    select your preferred main course in advance.
                                                    Menu details are being finalized and will be
                                                    shared here soon.
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                                {foodChoices.map((item, index) => (
                                    <div key={item.guestId}>
                                        <Typography align="center" variant="h4">
                                            {item.name}
                                        </Typography>
                                        <Box display="flex" justifyContent="center" my={2}>
                                            <FormControl sx={{ width: '40%' }}>
                                                <InputLabel>Main Course</InputLabel>
                                                <Select
                                                    label="Main Course"
                                                    variant="outlined"
                                                    value={item.choice}
                                                    onChange={(e) => {
                                                        const choice = e.target.value as FoodChoice;
                                                        const updatedItems = [...foodChoices];
                                                        updatedItems[index] = {
                                                            ...updatedItems[index],
                                                            choice: choice,
                                                        };
                                                        setFoodChoices(updatedItems);
                                                    }}
                                                >
                                                    {Object.values(FoodChoice).map((choice) => (
                                                        <MenuItem key={choice} value={choice}>
                                                            {choice}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                            mb={10}
                                        >
                                            <Box maxWidth={600} width="100%">
                                                <TextField
                                                    label="Food Allergies/Preferences"
                                                    variant="outlined"
                                                    value={item.allergies}
                                                    onChange={(e) => {
                                                        const allergies = e.target.value;
                                                        const updatedItems = [...foodChoices];
                                                        updatedItems[index] = {
                                                            ...updatedItems[index],
                                                            allergies: allergies,
                                                        };
                                                        setFoodChoices(updatedItems);
                                                    }}
                                                    fullWidth
                                                    multiline
                                                    minRows={3}
                                                    maxRows={5}
                                                />
                                            </Box>
                                        </Box>
                                    </div>
                                ))}
                                <Card
                                    sx={{
                                        maxWidth: 800,
                                        margin: 'auto',
                                        mt: 2,
                                        mb: 2,
                                    }}
                                    elevation={2}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Info
                                                sx={{
                                                    color: 'primary.main',
                                                    fontSize: 28,
                                                    mt: 0.5,
                                                }}
                                            />
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    component="h3"
                                                    gutterBottom
                                                    sx={{
                                                        fontWeight: 500,
                                                        color: 'text.primary',
                                                    }}
                                                >
                                                    Additional Guests
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    sx={{ color: 'text.secondary' }}
                                                >
                                                    Not seeing everybody in your party? Feel free to
                                                    contact us at morrowchad1@protonmail.com.
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                        {activeStep === 2 && (
                            <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                                <Box mb={2} width={'40%'}>
                                    <TextField
                                        label="Enter a song"
                                        value={newSong}
                                        onChange={(e) => {
                                            setNewSong(e.target.value);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                addSong();
                                            }
                                        }}
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Box>

                                {songs.map((song, index) => (
                                    <Box
                                        key={index}
                                        border={1}
                                        borderColor="primary.main"
                                        p={2}
                                        borderRadius={4}
                                        mb={2}
                                        width="40%"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between"
                                    >
                                        <Typography variant="h6">{song}</Typography>
                                        <IconButton
                                            aria-label="Remove song"
                                            onClick={() => handleRemoveSong(index)}
                                        >
                                            <CloseIcon fontSize="small" sx={{ color: 'black' }} />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        )}
                        <Divider sx={{ my: 2 }} />
                        <Box display={'flex'} justifyContent={'space-between'}>
                            <Button disabled={activeStep === 0 || isToastOpen} onClick={handleBack}>
                                Back
                            </Button>
                            {activeStep === steps.length - 1 || !attending ? (
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={isToastOpen}
                                >
                                    Submit
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={
                                        activeStep === 1 &&
                                        foodChoices.some((item) => item.choice === null)
                                    }
                                >
                                    Next
                                </Button>
                            )}
                        </Box>

                        <Snackbar
                            open={isToastOpen}
                            autoHideDuration={2000}
                            onClose={() => {
                                setIsToastOpen(false);
                                navigate('/');
                            }}
                        >
                            <Alert severity="success" variant="outlined" sx={{ width: '100%' }}>
                                Updates submitted!
                            </Alert>
                        </Snackbar>

                        <Snackbar open={error instanceof Error}>
                            <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
                                Failed to get guest information. Please refresh the page. If the
                                issue continues, reach out to us.
                            </Alert>
                        </Snackbar>
                    </Box>
                </Box>
            )}
        </PageContainer>
    );
};

export default Rsvp;
