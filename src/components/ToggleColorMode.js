import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import ModeNightRoundedIcon from '@mui/icons-material/ModeNightRounded';
function ToggleColorMode({ mode, toggleColorMode }) {
    return (React.createElement(Box, { sx: { maxWidth: '32px' } },
        React.createElement(Button, { variant: "text", onClick: toggleColorMode, size: "small", "aria-label": "button to toggle theme", sx: { minWidth: '32px', height: '32px', p: '4px' } }, mode === 'dark' ? (React.createElement(WbSunnyRoundedIcon, { fontSize: "small" })) : (React.createElement(ModeNightRoundedIcon, { fontSize: "small" })))));
}
export default ToggleColorMode;
