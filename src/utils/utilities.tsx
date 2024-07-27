export const isDevelopment = import.meta.env.MODE === 'development';

export function openInNewWindow(url: string) {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
}

export function generateGoogleMapsLink(address: string) {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
}
