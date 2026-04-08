import { color, hux } from '@heroku/heroku-cli-util';
import { Command, flags } from '@heroku-cli/command';
import { Args, ux } from '@oclif/core';
import { ago } from '../../lib/time.js';
const getProcessNum = (s) => Number.parseInt(s.split('.', 2)[1], 10);
export default class Ps extends Command {
    static args = {
        space: Args.string({ hidden: true }),
    };
    static description = 'list dynos for a space';
    static flags = {
        json: flags.boolean({ description: 'output in json format' }),
        space: flags.string({ char: 's', description: 'space to get dynos of' }),
    };
    static topic = 'spaces';
    async run() {
        const { args, flags } = await this.parse(Ps);
        const spaceName = flags.space || args.space;
        if (!spaceName) {
            throw new Error('Space name required.\nUSAGE: heroku spaces:ps my-space');
        }
        const [{ body: spaceDynos }, { body: space }] = await Promise.all([
            this.heroku.get(`/spaces/${spaceName}/dynos`),
            this.heroku.get(`/spaces/${spaceName}`),
        ]);
        if (space.shield) {
            spaceDynos.forEach(spaceDyno => {
                spaceDyno.dynos.forEach(d => {
                    if (d.size?.startsWith('Private')) {
                        d.size = d.size.replace('Private-', 'Shield-');
                    }
                });
            });
        }
        if (flags.json) {
            hux.styledJSON(spaceDynos);
        }
        else {
            this.render(spaceDynos);
        }
    }
    printDynos(appName, dynos) {
        const dynosByCommand = new Map();
        for (const dyno of dynos) {
            const since = ago(new Date(dyno.updated_at));
            const size = dyno.size ?? '1X';
            let key = '';
            let item = '';
            if (dyno.type === 'run') {
                key = 'run: one-off processes';
                item = `${dyno.name} (${size}): ${dyno.state} ${since}: ${dyno.command}`;
            }
            else {
                key = `${color.name(dyno.type)} (${color.info(size)}): ${dyno.command}`;
                const state = dyno.state === 'up' ? color.success(dyno.state) : color.warning(dyno.state);
                item = `${dyno.name}: ${color.info(state)} ${color.dim(since)}`;
            }
            if (!dynosByCommand.has(key)) {
                dynosByCommand.set(key, []);
            }
            dynosByCommand.get(key)?.push(item);
        }
        for (const [key, dynos] of dynosByCommand) {
            hux.styledHeader(`${appName} ${key} (${color.info(dynos.length.toString())})`);
            dynos.sort((a, b) => getProcessNum(a) - getProcessNum(b));
            for (const dyno of dynos) {
                ux.stdout(dyno);
            }
            ux.stdout();
        }
    }
    render(spaceDynos) {
        spaceDynos?.forEach(spaceDyno => {
            this.printDynos(spaceDyno.app_name, spaceDyno.dynos);
        });
    }
}
