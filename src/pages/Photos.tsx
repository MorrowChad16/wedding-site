import PageContainer from '../components/PageContainer';
import { Box, Grid } from '@mui/material';
import image0 from '../assets/images/display/IMG_5772.jpeg';
import image1 from '../assets/images/display/IMG_5841.jpeg';
import image2 from '../assets/images/display/IMG_6574.jpeg';
import image3 from '../assets/images/display/IMG_6622.jpeg';
import image4 from '../assets/images/display/IMG_7415.jpeg';
import image5 from '../assets/images/display/IMG_7556.jpeg';
import image6 from '../assets/images/display/IMG_8086.jpeg';
import image7 from '../assets/images/display/IMG_8636.jpeg';
import image8 from '../assets/images/display/IMG_9055.jpeg';
import image9 from '../assets/images/display/IMG_9191.jpeg';
import image10 from '../assets/images/display/IMG_9220.jpeg';
import image11 from '../assets/images/display/IMG_9238.jpeg';
import { extractFilenameFromImport } from '../utils/utilities';

const images = [
    image0,
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8,
    image9,
    image10,
    image11,
];

export default function Photos() {
    // Add 3 x N grid of images
    return (
        <PageContainer>
            <Grid container spacing={2}>
                {' '}
                {/* Spacing between images */}
                {Object.values(images).map((image, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Box>
                            <img
                                key={extractFilenameFromImport(image)}
                                src={image}
                                alt={extractFilenameFromImport(image)}
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </PageContainer>
    );
}
