import debug from 'debug';
import { createReadStream, promises as fs } from 'fs';
import { got } from 'got';
import { gitService } from './git.js';
const ciDebug = debug('ci');
// FileService class for easier testing/stubbing
export class FileService {
    createReadStream(filePath) {
        return createReadStream(filePath);
    }
    async stat(filePath) {
        return fs.stat(filePath);
    }
}
const fileService = new FileService();
async function uploadArchive(url, filePath) {
    const request = got.stream.put(url, {
        headers: {
            'content-length': (await fileService.stat(filePath)).size.toString(),
        },
    });
    fileService.createReadStream(filePath).pipe(request);
    return new Promise((resolve, reject) => {
        request.on('error', reject);
        request.on('response', resolve);
    });
}
async function prepareSource(ref, command) {
    const filePath = await gitService.createArchive(ref);
    const { body: source } = await command.heroku.post('/sources');
    await uploadArchive(source.source_blob.put_url, filePath);
    return source;
}
export async function createSourceBlob(ref, command) {
    try {
        const githubRepository = await gitService.githubRepository();
        const { repo, user } = githubRepository;
        const { body: archiveLink } = await command.heroku.get(`https://kolkrabbi.heroku.com/github/repos/${user}/${repo}/tarball/${ref}`);
        if (await command.heroku.request(archiveLink.archive_link, { method: 'HEAD' })) {
            return archiveLink.archive_link;
        }
    }
    catch (error) {
        // the commit isn't in the repo, we will package the local git commit instead
        ciDebug('Commit not found in pipeline repository', error);
    }
    const sourceBlob = await prepareSource(ref, command);
    return sourceBlob.source_blob.get_url;
}
// Export service instances for testing
export { fileService };
export { gitService } from './git.js';
