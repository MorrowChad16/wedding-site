import { useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PageContainer from '../components/PageContainer';
import { FoodChoice } from './Food';
import { useNavigate } from 'react-router-dom';
import { getGuest, updateGuest } from '../api/use-guests';

export enum Status {
    NOT_ATTENDING = 'NOT_ATTENDING',
    ATTENDING = 'ATTENDING',
    COMING = 'COMING',
}

const Rsvp = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [complete, setComplete] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [attending, setAttending] = useState(false);

    // TODO: update to handle choice for all members of party
    const [foodChoice, setFoodChoice] = useState<FoodChoice>();
    const [foodAllergies, setFoodAllergies] = useState('');

    const [songs, setSongs] = useState<string[]>([]);
    const [newSong, setNewSong] = useState('');

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

    const steps = ['Attending?', 'Food Choice', 'Song Requests'];

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        await updateGuest(
            localStorage.getItem('email')!,
            foodAllergies,
            songs.join(','),
            attending ? Status.COMING : Status.NOT_ATTENDING,
            foodChoice
        );
        // TOOD: add toast if update fails
        console.log('guest', getGuest('morrowchad1@protonmail.com'));
        setComplete(true);
    };

    return (
        <PageContainer>
            {submitting && !complete ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
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
                    <Box sx={{ p: 2 }}>
                        {activeStep === 0 && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    width: '100%',
                                }}
                            >
                                <Typography
                                    sx={{
                                        marginBottom: 2,
                                    }}
                                >
                                    Are you attending the wedding?
                                </Typography>
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
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    mt={2}
                                    sx={{ marginBottom: 2 }}
                                >
                                    <FormControl sx={{ width: '40%' }}>
                                        <InputLabel>Main Course</InputLabel>
                                        <Select
                                            label="Main Course"
                                            variant="outlined"
                                            value={foodChoice}
                                            onChange={(event) => {
                                                setFoodChoice(event.target.value as FoodChoice);
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
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <Box maxWidth={600} width="100%">
                                        <TextField
                                            label="Food Allergies/Preferences"
                                            variant="outlined"
                                            value={foodAllergies}
                                            onChange={(e) => {
                                                setFoodAllergies(e.target.value);
                                            }}
                                            fullWidth
                                            multiline
                                            minRows={3}
                                            maxRows={5}
                                        />
                                    </Box>
                                </Box>
                            </div>
                        )}
                        {activeStep === 2 && (
                            <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                                <Box mb={2} sx={{ width: '40%' }}>
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button disabled={activeStep === 0} onClick={handleBack}>
                                Back
                            </Button>
                            {activeStep === steps.length - 1 || !attending ? (
                                <Button variant="contained" onClick={handleSubmit}>
                                    Submit
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={activeStep === 1 && foodChoice === undefined}
                                >
                                    Next
                                </Button>
                            )}
                        </Box>
                        {complete && !attending && (
                            <Dialog open={true}>
                                <DialogTitle>Important Message</DialogTitle>
                                <DialogContent>
                                    We understand you're incredibly busy and we're always happy to
                                    have you if you change your mind.
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => navigate('/')} color="primary">
                                        OK
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        )}
                    </Box>
                </Box>
            )}
        </PageContainer>
    );
};

export default Rsvp;
