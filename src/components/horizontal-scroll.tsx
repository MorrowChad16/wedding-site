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
                    height: '0px',
                },
                // Scroll bar
                '&::-webkit-scrollbar-thumb': {
                    bgcolor: 'black',
                    borderRadius: '0px',
                },
            }}
        >
            {children}
        </Box>
    );
}
