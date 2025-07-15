import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
    useTheme,
    CircularProgress,
    DialogActions,
    TextField,
    MenuItem,
    Snackbar,
    Alert,
    Card,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import PageContainer from '../components/page-container';
import HorizontalScroll from '../components/horizontal-scroll';
import { openInNewWindow } from '../utils/utilities';
import { useRef, useState } from 'react';
import {
    getRegistryItems,
    createRegistryItem,
    updateRegistryItem,
    deleteRegistryItem,
    type RegistryItemType,
} from '../api/use-registry';
import { FileUploader, StorageImage } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { useQueryClient } from '@tanstack/react-query';
import { useStore } from '../api/use-store';

interface GiftSection {
    title: string;
    info: RegistryItemType[];
}

export default function Registry() {
    const theme = useTheme();
    const [openFundContribution, setOpenFundContribution] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newImage, setNewImage] = useState('');
    const [newExternalUrl, setNewExternalUrl] = useState('');
    const [newCurrentAmount, setNewCurrentAmount] = useState<number | ''>('');
    const [newTargetAmount, setNewTargetAmount] = useState<number | ''>('');
    const [newSection, setNewSection] = useState<'FUNDS' | 'REGISTRIES'>('FUNDS');
    const [editingItem, setEditingItem] = useState<RegistryItemType | null>(null);
    const [deletingItem, setDeletingItem] = useState<RegistryItemType | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const selectedItem = useRef<RegistryItemType>();
    const { isAdmin } = useStore();
    const { isLoading, error, registryItems } = getRegistryItems();
    const queryClient = useQueryClient();

    const onClose = () => setOpenFundContribution(false);

    const sections = ['FUNDS', 'REGISTRIES'];

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setNewName('');
        setNewDescription('');
        setNewImage('');
        setNewExternalUrl('');
        setNewCurrentAmount('');
        setNewTargetAmount('');
        setNewSection('FUNDS');
    };

    const handleSubmit = async () => {
        if (!newName.trim()) {
            setSnackbarMessage('Please enter a name');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        if (!newImage.trim()) {
            setSnackbarMessage('Please upload an image');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        setSubmitting(true);
        try {
            await createRegistryItem(
                newName.trim(),
                newDescription.trim() || undefined,
                newImage.trim(),
                newExternalUrl.trim() || undefined,
                typeof newCurrentAmount === 'number' ? newCurrentAmount : undefined,
                typeof newTargetAmount === 'number' ? newTargetAmount : undefined,
                newSection
            );

            queryClient.invalidateQueries({ queryKey: ['getRegistryItems'] });

            setSnackbarMessage('Registry item added successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleDialogClose();
        } catch (error) {
            console.error('Error creating registry item:', error);
            setSnackbarMessage('Failed to add registry item. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditItem = (item: RegistryItemType) => {
        setEditingItem(item);
        setNewName(item.name || '');
        setNewDescription(item.description || '');
        setNewImage(item.image);
        setNewExternalUrl(item.externalUrl || '');
        setNewCurrentAmount(item.currentAmount || '');
        setNewTargetAmount(item.targetAmount || '');
        setNewSection(item.section as 'FUNDS' | 'REGISTRIES');
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        setEditingItem(null);
        setNewName('');
        setNewDescription('');
        setNewImage('');
        setNewExternalUrl('');
        setNewCurrentAmount('');
        setNewTargetAmount('');
        setNewSection('FUNDS');
    };

    const handleEditSubmit = async () => {
        if (!newName.trim()) {
            setSnackbarMessage('Please enter a name');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        if (!editingItem || !newImage.trim()) {
            setSnackbarMessage('Please upload an image');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        setSubmitting(true);
        try {
            await updateRegistryItem(
                editingItem.id,
                newName.trim(),
                newDescription.trim() || undefined,
                newImage.trim(),
                newExternalUrl.trim() || undefined,
                typeof newCurrentAmount === 'number' ? newCurrentAmount : undefined,
                typeof newTargetAmount === 'number' ? newTargetAmount : undefined,
                newSection
            );

            queryClient.invalidateQueries({ queryKey: ['getRegistryItems'] });

            setSnackbarMessage('Registry item updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleEditDialogClose();
        } catch (error) {
            console.error('Error updating registry item:', error);
            setSnackbarMessage('Failed to update registry item. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteItem = (item: RegistryItemType) => {
        setDeletingItem(item);
        setDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setDeletingItem(null);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingItem) return;

        setSubmitting(true);
        try {
            await deleteRegistryItem(deletingItem.id);

            queryClient.invalidateQueries({ queryKey: ['getRegistryItems'] });

            setSnackbarMessage('Registry item deleted successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleDeleteDialogClose();
        } catch (error) {
            console.error('Error deleting registry item:', error);
            setSnackbarMessage('Failed to delete registry item. Please try again.');
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
                <Typography variant="h4" color="error" textAlign="center">
                    Error loading registry items
                </Typography>
            </PageContainer>
        );
    }

    // Show message if no items and not admin
    if ((!registryItems || registryItems.length === 0) && !isAdmin) {
        return (
            <PageContainer>
                <Alert severity="info">No registry items available at the moment.</Alert>
            </PageContainer>
        );
    }

    // Group items by section
    const giftSections: GiftSection[] = [];
    const sectionMap = new Map<string, RegistryItemType[]>();

    // Initialize all sections if admin, or if there are items in them
    const allSections = ['FUNDS', 'REGISTRIES'];
    if (isAdmin) {
        // For admins, always show all sections even if empty
        allSections.forEach((section) => {
            sectionMap.set(section, []);
        });
    }

    // Add items to their respective sections
    registryItems?.forEach((item) => {
        if (!sectionMap.has(item.section)) {
            sectionMap.set(item.section, []);
        }
        sectionMap.get(item.section)!.push(item);
    });

    // Convert to sections array
    sectionMap.forEach((items, title) => {
        giftSections.push({ title, info: items });
    });

    return (
        <PageContainer>
            <>
                <div>
                    {giftSections.map((section, index) => {
                        return (
                            <div key={section.title}>
                                <Typography variant="h3" mt={index === 0 ? 0 : 5}>
                                    {section.title}
                                </Typography>
                                <HorizontalScroll>
                                    {[
                                        // Admin Add New Card
                                        ...(isAdmin
                                            ? [
                                                  <Paper
                                                      key="add-new"
                                                      sx={{
                                                          border: `2px dashed ${theme.palette.primary.main}`,
                                                          borderRadius: '10px',
                                                          mr: '24px',
                                                          width: '250px',
                                                          minWidth: '250px',
                                                      }}
                                                  >
                                                      <Card
                                                          onClick={handleDialogOpen}
                                                          sx={{
                                                              backgroundColor: 'transparent',
                                                              cursor: 'pointer',
                                                              display: 'flex',
                                                              alignItems: 'center',
                                                              justifyContent: 'center',
                                                              minHeight: 300,
                                                              border: 'none',
                                                              boxShadow: 'none',
                                                              '&:hover': {
                                                                  backgroundColor:
                                                                      theme.palette.action.hover,
                                                              },
                                                          }}
                                                      >
                                                          <Box textAlign="center">
                                                              <AddIcon
                                                                  sx={{
                                                                      color: theme.palette.primary
                                                                          .main,
                                                                      fontSize: 48,
                                                                      mb: 1,
                                                                  }}
                                                              />
                                                              <Typography
                                                                  variant="h6"
                                                                  color="primary"
                                                              >
                                                                  Add New Item
                                                              </Typography>
                                                          </Box>
                                                      </Card>
                                                  </Paper>,
                                              ]
                                            : []),
                                        // Registry items
                                        ...section.info.map((item, itemIndex) => (
                                            <Paper
                                                key={item.id}
                                                elevation={4}
                                                sx={{
                                                    border: `1px solid ${theme.palette.primary.main}`,
                                                    borderRadius: '10px',
                                                    mr:
                                                        itemIndex === section.info.length - 1
                                                            ? '0px'
                                                            : '24px',
                                                    width: '250px',
                                                    minWidth: '250px',
                                                    position: 'relative',
                                                }}
                                            >
                                                <Box p={2}>
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
                                                                backgroundColor:
                                                                    'rgba(255, 255, 255, 0.9)',
                                                                borderRadius: 1,
                                                                padding: 0.5,
                                                            }}
                                                        >
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleEditItem(item)}
                                                                color="primary"
                                                                sx={{
                                                                    backgroundColor: 'white',
                                                                    '&:hover': {
                                                                        backgroundColor: 'grey.100',
                                                                    },
                                                                }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() =>
                                                                    handleDeleteItem(item)
                                                                }
                                                                color="error"
                                                                sx={{
                                                                    backgroundColor: 'white',
                                                                    '&:hover': {
                                                                        backgroundColor: 'grey.100',
                                                                    },
                                                                }}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    )}

                                                    {/* Title Section */}
                                                    {item.name && (
                                                        <Typography
                                                            variant="h5"
                                                            gutterBottom
                                                            mb={2}
                                                            textAlign={'center'}
                                                        >
                                                            {item.name}
                                                        </Typography>
                                                    )}

                                                    {/* Image Section */}
                                                    <Box
                                                        display="flex"
                                                        justifyContent="center"
                                                        mb={2}
                                                    >
                                                        <StorageImage
                                                            alt={
                                                                item.name ||
                                                                `registry-item-${itemIndex}`
                                                            }
                                                            path={item.image}
                                                            style={{
                                                                width: '100%',
                                                                height: '150px',
                                                                objectFit: 'cover',
                                                                objectPosition: 'center',
                                                                borderRadius: '10px',
                                                                display: 'block',
                                                            }}
                                                            loading="lazy"
                                                            validateObjectExistence={false}
                                                        />
                                                    </Box>

                                                    {/* Description Section */}
                                                    {item.description && (
                                                        <Typography
                                                            variant="body2"
                                                            textAlign={'center'}
                                                            mb={2}
                                                            whiteSpace={'normal'}
                                                        >
                                                            {item.description}
                                                        </Typography>
                                                    )}

                                                    {/* Progress Bar Section */}
                                                    {item.targetAmount && (
                                                        <Box mb={2}>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={Math.min(
                                                                    ((item.currentAmount || 0) /
                                                                        item.targetAmount) *
                                                                        100,
                                                                    100
                                                                )}
                                                                sx={{
                                                                    height: 8,
                                                                    borderRadius: 4,
                                                                    backgroundColor:
                                                                        theme.palette.grey[200],
                                                                    '& .MuiLinearProgress-bar': {
                                                                        borderRadius: 4,
                                                                        backgroundColor:
                                                                            theme.palette.primary
                                                                                .main,
                                                                    },
                                                                }}
                                                            />
                                                            <Box
                                                                display="flex"
                                                                justifyContent="center"
                                                                mt={1}
                                                            >
                                                                <Typography
                                                                    variant="caption"
                                                                    color="text.secondary"
                                                                >
                                                                    {Math.round(
                                                                        ((item.currentAmount || 0) /
                                                                            item.targetAmount) *
                                                                            100
                                                                    )}
                                                                    % funded
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    )}

                                                    {/* Button Section */}
                                                    {item.externalUrl ? (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            aria-label="website-link"
                                                            onClick={() =>
                                                                openInNewWindow(item.externalUrl!)
                                                            }
                                                            sx={{
                                                                display: 'block',
                                                                m: '0 auto',
                                                            }}
                                                        >
                                                            View
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => {
                                                                selectedItem.current = item;
                                                                setOpenFundContribution(true);
                                                            }}
                                                            sx={{
                                                                display: 'block',
                                                                m: '0 auto',
                                                            }}
                                                        >
                                                            Contribute
                                                        </Button>
                                                    )}
                                                </Box>
                                            </Paper>
                                        )),
                                    ]}
                                </HorizontalScroll>
                            </div>
                        );
                    })}
                </div>

                {/* Fund Contribution Dialog */}
                <Dialog open={openFundContribution} onClose={onClose}>
                    <DialogTitle>
                        Contribute
                        <IconButton
                            aria-label="close"
                            onClick={onClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText mb={2}>
                            You have a few options to help fund our {selectedItem.current?.name}{' '}
                            fund:
                            <List dense>
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <Typography component="span">
                                                Venmo:{' '}
                                                <Typography component="span" fontWeight="bold">
                                                    TODO
                                                </Typography>
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <Typography component="span">
                                                Zelle:{' '}
                                                <Typography component="span" fontWeight="bold">
                                                    815-708-4489
                                                </Typography>
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <Typography component="span">
                                                Cash:{' '}
                                                <Typography component="span" fontWeight="bold">
                                                    we'll have a table setup at the wedding ceremony
                                                    to accept any gifts in person.
                                                </Typography>
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            </List>{' '}
                            If you go with Venmo or Zelle, please put "{selectedItem.current?.name}"
                            in the description.
                        </DialogContentText>
                    </DialogContent>
                </Dialog>

                {/* Add Registry Item Dialog */}
                <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
                    <DialogTitle>Add New Registry Item</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Name *"
                            fullWidth
                            variant="outlined"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            label="Description (optional)"
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            label="External URL (optional)"
                            fullWidth
                            variant="outlined"
                            value={newExternalUrl}
                            onChange={(e) => setNewExternalUrl(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Box display="flex" gap={2} sx={{ mb: 2 }}>
                            <TextField
                                label="Current Amount (optional)"
                                type="number"
                                value={newCurrentAmount}
                                onChange={(e) =>
                                    setNewCurrentAmount(
                                        e.target.value ? Number(e.target.value) : ''
                                    )
                                }
                                inputProps={{ min: 0 }}
                                sx={{ flex: 1 }}
                            />
                            <TextField
                                label="Target Amount (optional)"
                                type="number"
                                value={newTargetAmount}
                                onChange={(e) =>
                                    setNewTargetAmount(e.target.value ? Number(e.target.value) : '')
                                }
                                inputProps={{ min: 0 }}
                                sx={{ flex: 1 }}
                            />
                        </Box>
                        <TextField
                            select
                            label="Section"
                            value={newSection}
                            onChange={(e) =>
                                setNewSection(e.target.value as 'FUNDS' | 'REGISTRIES')
                            }
                            sx={{ minWidth: 150, mb: 2 }}
                        >
                            {sections.map((section) => (
                                <MenuItem key={section} value={section}>
                                    {section}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Image *
                            </Typography>
                            <FileUploader
                                acceptedFileTypes={['image/webp']}
                                path="registry/"
                                maxFileCount={1}
                                isResumable
                                onUploadSuccess={(result) => {
                                    if (result && result.key) {
                                        setNewImage(result.key);
                                    }
                                }}
                                onUploadError={(error) => {
                                    console.error('Upload error:', error);
                                    setSnackbarMessage('Failed to upload image. Please try again.');
                                    setSnackbarSeverity('error');
                                    setSnackbarOpen(true);
                                    setNewImage('');
                                }}
                            />
                            {newImage && (
                                <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                                    Image uploaded successfully!
                                </Typography>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Cancel</Button>
                        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
                            {submitting ? 'Adding...' : 'Add Item'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Edit Registry Item Dialog */}
                <Dialog
                    open={editDialogOpen}
                    onClose={handleEditDialogClose}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Edit Registry Item</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Name *"
                            fullWidth
                            variant="outlined"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            label="Description (optional)"
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            label="External URL (optional)"
                            fullWidth
                            variant="outlined"
                            value={newExternalUrl}
                            onChange={(e) => setNewExternalUrl(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Box display="flex" gap={2} sx={{ mb: 2 }}>
                            <TextField
                                label="Current Amount (optional)"
                                type="number"
                                value={newCurrentAmount}
                                onChange={(e) =>
                                    setNewCurrentAmount(
                                        e.target.value ? Number(e.target.value) : ''
                                    )
                                }
                                inputProps={{ min: 0 }}
                                sx={{ flex: 1 }}
                            />
                            <TextField
                                label="Target Amount (optional)"
                                type="number"
                                value={newTargetAmount}
                                onChange={(e) =>
                                    setNewTargetAmount(e.target.value ? Number(e.target.value) : '')
                                }
                                inputProps={{ min: 0 }}
                                sx={{ flex: 1 }}
                            />
                        </Box>
                        <TextField
                            select
                            label="Section"
                            value={newSection}
                            onChange={(e) =>
                                setNewSection(e.target.value as 'FUNDS' | 'REGISTRIES')
                            }
                            sx={{ minWidth: 150, mb: 2 }}
                        >
                            {sections.map((section) => (
                                <MenuItem key={section} value={section}>
                                    {section}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Image *
                            </Typography>
                            <FileUploader
                                acceptedFileTypes={['image/webp']}
                                path="registry/"
                                maxFileCount={1}
                                isResumable
                                onUploadSuccess={(result) => {
                                    if (result && result.key) {
                                        setNewImage(result.key);
                                    }
                                }}
                                onUploadError={(error) => {
                                    console.error('Upload error:', error);
                                    setSnackbarMessage('Failed to upload image. Please try again.');
                                    setSnackbarSeverity('error');
                                    setSnackbarOpen(true);
                                    setNewImage('');
                                }}
                            />
                            {newImage && (
                                <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                                    {newImage.includes('/')
                                        ? 'New image uploaded successfully!'
                                        : 'Current image: Using existing image'}
                                </Typography>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditDialogClose}>Cancel</Button>
                        <Button
                            onClick={handleEditSubmit}
                            variant="contained"
                            disabled={submitting}
                        >
                            {submitting ? 'Updating...' : 'Update Item'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Registry Item Confirmation Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={handleDeleteDialogClose}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Delete Registry Item</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to delete this registry item?</Typography>
                        {deletingItem && (
                            <Box mt={2} p={2} sx={{ backgroundColor: 'grey.100', borderRadius: 1 }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    Name: {deletingItem.name || 'Unnamed Item'}
                                </Typography>
                                {deletingItem.description && (
                                    <Typography variant="body2" mt={1}>
                                        Description: {deletingItem.description}
                                    </Typography>
                                )}
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    mt={1}
                                    display="block"
                                >
                                    Section: {deletingItem.section}
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
                            {submitting ? 'Deleting...' : 'Delete Item'}
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
