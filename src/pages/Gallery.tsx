import PageContainer from '../components/PageContainer';
import { ImageList, ImageListItem, styled, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';

// Define the type for our image module
interface ImageModule {
    default: string;
  }
  
// Use import.meta.glob to import all images
const imageModules = import.meta.glob<ImageModule>('../assets/images/display/*.(png|jpg|jpeg|svg)', { eager: true });

// Convert the modules object into an array of image objects
const images = Object.entries(imageModules).map(([path, module]) => ({
    src: module.default,
    title: path.split('/').pop()?.replace(/\.(png|jpe?g|svg)$/, '') || '',
}));

const StyledImageListItem = styled(ImageListItem)({
    overflow: 'hidden',
    borderRadius: '10px',
    '& img': {
        width: '100%',
        height: 'auto',
        display: 'block',
        // aspectRatio: '1 / 1',
        objectFit: 'cover',
        transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
    },
  });

// Styled component for the image
const AnimatedImg = styled('img')({
    transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
    '&.loading': {
      opacity: 0,
      transform: 'scale(0.8)',
    },
    '&.loaded': {
      opacity: 1,
      transform: 'scale(1)',
    },
  });

export default function Gallery() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const cols = isSmallScreen ? 1 : isMediumScreen ? 2 : isLargeScreen ? 3 : 4;
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

    const handleImageLoad = (src: string) => {
        setLoadedImages(prev => new Set(prev).add(src));
    };

    return (
        <PageContainer>
            <ImageList variant="masonry" cols={cols} gap={8}>
                {Object.values(images).map((item) => (
                    <StyledImageListItem key={item.src}>
                        <AnimatedImg
                            srcSet={`${item.src}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            src={`${item.src}?w=248&fit=crop&auto=format`}
                            alt={item.title}
                            loading="lazy"
                            className={loadedImages.has(item.src) ? 'loaded' : 'loading'}
                            onLoad={() => handleImageLoad(item.src)}
                        />
                    </StyledImageListItem>
                ))}
            </ImageList>
        </PageContainer>
    );
}
