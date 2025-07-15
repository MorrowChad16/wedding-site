import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    LinearProgress,
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
import honeymoon from '../assets/images/registry/honeymoon.webp';
import barAcuda from '../assets/images/registry/barAcuda.webp';
import helicopter from '../assets/images/registry/helicopter.webp';
import kayak from '../assets/images/registry/kayak.webp';
import laua from '../assets/images/registry/laua.webp';
import massage from '../assets/images/registry/massage.webp';
import wellings from '../assets/images/registry/wellings.webp';
import { useRef, useState } from 'react';

interface GiftInfo {
    name?: string;
    image: string;
    description?: string;
    externalUrl?: string;
    currentAmount?: number;
    targetAmount?: number;
}

interface GiftSection {
    title: string;
    info: GiftInfo[];
}

const funds: GiftInfo[] = [
    {
        name: 'Honeymoon - General',
        description: 'Help us create unforgettable memories in Kauai.',
        image: honeymoon,
    },
    {
        name: 'Helicopter Ride',
        description: "On our honeymoon we'll be taking a helicopter ride along the Nā Pali coast.",
        image: helicopter,
        currentAmount: 100,
        targetAmount: 600,
    },
    {
        name: 'River Kayak Tour',
        description: "We'll be exploring the hidden interior by kayak during our honeymoon.",
        image: kayak,
        currentAmount: 0,
        targetAmount: 200,
    },
    {
        name: 'Bar Acuda Dinner',
        description: 'Help us enjoy a romantic beachfront dinner at Bar Acuda.',
        image: barAcuda,
        currentAmount: 0,
        targetAmount: 200,
    },
    {
        name: "Welling's dinner",
        description: "We'll be celebrating with a special dinner at Welling's restaurant.",
        image: wellings,
        currentAmount: 0,
        targetAmount: 200,
    },
    {
        name: 'Luau',
        description: "On our honeymoon we'll experience a traditional Hawaiian luau feast.",
        image: laua,
        currentAmount: 200,
        targetAmount: 200,
    },
    {
        name: 'Couples Massage',
        description: "We'll be unwinding together with a relaxing couples massage at a spa.",
        image: massage,
        currentAmount: 0,
        targetAmount: 300,
    },
];

const registries: GiftInfo[] = [
    {
        image: amazon,
        externalUrl: 'https://www.amazon.com/wedding/registry/35XXOW64VSOEL',
    },
];

export const REGISTRY_SECTIONS: GiftSection[] = [
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
                {REGISTRY_SECTIONS.map((section, index) => {
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
                                            {/* Title Section */}
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

                                            {/* Image Section */}
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

                                            {/* Description Section */}
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

                                            {/* Progress Bar Section */}
                                            {item.targetAmount && (
                                                <Box mb={2}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={Math.min(
                                                            ((item.currentAmount || 0) /
                                                                item.targetAmount) *
                                                                100,
                                                            100
                                                        )}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 4,
                                                            backgroundColor:
                                                                theme.palette.grey[200],
                                                            '& .MuiLinearProgress-bar': {
                                                                borderRadius: 4,
                                                                backgroundColor:
                                                                    theme.palette.primary.main,
                                                            },
                                                        }}
                                                    />
                                                    <Box
                                                        display="flex"
                                                        justifyContent="center"
                                                        mt={1}
                                                    >
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            {Math.round(
                                                                ((item.currentAmount || 0) /
                                                                    item.targetAmount) *
                                                                    100
                                                            )}
                                                            % funded
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            )}

                                            {/* Button Section */}
                                            {item.externalUrl ? (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    aria-label="website-link"
                                                    onClick={() =>
                                                        openInNewWindow(item.externalUrl!)
                                                    }
                                                    sx={{
                                                        display: 'block',
                                                        m: '0 auto',
                                                    }}
                                                >
                                                    View
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
                                                                TODO
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
