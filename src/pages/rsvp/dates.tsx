import React from 'react';
import { TextField, Typography, Container, Box } from '@mui/material';

interface DateFormProps {
    arrivalDate: string;
    setArrivalDate: React.Dispatch<React.SetStateAction<string>>;
    departureDate: string;
    setDepartureDate: React.Dispatch<React.SetStateAction<string>>;
}

export function DateForm({
    arrivalDate,
    setArrivalDate,
    departureDate,
    setDepartureDate,
}: DateFormProps) {
    return (
        <Container maxWidth="sm">
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'}>
                <Typography mb={2}>What dates do you plan to be in town?</Typography>
                <TextField
                    label="Arrival Date"
                    type="date"
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Departure Date"
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>
        </Container>
    );
}

export default DateForm;
