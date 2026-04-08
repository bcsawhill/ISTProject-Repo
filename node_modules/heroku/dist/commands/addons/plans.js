import { Command, flags } from '@heroku-cli/command';
import { Args } from '@oclif/core';
import { hux } from '@heroku/heroku-cli-util';
import { formatPrice } from '../../lib/addons/util.js';
import _ from 'lodash';
import printf from 'printf';
export default class Plans extends Command {
    static topic = 'addons';
    static description = 'list all available plans for an add-on service';
    static flags = {
        json: flags.boolean({ description: 'output in json format' }),
    };
    static args = {
        service: Args.string({ required: true, description: 'unique identifier or globally unique name of the add-on' }),
    };
    printMeteredPricingURL(service) {
        return printf(`https://elements.heroku.com/addons/${service}#pricing`);
    }
    async run() {
        const { flags, args } = await this.parse(Plans);
        const { service } = args;
        let { body: plans } = await this.heroku.get(`/addon-services/${service}/plans`, {
            headers: {
                Accept: 'application/vnd.heroku+json; version=3.sdk',
            },
        });
        plans = _.sortBy(plans, ['price.contract', 'price.cents']);
        if (flags.json) {
            hux.styledJSON(plans);
        }
        else {
            hux.table(plans, {
                default: {
                    header: ' ',
                    get: (plan) => plan.default ? 'default' : '',
                },
                name: {
                    header: 'Slug',
                },
                human_name: {
                    header: 'Name',
                },
                price: {
                    header: 'Price',
                    get: (plan) => formatPrice({ price: plan.price, hourly: true }),
                },
                max_price: {
                    header: 'Max Price',
                    get: (plan) => plan.price.metered ? this.printMeteredPricingURL(service) : formatPrice({ price: plan.price, hourly: false }),
                },
            });
        }
    }
}
