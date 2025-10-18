import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface WavyTextProps {
    text: string;
    mobileHeight?: number;
    desktopHeight?: number;
    mobileFontSize?: number;
    desktopFontSize?: number;
}

export default function WavyText({
    text,
    mobileHeight = 60,
    desktopHeight = 150,
    mobileFontSize = 18,
    desktopFontSize = 20,
}: WavyTextProps) {
    const [offset, setOffset] = useState(0);
    const theme = useTheme();

    // Animate the wavy text
    useEffect(() => {
        const interval = setInterval(() => {
            setOffset((prev) => (prev + 0.05) % 100);
        }, 16);
        return () => clearInterval(interval);
    }, []);

    // Repeat the text 10 times for continuous scrolling
    const repeatedText = text.repeat(10);

    return (
        <Box
            sx={{
                width: '100vw',
                position: 'relative',
                left: '50%',
                right: '50%',
                marginLeft: '-50vw',
                marginRight: '-50vw',
                overflow: 'hidden',
                marginBottom: { xs: '20px', md: '30px' },
            }}
        >
            {/* Mobile version - subtle wave */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                <svg
                    viewBox="0 0 1200 100"
                    width="100%"
                    height={mobileHeight}
                    style={{ display: 'block' }}
                    preserveAspectRatio="none"
                >
                    <defs>
                        <path
                            id="wavePathMobile"
                            d="M 0,50 Q 150,45 300,50 T 600,50 T 900,50 T 1200,50"
                            fill="transparent"
                        />
                    </defs>
                    <text
                        fill={theme.palette.primary.main}
                        fontSize={mobileFontSize}
                        fontFamily="inherit"
                        fontWeight="400"
                    >
                        <textPath href="#wavePathMobile" startOffset={`${-offset * 2}%`}>
                            {repeatedText}
                        </textPath>
                    </text>
                </svg>
            </Box>

            {/* Desktop version - more pronounced wave */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <svg
                    viewBox="0 0 1200 150"
                    width="100%"
                    height={desktopHeight}
                    style={{ display: 'block' }}
                    preserveAspectRatio="none"
                >
                    <defs>
                        <path
                            id="wavePathDesktop"
                            d="M 0,75 Q 150,50 300,75 T 600,75 T 900,75 T 1200,75"
                            fill="transparent"
                        />
                    </defs>
                    <text
                        fill={theme.palette.primary.main}
                        fontSize={desktopFontSize}
                        fontFamily="inherit"
                        fontWeight="400"
                    >
                        <textPath href="#wavePathDesktop" startOffset={`${-offset * 2}%`}>
                            {repeatedText}
                        </textPath>
                    </text>
                </svg>
            </Box>
        </Box>
    );
}
