import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

interface CountdownClockProps {
    targetEpochDate: number;
}

function CountdownClock({ targetEpochDate }: CountdownClockProps) {
    const [isCountdownComplete, setIsCountdownComplete] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState({
        years: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
    });

    useEffect(() => {
        const targetDate = new Date(targetEpochDate);

        const updateCountdown = () => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference >= 0) {
                setTimeRemaining({
                    years: Math.floor(difference / (1000 * 60 * 60 * 24 * 365)),
                    days: Math.floor((difference / (1000 * 60 * 60 * 24)) % 365),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / (1000 * 60)) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                    milliseconds: difference % 1000,
                });
            } else {
                setIsCountdownComplete(true);
            }
        };

        updateCountdown();
        const intervalId = setInterval(updateCountdown, 10);

        return () => clearInterval(intervalId);
    }, [targetEpochDate]);

    return (
        <Grid container spacing={5} justifyContent="center">
            {isCountdownComplete ? (
                <Grid item>
                    <Typography variant="h5" align="center" gutterBottom>
                        We did the thing!
                    </Typography>
                </Grid>
            ) : (
                Object.entries(timeRemaining).map(([unit, value]) => (
                    <Grid item key={unit}>
                        <Typography variant="h5" align="center" gutterBottom>
                            {value}
                        </Typography>
                        <Typography align="center">{unit}</Typography>
                    </Grid>
                ))
            )}
        </Grid>
    );
}

export default CountdownClock;
