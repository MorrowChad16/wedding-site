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
import { COUPLE_NAMES, WEDDING_DATE } from '../utils/constants';
import { TRAVEL_SECTIONS } from '../pages/Travel';
// import { REGISTRY_SECTIONS } from '../pages/Registry';
import { MarkdownTypography } from './markdown-typography';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import { useLocation } from 'react-router-dom';
import { LoadingDots } from './loading-dots';
import { StreamingText } from './streaming-text';

const getClient = () => generateClient<Schema>();

// function generateScheduleString(scheduleItems: typeof SCHEDULE_ITEMS): string {
//     return scheduleItems
//         .map((item) => {
//             let itemString = `- ${item.title}`;

//             if (item.startTime) {
//                 const startDate = new Date(item.startTime);
//                 itemString += `\n  Date: ${startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
//                 itemString += `\n  Time: ${startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;

//                 if (item.endTime) {
//                     const endDate = new Date(item.endTime);
//                     itemString += ` - ${endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
//                 }
//             }

//             if (item.locationName) {
//                 itemString += `\n  Location: ${item.locationName}`;
//             }

//             if (item.location) {
//                 itemString += `\n  Address: ${item.location}`;
//             }

//             if (item.description) {
//                 itemString += `\n  Description: ${item.description}`;
//             }

//             if (item.formality) {
//                 itemString += `\n  Dress Code: ${item.formality}`;
//             }

//             return itemString;
//         })
//         .join('\n\n');
// }

// TODO: update to retrieve all FAQs
// function generateFaqString(faqItems: typeof FAQ_ITEMS): string {
//     return faqItems
//         .map((item) => {
//             let faqString = `Q: ${item.question}\nA: ${item.answer}`;

//             if (item.lastUpdated) {
//                 faqString += `\n   (Last updated: ${item.lastUpdated.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })})`;
//             }

//             return faqString;
//         })
//         .join('\n\n');
// }

function generateTravelInfoString(sections: typeof TRAVEL_SECTIONS): string {
    return sections
        .map((section) => {
            let sectionString = `${section.title}:\n`;

            sectionString += section.info
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

// function generateGiftRegistryString(sections: typeof REGISTRY_SECTIONS): string {
//     return sections
//         .map((section) => {
//             let sectionString = `${section.title}:\n`;

//             sectionString += section.info
//                 .map((item) => {
//                     let itemString = item.name ? `- ${item.name}` : '- Registry';

//                     if (item.description) {
//                         itemString += `\n  Description: ${item.description}`;
//                     }

//                     if (item.externalUrl) {
//                         itemString += `\n  Registry URL: ${item.externalUrl}`;
//                     }

//                     return itemString;
//                 })
//                 .join('\n\n');

//             return sectionString;
//         })
//         .join('\n\n');
// }

// const faqString = generateFaqString(FAQ_ITEMS);
const travelInformation = generateTravelInfoString(TRAVEL_SECTIONS);
// const giftRegistryString = generateGiftRegistryString(REGISTRY_SECTIONS);

//   - Frequently Asked Questions:
//   ${faqString}
// Gift Registry Information:
//  ${giftRegistryString}
let WEDDING_CONTEXT = `
  You are an AI assistant for a wedding. Here are the key details about the wedding:
  
  - Couple: Alyssa Ealy and Jace Warkentien

  - Date: ${WEDDING_DATE}

  - Travel Information: 
  ${travelInformation}

  - Contact for questions: 
    - Name: Jace Warkentien
    - Number: 815-289-1606
  
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
    // const { storeEmail } = useStore();
    // const { guests } = getWeddingGuestsByEmail(storeEmail);

    // TODO: retrieve dynamically
    // const scheduleString = generateScheduleString(
    //     SCHEDULE_ITEMS.filter(
    //         (item) =>
    //             item.isPrivate === false ||
    //             item.isPrivate === guests?.some((guest: any) => guest.isBridalParty)
    //     )
    // );

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

        // - Schedule:
        // ${scheduleString}
        getClient()
            .queries.askWeddingQuestion({
                context: `
                ${WEDDING_CONTEXT} 

                ${aggregatedMessages}`,
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
