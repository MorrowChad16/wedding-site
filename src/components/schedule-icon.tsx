import { useContext } from 'react';
import { Box, Button, Grid, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import ThemeContext from './use-theme-context';

interface ScheduleIconProps {
    uid: string;
    startTime: Date;
    endTime: Date;
    title: string;
    description: string;
    location: string;
    iconAsset: string;
    formality: string;
}

function ScheduleIcon({
    uid,
    startTime,
    endTime,
    title,
    description,
    iconAsset,
    formality,
    location,
}: ScheduleIconProps) {
    const muiTheme = useTheme();
    const isSmallScreen = useMediaQuery(muiTheme.breakpoints.down('md'));

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(startTime);
    const { theme } = useContext(ThemeContext);

    const generateIcsDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    };

    const createIcsContent = (
        uid: string,
        startDate: Date,
        endDate: Date,
        title: string,
        description: string,
        location: string
    ) => `
    BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ical.marudot.com//iCal Event Maker
CALSCALE:GREGORIAN
BEGIN:VTIMEZONE
TZID:Europe/Madrid
LAST-MODIFIED:20231222T233358Z
TZURL:https://www.tzurl.org/zoneinfo-outlook/Europe/Madrid
X-LIC-LOCATION:Europe/Madrid
BEGIN:DAYLIGHT
TZNAME:CEST
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
DTSTART:19700329T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
END:DAYLIGHT
BEGIN:STANDARD
TZNAME:CET
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
DTSTART:19701025T030000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
DTSTAMP:20240522T220034Z
UID:${uid}@ical.marudot.com
DTSTART;TZID=Europe/Madrid:${generateIcsDate(startDate)}
DTEND;TZID=Europe/Madrid:${generateIcsDate(endDate)}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

    const downloadIcsFile = (
        uid: string,
        fileName: string,
        startDate: Date,
        endDate: Date,
        title: string,
        description: string,
        location: string
    ) => {
        const icsContent = createIcsContent(uid, startDate, endDate, title, description, location);
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
    };

    function formatTime(date: Date) {
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

        return `${formattedHours}:${minutes} ${ampm}`;
    }

    const formatTimeRange = (startTime: Date, endTime: Date) => {
        const startTimeString = formatTime(startTime);
        const endTimeString = formatTime(endTime);

        return `${startTimeString} - ${endTimeString}`;
    };

    return (
        <Grid item xs={12} sm={12}>
            <Paper
                elevation={4}
                sx={{
                    border: `1px solid ${theme.palette.primary.main}`,
                    borderRadius: '10px',
                    p: 4,
                    width: { sm: '100%', md: '100%', lg: '540px' },
                }}
            >
                <Typography
                    variant="h3"
                    fontSize={isSmallScreen ? '2rem' : '3rem'}
                    textAlign="center"
                    mb={1}
                >
                    {formattedDate}
                </Typography>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} mb={1}>
                    {
                        <img
                            src={iconAsset}
                            width={isSmallScreen ? 40 : 60}
                            height={isSmallScreen ? 40 : 60}
                            alt="Image Description"
                        />
                    }
                </Box>
                <Typography variant="h6" textAlign="center" mb={1}>
                    {title}
                </Typography>
                <Typography variant="body1" textAlign="center" mb={1}>
                    {formatTimeRange(startTime, endTime)}
                </Typography>
                <Typography variant="body1" textAlign="center" mb={1}>
                    {formality}
                </Typography>
                <Box textAlign={'center'}>
                    <Button
                        variant="contained"
                        color="primary"
                        aria-label="wedding-event-download"
                        onClick={() =>
                            downloadIcsFile(
                                uid,
                                `${title.toLowerCase().replace(' ', '-')}.ics`,
                                startTime,
                                endTime,
                                title,
                                description,
                                location
                            )
                        }
                    >
                        Add to calendar
                    </Button>
                </Box>
            </Paper>
        </Grid>
    );
}

export default ScheduleIcon;
