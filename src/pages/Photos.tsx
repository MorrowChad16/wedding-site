import PageContainer from '../components/PageContainer';
import { Box, Grid } from '@mui/material';
import { importAllImages } from '../components/utilities';

const images = importAllImages(
    import.meta.glob('../assets/images/display/**/*.{png,jpeg,jpg,svg}', {
        eager: true,
        import: 'default',
    })
);

export default function Photos() {
    // Add 3 x N grid of images
    return (
        <PageContainer>
            <Grid container spacing={2}>
                {' '}
                {/* Spacing between images */}
                {Object.keys(images).map((key, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Box>
                            <img
                                key={key}
                                src={images[key]}
                                alt={key}
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </PageContainer>
    );
}
