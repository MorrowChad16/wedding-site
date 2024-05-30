import * as React from 'react';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import ThemeContext from './use-theme-context';
function ScheduleIcon({ uid, startTime, endTime, title, description, iconAsset, formality, location, }) {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(startTime);
    const { theme } = React.useContext(ThemeContext);
    const generateIcsDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    };
    const createIcsContent = (uid, startDate, endDate, title, description, location) => `
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
    const downloadIcsFile = (uid, fileName, startDate, endDate, title, description, location) => {
        const icsContent = createIcsContent(uid, startDate, endDate, title, description, location);
        console.log(icsContent);
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
    };
    function formatTime(date) {
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        return `${formattedHours}:${minutes} ${ampm}`;
    }
    const formatTimeRange = (startTime, endTime) => {
        const startTimeString = formatTime(startTime);
        const endTimeString = formatTime(endTime);
        return `${startTimeString} - ${endTimeString}`;
    };
    return (React.createElement(Grid, { item: true, xs: 12 },
        React.createElement(Paper, { elevation: 4, sx: {
                border: `1px solid ${theme.palette.primary.main}`,
                borderRadius: '10px',
                padding: 4,
                width: '540px',
            } },
            React.createElement(Typography, { variant: "h3", sx: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 1,
                } }, formattedDate),
            React.createElement(Box, { sx: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 1,
                } }, React.createElement("img", { src: iconAsset, width: 60, height: 60, alt: "Image Description" })),
            React.createElement(Typography, { variant: "h6", sx: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 1,
                } }, title),
            React.createElement(Typography, { variant: "body1", sx: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 1,
                } }, formatTimeRange(startTime, endTime)),
            React.createElement(Typography, { variant: "body1", sx: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 1,
                } }, formality),
            React.createElement(Box, { sx: { textAlign: 'center' } },
                React.createElement(Button, { variant: "contained", color: "primary", "aria-label": "wedding-event-download", onClick: () => downloadIcsFile(uid, `${title.toLowerCase().replace(' ', '-')}.ics`, startTime, endTime, title, description, location) }, "Add to calendar")))));
}
export default ScheduleIcon;
