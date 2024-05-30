import PageContainer from '../components/PageContainer';
import { Box, Grid } from '@mui/material';
import { importAllImages } from '../components/utilities';
const images = importAllImages(import.meta.glob('../assets/images/display/**/*.{png,jpeg,jpg,svg}', {
    eager: true,
    import: 'default',
}));
export default function Photos() {
    // Add 3 x N grid of images
    return (React.createElement(PageContainer, null,
        React.createElement(Grid, { container: true, spacing: 2 },
            ' ',
            Object.keys(images).map((key, index) => (React.createElement(Grid, { item: true, xs: 12, sm: 4, key: index },
                React.createElement(Box, null,
                    React.createElement("img", { key: key, src: images[key], alt: key, style: { width: '100%', height: 'auto' } }))))))));
}
