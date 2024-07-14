import { Box, CardMedia, Paper, SxProps, Theme, Typography, useTheme } from '@mui/material';

export interface FoodBoxProps {
    image: string;
    imageAlt: string;
    description: string;
    sxOverride?: SxProps<Theme>;
}

export default function FoodBox({ image, imageAlt, description, sxOverride }: FoodBoxProps) {
    const theme = useTheme();

    return (
        <Paper
            elevation={4}
            sx={{
                border: `1px solid ${theme.palette.primary.main}`,
                borderRadius: '10px',
                p: 4,
                ...sxOverride,
            }}
        >
            <Box display="flex" justifyContent="center" mb={4}>
                <CardMedia
                    component="img"
                    image={image}
                    alt={imageAlt}
                    sx={{ width: '500px !important', objectFit: 'contain', borderRadius: '10px' }}
                />
            </Box>
            <Typography align="center">{description}</Typography>
        </Paper>
    );
}
