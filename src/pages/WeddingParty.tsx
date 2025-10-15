import { useState } from 'react';
import PageContainer from '../components/page-container';
import {
    Box,
    Card,
    CardContent,
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
    Grid,
    Avatar,
    Chip,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Person as PersonIcon,
    PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useQueryClient } from '@tanstack/react-query';
import { FileUploader, StorageImage } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { useStore } from '../api/use-store';
import { getAllWeddingGuests } from '../api/use-guests';
import {
    getWeddingPartyMembers,
    updateBridalPartyRole,
    updateGuestImage,
    getBridalPartyRoleDisplayName,
    type WeddingGuestType,
    type BridalPartyRole,
} from '../api/use-wedding-party';

export default function WeddingParty() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState<WeddingGuestType | null>(null);
    const [selectedRole, setSelectedRole] = useState<BridalPartyRole | ''>('');
    const [newImage, setNewImage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const { isAdmin } = useStore();
    const {
        isLoading: partyLoading,
        error: partyError,
        weddingPartyMembers,
    } = getWeddingPartyMembers();
    const {
        isLoading: guestsLoading,
        error: guestsError,
        guests: allGuests,
    } = getAllWeddingGuests();
    const queryClient = useQueryClient();
    const theme = useTheme();

    const bridalPartyRoles: { value: BridalPartyRole; label: string }[] = [
        { value: 'GROOM', label: 'Groom' },
        { value: 'BRIDE', label: 'Bride' },
        { value: 'BEST_MAN', label: 'Best Man' },
        { value: 'MAID_OF_HONOR', label: 'Maid of Honor' },
        { value: 'BRIDESMAID', label: 'Bridesmaid' },
        { value: 'GROOMSMAN', label: 'Groomsman' },
    ];

    // Get guests that are not already in the wedding party
    const availableGuests = allGuests || [];
    console.log(availableGuests);

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedGuest(null);
        setSelectedRole('');
    };

    const handleEditDialogOpen = (member: WeddingGuestType) => {
        setSelectedGuest(member);
        setSelectedRole(member.bridalPartyRole ?? '');
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        setSelectedGuest(null);
        setSelectedRole('');
    };

    const handleAddMember = async () => {
        if (!selectedGuest || !selectedRole) {
            setSnackbarMessage('Please select both a guest and a role');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        setSubmitting(true);
        try {
            await updateBridalPartyRole(selectedGuest.guestId, selectedRole);

            // Refetch the data to update the lists
            queryClient.invalidateQueries({ queryKey: ['getWeddingPartyMembers'] });
            queryClient.invalidateQueries({ queryKey: ['getAllWeddingGuests'] });

            setSnackbarMessage('Wedding party member added successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleDialogClose();
        } catch (error) {
            console.error('Error adding wedding party member:', error);
            setSnackbarMessage('Failed to add wedding party member. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateMember = async () => {
        if (!selectedGuest) return;

        setSubmitting(true);
        try {
            await updateBridalPartyRole(
                selectedGuest.guestId,
                selectedRole === '' ? null : (selectedRole as BridalPartyRole)
            );

            // Refetch the data to update the lists
            queryClient.invalidateQueries({ queryKey: ['getWeddingPartyMembers'] });
            queryClient.invalidateQueries({ queryKey: ['getAllWeddingGuests'] });

            setSnackbarMessage(
                selectedRole === ''
                    ? 'Member removed from wedding party successfully!'
                    : 'Wedding party member updated successfully!'
            );
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleEditDialogClose();
        } catch (error) {
            console.error('Error updating wedding party member:', error);
            setSnackbarMessage('Failed to update wedding party member. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleImageDialogOpen = (member: WeddingGuestType) => {
        setSelectedGuest(member);
        setNewImage(member.image || '');
        setImageDialogOpen(true);
    };

    const handleImageDialogClose = () => {
        setImageDialogOpen(false);
        setSelectedGuest(null);
        setNewImage('');
    };

    const handleImageUpdate = async () => {
        if (!selectedGuest) return;

        setSubmitting(true);
        try {
            await updateGuestImage(selectedGuest.guestId, newImage);

            // Refresh data
            queryClient.invalidateQueries({ queryKey: ['getWeddingPartyMembers'] });
            queryClient.invalidateQueries({ queryKey: ['getAllWeddingGuests'] });

            setSnackbarMessage('Profile image updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleImageDialogClose();
        } catch (error) {
            console.error('Error updating image:', error);
            setSnackbarMessage('Failed to update image. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    if (partyLoading || guestsLoading) {
        return (
            <PageContainer>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                    <CircularProgress />
                </Box>
            </PageContainer>
        );
    }

    if (partyError || guestsError) {
        return (
            <PageContainer>
                <Box m={'0 auto'} width={{ xs: '100%', sm: '100%', md: '80%', lg: '80%' }}>
                    <Alert severity="error">
                        Failed to load wedding party information. Please try again later.
                    </Alert>
                </Box>
            </PageContainer>
        );
    }

    if ((!weddingPartyMembers || weddingPartyMembers.length === 0) && !isAdmin) {
        return (
            <PageContainer>
                <Box m={'0 auto'} width={{ xs: '100%', sm: '100%', md: '80%', lg: '80%' }}>
                    <Alert severity="info">No wedding party members have been announced yet.</Alert>
                </Box>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <>
                <Box m={'0 auto'} width={{ xs: '100%', sm: '100%', md: '80%', lg: '80%' }}>
                    <Typography variant="h4" component="h1" gutterBottom textAlign="center" mb={4}>
                        Wedding Party
                    </Typography>

                    {/* Add Member Button - Only visible to admins */}
                    {isAdmin && (
                        <Box mb={4} display="flex" justifyContent="center">
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleDialogOpen}
                                disabled={availableGuests.length === 0}
                            >
                                Add Wedding Party Member
                            </Button>
                        </Box>
                    )}

                    {/* Wedding Party Members - Two Column Layout */}
                    <Grid container spacing={4}>
                        {/* Groom's Side */}
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="h5"
                                component="h2"
                                gutterBottom
                                textAlign="center"
                                mb={3}
                            >
                                Groom's Party
                            </Typography>
                            <Box display="flex" flexDirection="column" gap={3}>
                                {(weddingPartyMembers || [])
                                    .filter((member) =>
                                        [
                                            'GROOM',
                                            'BEST_MAN',
                                            'GROOMSMAN',
                                            'RING_BEARER',
                                            'USHER',
                                        ].includes(member.bridalPartyRole ?? '')
                                    )
                                    .map((member) => (
                                        <Card
                                            key={member.guestId}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                position: 'relative',
                                                '&:hover': isAdmin
                                                    ? {
                                                          boxShadow: theme.shadows[8],
                                                      }
                                                    : {},
                                            }}
                                        >
                                            {/* Admin controls */}
                                            {isAdmin && (
                                                <Box
                                                    position="absolute"
                                                    top={8}
                                                    right={8}
                                                    zIndex={1}
                                                    display="flex"
                                                    gap={1}
                                                >
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            handleImageDialogOpen(member)
                                                        }
                                                        sx={{
                                                            backgroundColor:
                                                                'rgba(255, 255, 255, 0.9)',
                                                            color: 'black',
                                                            '&:hover': { backgroundColor: 'white' },
                                                        }}
                                                    >
                                                        <PhotoCameraIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEditDialogOpen(member)}
                                                        color="primary"
                                                        sx={{
                                                            backgroundColor:
                                                                'rgba(255, 255, 255, 0.9)',
                                                            '&:hover': { backgroundColor: 'white' },
                                                        }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            )}

                                            <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                                                <Box position="relative" display="inline-block">
                                                    {member.image ? (
                                                        <Box
                                                            sx={{
                                                                width: 80,
                                                                height: 80,
                                                                margin: '0 auto 16px auto',
                                                                borderRadius: '50%',
                                                                overflow: 'hidden',
                                                                backgroundColor:
                                                                    theme.palette.primary.main,
                                                            }}
                                                        >
                                                            <StorageImage
                                                                alt={member.fullName}
                                                                path={member.image}
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover',
                                                                }}
                                                                loading="lazy"
                                                                validateObjectExistence={false}
                                                            />
                                                        </Box>
                                                    ) : (
                                                        <Avatar
                                                            sx={{
                                                                width: 80,
                                                                height: 80,
                                                                margin: '0 auto 16px auto',
                                                                backgroundColor:
                                                                    theme.palette.primary.main,
                                                                fontSize: '2rem',
                                                            }}
                                                        >
                                                            <PersonIcon fontSize="large" />
                                                        </Avatar>
                                                    )}
                                                    {isAdmin && !member.image && (
                                                        <IconButton
                                                            size="small"
                                                            onClick={() =>
                                                                handleImageDialogOpen(member)
                                                            }
                                                            sx={{
                                                                position: 'absolute',
                                                                bottom: 12,
                                                                right: -4,
                                                                backgroundColor: 'black',
                                                                color: 'white',
                                                                width: 24,
                                                                height: 24,
                                                                '&:hover': {
                                                                    backgroundColor: '#333',
                                                                },
                                                            }}
                                                        >
                                                            <PhotoCameraIcon
                                                                sx={{ fontSize: 14 }}
                                                            />
                                                        </IconButton>
                                                    )}
                                                </Box>

                                                <Typography
                                                    variant="h6"
                                                    component="h2"
                                                    gutterBottom
                                                >
                                                    {member.fullName}
                                                </Typography>

                                                <Chip
                                                    label={getBridalPartyRoleDisplayName(
                                                        member.bridalPartyRole ?? null
                                                    )}
                                                    color={'primary'}
                                                    variant="filled"
                                                    sx={{ mb: 1 }}
                                                />
                                            </CardContent>
                                        </Card>
                                    ))}
                            </Box>
                        </Grid>

                        {/* Bride's Side */}
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="h5"
                                component="h2"
                                gutterBottom
                                textAlign="center"
                                mb={3}
                            >
                                Bride's Party
                            </Typography>
                            <Box display="flex" flexDirection="column" gap={3}>
                                {(weddingPartyMembers || [])
                                    .filter((member) =>
                                        ['BRIDE', 'MAID_OF_HONOR', 'BRIDESMAID'].includes(
                                            member.bridalPartyRole ?? ''
                                        )
                                    )
                                    .map((member) => (
                                        <Card
                                            key={member.guestId}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                position: 'relative',
                                                '&:hover': isAdmin
                                                    ? {
                                                          boxShadow: theme.shadows[8],
                                                      }
                                                    : {},
                                            }}
                                        >
                                            {/* Admin controls */}
                                            {isAdmin && (
                                                <Box
                                                    position="absolute"
                                                    top={8}
                                                    right={8}
                                                    zIndex={1}
                                                    display="flex"
                                                    gap={1}
                                                >
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            handleImageDialogOpen(member)
                                                        }
                                                        sx={{
                                                            backgroundColor:
                                                                'rgba(255, 255, 255, 0.9)',
                                                            color: 'black',
                                                            '&:hover': { backgroundColor: 'white' },
                                                        }}
                                                    >
                                                        <PhotoCameraIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEditDialogOpen(member)}
                                                        color="primary"
                                                        sx={{
                                                            backgroundColor:
                                                                'rgba(255, 255, 255, 0.9)',
                                                            '&:hover': { backgroundColor: 'white' },
                                                        }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            )}

                                            <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                                                <Box position="relative" display="inline-block">
                                                    {member.image ? (
                                                        <Box
                                                            sx={{
                                                                width: 80,
                                                                height: 80,
                                                                margin: '0 auto 16px auto',
                                                                borderRadius: '50%',
                                                                overflow: 'hidden',
                                                                backgroundColor:
                                                                    theme.palette.primary.main,
                                                            }}
                                                        >
                                                            <StorageImage
                                                                alt={member.fullName}
                                                                path={member.image}
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover',
                                                                }}
                                                                loading="lazy"
                                                                validateObjectExistence={false}
                                                            />
                                                        </Box>
                                                    ) : (
                                                        <Avatar
                                                            sx={{
                                                                width: 80,
                                                                height: 80,
                                                                margin: '0 auto 16px auto',
                                                                backgroundColor:
                                                                    theme.palette.primary.main,
                                                                fontSize: '2rem',
                                                            }}
                                                        >
                                                            <PersonIcon fontSize="large" />
                                                        </Avatar>
                                                    )}
                                                    {isAdmin && !member.image && (
                                                        <IconButton
                                                            size="small"
                                                            onClick={() =>
                                                                handleImageDialogOpen(member)
                                                            }
                                                            sx={{
                                                                position: 'absolute',
                                                                bottom: 12,
                                                                right: -4,
                                                                backgroundColor: 'black',
                                                                color: 'white',
                                                                width: 24,
                                                                height: 24,
                                                                '&:hover': {
                                                                    backgroundColor: '#333',
                                                                },
                                                            }}
                                                        >
                                                            <PhotoCameraIcon
                                                                sx={{ fontSize: 14 }}
                                                            />
                                                        </IconButton>
                                                    )}
                                                </Box>

                                                <Typography
                                                    variant="h6"
                                                    component="h2"
                                                    gutterBottom
                                                >
                                                    {member.fullName}
                                                </Typography>

                                                <Chip
                                                    label={getBridalPartyRoleDisplayName(
                                                        member.bridalPartyRole ?? null
                                                    )}
                                                    color={'primary'}
                                                    variant="filled"
                                                    sx={{ mb: 1 }}
                                                />
                                            </CardContent>
                                        </Card>
                                    ))}
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Empty state for admins */}
                    {isAdmin && (!weddingPartyMembers || weddingPartyMembers.length === 0) && (
                        <Box mt={4}>
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
                                        Add First Wedding Party Member
                                    </Typography>
                                </Box>
                            </Card>
                        </Box>
                    )}
                </Box>

                {/* Add Member Dialog */}
                <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                    <DialogTitle>Add Wedding Party Member</DialogTitle>
                    <DialogContent>
                        <TextField
                            select
                            label="Select Guest"
                            fullWidth
                            value={selectedGuest?.guestId || ''}
                            onChange={(e) => {
                                const guest = availableGuests.find(
                                    (g) => g.guestId === e.target.value
                                );
                                setSelectedGuest(guest || null);
                            }}
                            sx={{ mb: 2, mt: 1 }}
                        >
                            {availableGuests.map((guest) => (
                                <MenuItem key={guest.guestId} value={guest.guestId}>
                                    {guest.fullName}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Wedding Party Role"
                            fullWidth
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value as BridalPartyRole)}
                        >
                            {bridalPartyRoles.map((role) => (
                                <MenuItem key={role.value} value={role.value}>
                                    {role.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Cancel</Button>
                        <Button onClick={handleAddMember} variant="contained" disabled={submitting}>
                            {submitting ? 'Adding...' : 'Add Member'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Edit Member Dialog */}
                <Dialog
                    open={editDialogOpen}
                    onClose={handleEditDialogClose}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Edit Wedding Party Member</DialogTitle>
                    <DialogContent>
                        {selectedGuest && (
                            <>
                                <Typography variant="body1" sx={{ mb: 2, mt: 1 }}>
                                    <strong>Guest:</strong> {selectedGuest.fullName}
                                </Typography>

                                <TextField
                                    select
                                    label="Wedding Party Role"
                                    fullWidth
                                    value={selectedRole}
                                    onChange={(e) =>
                                        setSelectedRole(e.target.value as BridalPartyRole | '')
                                    }
                                >
                                    <MenuItem value="">
                                        <em>Remove from Wedding Party</em>
                                    </MenuItem>
                                    {bridalPartyRoles.map((role) => (
                                        <MenuItem key={role.value} value={role.value}>
                                            {role.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditDialogClose}>Cancel</Button>
                        <Button
                            onClick={handleUpdateMember}
                            variant="contained"
                            disabled={submitting}
                        >
                            {submitting ? 'Updating...' : 'Update Member'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Image Upload Dialog */}
                <Dialog
                    open={imageDialogOpen}
                    onClose={handleImageDialogClose}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Update Profile Image</DialogTitle>
                    <DialogContent>
                        {selectedGuest && (
                            <Box sx={{ mt: 1 }}>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    <strong>Member:</strong> {selectedGuest.fullName}
                                </Typography>

                                {/* Current Image Preview */}
                                {selectedGuest.image && (
                                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 1 }}
                                        >
                                            Current Image:
                                        </Typography>
                                        <Box
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                margin: '0 auto',
                                                borderRadius: '50%',
                                                overflow: 'hidden',
                                                backgroundColor: theme.palette.primary.main,
                                            }}
                                        >
                                            <StorageImage
                                                alt={selectedGuest.fullName}
                                                path={selectedGuest.image}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                                loading="lazy"
                                                validateObjectExistence={false}
                                            />
                                        </Box>
                                    </Box>
                                )}

                                {/* File Uploader */}
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Image (WebP only)
                                    </Typography>
                                    <FileUploader
                                        acceptedFileTypes={['image/webp']}
                                        path="wedding-party/"
                                        maxFileCount={1}
                                        isResumable
                                        onUploadSuccess={(result) => {
                                            if (result && result.key) {
                                                setNewImage(result.key);
                                            }
                                        }}
                                        onUploadError={(error) => {
                                            console.error('Upload error:', error);
                                            setSnackbarMessage(
                                                'Failed to upload image. Please try again.'
                                            );
                                            setSnackbarSeverity('error');
                                            setSnackbarOpen(true);
                                            setNewImage('');
                                        }}
                                    />
                                    {newImage && newImage !== selectedGuest.image && (
                                        <Typography
                                            variant="body2"
                                            color="success.main"
                                            sx={{ mt: 1 }}
                                        >
                                            New image uploaded successfully! Click "Update Image" to
                                            save.
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleImageDialogClose}>Cancel</Button>
                        <Button
                            onClick={handleImageUpdate}
                            variant="contained"
                            disabled={submitting || !newImage || newImage === selectedGuest?.image}
                        >
                            {submitting ? 'Updating...' : 'Update Image'}
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
