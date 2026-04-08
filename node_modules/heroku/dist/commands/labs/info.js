import { color, hux } from '@heroku/heroku-cli-util';
import { Command, flags } from '@heroku-cli/command';
import { Args } from '@oclif/core';
function print(feature) {
    hux.styledHeader(feature.name);
    /* eslint-disable perfectionist/sort-objects */
    hux.styledObject({
        Description: feature.description,
        Enabled: feature.enabled ? color.success('true') : color.failure('false'),
        Docs: feature.doc_url,
    });
    /* eslint-enable perfectionist/sort-objects */
}
export default class LabsInfo extends Command {
    static args = {
        feature: Args.string({ description: 'unique identifier or name of the account feature', required: true }),
    };
    static description = 'show feature info';
    static flags = {
        app: flags.app({ required: false }),
        json: flags.boolean({ description: 'display as json', required: false }),
        remote: flags.remote(),
    };
    static topic = 'labs';
    async run() {
        const { args, flags } = await this.parse(LabsInfo);
        let feature;
        try {
            const featureResponse = await this.heroku.get(`/account/features/${args.feature}`);
            feature = featureResponse.body;
        }
        catch (error) {
            if (error.http.statusCode !== 404)
                throw error;
            // might be an app feature
            if (!flags.app)
                throw error;
            const featureResponse = await this.heroku.get(`/apps/${flags.app}/features/${args.feature}`);
            feature = featureResponse.body;
        }
        if (flags.json) {
            hux.styledJSON(feature);
        }
        else {
            print(feature);
        }
    }
}
