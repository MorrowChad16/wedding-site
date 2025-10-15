import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PhoneIcon from '@mui/icons-material/Phone';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useState } from 'react';
import PageContainer from '../components/page-container';
import { generateGoogleMapsLink, openInNewWindow } from '../utils/utilities';
import HorizontalScroll from '../components/horizontal-scroll';
import { MapListFab } from '../components/map-list-fab';
import TravelMap from '../components/snazzy-map';
import {
    getTravelItems,
    createTravelItem,
    updateTravelItem,
    deleteTravelItem,
    type TravelItemType,
} from '../api/use-travel';
import { FileUploader, StorageImage } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { useQueryClient } from '@tanstack/react-query';
import { useStore } from '../api/use-store';

export type LocationCategory =
    | 'HOTEL'
    | 'AIRBNB'
    | 'AIRPORT'
    | 'TRANSPORTATION'
    | 'RESTAURANT'
    | 'BAR'
    | 'BREWERY'
    | 'PARK'
    | 'GOLF'
    | 'CEREMONY_VENUE';

interface TravelSection {
    title: string;
    info: TravelItemType[];
}

export default function Travel() {
    const theme = useTheme();
    const [isListView, setIsListView] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [newCategory, setNewCategory] = useState<LocationCategory | ''>('');
    const [newImage, setNewImage] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newWebsiteUrl, setNewWebsiteUrl] = useState('');
    const [newCoordinatesLat, setNewCoordinatesLat] = useState<number>(0);
    const [newCoordinatesLng, setNewCoordinatesLng] = useState<number>(0);
    const [editingItem, setEditingItem] = useState<TravelItemType | null>(null);
    const [deletingItem, setDeletingItem] = useState<TravelItemType | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const { isAdmin } = useStore();
    const { isLoading, error, travelItems } = getTravelItems();
    const queryClient = useQueryClient();

    // Use the schema's TravelCategory enum values
    const locationCategories: LocationCategory[] = [
        'HOTEL',
        'AIRBNB',
        'AIRPORT',
        'TRANSPORTATION',
        'RESTAURANT',
        'BAR',
        'BREWERY',
        'PARK',
        'GOLF',
        'CEREMONY_VENUE',
    ];

    const handleDialogOpen = (category?: LocationCategory) => {
        setDialogOpen(true);
        if (category) {
            setNewCategory(category);
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setNewName('');
        setNewCategory('');
        setNewImage('');
        setNewAddress('');
        setNewPhone('');
        setNewDescription('');
        setNewWebsiteUrl('');
        setNewCoordinatesLat(0);
        setNewCoordinatesLng(0);
    };

    const handleSubmit = async () => {
        if (!newName.trim()) {
            setSnackbarMessage('Please enter a name');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        if (!newCategory) {
            setSnackbarMessage('Please select a category');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        setSubmitting(true);
        try {
            await createTravelItem(
                newName.trim(),
                newCategory,
                newImage.trim() || undefined,
                newAddress.trim() || undefined,
                newPhone.trim() || undefined,
                newDescription.trim() || undefined,
                newWebsiteUrl.trim() || undefined,
                typeof newCoordinatesLat === 'number' ? newCoordinatesLat : undefined,
                typeof newCoordinatesLng === 'number' ? newCoordinatesLng : undefined
            );

            queryClient.invalidateQueries({ queryKey: ['getTravelItems'] });

            setSnackbarMessage('Travel item added successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleDialogClose();
        } catch (error) {
            console.error('Error creating travel item:', error);
            setSnackbarMessage('Failed to add travel item. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditItem = (item: TravelItemType) => {
        setEditingItem(item);
        setNewName(item.name || '');
        setNewCategory(item.category || '');
        setNewImage(item.image || '');
        setNewAddress(item.address || '');
        setNewPhone(item.phone || '');
        setNewDescription(item.description || '');
        setNewWebsiteUrl(item.websiteUrl || '');
        setNewCoordinatesLat(item.coordinatesLat || 0);
        setNewCoordinatesLng(item.coordinatesLng || 0);
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        setEditingItem(null);
        setNewName('');
        setNewCategory('');
        setNewImage('');
        setNewAddress('');
        setNewPhone('');
        setNewDescription('');
        setNewWebsiteUrl('');
        setNewCoordinatesLat(0);
        setNewCoordinatesLng(0);
    };

    const handleEditSubmit = async () => {
        if (!newName.trim()) {
            setSnackbarMessage('Please enter a name');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        if (!editingItem) {
            setSnackbarMessage('No item selected for editing');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        if (!newCategory) {
            setSnackbarMessage('Please select a category');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        setSubmitting(true);
        try {
            await updateTravelItem(
                editingItem.id,
                newName.trim(),
                newCategory,
                newImage.trim() || undefined,
                newAddress.trim() || undefined,
                newPhone.trim() || undefined,
                newDescription.trim() || undefined,
                newWebsiteUrl.trim() || undefined,
                typeof newCoordinatesLat === 'number' ? newCoordinatesLat : undefined,
                typeof newCoordinatesLng === 'number' ? newCoordinatesLng : undefined
            );

            queryClient.invalidateQueries({ queryKey: ['getTravelItems'] });

            setSnackbarMessage('Travel item updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleEditDialogClose();
        } catch (error) {
            console.error('Error updating travel item:', error);
            setSnackbarMessage('Failed to update travel item. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteItem = (item: TravelItemType) => {
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
            await deleteTravelItem(deletingItem.id);

            queryClient.invalidateQueries({ queryKey: ['getTravelItems'] });

            setSnackbarMessage('Travel item deleted successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleDeleteDialogClose();
        } catch (error) {
            console.error('Error deleting travel item:', error);
            setSnackbarMessage('Failed to delete travel item. Please try again.');
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
                    Error loading travel items
                </Typography>
            </PageContainer>
        );
    }

    // Show message if no items and not admin
    if ((!travelItems || travelItems.length === 0) && !isAdmin) {
        return (
            <PageContainer display="block" justifyContent="flex-start">
                <div>
                    <Alert severity="info">No travel items available at the moment.</Alert>
                    <MapListFab isListView={isListView} setIsListView={setIsListView} />
                </div>
            </PageContainer>
        );
    }

    // Group items by category
    const travelSections: TravelSection[] = [];
    const categoryMap = new Map<string, TravelItemType[]>();

    // Initialize all categories if admin, or if there are items in them
    const allCategories = locationCategories;
    if (isAdmin) {
        // For admins, always show all categories even if empty
        allCategories.forEach((category) => {
            categoryMap.set(category, []);
        });
    }

    // Add items to their respective categories
    travelItems?.forEach((item) => {
        if (!categoryMap.has(item.category)) {
            categoryMap.set(item.category, []);
        }
        categoryMap.get(item.category)!.push(item);
    });

    // Convert to sections array
    categoryMap.forEach((items, title) => {
        travelSections.push({ title, info: items });
    });

    return (
        <PageContainer display="block" justifyContent="flex-start">
            <div>
                {isListView ? (
                    <div>
                        {travelSections.map((section, index) => {
                            return (
                                <div key={section.title}>
                                    <Typography variant="h3" mt={index === 0 ? 0 : 5}>
                                        {section.title?.replace('_', ' ')}
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
                                                              width: '400px',
                                                              minWidth: '400px',
                                                          }}
                                                      >
                                                          <Card
                                                              onClick={() =>
                                                                  handleDialogOpen(
                                                                      section.title as LocationCategory
                                                                  )
                                                              }
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
                                                                          theme.palette.action
                                                                              .hover,
                                                                  },
                                                              }}
                                                          >
                                                              <Box textAlign="center">
                                                                  <AddIcon
                                                                      sx={{
                                                                          color: theme.palette
                                                                              .primary.main,
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
                                            // Travel items
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
                                                        width: '400px',
                                                        minWidth: '400px',
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
                                                                    onClick={() =>
                                                                        handleEditItem(item)
                                                                    }
                                                                    color="primary"
                                                                    sx={{
                                                                        backgroundColor: 'white',
                                                                        '&:hover': {
                                                                            backgroundColor:
                                                                                'grey.100',
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
                                                                            backgroundColor:
                                                                                'grey.100',
                                                                        },
                                                                    }}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                        )}

                                                        {/* Title Section */}
                                                        <Typography
                                                            variant="h5"
                                                            gutterBottom
                                                            mb={2}
                                                            textAlign={'center'}
                                                        >
                                                            {item.name}
                                                        </Typography>

                                                        {/* Image Section */}
                                                        {item.image && (
                                                            <Box
                                                                display="flex"
                                                                justifyContent="center"
                                                                mb={2}
                                                            >
                                                                <StorageImage
                                                                    alt={
                                                                        item.name ||
                                                                        `travel-item-${itemIndex}`
                                                                    }
                                                                    path={item.image}
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '300px',
                                                                        objectFit: 'cover',
                                                                        objectPosition: 'center',
                                                                        borderRadius: '10px',
                                                                        display: 'block',
                                                                    }}
                                                                    loading="lazy"
                                                                    validateObjectExistence={false}
                                                                />
                                                            </Box>
                                                        )}

                                                        {/* Address Section */}
                                                        {item.address && (
                                                            <Button
                                                                variant="text"
                                                                onClick={() =>
                                                                    openInNewWindow(
                                                                        generateGoogleMapsLink(
                                                                            item.address!
                                                                        )
                                                                    )
                                                                }
                                                                style={{
                                                                    display: 'flex',
                                                                    marginBottom: 2,
                                                                    justifyContent: 'center',
                                                                    width: '100%',
                                                                }}
                                                            >
                                                                <LocationOnIcon fontSize="inherit" />
                                                                {item.address}
                                                                <OpenInNewIcon
                                                                    style={{ marginLeft: 2 }}
                                                                    fontSize="inherit"
                                                                />
                                                            </Button>
                                                        )}

                                                        {/* Phone Section */}
                                                        {item.phone && (
                                                            <Typography
                                                                variant="body1"
                                                                gutterBottom
                                                                textAlign={'center'}
                                                                mb={2}
                                                            >
                                                                <PhoneIcon fontSize="inherit" />
                                                                {item.phone}
                                                            </Typography>
                                                        )}

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

                                                        {/* Website Button */}
                                                        {item.websiteUrl && (
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                aria-label="website-link"
                                                                onClick={() =>
                                                                    openInNewWindow(
                                                                        item.websiteUrl!
                                                                    )
                                                                }
                                                                sx={{
                                                                    display: 'block',
                                                                    m: '0 auto',
                                                                }}
                                                            >
                                                                Website
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
                ) : (
                    <TravelMap />
                )}
                <MapListFab isListView={isListView} setIsListView={setIsListView} />

                {/* Add Travel Item Dialog */}
                <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
                    <DialogTitle>Add New Travel Item</DialogTitle>
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
                            select
                            label="Category *"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value as LocationCategory)}
                            sx={{ minWidth: 200, mb: 2 }}
                        >
                            <MenuItem value="">Select a category</MenuItem>
                            {locationCategories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category.replace('_', ' ')}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            margin="dense"
                            label="Address (optional)"
                            fullWidth
                            variant="outlined"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            label="Phone (optional)"
                            fullWidth
                            variant="outlined"
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
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
                            label="Website URL (optional)"
                            fullWidth
                            variant="outlined"
                            value={newWebsiteUrl}
                            onChange={(e) => setNewWebsiteUrl(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Box display="flex" gap={2} sx={{ mb: 2 }}>
                            <TextField
                                label="Latitude *"
                                type="number"
                                value={newCoordinatesLat}
                                onChange={(e) =>
                                    setNewCoordinatesLat(parseFloat(e.target.value) || 0)
                                }
                                fullWidth
                            />
                            <TextField
                                label="Longitude *"
                                type="number"
                                value={newCoordinatesLng}
                                onChange={(e) =>
                                    setNewCoordinatesLng(parseFloat(e.target.value) || 0)
                                }
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Image (optional)
                            </Typography>
                            <FileUploader
                                acceptedFileTypes={['image/webp']}
                                path="travel/"
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

                {/* Edit Travel Item Dialog */}
                <Dialog
                    open={editDialogOpen}
                    onClose={handleEditDialogClose}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Edit Travel Item</DialogTitle>
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
                            select
                            label="Category *"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value as LocationCategory)}
                            sx={{ minWidth: 200, mb: 2 }}
                        >
                            <MenuItem value="">Select a category</MenuItem>
                            {locationCategories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category.replace('_', ' ')}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            margin="dense"
                            label="Address (optional)"
                            fullWidth
                            variant="outlined"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            label="Phone (optional)"
                            fullWidth
                            variant="outlined"
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
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
                            label="Website URL (optional)"
                            fullWidth
                            variant="outlined"
                            value={newWebsiteUrl}
                            onChange={(e) => setNewWebsiteUrl(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Box display="flex" gap={2} sx={{ mb: 2 }}>
                            <TextField
                                label="Latitude *"
                                type="number"
                                value={newCoordinatesLat}
                                onChange={(e) =>
                                    setNewCoordinatesLat(parseFloat(e.target.value) || 0)
                                }
                                fullWidth
                            />
                            <TextField
                                label="Longitude *"
                                type="number"
                                value={newCoordinatesLng}
                                onChange={(e) =>
                                    setNewCoordinatesLng(parseFloat(e.target.value) || 0)
                                }
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Image (optional)
                            </Typography>
                            <FileUploader
                                acceptedFileTypes={['image/webp']}
                                path="travel/"
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

                {/* Delete Travel Item Confirmation Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={handleDeleteDialogClose}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Delete Travel Item</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to delete this travel item?</Typography>
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
                                    Category: {deletingItem.category?.replace('_', ' ')}
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
            </div>
        </PageContainer>
    );
}
