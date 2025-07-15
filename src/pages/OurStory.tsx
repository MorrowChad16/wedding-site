import { useState } from 'react';
import PageContainer from '../components/page-container';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent,
} from '@mui/lab';
import {
    Box,
    Card,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Snackbar,
    Typography,
    IconButton,
    MenuItem,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { FileUploader, StorageImage } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { getStoryItems, createStoryItem, updateStoryItem, deleteStoryItem } from '../api/use-story';
import { useQueryClient } from '@tanstack/react-query';
import { useStore } from '../api/use-store';
import type { Schema } from '../../amplify/data/resource';

type StoryItemType = Schema['StoryItems']['type'];

export default function OurStory() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newBody, setNewBody] = useState('');
    const [newMonth, setNewMonth] = useState(1);
    const [newYear, setNewYear] = useState(new Date().getFullYear());
    const [newPicture, setNewPicture] = useState('');
    const [editingStory, setEditingStory] = useState<StoryItemType | null>(null);
    const [deletingStory, setDeletingStory] = useState<StoryItemType | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const { isAdmin } = useStore();
    const { isLoading, error, storyItems } = getStoryItems();
    const queryClient = useQueryClient();
    const theme = useTheme();

    const months = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' },
    ];

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setNewTitle('');
        setNewBody('');
        setNewMonth(1);
        setNewYear(new Date().getFullYear());
        setNewPicture('');
    };

    const handleSubmit = async () => {
        if (!newTitle.trim() || !newBody.trim() || !newPicture.trim()) {
            setSnackbarMessage('Please fill in all required fields');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        setSubmitting(true);
        try {
            await createStoryItem(
                newTitle.trim(),
                newBody.trim(),
                newMonth,
                newYear,
                newPicture.trim()
            );

            // Refetch the story items to update the list
            queryClient.invalidateQueries({ queryKey: ['getStoryItems'] });

            setSnackbarMessage('Story item added successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleDialogClose();
        } catch (error) {
            console.error('Error creating story item:', error);
            setSnackbarMessage('Failed to add story item. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleEditStory = (story: StoryItemType) => {
        setEditingStory(story);
        setNewTitle(story.title);
        setNewBody(story.body);
        setNewMonth(story.month);
        setNewYear(story.year);
        setNewPicture(story.picture);
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        setEditingStory(null);
        setNewTitle('');
        setNewBody('');
        setNewMonth(1);
        setNewYear(new Date().getFullYear());
        setNewPicture('');
    };

    const handleEditSubmit = async () => {
        if (!editingStory || !newTitle.trim() || !newBody.trim() || !newPicture.trim()) {
            setSnackbarMessage('Please fill in all required fields');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        setSubmitting(true);
        try {
            await updateStoryItem(
                editingStory.id,
                newTitle.trim(),
                newBody.trim(),
                newMonth,
                newYear,
                newPicture.trim()
            );

            // Refetch the story items to update the list
            queryClient.invalidateQueries({ queryKey: ['getStoryItems'] });

            setSnackbarMessage('Story item updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleEditDialogClose();
        } catch (error) {
            console.error('Error updating story item:', error);
            setSnackbarMessage('Failed to update story item. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteStory = (story: StoryItemType) => {
        setDeletingStory(story);
        setDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setDeletingStory(null);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingStory) return;

        setSubmitting(true);
        try {
            await deleteStoryItem(deletingStory.id);

            // Refetch the story items to update the list
            queryClient.invalidateQueries({ queryKey: ['getStoryItems'] });

            setSnackbarMessage('Story item deleted successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleDeleteDialogClose();
        } catch (error) {
            console.error('Error deleting story item:', error);
            setSnackbarMessage('Failed to delete story item. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <PageContainer>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                    <CircularProgress />
                </Box>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <Box m={'0 auto'} width={{ xs: '100%', sm: '100%', md: '60%', lg: '60%' }}>
                    <Alert severity="error">
                        Failed to load story items. Please try again later.
                    </Alert>
                </Box>
            </PageContainer>
        );
    }

    if ((!storyItems || storyItems.length === 0) && !isAdmin) {
        return (
            <PageContainer>
                <Box m={'0 auto'} width={{ xs: '100%', sm: '100%', md: '60%', lg: '60%' }}>
                    <Alert severity="info">No story items available at the moment.</Alert>
                </Box>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <>
                <Box m={'0 auto'} width={{ xs: '100%', sm: '100%', md: '60%', lg: '60%' }}>
                    <Timeline position="alternate">
                        {/* Add Story Item - Only visible to admins */}
                        {isAdmin && (
                            <TimelineItem>
                                <TimelineOppositeContent>
                                    <Card
                                        onClick={handleDialogOpen}
                                        sx={{
                                            border: `2px dashed ${theme.palette.primary.main}`,
                                            backgroundColor: 'transparent',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minHeight: 200,
                                            '&:hover': {
                                                backgroundColor: theme.palette.action.hover,
                                            },
                                        }}
                                    >
                                        <Box textAlign="center">
                                            <AddIcon
                                                sx={{
                                                    color: theme.palette.primary.main,
                                                    fontSize: 48,
                                                    mb: 1,
                                                }}
                                            />
                                            <Typography variant="h6" color="primary">
                                                Add New Story
                                            </Typography>
                                        </Box>
                                    </Card>
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot color="primary" />
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent fontSize={{ xs: 12, md: 16 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Click to add a new chapter to your story
                                    </Typography>
                                </TimelineContent>
                            </TimelineItem>
                        )}

                        {(storyItems || []).map((story) => (
                            <TimelineItem key={story.id}>
                                <TimelineOppositeContent>
                                    <Box position="relative">
                                        <Card>
                                            <StorageImage
                                                alt={story.title}
                                                path={story.picture}
                                                style={{
                                                    width: '100%',
                                                    height: 'auto',
                                                    display: 'block',
                                                }}
                                                loading="lazy"
                                                validateObjectExistence={false}
                                            />
                                        </Card>
                                        {/* Admin controls */}
                                        {isAdmin && (
                                            <Box
                                                position="absolute"
                                                top={8}
                                                right={8}
                                                display="flex"
                                                flexDirection="column"
                                                gap={1}
                                                sx={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                    borderRadius: 1,
                                                    padding: 0.5,
                                                }}
                                            >
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEditStory(story)}
                                                    color="primary"
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        '&:hover': { backgroundColor: 'grey.100' },
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteStory(story)}
                                                    color="error"
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        '&:hover': { backgroundColor: 'grey.100' },
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        )}
                                    </Box>
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot />
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent fontSize={{ xs: 12, md: 16 }}>
                                    <h4>{story.title}</h4>
                                    <p>{story.body}</p>
                                    {isAdmin && (
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            display="block"
                                            mt={1}
                                        >
                                            {months.find((m) => m.value === story.month)?.label}{' '}
                                            {story.year}
                                        </Typography>
                                    )}
                                </TimelineContent>
                            </TimelineItem>
                        ))}
                    </Timeline>
                </Box>

                {/* Add Story Dialog */}
                <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
                    <DialogTitle>Add New Story Item</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Title"
                            fullWidth
                            variant="outlined"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            label="Story"
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            value={newBody}
                            onChange={(e) => setNewBody(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Story Image *
                            </Typography>
                            <FileUploader
                                acceptedFileTypes={['image/webp']}
                                path="story/"
                                maxFileCount={1}
                                isResumable
                                onUploadSuccess={(result) => {
                                    // Extract the key from the upload result
                                    if (result && result.key) {
                                        setNewPicture(result.key);
                                    }
                                }}
                                onUploadError={(error) => {
                                    console.error('Upload error:', error);
                                    setSnackbarMessage('Failed to upload image. Please try again.');
                                    setSnackbarSeverity('error');
                                    setSnackbarOpen(true);
                                    setNewPicture('');
                                }}
                            />
                            {newPicture && (
                                <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                                    Image uploaded successfully!
                                </Typography>
                            )}
                        </Box>
                        <Box display="flex" gap={2}>
                            <TextField
                                select
                                label="Month"
                                value={newMonth}
                                onChange={(e) => setNewMonth(Number(e.target.value))}
                                sx={{ minWidth: 150 }}
                            >
                                {months.map((month) => (
                                    <MenuItem key={month.value} value={month.value}>
                                        {month.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Year"
                                type="number"
                                value={newYear}
                                onChange={(e) => setNewYear(Number(e.target.value))}
                                inputProps={{ min: 1900, max: new Date().getFullYear() + 10 }}
                                sx={{ minWidth: 100 }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Cancel</Button>
                        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
                            {submitting ? 'Adding...' : 'Add Story'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Edit Story Dialog */}
                <Dialog
                    open={editDialogOpen}
                    onClose={handleEditDialogClose}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Edit Story Item</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Title"
                            fullWidth
                            variant="outlined"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            label="Story"
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            value={newBody}
                            onChange={(e) => setNewBody(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Story Image *
                            </Typography>
                            <FileUploader
                                acceptedFileTypes={['image/webp']}
                                path="story/"
                                maxFileCount={1}
                                isResumable
                                onUploadSuccess={(result) => {
                                    // Extract the key from the upload result
                                    if (result && result.key) {
                                        setNewPicture(result.key);
                                    }
                                }}
                                onUploadError={(error) => {
                                    console.error('Upload error:', error);
                                    setSnackbarMessage('Failed to upload image. Please try again.');
                                    setSnackbarSeverity('error');
                                    setSnackbarOpen(true);
                                    setNewPicture('');
                                }}
                            />
                            {newPicture && (
                                <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                                    {newPicture.includes('/')
                                        ? 'New image uploaded successfully!'
                                        : 'Current image: Using existing image'}
                                </Typography>
                            )}
                        </Box>
                        <Box display="flex" gap={2}>
                            <TextField
                                select
                                label="Month"
                                value={newMonth}
                                onChange={(e) => setNewMonth(Number(e.target.value))}
                                sx={{ minWidth: 150 }}
                            >
                                {months.map((month) => (
                                    <MenuItem key={month.value} value={month.value}>
                                        {month.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Year"
                                type="number"
                                value={newYear}
                                onChange={(e) => setNewYear(Number(e.target.value))}
                                inputProps={{ min: 1900, max: new Date().getFullYear() + 10 }}
                                sx={{ minWidth: 100 }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditDialogClose}>Cancel</Button>
                        <Button
                            onClick={handleEditSubmit}
                            variant="contained"
                            disabled={submitting}
                        >
                            {submitting ? 'Updating...' : 'Update Story'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Story Confirmation Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={handleDeleteDialogClose}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Delete Story Item</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to delete this story item?</Typography>
                        {deletingStory && (
                            <Box mt={2} p={2} sx={{ backgroundColor: 'grey.100', borderRadius: 1 }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    Title: {deletingStory.title}
                                </Typography>
                                <Typography variant="body2" mt={1}>
                                    Story: {deletingStory.body}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    mt={1}
                                    display="block"
                                >
                                    {months.find((m) => m.value === deletingStory.month)?.label}{' '}
                                    {deletingStory.year}
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
                            {submitting ? 'Deleting...' : 'Delete Story'}
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
