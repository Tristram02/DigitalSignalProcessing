export function FileUpload(target) {
    return new Promise((resolve, reject) => {
        const file = target.files[0];

        if (!file) {
            reject('No file selected');
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            const data = JSON.parse(event.target.result);
            resolve(data.signal);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsText(file);

    });
}

export function FileUploadComplex(target) {
    return new Promise((resolve, reject) => {
        const file = target.files[0];

        if (!file) {
            reject('No file selected');
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const complexSignalData = JSON.parse(event.target.result);
                resolve(complexSignalData);
            } catch (error) {
                reject('Error parsing JSON');
            }
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsText(file);
    });
}
