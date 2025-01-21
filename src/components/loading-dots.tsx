import { useEffect, useState } from 'react';

const LoadingDots = () => {
    const [dots, setDots] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prevDots) => (prevDots === 3 ? 1 : prevDots + 1));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-center p-4">
            <div className="text-gray-600 text-2xl">{'.'.repeat(dots)}</div>
        </div>
    );
};

export { LoadingDots };
