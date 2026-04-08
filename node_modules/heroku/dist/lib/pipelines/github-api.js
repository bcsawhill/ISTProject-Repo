import { HTTP } from '@heroku/http-call';
const GITHUB_API = 'https://api.github.com';
export default class GitHubAPI {
    version;
    token;
    constructor(version, token) {
        this.version = version;
        this.token = token;
    }
    request(url, options = {}) {
        options.headers = {
            Authorization: `Token ${this.token}`,
            'User-Agent': this.version,
            ...options.headers,
        };
        return HTTP.get(`${GITHUB_API}${url}`, options);
    }
    getRepo(name) {
        return this.request(`/repos/${name}`).then((res) => res.body);
    }
}
