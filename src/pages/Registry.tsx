import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
    useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PageContainer from '../components/page-container';
import HorizontalScroll from '../components/horizontal-scroll';
import { openInNewWindow } from '../utils/utilities';
import amazon from '../assets/images/registry/amazon.webp';
import createandbarrel from '../assets/images/registry/crateandbarrel.webp';
import etsy from '../assets/images/registry/etsy.webp';
import rough_linen from '../assets/images/registry/rough_linen.webp';
import honeymoon from '../assets/images/registry/honeymoon.webp';
import { useRef, useState } from 'react';

interface GiftInfo {
    name?: string;
    image: string;
    description?: string;
    registryUrl?: string;
}

interface GiftSection {
    title: string;
    info: GiftInfo[];
}

const funds: GiftInfo[] = [
    {
        name: 'Honeymoon',
        description: 'Please contribute what you wish',
        image: honeymoon,
    },
];

const registries: GiftInfo[] = [
    {
        image: amazon,
        registryUrl: 'https://www.amazon.com/wedding/registry/35XXOW64VSOEL',
    },
    {
        image: createandbarrel,
        registryUrl: 'https://www.crateandbarrel.com/gift-registry/chad-morrow/r7160605',
    },
    {
        image: etsy,
        registryUrl: 'https://www.etsy.com/registry/MTM4NDQ4MTE1fDIwMjI1MzYwNA',
    },
    {
        image: rough_linen,
        registryUrl: 'https://www.roughlinen.com/apps/giftregistry/registry/338732',
    },
];

const sections: GiftSection[] = [
    {
        title: 'Funds',
        info: funds,
    },
    {
        title: 'Registries',
        info: registries,
    },
];

export default function Registry() {
    const theme = useTheme();
    const [openFundContribution, setOpenFundContribution] = useState<boolean>(false);
    const selectedItem = useRef<GiftInfo>();
    const onClose = () => setOpenFundContribution(false);

    return (
        <PageContainer>
            <div>
                {sections.map((section, index) => {
                    return (
                        <div>
                            <Typography variant="h3" mt={index === 0 ? 0 : 5}>
                                {section.title}
                            </Typography>
                            <HorizontalScroll>
                                {section.info.map((item, index) => (
                                    <Paper
                                        key={item.name}
                                        elevation={4}
                                        sx={{
                                            border: `1px solid ${theme.palette.primary.main}`,
                                            borderRadius: '10px',
                                            mr: index === section.info.length - 1 ? '0px' : '24px',
                                            width: '250px',
                                            minWidth: '250px',
                                        }}
                                    >
                                        <Box p={2}>
                                            {item.name && (
                                                <Typography
                                                    variant="h5"
                                                    gutterBottom
                                                    mb={2}
                                                    textAlign={'center'}
                                                >
                                                    {item.name}
                                                </Typography>
                                            )}
                                            <Box display="flex" justifyContent="center" mb={2}>
                                                <img
                                                    src={item.image}
                                                    alt={`travel-${index}`}
                                                    style={{
                                                        width: '100%',
                                                        height: '150px',
                                                        objectFit: 'cover',
                                                        objectPosition: 'center',
                                                        borderRadius: '10px',
                                                    }}
                                                />
                                            </Box>
                                            {item.description && (
                                                <Typography
                                                    variant="body2"
                                                    textAlign={'center'}
                                                    mb={2}
                                                    whiteSpace={'normal'}
                                                >
                                                    {item.description}
                                                </Typography>
                                            )}
                                            {item.registryUrl ? (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    aria-label="website-link"
                                                    onClick={() =>
                                                        openInNewWindow(item.registryUrl!)
                                                    }
                                                    sx={{
                                                        display: 'block',
                                                        m: '0 auto',
                                                    }}
                                                >
                                                    View Registry
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => {
                                                        selectedItem.current = item;
                                                        setOpenFundContribution(true);
                                                    }}
                                                    sx={{
                                                        display: 'block',
                                                        m: '0 auto',
                                                    }}
                                                >
                                                    Contribute
                                                </Button>
                                            )}
                                        </Box>
                                    </Paper>
                                ))}
                            </HorizontalScroll>

                            <Dialog open={openFundContribution} onClose={onClose}>
                                <DialogTitle>
                                    Contribute
                                    <IconButton
                                        aria-label="close"
                                        onClick={onClose}
                                        sx={{
                                            position: 'absolute',
                                            right: 8,
                                            top: 8,
                                            color: (theme) => theme.palette.grey[500],
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText mb={2}>
                                        You have a few options to help fund our{' '}
                                        {selectedItem.current?.name} fund:
                                        <List dense>
                                            <ListItem>
                                                <ListItemText
                                                    primary={
                                                        <Typography component="span">
                                                            Venmo:{' '}
                                                            <Typography
                                                                component="span"
                                                                fontWeight="bold"
                                                            >
                                                                Chad-Morrow-6
                                                            </Typography>
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText
                                                    primary={
                                                        <Typography component="span">
                                                            Zelle:{' '}
                                                            <Typography
                                                                component="span"
                                                                fontWeight="bold"
                                                            >
                                                                815-708-4489
                                                            </Typography>
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText
                                                    primary={
                                                        <Typography component="span">
                                                            Cash:{' '}
                                                            <Typography
                                                                component="span"
                                                                fontWeight="bold"
                                                            >
                                                                we'll have a table setup at the
                                                                wedding ceremony to accept any gifts
                                                                in person.
                                                            </Typography>
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        </List>{' '}
                                        If you go with Venmo or Zelle, please put "
                                        {selectedItem.current?.name}" in the description.
                                    </DialogContentText>
                                </DialogContent>
                            </Dialog>
                        </div>
                    );
                })}
            </div>
        </PageContainer>
    );
}
