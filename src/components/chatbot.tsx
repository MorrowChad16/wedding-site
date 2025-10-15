import { useEffect, useRef, useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import {
    BRIDE_FIRST_NAME,
    BRIDE_LAST_NAME,
    BRIDE_PHONE_NUMBER,
    COUPLE_NAMES,
    GROOM_FIRST_NAME,
    GROOM_LAST_NAME,
    GROOM_PHONE_NUMBER,
    WEDDING_DATE,
} from '../utils/constants';
import { MarkdownTypography } from './markdown-typography';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import { useLocation } from 'react-router-dom';
import { LoadingDots } from './loading-dots';
import { StreamingText } from './streaming-text';
import { getVisibleScheduleItems } from '../api/use-schedule';
import { getVisibleFAQs } from '../api/use-faqs';
import { getTravelItems } from '../api/use-travel';
import { getRegistryItems } from '../api/use-registry';
import { useStore } from '../api/use-store';
import { getWeddingGuestsByEmail } from '../api/use-guests';

const getClient = () => generateClient<Schema>();

function generateScheduleString(scheduleItems: any[]): string {
    return scheduleItems
        .map((item) => {
            let itemString = `- ${item.title}`;

            if (item.startTime) {
                const startDate = new Date(item.startTime);
                itemString += `\n  Date: ${startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
                itemString += `\n  Time: ${startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;

                if (item.endTime) {
                    const endDate = new Date(item.endTime);
                    itemString += ` - ${endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
                }
            }

            if (item.locationName) {
                itemString += `\n  Location: ${item.locationName}`;
            }

            if (item.location) {
                itemString += `\n  Address: ${item.location}`;
            }

            if (item.description) {
                itemString += `\n  Description: ${item.description}`;
            }

            if (item.formality) {
                itemString += `\n  Dress Code: ${item.formality}`;
            }

            return itemString;
        })
        .join('\n\n');
}

function generateFaqString(faqItems: any[]): string {
    return faqItems
        .map((item) => {
            let faqString = `Q: ${item.question}\nA: ${item.answer}`;

            if (item.updatedAt) {
                const updatedDate = new Date(item.updatedAt);
                faqString += `\n   (Last updated: ${updatedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })})`;
            }

            return faqString;
        })
        .join('\n\n');
}

function generateTravelInfoString(travelItems: any[]): string {
    // Group items by category
    const categorizedItems: { [key: string]: any[] } = {};

    travelItems.forEach((item) => {
        const category = item.category || 'OTHER';
        if (!categorizedItems[category]) {
            categorizedItems[category] = [];
        }
        categorizedItems[category].push(item);
    });

    // Convert categories to readable titles
    const categoryTitles: { [key: string]: string } = {
        HOTEL: 'Hotels & Accommodations',
        AIRBNB: 'Airbnb',
        AIRPORT: 'Airport Information',
        TRANSPORTATION: 'Transportation',
        RESTAURANT: 'Restaurants',
        BAR: 'Bars & Nightlife',
        BREWERY: 'Breweries',
        PARK: 'Parks & Nature',
        GOLF: 'Golf',
        CEREMONY_VENUE: 'Ceremony Venues',
        OTHER: 'Other',
    };

    return Object.entries(categorizedItems)
        .map(([category, items]) => {
            const title = categoryTitles[category] || category;
            let sectionString = `${title}:\n`;

            sectionString += items
                .map((item) => {
                    let itemString = `- ${item.name}`;

                    if (item.address) {
                        itemString += `\n  Address: ${item.address}`;
                    }

                    if (item.phone) {
                        itemString += `\n  Phone: ${item.phone}`;
                    }

                    if (item.description) {
                        itemString += `\n  Description: ${item.description}`;
                    }

                    if (item.websiteUrl) {
                        itemString += `\n  Website: ${item.websiteUrl}`;
                    }

                    return itemString;
                })
                .join('\n\n');

            return sectionString;
        })
        .join('\n\n');
}

function generateGiftRegistryString(registryItems: any[]): string {
    // Group items by section
    const sectionedItems: { [key: string]: any[] } = {};

    registryItems.forEach((item) => {
        const section = item.section || 'OTHER';
        if (!sectionedItems[section]) {
            sectionedItems[section] = [];
        }
        sectionedItems[section].push(item);
    });

    // Convert sections to readable titles
    const sectionTitles: { [key: string]: string } = {
        FUNDS: 'Honeymoon Fund',
        REGISTRIES: 'Gift Registries',
        OTHER: 'Other Registry Items',
    };

    return Object.entries(sectionedItems)
        .map(([section, items]) => {
            const title = sectionTitles[section] || section;
            let sectionString = `${title}:\n`;

            sectionString += items
                .map((item) => {
                    let itemString = item.name ? `- ${item.name}` : '- Registry';

                    if (item.description) {
                        itemString += `\n  Description: ${item.description}`;
                    }

                    if (item.externalUrl) {
                        itemString += `\n  Registry URL: ${item.externalUrl}`;
                    }

                    if (item.targetAmount && item.currentAmount !== undefined) {
                        const progress = ((item.currentAmount / item.targetAmount) * 100).toFixed(
                            1
                        );
                        itemString += `\n  Progress: $${item.currentAmount} / $${item.targetAmount} (${progress}%)`;
                    } else if (item.targetAmount) {
                        itemString += `\n  Target Amount: $${item.targetAmount}`;
                    }

                    return itemString;
                })
                .join('\n\n');

            return sectionString;
        })
        .join('\n\n');
}

let WEDDING_CONTEXT = `
  You are an AI assistant for a wedding. Here are the key details about the wedding:
  
  - Couple: ${BRIDE_FIRST_NAME} ${BRIDE_LAST_NAME} and ${GROOM_FIRST_NAME} ${GROOM_LAST_NAME}

  - Date: ${WEDDING_DATE}

  - Contact for questions: 
    - Name: ${GROOM_FIRST_NAME} ${GROOM_LAST_NAME}
    - Number: ${GROOM_PHONE_NUMBER}
    - Name: ${BRIDE_FIRST_NAME} ${BRIDE_LAST_NAME}
    - Number: ${BRIDE_PHONE_NUMBER}
  
  Please answer any questions about the wedding based on this information. If you don't have the specific information requested, politely say so and suggest contacting the provided contact person for more details.
  Please feel free to add new lines and any styling updates necessary to help readers parse the information.
  If the guest asks non-Wedding questions, please let them know this can only be used for Wedding-related questions. When you let them know, always start the request with "I'm afraid", so I can track it.

  I'll also append on past conversation context, so you can rely on past information to help with any future questions.

  Past Questions and Responses:

  `;

type Message = {
    text: string;
    isUser: boolean;
    isStreaming?: boolean;
};

function ChatBot() {
    const theme = useTheme();
    const [openChatBot, setOpenChatBot] = useState(false);
    const [question, setQuestion] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();
    const { storeEmail } = useStore();
    const { guests } = getWeddingGuestsByEmail(storeEmail);

    // Fetch remote data
    const { scheduleItems } = getVisibleScheduleItems();
    const { faqs } = getVisibleFAQs();
    const { travelItems } = getTravelItems();
    const { registryItems } = getRegistryItems();

    // Generate strings from remote data
    const scheduleString = scheduleItems
        ? generateScheduleString(
              scheduleItems.filter(
                  (item) =>
                      item.isPrivate === false ||
                      item.isPrivate === guests?.some((guest: any) => guest.isBridalParty)
              )
          )
        : '';

    const faqString = faqs ? generateFaqString(faqs) : '';
    const travelInformation = travelItems ? generateTravelInfoString(travelItems) : '';
    const giftRegistryString = registryItems ? generateGiftRegistryString(registryItems) : '';

    const exampleQuestions = [
        'Where is the venue located?',
        'Will there be a shuttle service?',
        "What are the best things to do in Boise while I'm in town?",
    ] as const;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Ask LLM to respond
    const handleSend = () => {
        const text = question.trim();
        setMessages([...messages, { text, isUser: true }]);
        setQuestion('');
        const aggregatedMessages = messages.map((message) => message.text).join('\n');
        setIsLoading(true);

        // Build dynamic context with remote data
        const dynamicContext = `
        ${WEDDING_CONTEXT}

        ${
            scheduleString
                ? `- Schedule:
        ${scheduleString}`
                : ''
        }

        ${
            faqString
                ? `- Frequently Asked Questions:
        ${faqString}`
                : ''
        }

        ${
            travelInformation
                ? `- Travel Information:
        ${travelInformation}`
                : ''
        }

        ${
            giftRegistryString
                ? `- Gift Registry Information:
        ${giftRegistryString}`
                : ''
        }

        ${aggregatedMessages}`;

        getClient()
            .queries.askWeddingQuestion({
                context: dynamicContext,
                question: text,
            })
            .then((response) => {
                setIsLoading(false);
                // Add the new message with streaming flag
                setMessages((prev) => [
                    ...prev,
                    {
                        text: response.data!,
                        isUser: false,
                        isStreaming: true,
                    },
                ]);
            })
            .catch(() => {});
    };

    useEffect(scrollToBottom, [messages]);

    return (
        <div>
            {!location.pathname.includes('rsvp') && !location.pathname.includes('travel') && (
                <Fab
                    color="primary"
                    variant="extended"
                    onClick={() => setOpenChatBot(true)}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        zIndex: 1000,
                    }}
                >
                    Ask AI
                </Fab>
            )}

            <Dialog
                open={openChatBot}
                onClose={(_, reason: string) => {
                    if (reason === 'backdropClick') {
                        setOpenChatBot(false);
                    }
                }}
                sx={{
                    padding: isMobile ? undefined : '10%',
                }}
                PaperProps={{
                    style: { borderRadius: isMobile ? 0 : 10 },
                }}
                fullScreen
            >
                <DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenChatBot(false)}
                        style={{ position: 'absolute', top: '0', right: '0' }}
                    >
                        <CloseIcon />
                    </IconButton>
                    Ask AI
                </DialogTitle>
                <DialogContent
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        paddingLeft: '50px',
                        paddingRight: '50px',
                    }}
                >
                    {messages.length === 0 ? (
                        <div>
                            <Typography variant="h6" gutterBottom>
                                Hi!
                            </Typography>

                            <Typography variant="body2" paragraph>
                                I'm an AI assistant trained on {COUPLE_NAMES}'s wedding info.
                            </Typography>

                            <Typography variant="body2" paragraph paddingBottom={3}>
                                Ask me anything about the event or surrounding days.
                            </Typography>

                            <Typography variant="body2" color={'gray'} paragraph gutterBottom>
                                EXAMPLE QUESTIONS
                            </Typography>

                            <List sx={{ marginLeft: '5px' }}>
                                {exampleQuestions.map((question, index) => (
                                    <Paper
                                        key={index}
                                        elevation={5}
                                        sx={{ mb: 2, maxWidth: 'fit-content' }}
                                    >
                                        <ListItem key={index}>
                                            <ListItemText primary={question} />
                                        </ListItem>
                                    </Paper>
                                ))}
                            </List>
                        </div>
                    ) : (
                        <>
                            {messages.map((message, index) => (
                                <Paper
                                    key={index}
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        mb: 2,
                                        backgroundColor: message.isUser
                                            ? 'primary.light'
                                            : 'grey.200',
                                        maxWidth: '70%',
                                        ml: message.isUser ? 'auto' : 0,
                                        mr: message.isUser ? 0 : 'auto',
                                    }}
                                >
                                    {message.isUser || !message.isStreaming ? (
                                        <MarkdownTypography>{message.text}</MarkdownTypography>
                                    ) : (
                                        <StreamingText
                                            text={message.text}
                                            onComplete={() => {
                                                setMessages(
                                                    messages.map((msg, i) =>
                                                        i === index
                                                            ? { ...msg, isStreaming: false }
                                                            : msg
                                                    )
                                                );
                                            }}
                                        />
                                    )}
                                </Paper>
                            ))}
                            {isLoading && (
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        mb: 2,
                                        backgroundColor: 'grey.200',
                                        maxWidth: '70%',
                                        mr: 'auto',
                                    }}
                                >
                                    <LoadingDots />
                                </Paper>
                            )}
                        </>
                    )}
                    <div ref={messagesEndRef} />
                </DialogContent>
                <DialogActions
                    style={{
                        paddingLeft: '50px',
                        paddingRight: '50px',
                        marginBottom: 10,
                    }}
                >
                    <TextField
                        autoFocus
                        id="question"
                        placeholder="Where is the venue located?"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault(); // Prevents the default action (newline) on Enter
                                handleSend();
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={() => handleSend()} edge="end">
                                    <SendRoundedIcon color="primary" />
                                </IconButton>
                            ),
                        }}
                    />
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ChatBot;
