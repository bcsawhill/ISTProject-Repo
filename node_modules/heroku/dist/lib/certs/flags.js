export default async function (flags, heroku) {
    if (flags.endpoint && flags.name) {
        throw new Error('Specified both --name and --endpoint, please use just one');
    }
    let { body: sniEndpoints } = await heroku.get(`/apps/${flags.app}/sni-endpoints`);
    if (sniEndpoints.length === 0) {
        throw new Error(`${flags.app} has no SSL certificates`);
    }
    if (flags.endpoint) {
        const promises = [];
        sniEndpoints.forEach(endpoint => {
            endpoint.domains.forEach(domain => promises.push(heroku.get(`/apps/${flags.app}/domains/${domain}`)));
        });
        const domains = (await Promise.all(promises)).map(({ body: domain }) => domain);
        sniEndpoints = sniEndpoints.filter(endpoint => 
        // This was modified from `endpoint.cname === flags.endpoint` because `cname` doesn't exist anymore in the SniEndpoint serialization.
        // We're making the assumption that the `--endpoint` flag was being used to search by hostname (internationalized domain name).
        domains.some(domain => domain.hostname === flags.endpoint && domain.sni_endpoint?.name === endpoint.name));
        if (sniEndpoints.length > 1) {
            throw new Error('Must pass --name when more than one endpoint matches --endpoint');
        }
    }
    if (flags.name) {
        sniEndpoints = sniEndpoints.filter(endpoint => endpoint.name === flags.name);
        if (sniEndpoints.length > 1) {
            throw new Error(`More than one endpoint matches ${flags.name}, please file a support ticket`);
        }
    }
    if (sniEndpoints.length > 1) {
        throw new Error('Must pass --name when more than one endpoint');
    }
    if (sniEndpoints.length === 0) {
        throw new Error('Record not found.');
    }
    return sniEndpoints[0];
}
