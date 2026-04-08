export const V3_HEADER = 'application/vnd.heroku+json; version=3';
export const SDK_HEADER = 'application/vnd.heroku+json; version=3.sdk';
export const FILTERS_HEADER = `${V3_HEADER}.filters`;
export const PIPELINES_HEADER = `${V3_HEADER}.pipelines`;
const CI_HEADER = `${V3_HEADER}.ci`;
export function createAppSetup(heroku, body) {
    return heroku.post('/app-setups', { body });
}
export function postCoupling(heroku, pipeline, app, stage) {
    return heroku.post('/pipeline-couplings', {
        body: { app, pipeline, stage },
    });
}
export function createCoupling(heroku, pipeline, app, stage) {
    return postCoupling(heroku, pipeline.id, app, stage);
}
export function createPipeline(heroku, name, owner, generationName = 'cedar') {
    return heroku.request('/pipelines', {
        body: { generation: { name: generationName }, name, owner },
        headers: { Accept: PIPELINES_HEADER },
        method: 'POST',
    });
}
export function createPipelineTransfer(heroku, pipeline) {
    return heroku.post('/pipeline-transfers', {
        body: pipeline,
    });
}
function deleteCoupling(heroku, id) {
    return heroku.delete(`/pipeline-couplings/${id}`);
}
export function destroyPipeline(heroku, name, pipelineId) {
    return heroku.request(`/pipelines/${pipelineId}`, {
        body: { name },
        headers: { Accept: PIPELINES_HEADER },
        method: 'DELETE',
    });
}
export function findPipelineByName(heroku, idOrName) {
    return heroku.request(`/pipelines?eq[name]=${idOrName}`, {
        headers: { Accept: PIPELINES_HEADER },
        method: 'GET',
    });
}
export function getCoupling(heroku, app) {
    return heroku.get(`/apps/${app}/pipeline-couplings`, {
        headers: { Accept: SDK_HEADER },
    });
}
export function getPipeline(heroku, id) {
    return heroku.request(`/pipelines/${id}`, {
        headers: { Accept: PIPELINES_HEADER },
        method: 'GET',
    });
}
export function updatePipeline(heroku, id, body) {
    return heroku.patch(`/pipelines/${id}`, {
        body,
    });
}
export function getTeam(heroku, teamId) {
    return heroku.get(`/teams/${teamId}`);
}
function getAppFilter(heroku, appIds) {
    return heroku.request('/filters/apps', {
        body: { in: { id: appIds } },
        headers: { Accept: FILTERS_HEADER, Range: 'id ..; max=1000;' },
        method: 'POST',
    });
}
export function getAccountInfo(heroku, id = '~') {
    return heroku.get(`/users/${id}`);
}
export function getAppSetup(heroku, buildId) {
    return heroku.get(`/app-setups/${buildId}`);
}
function listCouplings(heroku, pipelineId) {
    return heroku.get(`/pipelines/${pipelineId}/pipeline-couplings`, {
        headers: { Accept: SDK_HEADER },
    });
}
export async function listPipelineApps(heroku, pipelineId) {
    const { body: couplings } = await listCouplings(heroku, pipelineId);
    const appIds = couplings.map(coupling => coupling.app.id || '');
    const { body: apps } = await getAppFilter(heroku, appIds);
    return apps.map(app => ({
        ...app,
        pipelineCoupling: couplings.find(coupling => coupling.app.id === app.id),
    }));
}
export function patchCoupling(heroku, id, stage) {
    return heroku.patch(`/pipeline-couplings/${id}`, { body: { stage } });
}
export function removeCoupling(heroku, app) {
    return getCoupling(heroku, app)
        .then(({ body }) => deleteCoupling(heroku, body.id));
}
export function updateCoupling(heroku, app, stage) {
    return getCoupling(heroku, app)
        .then(({ body: coupling }) => patchCoupling(heroku, coupling.id, stage));
}
export function getReleases(heroku, appId) {
    return heroku.get(`/apps/${appId}/releases`, {
        headers: { Accept: SDK_HEADER, Range: 'version ..; order=desc' },
        partial: true,
    });
}
export function getPipelineConfigVars(heroku, pipelineID) {
    return heroku.request(`/pipelines/${pipelineID}/stage/test/config-vars`, {
        headers: { Accept: PIPELINES_HEADER },
        method: 'GET',
    });
}
export function setPipelineConfigVars(heroku, pipelineID, body) {
    return heroku.request(`/pipelines/${pipelineID}/stage/test/config-vars`, {
        body,
        headers: { Accept: PIPELINES_HEADER },
        method: 'PATCH',
        path: `/pipelines/${pipelineID}/stage/test/config-vars`,
    });
}
export async function createTestRun(heroku, body) {
    const headers = {
        Accept: CI_HEADER,
    };
    return heroku.request('/test-runs', {
        body,
        headers,
        method: 'POST',
    });
}
export async function getTestNodes(heroku, testRunIdD) {
    return heroku.request(`/test-runs/${testRunIdD}/test-nodes`, {
        headers: {
            Accept: CI_HEADER,
            Authorization: `Bearer ${heroku.auth}`,
        },
    });
}
export function updateTestRun(heroku, id, body) {
    return heroku.request(`/test-runs/${id}`, {
        body,
        headers: {
            Accept: CI_HEADER,
        },
        method: 'PATCH',
    });
}
