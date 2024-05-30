import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, Step, StepLabel, Stepper, TextField, Typography, } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PageContainer from '../components/PageContainer';
import { FoodChoice } from './Food';
import { useNavigate } from 'react-router-dom';
const Rsvp = () => {
    // TODO: add message if they deny RSVP
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [attending, setAttending] = useState(false);
    const [foodChoice, setFoodChoice] = useState();
    const [foodAllergies, setFoodAllergies] = useState('');
    // // TODO: handle guests choices
    // const [guestFoodChoice, setGuestFoodChoice] = useState<FoodChoice>();
    // const [guestFoodAllergies, setGuestFoodAllergies] = useState('');
    const [songs, setSongs] = useState([]);
    const [newSong, setNewSong] = useState('');
    const addSong = () => {
        if (newSong.trim() !== '') {
            setSongs([...songs, newSong.trim()]);
            setNewSong('');
        }
    };
    const handleRemoveSong = (index) => {
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
    const handleSubmit = () => {
        setSubmitted(true);
        if (attending) {
            // TODO: submit data to DDB
        }
    };
    return (React.createElement(PageContainer, null,
        React.createElement(Box, null,
            React.createElement(Stepper, { activeStep: activeStep, alternativeLabel: true }, steps.map((label) => (React.createElement(Step, { key: label },
                React.createElement(StepLabel, null, label))))),
            React.createElement(Box, { sx: { p: 2 } },
                activeStep === 0 && (React.createElement(Box, { sx: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    } },
                    React.createElement(Typography, { sx: {
                            marginBottom: 2,
                        } }, "Are you attending the wedding?"),
                    React.createElement(Box, null,
                        React.createElement(Button, { variant: attending ? 'contained' : 'outlined', onClick: () => setAttending(true), sx: { mr: 2 } }, "Yes"),
                        React.createElement(Button, { variant: !attending ? 'contained' : 'outlined', onClick: () => setAttending(false) }, "No")))),
                activeStep === 1 && (React.createElement("div", null,
                    React.createElement(Box, { display: "flex", justifyContent: "center", mt: 2, sx: { marginBottom: 2 } },
                        React.createElement(FormControl, { sx: { width: '40%' } },
                            React.createElement(InputLabel, null, "Main Course"),
                            React.createElement(Select, { label: "Main Course", variant: "outlined", value: foodChoice, onChange: (event) => {
                                    setFoodChoice(event.target.value);
                                } }, Object.values(FoodChoice).map((choice) => (React.createElement(MenuItem, { key: choice, value: choice }, choice)))))),
                    React.createElement(Box, { display: "flex", justifyContent: "center", alignItems: "center" },
                        React.createElement(Box, { maxWidth: 600, width: "100%" },
                            React.createElement(TextField, { label: "Food Allergies/Preferences", variant: "outlined", value: foodAllergies, onChange: (e) => {
                                    setFoodAllergies(e.target.value);
                                }, fullWidth: true, multiline: true, minRows: 3, maxRows: 5 }))))),
                activeStep === 2 && (React.createElement(Box, { display: "flex", flexDirection: "column", alignItems: "center", mt: 4 },
                    React.createElement(Box, { mb: 2, sx: { width: '40%' } },
                        React.createElement(TextField, { label: "Enter a song", value: newSong, onChange: (e) => {
                                setNewSong(e.target.value);
                            }, onKeyDown: (e) => {
                                if (e.key === 'Enter') {
                                    addSong();
                                }
                            }, variant: "outlined", fullWidth: true })),
                    songs.map((song, index) => (React.createElement(Box, { key: index, border: 1, borderColor: "primary.main", p: 2, borderRadius: 4, mb: 2, width: "40%", display: "flex", alignItems: "center", justifyContent: "space-between" },
                        React.createElement(Typography, { variant: "h6" }, song),
                        React.createElement(IconButton, { "aria-label": "Remove song", onClick: () => handleRemoveSong(index) },
                            React.createElement(CloseIcon, { fontSize: "small", sx: { color: 'black' } }))))))),
                React.createElement(Divider, { sx: { my: 2 } }),
                React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between' } },
                    React.createElement(Button, { disabled: activeStep === 0, onClick: handleBack }, "Back"),
                    activeStep === steps.length - 1 || !attending ? (React.createElement(Button, { variant: "contained", onClick: handleSubmit }, "Submit")) : (React.createElement(Button, { variant: "contained", onClick: handleNext, disabled: activeStep === 1 && foodChoice === undefined }, "Next"))),
                submitted && !attending && (React.createElement(Dialog, { open: true },
                    React.createElement(DialogTitle, null, "Important Message"),
                    React.createElement(DialogContent, null, "We understand you're incredibly busy and we're always happy to have you if you change your mind."),
                    React.createElement(DialogActions, null,
                        React.createElement(Button, { onClick: () => navigate('/'), color: "primary" }, "OK"))))))));
};
export default Rsvp;
