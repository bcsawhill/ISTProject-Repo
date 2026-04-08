import { HTTP } from '@heroku/http-call';
async function call(url, out, retries) {
    const maxRetries = 30;
    try {
        const { response } = await HTTP.stream(url);
        response.on('data', (d) => {
            out.write(d);
        });
        return await new Promise((resolve, reject) => {
            response.on('error', reject);
            response.on('end', resolve);
        });
    }
    catch (error) {
        if (error.statusCode === 404 && retries <= maxRetries) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    call(url, out, retries + 1).then(resolve, reject);
                }, 1000);
            });
        }
        throw error;
    }
}
export const streamer = function (url, out) {
    return call(url, out, 0);
};
