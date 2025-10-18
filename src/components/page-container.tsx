import { Container, Grid, useMediaQuery, useTheme } from '@mui/material';
import { ReactElement } from 'react';

interface PageContainerProps {
    children: ReactElement;
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

    let paddingTop = '100px';
    if (isMobile) {
        paddingTop = '60px';
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
                <Grid item width={'100%'}>
                    {children}
                </Grid>
            </Grid>
        </Container>
    );
}

export default PageContainer;
