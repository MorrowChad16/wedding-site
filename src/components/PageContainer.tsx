import { useContext, useState, useEffect } from 'react';
import { Alert, Container } from '@mui/material';
import { WEDDING_DATE } from '../utils/constants';
import { hasSubmittedRsvp } from '../api/use-guests';
import { SharedVariableContext } from '../utils/shared-context';

interface PageContainerProps {
    children: JSX.Element;
}

function PageContainer({ children }: PageContainerProps) {
    const { email } = useContext(SharedVariableContext);
    const isWithin30Days = (): boolean => {
        const timeDiff = Math.abs(WEDDING_DATE.getTime() - new Date().getTime());
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return daysDiff > 0 && daysDiff <= 30;
    };
    const [open, setIsOpen] = useState(false);

    useEffect(() => {
        const getStatus = async () => {
            const isSubmitted = await hasSubmittedRsvp(email);
            setIsOpen(isWithin30Days() && !isSubmitted);
        };

        getStatus();
    }, []);

    return (
        <Container
            maxWidth="lg"
            sx={{
                pt: open ? '80px' : '100px',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {open && (
                <Alert
                    severity="warning"
                    variant="filled"
                    sx={{ borderRadius: '10px', mb: '20px' }}
                >
                    The RSVP window is closing soon! You have until August 10th to submit your
                    details.
                </Alert>
            )}
            {children}
        </Container>
    );
}

export default PageContainer;
