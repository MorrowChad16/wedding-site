import PageContainer from '../components/page-container';
import ScheduleIcon from '../components/schedule-icon';
import {
    CircularProgress,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    Alert,
    FormControlLabel,
    Switch,
    Snackbar,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { useStore } from '../api/use-store';
import { getWeddingGuestsByEmail } from '../api/use-guests';
import {
    getVisibleScheduleItems,
    getAllScheduleItems,
    ScheduleItemType,
    createScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
} from '../api/use-schedule';
import { useQueryClient } from '@tanstack/react-query';

export default function Schedule() {
    const { storeEmail, isAdmin } = useStore();
    const { isLoading: guestsLoading, guests } = getWeddingGuestsByEmail(storeEmail);
    const { isLoading: scheduleLoading, scheduleItems } = isAdmin
        ? getAllScheduleItems()
        : getVisibleScheduleItems();
    const queryClient = useQueryClient();
    const theme = useTheme();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadedIconKey, setUploadedIconKey] = useState<string>('');
    const [editingItem, setEditingItem] = useState<ScheduleItemType | null>(null);
    const [deletingItem, setDeletingItem] = useState<ScheduleItemType | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [formData, setFormData] = useState({
        uid: '',
        title: '',
        description: '',
        locationName: '',
        location: '',
        coordinatesLat: 0,
        coordinatesLng: 0,
        startTime: '',
        endTime: '',
        type: 'EVENT' as 'EVENT' | 'CEREMONY' | 'RECEPTION' | 'ACTIVITY',
        formality: 'CASUAL' as 'CASUAL' | 'SEMI_FORMAL' | 'FORMAL',
        isPrivate: false,
        isVisible: true,
    });

    const isLoading = guestsLoading || scheduleLoading;

    const handleSubmit = async () => {
        try {
            setUploading(true);
            setError(null);

            // Validate required fields
            if (
                !formData.title ||
                !formData.locationName ||
                !formData.startTime ||
                !formData.endTime ||
                !uploadedIconKey
            ) {
                setError('Please fill in all required fields and upload an icon image');
                return;
            }

            // Auto-generate unique ID for new items
            const uniqueId = crypto.randomUUID();

            // Create schedule item with S3 key
            await createScheduleItem(
                uniqueId,
                new Date(formData.startTime),
                new Date(formData.endTime),
                formData.title,
                formData.locationName,
                formData.location,
                { lat: formData.coordinatesLat, lng: formData.coordinatesLng },
                formData.type,
                uploadedIconKey, // Store the S3 key from FileUploader
                formData.formality,
                formData.description,
                formData.isPrivate,
                formData.isVisible
            );

            // Refresh the schedule items
            await queryClient.invalidateQueries({ queryKey: ['getVisibleScheduleItems'] });
            await queryClient.invalidateQueries({ queryKey: ['getAllScheduleItems'] });

            setSnackbarMessage('Schedule item created successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            // Reset form
            setFormData({
                uid: '',
                title: '',
                description: '',
                locationName: '',
                location: '',
                coordinatesLat: 0,
                coordinatesLng: 0,
                startTime: '',
                endTime: '',
                type: 'EVENT',
                formality: 'CASUAL',
                isPrivate: false,
                isVisible: true,
            });
            setUploadedIconKey('');
            setDialogOpen(false);
        } catch (err) {
            console.error('Error creating schedule item:', err);
            setError('Failed to create schedule item. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleToggleVisibility = async (item: ScheduleItemType) => {
        setUploading(true);
        try {
            await updateScheduleItem(
                item.id,
                item.uid,
                new Date(item.startTime),
                new Date(item.endTime),
                item.title,
                item.locationName,
                item.location,
                { lat: item.coordinatesLat, lng: item.coordinatesLng },
                item.type,
                item.iconAsset,
                item.formality,
                item.description || undefined,
                item.isPrivate ?? false,
                !item.isVisible
            );

            // Refresh the schedule items
            await queryClient.invalidateQueries({ queryKey: ['getVisibleScheduleItems'] });
            await queryClient.invalidateQueries({ queryKey: ['getAllScheduleItems'] });

            setSnackbarMessage(
                `Schedule item ${!item.isVisible ? 'made visible' : 'hidden'} successfully!`
            );
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error updating schedule item visibility:', error);
            setSnackbarMessage('Failed to update schedule item visibility. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setUploading(false);
        }
    };

    const handleEditItem = (item: ScheduleItemType) => {
        setEditingItem(item);

        // Format dates for datetime-local input
        const startDateTime = new Date(item.startTime).toISOString().slice(0, 16);
        const endDateTime = new Date(item.endTime).toISOString().slice(0, 16);

        setFormData({
            uid: item.uid,
            title: item.title,
            description: item.description || '',
            locationName: item.locationName,
            location: item.location,
            coordinatesLat: item.coordinatesLat,
            coordinatesLng: item.coordinatesLng,
            startTime: startDateTime,
            endTime: endDateTime,
            type: item.type,
            formality: item.formality,
            isPrivate: item.isPrivate ?? false,
            isVisible: item.isVisible ?? true,
        });
        setUploadedIconKey(item.iconAsset);
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        setEditingItem(null);
        setFormData({
            uid: '',
            title: '',
            description: '',
            locationName: '',
            location: '',
            coordinatesLat: 0,
            coordinatesLng: 0,
            startTime: '',
            endTime: '',
            type: 'EVENT',
            formality: 'CASUAL',
            isPrivate: false,
            isVisible: true,
        });
        setUploadedIconKey('');
        setError(null);
    };

    const handleEditSubmit = async () => {
        if (!editingItem) return;

        try {
            setUploading(true);
            setError(null);

            // Validate required fields
            if (
                !formData.uid ||
                !formData.title ||
                !formData.locationName ||
                !formData.startTime ||
                !formData.endTime ||
                !uploadedIconKey
            ) {
                setError('Please fill in all required fields and upload an icon image');
                return;
            }

            await updateScheduleItem(
                editingItem.id,
                formData.uid,
                new Date(formData.startTime),
                new Date(formData.endTime),
                formData.title,
                formData.locationName,
                formData.location,
                { lat: formData.coordinatesLat, lng: formData.coordinatesLng },
                formData.type,
                uploadedIconKey,
                formData.formality,
                formData.description,
                formData.isPrivate,
                formData.isVisible
            );

            // Refresh the schedule items
            await queryClient.invalidateQueries({ queryKey: ['getVisibleScheduleItems'] });
            await queryClient.invalidateQueries({ queryKey: ['getAllScheduleItems'] });

            setSnackbarMessage('Schedule item updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleEditDialogClose();
        } catch (error) {
            console.error('Error updating schedule item:', error);
            setError('Failed to update schedule item. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteItem = (item: ScheduleItemType) => {
        setDeletingItem(item);
        setDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setDeletingItem(null);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingItem) return;

        setUploading(true);
        try {
            await deleteScheduleItem(deletingItem.id);

            // Refresh the schedule items
            await queryClient.invalidateQueries({ queryKey: ['getVisibleScheduleItems'] });
            await queryClient.invalidateQueries({ queryKey: ['getAllScheduleItems'] });

            setSnackbarMessage('Schedule item deleted successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleDeleteDialogClose();
        } catch (error) {
            console.error('Error deleting schedule item:', error);
            setSnackbarMessage('Failed to delete schedule item. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setUploading(false);
        }
    };

    return (
        <PageContainer>
            <>
                <Grid container spacing={2} justifyContent="center">
                    {isLoading ? (
                        <Grid item>
                            <CircularProgress />
                        </Grid>
                    ) : (
                        scheduleItems
                            ?.filter(
                                (item) =>
                                    isAdmin ||
                                    (item.isVisible &&
                                        (item.isPrivate === false ||
                                            item.isPrivate ===
                                                guests?.some((guest: any) => guest.isBridalParty)))
                            )
                            .map((item: ScheduleItemType) => (
                                <Grid item xs={12} sm={12} key={item.uid}>
                                    <Box position="relative">
                                        <ScheduleIcon
                                            uid={item.uid}
                                            startTime={item.startTime}
                                            endTime={item.endTime}
                                            title={item.title}
                                            description={item.description}
                                            location={item.location}
                                            locationName={item.locationName}
                                            iconAsset={item.iconAsset}
                                            formality={item.formality}
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
                                                    onClick={() => handleEditItem(item)}
                                                    color="primary"
                                                    variant="outlined"
                                                    sx={{ minWidth: 'auto', px: 1 }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="small"
                                                    startIcon={<DeleteIcon />}
                                                    onClick={() => handleDeleteItem(item)}
                                                    color="error"
                                                    variant="outlined"
                                                    sx={{ minWidth: 'auto', px: 1 }}
                                                >
                                                    Delete
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                </Grid>
                            )) || []
                    )}
                </Grid>

                {/* Add Schedule Item Button styled as Box - Only visible to admins */}
                {isAdmin && (
                    <Box mb={2} mt={3}>
                        <Box
                            onClick={() => setDialogOpen(true)}
                            sx={{
                                border: `2px dashed ${theme.palette.primary.main}`,
                                backgroundColor: 'transparent',
                                cursor: 'pointer',
                                borderRadius: 1,
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover,
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
                                    Click to add a new schedule item
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                )}

                {/* Admin Dialog */}
                <Dialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Add Schedule Item</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                            {error && <Alert severity="error">{error}</Alert>}

                            <TextField
                                label="Title *"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                fullWidth
                            />

                            <TextField
                                label="Description *"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                multiline
                                rows={3}
                                fullWidth
                            />

                            <TextField
                                label="Location Name *"
                                value={formData.locationName}
                                onChange={(e) =>
                                    setFormData({ ...formData, locationName: e.target.value })
                                }
                                fullWidth
                            />

                            <TextField
                                label="Location Address *"
                                value={formData.location}
                                onChange={(e) =>
                                    setFormData({ ...formData, location: e.target.value })
                                }
                                fullWidth
                            />

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    label="Latitude *"
                                    type="number"
                                    value={formData.coordinatesLat}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            coordinatesLat: parseFloat(e.target.value) || 0,
                                        })
                                    }
                                    fullWidth
                                />
                                <TextField
                                    label="Longitude *"
                                    type="number"
                                    value={formData.coordinatesLng}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            coordinatesLng: parseFloat(e.target.value) || 0,
                                        })
                                    }
                                    fullWidth
                                />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    label="Start Time *"
                                    type="datetime-local"
                                    value={formData.startTime}
                                    onChange={(e) =>
                                        setFormData({ ...formData, startTime: e.target.value })
                                    }
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    label="End Time *"
                                    type="datetime-local"
                                    value={formData.endTime}
                                    onChange={(e) =>
                                        setFormData({ ...formData, endTime: e.target.value })
                                    }
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        value={formData.type}
                                        label="Type *"
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                type: e.target.value as any,
                                            })
                                        }
                                    >
                                        <MenuItem value="EVENT">Event</MenuItem>
                                        <MenuItem value="CEREMONY">Ceremony</MenuItem>
                                        <MenuItem value="RECEPTION">Reception</MenuItem>
                                        <MenuItem value="ACTIVITY">Activity</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel>Formality</InputLabel>
                                    <Select
                                        value={formData.formality}
                                        label="Formality *"
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                formality: e.target.value as any,
                                            })
                                        }
                                    >
                                        <MenuItem value="CASUAL">Casual</MenuItem>
                                        <MenuItem value="SEMI_FORMAL">Semi Formal</MenuItem>
                                        <MenuItem value="FORMAL">Formal</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isPrivate}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    isPrivate: e.target.checked,
                                                })
                                            }
                                        />
                                    }
                                    label="Private (Wedding Party Only)"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isVisible}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    isVisible: e.target.checked,
                                                })
                                            }
                                        />
                                    }
                                    label="Visible"
                                />
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    Icon Image (PNG only) *
                                </Typography>
                                <FileUploader
                                    acceptedFileTypes={['image/png']}
                                    path="schedule/"
                                    maxFileCount={1}
                                    isResumable
                                    onUploadSuccess={(result) => {
                                        // Extract the key from the upload result
                                        if (result && result.key) {
                                            setUploadedIconKey(result.key);
                                            setError(null);
                                        }
                                    }}
                                    onUploadError={(error) => {
                                        console.error('Upload error:', error);
                                        setError('Failed to upload image. Please try again.');
                                        setUploadedIconKey('');
                                    }}
                                />
                                {uploadedIconKey && (
                                    <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                                        Icon uploaded successfully!
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} disabled={uploading}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} variant="contained" disabled={uploading}>
                            {uploading ? 'Creating...' : 'Create Schedule Item'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Edit Schedule Item Dialog */}
                <Dialog
                    open={editDialogOpen}
                    onClose={handleEditDialogClose}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Edit Schedule Item</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                            {error && <Alert severity="error">{error}</Alert>}

                            <TextField
                                label="UID *"
                                value={formData.uid}
                                onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
                                fullWidth
                                helperText="Unique identifier for this schedule item"
                            />

                            <TextField
                                label="Title *"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                fullWidth
                            />

                            <TextField
                                label="Description *"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                multiline
                                rows={3}
                                fullWidth
                            />

                            <TextField
                                label="Location Name *"
                                value={formData.locationName}
                                onChange={(e) =>
                                    setFormData({ ...formData, locationName: e.target.value })
                                }
                                fullWidth
                            />

                            <TextField
                                label="Location Address *"
                                value={formData.location}
                                onChange={(e) =>
                                    setFormData({ ...formData, location: e.target.value })
                                }
                                fullWidth
                            />

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    label="Latitude *"
                                    type="number"
                                    value={formData.coordinatesLat}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            coordinatesLat: parseFloat(e.target.value) || 0,
                                        })
                                    }
                                    fullWidth
                                />
                                <TextField
                                    label="Longitude *"
                                    type="number"
                                    value={formData.coordinatesLng}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            coordinatesLng: parseFloat(e.target.value) || 0,
                                        })
                                    }
                                    fullWidth
                                />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    label="Start Time *"
                                    type="datetime-local"
                                    value={formData.startTime}
                                    onChange={(e) =>
                                        setFormData({ ...formData, startTime: e.target.value })
                                    }
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    label="End Time *"
                                    type="datetime-local"
                                    value={formData.endTime}
                                    onChange={(e) =>
                                        setFormData({ ...formData, endTime: e.target.value })
                                    }
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        value={formData.type}
                                        label="Type *"
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                type: e.target.value as any,
                                            })
                                        }
                                    >
                                        <MenuItem value="EVENT">Event</MenuItem>
                                        <MenuItem value="CEREMONY">Ceremony</MenuItem>
                                        <MenuItem value="RECEPTION">Reception</MenuItem>
                                        <MenuItem value="ACTIVITY">Activity</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel>Formality</InputLabel>
                                    <Select
                                        value={formData.formality}
                                        label="Formality *"
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                formality: e.target.value as any,
                                            })
                                        }
                                    >
                                        <MenuItem value="CASUAL">Casual</MenuItem>
                                        <MenuItem value="SEMI_FORMAL">Semi Formal</MenuItem>
                                        <MenuItem value="FORMAL">Formal</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isPrivate}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    isPrivate: e.target.checked,
                                                })
                                            }
                                        />
                                    }
                                    label="Private (Wedding Party Only)"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isVisible}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    isVisible: e.target.checked,
                                                })
                                            }
                                        />
                                    }
                                    label="Visible"
                                />
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    Icon Image (PNG only) *
                                </Typography>
                                <FileUploader
                                    acceptedFileTypes={['image/png']}
                                    path="schedule/"
                                    maxFileCount={1}
                                    isResumable
                                    onUploadSuccess={(result) => {
                                        // Extract the key from the upload result
                                        if (result && result.key) {
                                            setUploadedIconKey(result.key);
                                            setError(null);
                                        }
                                    }}
                                    onUploadError={(error) => {
                                        console.error('Upload error:', error);
                                        setError('Failed to upload image. Please try again.');
                                        setUploadedIconKey('');
                                    }}
                                />
                                {uploadedIconKey && (
                                    <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                                        Icon uploaded successfully!
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditDialogClose} disabled={uploading}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditSubmit} variant="contained" disabled={uploading}>
                            {uploading ? 'Updating...' : 'Update Schedule Item'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Schedule Item Confirmation Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={handleDeleteDialogClose}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Delete Schedule Item</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to delete this schedule item?</Typography>
                        {deletingItem && (
                            <Box mt={2} p={2} sx={{ backgroundColor: 'grey.100', borderRadius: 1 }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    Title: {deletingItem.title}
                                </Typography>
                                <Typography variant="body2" mt={1}>
                                    Location: {deletingItem.locationName}
                                </Typography>
                                <Typography variant="body2" mt={1}>
                                    Time: {new Date(deletingItem.startTime).toLocaleString()} -{' '}
                                    {new Date(deletingItem.endTime).toLocaleString()}
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
                            disabled={uploading}
                        >
                            {uploading ? 'Deleting...' : 'Delete Schedule Item'}
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
