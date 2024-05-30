import * as React from 'react';
import { Box, CardMedia, Paper, SxProps, Theme, Typography } from '@mui/material';
import ThemeContext from './use-theme-context';

export interface FoodBoxProps {
    image: string;
    imageAlt: string;
    description: string;
    sxOverride?: SxProps<Theme>;
}

export default function FoodBox({ image, imageAlt, description, sxOverride }: FoodBoxProps) {
    const { theme } = React.useContext(ThemeContext);

    return (
        <Paper
            elevation={4}
            sx={{
                border: `1px solid ${theme.palette.primary.main}`,
                borderRadius: '10px',
                padding: 4,
                ...sxOverride,
            }}
        >
            <Box display="flex" justifyContent="center" marginBottom={4}>
                <CardMedia
                    component="img"
                    image={image}
                    alt={imageAlt}
                    sx={{ width: '500px !important', objectFit: 'contain' }}
                />
            </Box>
            <Typography align="center">{description}</Typography>
        </Paper>
    );
}
