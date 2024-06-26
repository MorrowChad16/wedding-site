import { Box } from '@mui/material';

interface HorizontalScrollProps {
    children: JSX.Element[];
}

export default function HorizontalScroll({ children }: HorizontalScrollProps) {
    return (
        <Box
            display={'flex'}
            whiteSpace={'nowrap'}
            p={2}
            sx={{
                overflowX: 'auto',
                overflowY: 'hidden',
                // Scroll bar
                '&::-webkit-scrollbar': {
                    height: '8px',
                },
                // Scroll bar
                '&::-webkit-scrollbar-thumb': {
                    bgcolor: 'grey',
                    borderRadius: '4px',
                },
            }}
        >
            {children}
        </Box>
    );
}
