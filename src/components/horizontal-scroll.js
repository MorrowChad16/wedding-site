import { Box } from '@mui/material';
export default function HorizontalScroll({ children }) {
    return (React.createElement(Box, { sx: {
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
        } }, children));
}
