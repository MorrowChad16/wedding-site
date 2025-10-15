import { useState } from 'react';
import PageContainer from '../components/page-container';
import {
    Box,
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
import {
    Add as AddIcon,
    Edit as EditIcon,
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
    updateGuestDescription,
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
    const [selectedDescription, setSelectedDescription] = useState('');
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

    const availableGuests = allGuests || [];

    // Capitalize first letter of each word in a name
    const capitalizeName = (name: string) => {
        return name
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

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
        setSelectedDescription(member.description || '');
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        setSelectedGuest(null);
        setSelectedRole('');
        setSelectedDescription('');
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
            // Update role
            await updateBridalPartyRole(
                selectedGuest.guestId,
                selectedRole === '' ? null : (selectedRole as BridalPartyRole)
            );

            // Update description if it has changed
            if (selectedDescription !== (selectedGuest.description || '')) {
                await updateGuestDescription(selectedGuest.guestId, selectedDescription);
            }

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

    const getRoleGradient = (role: BridalPartyRole | undefined) => {
        switch (role) {
            case 'BRIDE':
                return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
            case 'GROOM':
                return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
            case 'MAID_OF_HONOR':
                return 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)';
            case 'BEST_MAN':
                return 'linear-gradient(135deg, #2af598 0%, #009efd 100%)';
            case 'BRIDESMAID':
                return 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
            case 'GROOMSMAN':
                return 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)';
            default:
                return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    };

    const polaroidPositions = [
        { transform: 'rotate(-8deg)', top: '20px', left: '3%' },
        { transform: 'rotate(5deg)', top: '40px', right: '15%' },
        { transform: 'rotate(-12deg)', top: '280px', left: '25%' },
        { transform: 'rotate(7deg)', top: '320px', right: '5%' },
        { transform: 'rotate(-5deg)', top: '620px', left: '10%' },
        { transform: 'rotate(9deg)', top: '650px', right: '20%' },
        { transform: 'rotate(-15deg)', top: '980px', left: '18%' },
        { transform: 'rotate(4deg)', top: '940px', right: '8%' },
        { transform: 'rotate(-6deg)', top: '1300px', left: '12%' },
        { transform: 'rotate(11deg)', top: '1280px', right: '12%' },
        { transform: 'rotate(-9deg)', top: '1640px', left: '22%' },
        { transform: 'rotate(6deg)', top: '1620px', right: '18%' },
    ];

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
                <Box
                    sx={{
                        minHeight: '100vh',
                        padding: { xs: '20px', md: '40px 20px' },
                    }}
                >
                    <Box m={'0 auto'} maxWidth="1200px">
                        <Typography
                            variant="h2"
                            component="h1"
                            sx={{
                                textAlign: 'center',
                                fontSize: { xs: '2.2em', md: '3em' },
                                color: '#6b5d54',
                                marginBottom: '20px',
                            }}
                        >
                            Our Wedding Party
                        </Typography>

                        <Typography
                            sx={{
                                textAlign: 'center',
                                fontSize: '1.2em',
                                color: '#8a7a6d',
                                marginBottom: '60px',
                            }}
                        >
                            The incredible people who brought us to this day
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

                        {/* Polaroid Gallery */}
                        <Box
                            sx={{
                                position: 'relative',
                                minHeight: { xs: 'auto', md: '1400px' },
                                padding: '20px',
                                display: { xs: 'flex', md: 'block' },
                                flexDirection: { xs: 'column', md: 'unset' },
                                gap: { xs: '30px', md: 0 },
                            }}
                        >
                            {(weddingPartyMembers || []).map((member, index) => (
                                <Box
                                    key={member.guestId}
                                    sx={{
                                        background: 'white',
                                        padding: '16px',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        cursor: 'pointer',
                                        position: { xs: 'relative', md: 'absolute' },
                                        width: { xs: '100%', sm: '280px', md: '312px' },
                                        maxWidth: { xs: '280px', md: '312px' },
                                        margin: { xs: '0 auto', md: '0' },
                                        transform: {
                                            xs: 'none',
                                            md: polaroidPositions[index % polaroidPositions.length]
                                                ?.transform,
                                        },
                                        top: {
                                            xs: 'auto',
                                            md: polaroidPositions[index % polaroidPositions.length]
                                                ?.top,
                                        },
                                        left: {
                                            xs: 'auto',
                                            md: polaroidPositions[index % polaroidPositions.length]
                                                ?.left,
                                        },
                                        right: {
                                            xs: 'auto',
                                            md: polaroidPositions[index % polaroidPositions.length]
                                                ?.right,
                                        },
                                        '&:hover': {
                                            transform: {
                                                xs: 'translateY(-5px) scale(1.02) !important',
                                                md: 'rotate(0deg) translateY(-5px) scale(1.05) !important',
                                            },
                                            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
                                            zIndex: 10,
                                        },
                                    }}
                                >
                                    {/* Admin controls */}
                                    {isAdmin && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                zIndex: 1,
                                                display: 'flex',
                                                gap: 1,
                                            }}
                                        >
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleImageDialogOpen(member);
                                                }}
                                                sx={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                    color: 'black',
                                                    '&:hover': { backgroundColor: 'white' },
                                                }}
                                            >
                                                <PhotoCameraIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditDialogOpen(member);
                                                }}
                                                color="primary"
                                                sx={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                    '&:hover': { backgroundColor: 'white' },
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    )}

                                    {/* Photo */}
                                    <Box
                                        sx={{
                                            width: '100%',
                                            aspectRatio: '7/8',
                                            background: getRoleGradient(
                                                member.bridalPartyRole ?? undefined
                                            ),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '1.2em',
                                            marginBottom: '12px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {member.image ? (
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
                                        ) : (
                                            <Typography>[Photo]</Typography>
                                        )}
                                    </Box>

                                    {/* Caption */}
                                    <Box
                                        sx={{
                                            textAlign: 'center',
                                            paddingTop: '12px',
                                            minHeight: '60px',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '1.3em',
                                                color: '#333',
                                                marginBottom: '2px',
                                            }}
                                        >
                                            {capitalizeName(member.fullName)}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: '0.9em',
                                                color: '#666',
                                                fontStyle: 'italic',
                                            }}
                                        >
                                            {getBridalPartyRoleDisplayName(
                                                member.bridalPartyRole || null
                                            )}
                                        </Typography>
                                        {member.description && (
                                            <Typography
                                                sx={{
                                                    fontSize: '0.85em',
                                                    color: '#888',
                                                    marginTop: '6px',
                                                    lineHeight: 1.3,
                                                }}
                                            >
                                                {member.description}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        {/* Empty state for admins */}
                        {isAdmin && (!weddingPartyMembers || weddingPartyMembers.length === 0) && (
                            <Box mt={4}>
                                <Box
                                    onClick={handleDialogOpen}
                                    sx={{
                                        border: `2px dashed ${theme.palette.primary.main}`,
                                        backgroundColor: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: 200,
                                        borderRadius: 1,
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
                                </Box>
                            </Box>
                        )}
                    </Box>
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
                                    sx={{ mb: 2 }}
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

                                <TextField
                                    label="Description"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    value={selectedDescription}
                                    onChange={(e) => setSelectedDescription(e.target.value)}
                                    placeholder="e.g., Best friend since college"
                                    helperText="This will appear on the polaroid below the member's name and role"
                                />
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
                                        Image (WebP only (use https://squoosh.app/))
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
