import { saveAs } from 'file-saver';

export function download(data) {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json'});
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'signal.bin';
    link.click();

    URL.revokeObjectURL(url);
}

export function saveImage() {
    const chart = document.getElementById("chart");
    const histogram = document.getElementById("histogram");
    
    if (chart && histogram) {
        chart.toBlob(function (blob) {
            if (blob) {
                saveAs(blob, "chart.png");
            } else {
                console.error('Failed to create blob from chart');
            }
        });

        histogram.toBlob(function (blob) {
            if (blob) {
                saveAs(blob, "histogram.png");
            } else {
                console.error('Failed to create blob from histogram');
            }
        });
    } else {
        console.error('Failed to get chart or histogram element');
    }
}
