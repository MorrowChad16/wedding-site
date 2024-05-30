export function importAllImages(r) {
    return Object.entries(r).reduce((acc, [path]) => {
        const filename = path.replace(/^.*[\\\/]/, '');
        const imageSrc = path.replace('../', '/src/');
        acc[filename] = imageSrc;
        return acc;
    }, {});
}
export function openInNewWindow(url) {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow)
        newWindow.opener = null;
}
