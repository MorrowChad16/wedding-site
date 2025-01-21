import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

const StreamingText = ({ text, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            // Variable timing based on punctuation
            let delay = 10;

            // Longer pauses after punctuation
            if (currentIndex > 0) {
                const prevChar = text[currentIndex - 1];
                if (prevChar === '.') {
                    delay = 100;
                } else if (prevChar === ',') {
                    delay = 50;
                } else if (prevChar === ' ') {
                    delay = 25;
                }
            }

            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text[currentIndex]);
                setCurrentIndex((prev) => prev + 1);
            }, delay);

            return () => clearTimeout(timeout);
        } else if (onComplete) {
            onComplete();
        }
    }, [currentIndex, text, onComplete]);

    return <Typography>{displayedText}</Typography>;
};

export { StreamingText };
