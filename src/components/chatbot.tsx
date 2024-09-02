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
import { SCHEDULE_ITEMS } from '../pages/Schedule';
import { FAQ_ITEMS } from '../pages/FAQ';
import { TRAVEL_SECTIONS } from '../pages/Travel';
import { REGISTRY_SECTIONS } from '../pages/Registry';
import { MarkdownTypography } from './markdown-typography';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';

const getClient = () => generateClient<Schema>();

// Local testing only
// const anthropic = new Anthropic({
//     apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
//     dangerouslyAllowBrowser: true,
// });

function generateScheduleString(scheduleItems: typeof SCHEDULE_ITEMS): string {
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

function generateFaqString(faqItems: typeof FAQ_ITEMS): string {
    return faqItems
        .map((item) => {
            let faqString = `Q: ${item.question}\nA: ${item.answer}`;

            if (item.lastUpdated) {
                faqString += `\n   (Last updated: ${item.lastUpdated.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })})`;
            }

            return faqString;
        })
        .join('\n\n');
}

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

function generateGiftRegistryString(sections: typeof REGISTRY_SECTIONS): string {
    return sections
        .map((section) => {
            let sectionString = `${section.title}:\n`;

            sectionString += section.info
                .map((item) => {
                    let itemString = item.name ? `- ${item.name}` : '- Registry';

                    if (item.description) {
                        itemString += `\n  Description: ${item.description}`;
                    }

                    if (item.registryUrl) {
                        itemString += `\n  Registry URL: ${item.registryUrl}`;
                    }

                    return itemString;
                })
                .join('\n\n');

            return sectionString;
        })
        .join('\n\n');
}

const scheduleString = generateScheduleString(SCHEDULE_ITEMS);
const faqString = generateFaqString(FAQ_ITEMS);
const travelInformation = generateTravelInfoString(TRAVEL_SECTIONS);
const giftRegistryString = generateGiftRegistryString(REGISTRY_SECTIONS);

const WEDDING_CONTEXT = `
  You are an AI assistant for a wedding. Here are the key details about the wedding:
  
  - Couple: ${COUPLE_NAMES}

  - Date: ${WEDDING_DATE}

  - Schedule: 
  ${scheduleString}

  - Frequently Asked Questions: 
  ${faqString}

  - Travel Information: 
  ${travelInformation}

  Gift Registry Information:
  ${giftRegistryString}

  - Contact for questions: 
    - Name: Chad
    - Number: 815-708-4489
    - Email: morrowchad1@protonmail.com
  
  Please answer any questions about the wedding based on this information. If you don't have the specific information requested, politely say so and suggest contacting the provided contact person for more details.
  Please feel free to add new lines and any styling updates necessary to help readers parse the information.
  If the guest asks non-Wedding questions, please let them know this can only be used for Wedding-related questions. When you let them know, always start the request with "I'm afraid", so I can track it.
  `;

// Local testing only
// async function askWeddingQuestion(question: string): Promise<string> {
//     try {
//         const msg = await anthropic.messages.create({
//             model: 'claude-3-sonnet-20240229', // claude-3-5-sonnet-20240620
//             max_tokens: 300,
//             temperature: 0.5,
//             system: WEDDING_CONTEXT,
//             messages: [
//                 {
//                     role: 'user',
//                     content: [
//                         {
//                             type: 'text',
//                             text: question,
//                         },
//                     ],
//                 },
//             ],
//         });

//         return (msg.content[0] as TextBlock).text;
//     } catch (error) {
//         console.error('Error calling Anthropic API: ', error);
//         return "I'm sorry, I encountered an error while processing your question. Please try again later or contact the wedding organizer for assistance.";
//     }
// }

interface Message {
    text: string;
    isUser: boolean;
}

function ChatBot() {
    const theme = useTheme();
    const [openChatBot, setOpenChatBot] = useState(false);
    const [question, setQuestion] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

        getClient()
            .queries.askWeddingQuestion({
                context: WEDDING_CONTEXT,
                question: text,
            })
            .then((response) => {
                console.log(response);
                setMessages((prev) => [...prev, { text: response.data!, isUser: false }]);
            })
            .catch(() => {});

        // Local testing only
        // // Ask LLM to respond
        // askWeddingQuestion(text)
        //     .then((response) => {
        //         console.log(response);
        //         setMessages((prev) => [...prev, { text: response, isUser: false }]);
        //     })
        //     .catch(() => {});
    };

    useEffect(scrollToBottom, [messages]);

    return (
        <div>
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
                    style: { borderRadius: 10 },
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
                        messages.map((message, index) => (
                            <Paper
                                key={index}
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    backgroundColor: message.isUser ? 'primary.light' : 'grey.200',
                                    maxWidth: '70%',
                                    ml: message.isUser ? 'auto' : 0,
                                    mr: message.isUser ? 0 : 'auto',
                                }}
                            >
                                <MarkdownTypography>{message.text}</MarkdownTypography>
                            </Paper>
                        ))
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
