import { Box } from '@mui/material';

interface HorizontalScrollProps {
    children: JSX.Element[];
}

export default function HorizontalScroll({ children }: HorizontalScrollProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                overflowX: 'auto',
                overflowY: 'hidden',
                whiteSpace: 'nowrap',
                padding: '8px',
                // Scroll bar
                '&::-webkit-scrollbar': {
                    height: '8px',
                },
                // Scroll bar
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'grey',
                    borderRadius: '4px',
                },
                marginBottom: 4,
            }}
        >
            {children}
        </Box>
    );
}
