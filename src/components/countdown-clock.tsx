import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { WEDDING_DATE } from '../utils/constants';

type Countdown = {
    years?: number;
    months?: number;
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

            if (difference < 0) {
                setIsCountdownComplete(true);
                return;
            }

            const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25));
            if (years > 0) {
                timeRemainingObj.years = years;
            }

            let remainingTime = difference - years * (1000 * 60 * 60 * 24 * 365.25);
            const months = Math.floor(remainingTime / (1000 * 60 * 60 * 24 * 30.44));
            if (months > 0) {
                timeRemainingObj.months = months;
            }

            remainingTime -= months * (1000 * 60 * 60 * 24 * 30.44);
            const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
            if (days > 0) {
                timeRemainingObj.days = days;
            }

            const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
            if (hours > 0) {
                timeRemainingObj.hours = hours;
            }

            const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
            if (minutes > 0) {
                timeRemainingObj.minutes = minutes;
            }

            const seconds = Math.floor((remainingTime / 1000) % 60);
            if (seconds > 0) {
                timeRemainingObj.seconds = seconds;
            }

            timeRemainingObj.milliseconds = remainingTime % 1000;

            setTimeRemaining(timeRemainingObj);
        };

        updateCountdown();
        const intervalId = setInterval(updateCountdown, 10);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <Grid container spacing={{ xs: 2, sm: 3, md: 5, lg: 5 }} justifyContent="center">
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
