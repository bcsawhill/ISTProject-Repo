import { color, hux } from '@heroku/heroku-cli-util';
import { Command, flags } from '@heroku-cli/command';
import { Args, ux } from '@oclif/core';
import tsheredoc from 'tsheredoc';
const heredoc = tsheredoc.default;
export default class Topology extends Command {
    static args = {
        space: Args.string({ hidden: true }),
    };
    static description = 'show space topology';
    static flags = {
        json: flags.boolean({ description: 'output in json format' }),
        space: flags.string({ char: 's', description: 'space to get topology of' }),
    };
    static topic = 'spaces';
    getProcessNum(s) {
        return Number.parseInt(s.split('-', 2)[0].split('.', 2)[1], 10);
    }
    getProcessType(s) {
        return s.split('-', 2)[0].split('.', 2)[0];
    }
    render(topology, appInfo, json) {
        if (json) {
            hux.styledJSON(topology);
        }
        else if (topology.apps) {
            topology.apps.forEach(app => {
                const formations = [];
                const dynos = [];
                if (app.formations) {
                    app.formations.forEach(formation => {
                        formations.push(formation.process_type);
                        if (formation.dynos) {
                            formation.dynos.forEach(dyno => {
                                const dynoS = [`${formation.process_type}.${dyno.number}`, dyno.private_ip, dyno.hostname].filter(Boolean);
                                dynos.push(dynoS.join(' - '));
                            });
                        }
                    });
                }
                const domains = app.domains.sort();
                formations.sort();
                dynos.sort((a, b) => {
                    const apt = this.getProcessType(a);
                    const bpt = this.getProcessType(b);
                    if (apt > bpt) {
                        return 1;
                    }
                    if (apt < bpt) {
                        return -1;
                    }
                    return this.getProcessNum(a) - this.getProcessNum(b);
                });
                const info = appInfo.find(info => info.id === app.id);
                let header = info?.name;
                if (formations.length > 0) {
                    header += ` (${color.info(formations.join(', '))})`;
                }
                hux.styledHeader(header || '');
                hux.styledObject({
                    Domains: domains, Dynos: dynos,
                }, ['Domains', 'Dynos']);
                ux.stdout();
            });
        }
    }
    async run() {
        const { args, flags } = await this.parse(Topology);
        const spaceName = flags.space || args.space;
        if (!spaceName) {
            ux.error(heredoc(`
        Error: Missing 1 required arg:
        space
        See more help with --help
      `));
        }
        const { body: topology } = await this.heroku.get(`/spaces/${spaceName}/topology`);
        let appInfo = [];
        if (topology.apps) {
            appInfo = await Promise.all(topology.apps.map(async (topologyApp) => {
                const { body: app } = await this.heroku.get(`/apps/${topologyApp.id}`);
                return app;
            }));
        }
        this.render(topology, appInfo, flags.json);
    }
}
