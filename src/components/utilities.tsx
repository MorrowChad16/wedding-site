export const isDevelopment = import.meta.env.MODE === 'development';

export function importAllImages(r: Record<string, { default: string }>) {
    return Object.entries(r).reduce(
        (acc, [path]) => {
            const filename: string = path.replace(/^.*[\\\/]/, '');
            const replacementString = isDevelopment ? '/src/' : '/';
            const imageSrc: string = path.replace('../', replacementString);
            acc[filename] = imageSrc;
            return acc;
        },
        {} as Record<string, string>
    );
}

export function openInNewWindow(url: string) {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
}
