import * as React from 'react';
import { Box, CardMedia, Paper, Typography } from '@mui/material';
import ThemeContext from './use-theme-context';
export default function FoodBox({ image, imageAlt, description, sxOverride }) {
    const { theme } = React.useContext(ThemeContext);
    return (React.createElement(Paper, { elevation: 4, sx: {
            border: `1px solid ${theme.palette.primary.main}`,
            borderRadius: '10px',
            padding: 4,
            ...sxOverride,
        } },
        React.createElement(Box, { display: "flex", justifyContent: "center", marginBottom: 4 },
            React.createElement(CardMedia, { component: "img", image: image, alt: imageAlt, sx: { width: '500px !important', objectFit: 'contain' } })),
        React.createElement(Typography, { align: "center" }, description)));
}
