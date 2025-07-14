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
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { getVisibleFAQs, getAllFAQs, createFAQ, updateFAQ, deleteFAQ } from '../api/use-faqs';
import { useQueryClient } from '@tanstack/react-query';
import { useStore } from '../api/use-store';
import type { Schema } from '../../amplify/data/resource';

type FAQType = Schema['FrequentlyAskedQuestions']['type'];

export default function FAQ(): JSX.Element {
    const [expandedPanels, setExpandedPanels] = useState<string[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const [editingFAQ, setEditingFAQ] = useState<FAQType | null>(null);
    const [deletingFAQ, setDeletingFAQ] = useState<FAQType | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const { isAdmin } = useStore();
    const { isLoading, error, faqs } = isAdmin ? getAllFAQs() : getVisibleFAQs();
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

    const handleToggleVisibility = async (faq: FAQType) => {
        setSubmitting(true);
        try {
            await updateFAQ(faq.id, faq.question, faq.answer, !faq.isVisible);

            // Refetch the FAQs to update the list
            queryClient.invalidateQueries({ queryKey: ['getVisibleFAQs'] });
            queryClient.invalidateQueries({ queryKey: ['getAllFAQs'] });

            setSnackbarMessage(`FAQ ${!faq.isVisible ? 'made visible' : 'hidden'} successfully!`);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error updating FAQ visibility:', error);
            setSnackbarMessage('Failed to update FAQ visibility. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditFAQ = (faq: FAQType) => {
        setEditingFAQ(faq);
        setNewQuestion(faq.question);
        setNewAnswer(faq.answer);
        setIsVisible(faq.isVisible ?? true);
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        setEditingFAQ(null);
        setNewQuestion('');
        setNewAnswer('');
        setIsVisible(true);
    };

    const handleEditSubmit = async () => {
        if (!editingFAQ || !newQuestion.trim() || !newAnswer.trim()) {
            setSnackbarMessage('Please fill in both question and answer fields');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        setSubmitting(true);
        try {
            await updateFAQ(editingFAQ.id, newQuestion.trim(), newAnswer.trim(), isVisible);

            // Refetch the FAQs to update the list
            queryClient.invalidateQueries({ queryKey: ['getVisibleFAQs'] });
            queryClient.invalidateQueries({ queryKey: ['getAllFAQs'] });

            setSnackbarMessage('FAQ updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleEditDialogClose();
        } catch (error) {
            console.error('Error updating FAQ:', error);
            setSnackbarMessage('Failed to update FAQ. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteFAQ = (faq: FAQType) => {
        setDeletingFAQ(faq);
        setDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setDeletingFAQ(null);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingFAQ) return;

        setSubmitting(true);
        try {
            await deleteFAQ(deletingFAQ.id);

            // Refetch the FAQs to update the list
            queryClient.invalidateQueries({ queryKey: ['getVisibleFAQs'] });
            queryClient.invalidateQueries({ queryKey: ['getAllFAQs'] });

            setSnackbarMessage('FAQ deleted successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleDeleteDialogClose();
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            setSnackbarMessage('Failed to delete FAQ. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setSubmitting(false);
        }
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

    if ((!faqs || faqs.length === 0) && !isAdmin) {
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
                    {(faqs || [])
                        .filter((item: FAQType) => isAdmin || item.isVisible === true)
                        .map((item: FAQType) => (
                            <Box key={item.id} position="relative">
                                <QuestionAnswerBox
                                    question={item.question}
                                    answer={item.answer}
                                    expanded={expandedPanels.includes(item.id)}
                                    handleChange={() => handlePanelChange(item.id)}
                                    lastUpdated={
                                        item.updatedAt ? new Date(item.updatedAt) : undefined
                                    }
                                />
                                {/* Admin controls */}
                                {isAdmin && (
                                    <Box
                                        position="absolute"
                                        top={8}
                                        right={8}
                                        display="flex"
                                        gap={1}
                                        sx={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            borderRadius: 1,
                                            padding: 0.5,
                                        }}
                                    >
                                        <Button
                                            size="small"
                                            startIcon={
                                                item.isVisible ? (
                                                    <VisibilityIcon />
                                                ) : (
                                                    <VisibilityOffIcon />
                                                )
                                            }
                                            onClick={() => handleToggleVisibility(item)}
                                            color={item.isVisible ? 'success' : 'warning'}
                                            variant="outlined"
                                            sx={{ minWidth: 'auto', px: 1 }}
                                        >
                                            {item.isVisible ? 'Visible' : 'Hidden'}
                                        </Button>
                                        <Button
                                            size="small"
                                            startIcon={<EditIcon />}
                                            onClick={() => handleEditFAQ(item)}
                                            color="primary"
                                            variant="outlined"
                                            sx={{ minWidth: 'auto', px: 1 }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="small"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDeleteFAQ(item)}
                                            color="error"
                                            variant="outlined"
                                            sx={{ minWidth: 'auto', px: 1 }}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        ))}

                    {/* Add FAQ Button styled as QuestionAnswerBox - Only visible to admins */}
                    {isAdmin && (
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
                    )}
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

                {/* Edit FAQ Dialog */}
                <Dialog
                    open={editDialogOpen}
                    onClose={handleEditDialogClose}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Edit FAQ</DialogTitle>
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
                        <Button onClick={handleEditDialogClose}>Cancel</Button>
                        <Button
                            onClick={handleEditSubmit}
                            variant="contained"
                            disabled={submitting}
                        >
                            {submitting ? 'Updating...' : 'Update FAQ'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete FAQ Confirmation Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={handleDeleteDialogClose}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Delete FAQ</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to delete this FAQ?</Typography>
                        {deletingFAQ && (
                            <Box mt={2} p={2} sx={{ backgroundColor: 'grey.100', borderRadius: 1 }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    Question: {deletingFAQ.question}
                                </Typography>
                                <Typography variant="body2" mt={1}>
                                    Answer: {deletingFAQ.answer}
                                </Typography>
                            </Box>
                        )}
                        <Typography color="error" variant="body2" mt={2}>
                            This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                        <Button
                            onClick={handleDeleteConfirm}
                            color="error"
                            variant="contained"
                            disabled={submitting}
                        >
                            {submitting ? 'Deleting...' : 'Delete FAQ'}
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
