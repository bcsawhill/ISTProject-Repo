export async function getRelease(heroku, appName, id) {
    const { body: release } = await heroku.get(`/apps/${appName}/releases/${id}`);
    return release;
}
