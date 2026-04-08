import { Command } from '@heroku-cli/command';
export default class AuthWhoami extends Command {
    static aliases = ['whoami'];
    static baseFlags = Command.baseFlagsWithoutPrompt();
    static description = 'display the current logged in user';
    static promptFlagActive = false;
    notloggedin() {
        this.error('not logged in', { exit: 100 });
    }
    async run() {
        if (process.env.HEROKU_API_KEY)
            this.warn('HEROKU_API_KEY is set');
        if (!this.heroku.auth)
            this.notloggedin();
        try {
            const { body: account } = await this.heroku.get('/account', { retryAuth: false });
            this.log(account.email);
        }
        catch (error) {
            if (error.statusCode === 401)
                this.notloggedin();
            throw error;
        }
    }
}
