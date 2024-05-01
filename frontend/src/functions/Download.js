export function download(data) {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json'});
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'signal.bin';
    link.click();

    URL.revokeObjectURL(url);
}