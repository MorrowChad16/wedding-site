import { Box, Button, Grid, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import { generateGoogleMapsLink, openInNewWindow } from '../utils/utilities';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { StorageImage } from '@aws-amplify/ui-react-storage';

interface ScheduleIconProps {
    uid: string;
    startTime: string;
    endTime: string;
    title: string;
    description?: string | null;
    location: string;
    locationName: string;
    iconAsset: string;
    formality: 'CASUAL' | 'SEMI_FORMAL' | 'FORMAL';
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
    locationName,
}: ScheduleIconProps) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    // Convert string dates to Date objects
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // Convert formality enum to display format
    const displayFormality =
        formality === 'CASUAL' ? 'Casual' : formality === 'SEMI_FORMAL' ? 'Semi-Formal' : 'Formal';

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(startDate);

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
TZID:America/Denver
LAST-MODIFIED:20231222T233358Z
TZURL:https://www.tzurl.org/zoneinfo-outlook/America/Denver
X-LIC-LOCATION:America/Denver
BEGIN:DAYLIGHT
TZNAME:MST
TZOFFSETFROM:-0700
TZOFFSETTO:-0600
DTSTART:19701101T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
END:DAYLIGHT
BEGIN:STANDARD
TZNAME:MST
TZOFFSETFROM:-0600
TZOFFSETTO:-0700
DTSTART:19701101T020000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
DTSTAMP:20240723T031740Z
UID:${uid}@ical.marudot.com
DTSTART;TZID=America/Denver:${generateIcsDate(startDate)}
DTEND;TZID=America/Denver:${generateIcsDate(endDate)}
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
                <Box display="flex" justifyContent="center" mb={1}>
                    <StorageImage
                        alt={`${title} icon`}
                        path={iconAsset}
                        style={{
                            width: isSmallScreen ? 40 : 60,
                            height: isSmallScreen ? 40 : 60,
                        }}
                        loading="lazy"
                        validateObjectExistence={false}
                    />
                </Box>
                <Typography variant="h4" textAlign="center" mb={1}>
                    {title}
                </Typography>
                <Typography variant="h6" textAlign="center" mb={1}>
                    {locationName}
                </Typography>
                <Button
                    variant="text"
                    onClick={() => openInNewWindow(generateGoogleMapsLink(location))}
                    style={{
                        display: 'flex',
                        marginBottom: 2,
                        justifyContent: 'center',
                        width: '100%',
                    }}
                >
                    <LocationOnIcon fontSize="inherit" />
                    {location}
                </Button>
                <Typography variant="body1" textAlign="center" mb={1}>
                    {formatTimeRange(startDate, endDate)}
                </Typography>
                <Typography variant="body1" textAlign="center" mb={1}>
                    {displayFormality}
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
                                startDate,
                                endDate,
                                title,
                                description ?? '',
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
