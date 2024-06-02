import PageContainer from '../components/PageContainer';
import { ImageList, ImageListItem } from '@mui/material';
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
    image1,
    image2,
    image4,
    image0,
    image3,
    image6,
    image8,
    image5,
    image7,
    image9,
    image10,
    image11,
];

export default function Gallery() {
    return (
        <PageContainer>
            <ImageList variant="masonry" cols={3} gap={8}>
                {Object.values(images).map((image) => (
                    <ImageListItem key={extractFilenameFromImport(image)}>
                        <img
                            srcSet={`${image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            src={`${image}?w=248&fit=crop&auto=format`}
                            alt={extractFilenameFromImport(image)}
                            loading="eager"
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </PageContainer>
    );
}
