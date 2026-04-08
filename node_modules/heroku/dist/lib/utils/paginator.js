// page size ranges from 200 - 1000 seen here
// https://devcenter.heroku.com/articles/platform-api-reference#ranges
export async function paginateRequest(client, url, pageSize = 200) {
    let isPartial = true;
    let isFirstRequest = true;
    let nextRange = '';
    let aggregatedResponseBody = [];
    while (isPartial) {
        const response = await client.get(url, {
            headers: {
                Range: `${(isPartial && !isFirstRequest) ? `${nextRange}` : `id ..; max=${pageSize};`}`,
            },
            partial: true,
        });
        aggregatedResponseBody = [...response.body, ...aggregatedResponseBody];
        isFirstRequest = false;
        if (response.statusCode === 206) {
            nextRange = response.headers['next-range'];
        }
        else {
            isPartial = false;
        }
    }
    return aggregatedResponseBody;
}
