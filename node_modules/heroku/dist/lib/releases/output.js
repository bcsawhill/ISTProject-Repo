import got from 'got';
export const stream = function (url) {
    return new Promise((resolve, reject) => {
        const stream = got.stream(url);
        stream.on('error', reject);
        stream.on('end', resolve);
        const piped = stream.pipe(process.stdout);
        piped.on('error', reject);
    });
};
