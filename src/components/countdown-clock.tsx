import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { WEDDING_DATE } from '../utils/constants';

type Countdown = {
    years?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
};

function CountdownClock() {
    const [isCountdownComplete, setIsCountdownComplete] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<Countdown>({});

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            let timeRemainingObj: Countdown = {};
            const difference = WEDDING_DATE.getTime() - now.getTime();
            const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));
            if (years > 0) {
                timeRemainingObj.years = years;
            }
            const days = Math.floor((difference / (1000 * 60 * 60 * 24)) % 365);
            if (days > 0) {
                timeRemainingObj.days = days;
            }
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            if (hours > 0) {
                timeRemainingObj.hours = hours;
            }
            const minutes = Math.floor((difference / (1000 * 60)) % 60);
            if (minutes > 0) {
                timeRemainingObj.minutes = minutes;
            }
            const seconds = Math.floor((difference / 1000) % 60);
            if (seconds > 0) {
                timeRemainingObj.seconds = seconds;
            }
            timeRemainingObj.milliseconds = difference % 1000;

            if (difference >= 0) {
                setTimeRemaining(timeRemainingObj);
            } else {
                setIsCountdownComplete(true);
            }
        };

        updateCountdown();
        const intervalId = setInterval(updateCountdown, 10);

        return () => clearInterval(intervalId);
    }, []);

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
