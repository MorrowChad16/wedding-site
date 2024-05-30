import { Container } from '@mui/material';
function PageContainer({ sxOverrides, children }) {
    return (React.createElement(Container, { maxWidth: "lg", sx: {
            paddingTop: '100px',
            alignItems: 'center',
            justifyContent: 'center',
            ...sxOverrides,
        } }, children));
}
export default PageContainer;
