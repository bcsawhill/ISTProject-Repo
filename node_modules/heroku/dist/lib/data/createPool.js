export default async function createPool(dataApi, addon, parameters) {
    const { body: poolInfo } = await dataApi.post(`/data/postgres/v1/${addon.id}/pools`, {
        body: parameters,
    });
    return poolInfo;
}
