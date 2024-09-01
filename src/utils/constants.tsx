export const WEDDING_DATE = new Date(1749931200000);
export const PAST_DUE_DATE = WEDDING_DATE.getTime() < new Date().getTime();
export const COUPLE_NAMES = 'Ciara and Chad' as const;
