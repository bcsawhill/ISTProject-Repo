import { APIClient, Command } from '@heroku-cli/command';
export default abstract class extends Command {
    get dataApi(): APIClient;
}
