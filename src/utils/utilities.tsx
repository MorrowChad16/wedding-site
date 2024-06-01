export const isDevelopment = import.meta.env.MODE === 'development';

export function openInNewWindow(url: string) {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
}

export function extractFilenameFromImport(importPath: string) {
    const filenameWithHash = importPath.split('/').pop()?.split('?')[0];
    return filenameWithHash?.replace(/-\w+\./, '.') || '';
}
