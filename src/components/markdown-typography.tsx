import { Typography, TypographyProps } from '@mui/material';
import ReactMarkdown from 'react-markdown';

// Define a type for the components prop
type ComponentsType = {
    [key: string]: React.ComponentType<any>;
};

// Create a wrapper component for Typography
const TypographyWrapper: React.FC<TypographyProps> = (props) => <Typography {...props} />;

export const MarkdownTypography: React.FC<{ children: string }> = ({ children }) => {
    const components: ComponentsType = {
        p: (props) => <TypographyWrapper {...props} />,
        h1: (props) => <TypographyWrapper variant="h1" {...props} />,
        h2: (props) => <TypographyWrapper variant="h2" {...props} />,
        h3: (props) => <TypographyWrapper variant="h3" {...props} />,
        h4: (props) => <TypographyWrapper variant="h4" {...props} />,
        h5: (props) => <TypographyWrapper variant="h5" {...props} />,
        h6: (props) => <TypographyWrapper variant="h6" {...props} />,
        li: (props) => <TypographyWrapper component="li" {...props} />,
        // Add more components as needed
    };

    return <ReactMarkdown components={components}>{children}</ReactMarkdown>;
};
