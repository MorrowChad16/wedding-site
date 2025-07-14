import { useState } from 'react';
import { QuestionAnswerBox } from '../components/question-box';
import PageContainer from '../components/page-container';
import {
    Box,
    CircularProgress,
    Typography,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControlLabel,
    Switch,
    Snackbar,
    Accordion,
    AccordionSummary,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { getVisibleFAQs, createFAQ } from '../api/use-faqs';
import { useQueryClient } from '@tanstack/react-query';
import type { Schema } from '../../amplify/data/resource';

type FAQType = Schema['FrequentlyAskedQuestions']['type'];

export default function FAQ(): JSX.Element {
    const [expandedPanels, setExpandedPanels] = useState<string[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const { isLoading, error, faqs } = getVisibleFAQs();
    const queryClient = useQueryClient();
    const theme = useTheme();

    const handlePanelChange = (panelId: string) => {
        setExpandedPanels((prevPanels) => {
            if (prevPanels.includes(panelId)) {
                return prevPanels.filter((id) => id !== panelId);
            } else {
                return [...prevPanels, panelId];
            }
        });
    };

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setNewQuestion('');
        setNewAnswer('');
        setIsVisible(true);
    };

    const handleSubmit = async () => {
        if (!newQuestion.trim() || !newAnswer.trim()) {
            setSnackbarMessage('Please fill in both question and answer fields');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        setSubmitting(true);
        try {
            await createFAQ(newQuestion.trim(), newAnswer.trim(), isVisible);

            // Refetch the FAQs to update the list
            queryClient.invalidateQueries({ queryKey: ['getVisibleFAQs'] });
            queryClient.invalidateQueries({ queryKey: ['getAllFAQs'] });

            setSnackbarMessage('FAQ added successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleDialogClose();
        } catch (error) {
            console.error('Error creating FAQ:', error);
            setSnackbarMessage('Failed to add FAQ. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    if (isLoading) {
        return (
            <PageContainer>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <Box margin="0 auto" width={{ xs: '100%', sm: '100%', md: '80%', lg: '80%' }}>
                    <Alert severity="error">Error loading FAQs. Please try again later.</Alert>
                </Box>
            </PageContainer>
        );
    }

    if (!faqs || faqs.length === 0) {
        return (
            <PageContainer>
                <Box margin="0 auto" width={{ xs: '100%', sm: '100%', md: '80%', lg: '80%' }}>
                    <Typography variant="h6" textAlign="center" color="text.secondary">
                        No FAQs available at this time.
                    </Typography>
                </Box>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <>
                <Box margin="0 auto" width={{ xs: '100%', sm: '100%', md: '80%', lg: '80%' }}>
                    {faqs
                        .filter((item: FAQType) => item.isVisible === true)
                        .map((item: FAQType) => (
                            <QuestionAnswerBox
                                key={item.id}
                                question={item.question}
                                answer={item.answer}
                                expanded={expandedPanels.includes(item.id)}
                                handleChange={() => handlePanelChange(item.id)}
                                lastUpdated={item.updatedAt ? new Date(item.updatedAt) : undefined}
                            />
                        ))}

                    {/* Add FAQ Button styled as QuestionAnswerBox */}
                    <Box mb={2}>
                        <Accordion
                            onClick={handleDialogOpen}
                            sx={{
                                border: `2px dashed ${theme.palette.primary.main}`,
                                backgroundColor: 'transparent',
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover,
                                },
                                '&::before': {
                                    display: 'none',
                                },
                            }}
                        >
                            <AccordionSummary
                                sx={{
                                    '& .MuiAccordionSummary-expandIconWrapper': {
                                        display: 'none',
                                    },
                                }}
                            >
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    width="100%"
                                    py={2}
                                >
                                    <AddIcon
                                        sx={{
                                            color: theme.palette.primary.main,
                                            mr: 1,
                                        }}
                                    />
                                    <Typography variant="h6" color="primary" textAlign="center">
                                        Click to add a new FAQ
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                        </Accordion>
                    </Box>
                </Box>

                {/* Add FAQ Dialog */}
                <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
                    <DialogTitle>Add New FAQ</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Question"
                            fullWidth
                            variant="outlined"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            label="Answer"
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isVisible}
                                    onChange={(e) => setIsVisible(e.target.checked)}
                                />
                            }
                            label="Visible to users"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Cancel</Button>
                        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
                            {submitting ? 'Adding...' : 'Add FAQ'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar for notifications */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={handleSnackbarClose}
                        severity={snackbarSeverity}
                        sx={{ width: '100%' }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </>
        </PageContainer>
    );
}
