import { Container, SxProps, Theme } from '@mui/material';
import * as React from 'react';

interface PageContainerProps {
    sxOverrides?: SxProps<Theme>;
    children: React.JSX.Element;
}

function PageContainer({ sxOverrides, children }: PageContainerProps) {
    return (
        <Container
            maxWidth="lg"
            sx={{
                paddingTop: '100px',
                alignItems: 'center',
                justifyContent: 'center',
                ...sxOverrides,
            }}
        >
            {children}
        </Container>
    );
}

export default PageContainer;
