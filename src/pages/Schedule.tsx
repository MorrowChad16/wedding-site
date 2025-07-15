import PageContainer from '../components/page-container';
import ScheduleIcon from '../components/schedule-icon';
import {
    CircularProgress,
    Grid,
    Fab,
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
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useState } from 'react';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { useStore } from '../api/use-store';
import { getWeddingGuestsByEmail } from '../api/use-guests';
import { getVisibleScheduleItems, ScheduleItemType, createScheduleItem } from '../api/use-schedule';
import { useQueryClient } from '@tanstack/react-query';

export default function Schedule() {
    const { storeEmail, isAdmin } = useStore();
    const { isLoading: guestsLoading, guests } = getWeddingGuestsByEmail(storeEmail);
    const { isLoading: scheduleLoading, scheduleItems } = getVisibleScheduleItems();
    const queryClient = useQueryClient();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadedIconKey, setUploadedIconKey] = useState<string>('');
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

            // Create schedule item with S3 key
            await createScheduleItem(
                formData.uid,
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
                                    item.isPrivate === false ||
                                    item.isPrivate ===
                                        guests?.some((guest: any) => guest.isBridalParty)
                            )
                            .map((item: ScheduleItemType) => (
                                <ScheduleIcon
                                    key={item.uid}
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
                            )) || []
                    )}
                </Grid>

                {/* Admin FAB */}
                {isAdmin && (
                    <Fab
                        color="primary"
                        aria-label="add schedule item"
                        sx={{
                            position: 'fixed',
                            bottom: 16,
                            left: 16,
                        }}
                        onClick={() => setDialogOpen(true)}
                    >
                        <AddIcon />
                    </Fab>
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
                        <Button onClick={() => setDialogOpen(false)} disabled={uploading}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} variant="contained" disabled={uploading}>
                            {uploading ? 'Creating...' : 'Create Schedule Item'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        </PageContainer>
    );
}
