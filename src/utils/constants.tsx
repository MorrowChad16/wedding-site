import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

export const WEDDING_DATE = new Date(1748217600000);
export const PAST_DUE_DATE = WEDDING_DATE.getTime() < new Date().getTime();