import { Fab, Typography } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import MapIcon from '@mui/icons-material/Map';

export interface MapListFabProps {
    isListView: boolean;
    setIsListView: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MapListFab = ({ isListView, setIsListView }: MapListFabProps) => {
    return (
        <Fab
            color="primary"
            variant="extended"
            onClick={() => setIsListView(!isListView)}
            style={{
                position: 'fixed',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center', // This centers items vertically
            }}
        >
            <Typography variant="body1" style={{ marginRight: '8px' }}>
                {isListView ? 'Show map' : 'Show list'}
            </Typography>
            {isListView ? (
                <MapIcon sx={{ paddingBottom: '2px' }} />
            ) : (
                <ListIcon sx={{ paddingBottom: '2px' }} />
            )}
        </Fab>
    );
};
