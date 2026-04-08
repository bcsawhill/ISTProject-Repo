import { hux, color } from '@heroku/heroku-cli-util';
import { Command, flags } from '@heroku-cli/command';
import { Args, ux } from '@oclif/core';
import inquirer from 'inquirer';
import tsheredoc from 'tsheredoc';
import { displayCertificateDetails } from '../../lib/certs/certificate_details.js';
import { waitForDomains } from '../../lib/certs/domains.js';
import { CertAndKeyManager } from '../../lib/certs/get_cert_and_key.js';
const heredoc = tsheredoc.default;
export default class Add extends Command {
    static args = {
        CRT: Args.string({ description: 'absolute path of the certificate file on disk', required: true }),
        KEY: Args.string({ description: 'absolute path of the key file on disk', required: true }),
    };
    static description = `Add an SSL certificate to an app.

  Note: certificates with PEM encoding are also valid.
  `;
    static examples = [heredoc(`
    ${color.command('heroku certs:add example.com.crt example.com.key')}
    If you require intermediate certificates, refer to this article on merging certificates to get a complete chain:
    ${color.info('https://help.salesforce.com/s/articleView?id=000333504&type=1')}`)];
    static flags = {
        app: flags.app({ required: true }),
        remote: flags.remote(),
    };
    static strict = true;
    static topic = 'certs';
    async configureDomains(app, heroku, cert) {
        const certDomains = cert.ssl_cert.cert_domains;
        const apiDomains = await waitForDomains(app, heroku);
        const appDomains = apiDomains?.map((domain) => domain.hostname);
        const matchedDomains = matchDomains(certDomains, appDomains ?? []);
        if (matchedDomains.length > 0) {
            hux.styledHeader('Almost done! Which of these domains on this application would you like this certificate associated with?');
            const selections = await this.selectDomains(matchedDomains);
            await Promise.all(selections?.domains.map(domain => heroku.patch(`/apps/${app}/domains/${domain}`, {
                body: { sni_endpoint: cert.name },
            })));
        }
    }
    getDomainsToAssociate(sniEndpoint) {
        return inquirer.prompt([{
                choices: sniEndpoint.ssl_cert.cert_domains,
                message: 'Select domains',
                name: 'domains',
                type: 'checkbox',
            }]);
    }
    async run() {
        const { args, flags } = await this.parse(Add);
        const { app } = flags;
        const certManager = new CertAndKeyManager();
        const files = await certManager.getCertAndKey(args);
        ux.action.start(`Adding SSL certificate to ${color.app(app)}`);
        const { body: sniEndpoint } = await this.heroku.post(`/apps/${app}/sni-endpoints`, {
            body: {
                certificate_chain: files.crt.toString(),
                private_key: files.key.toString(),
            },
        });
        ux.action.stop();
        displayCertificateDetails(sniEndpoint);
        await this.configureDomains(app, this.heroku, sniEndpoint);
    }
    async selectDomains(domainOptions) {
        return inquirer.prompt([{
                choices: domainOptions,
                message: 'Select domains',
                name: 'domains',
                type: 'checkbox',
            }]);
    }
}
function splitDomains(domains) {
    return domains.map(domain => [domain.slice(0, 1), domain.slice(1)]);
}
function createMatcherFromSplitDomain([firstChar, rest]) {
    const matcherContents = [];
    if (firstChar === '*') {
        matcherContents.push('^[\\w\\-]+');
    }
    else {
        matcherContents.push(firstChar);
    }
    const escapedRest = rest.replaceAll('.', '\\.');
    matcherContents.push(escapedRest);
    return new RegExp(matcherContents.join(''));
}
function matchDomains(certDomains, appDomains) {
    const splitCertDomains = splitDomains(certDomains);
    const matchers = splitCertDomains.map(splitDomain => createMatcherFromSplitDomain(splitDomain));
    if (splitCertDomains.some(domain => (domain[0] === '*'))) {
        const matchedDomains = [];
        appDomains.forEach(appDomain => {
            if (matchers.some(matcher => matcher.test(appDomain))) {
                matchedDomains.push(appDomain);
            }
        });
        return matchedDomains;
    }
    return certDomains.filter(domain => appDomains.includes(domain));
}
