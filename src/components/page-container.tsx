import { Alert, Container, Grid, useMediaQuery, useTheme } from '@mui/material';
import { WEDDING_DATE } from '../utils/constants';
import { hasSubmittedRsvp } from '../api/use-guests';
import { useStore } from '../api/use-store';

interface PageContainerProps {
    children: JSX.Element;
    display?: string;
    justifyContent?: string;
}

function PageContainer({
    children,
    display = 'flex',
    justifyContent = 'center',
}: PageContainerProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const { storeEmail } = useStore();
    const isWithin30Days = (): boolean => {
        const timeDiff = Math.abs(WEDDING_DATE.getTime() - new Date().getTime());
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return daysDiff > 0 && daysDiff <= 30;
    };
    const { hasSubmitted } = hasSubmittedRsvp(storeEmail);

    let paddingTop = '100px';
    if (isMobile) {
        paddingTop = '60px';
    } else if (isWithin30Days() && !hasSubmitted) {
        paddingTop = isMobile ? '60px' : '80px';
    }

    return (
        <Container
            disableGutters={isMobile}
            maxWidth={isMobile ? false : 'xl'}
            sx={{
                display,
                pt: paddingTop,
                justifyContent,
                width: isMobile ? '100%' : 'auto',
            }}
        >
            <Grid container direction="column" alignItems={'center'}>
                {isWithin30Days() && !hasSubmitted && (
                    <Grid item>
                        <Alert
                            severity="warning"
                            variant="filled"
                            sx={{ borderRadius: '10px', mb: '20px' }}
                        >
                            The RSVP window is closing soon! You have until August 10th to submit
                            your details.
                        </Alert>
                    </Grid>
                )}
                <Grid item width={'100%'}>
                    {children}
                </Grid>
            </Grid>
        </Container>
    );
}

export default PageContainer;
