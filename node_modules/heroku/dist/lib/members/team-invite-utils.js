/**
 * Standard role description for consistent usage across commands
 */
export const ROLE_DESCRIPTION = 'member role (admin, collaborator, member, owner)';
/**
 * Check if team invite acceptance feature is enabled for a team
 */
export async function isTeamInviteFeatureEnabled(team, heroku) {
    const { body: teamInfo } = await heroku.get(`/teams/${team}`);
    if (teamInfo.type !== 'team') {
        return false;
    }
    const { body: teamFeatures } = await heroku.get(`/teams/${team}/features`);
    return teamFeatures.some(feature => feature.name === 'team-invite-acceptance' && feature.enabled);
}
/**
 * Get team invitations with proper headers
 */
export async function getTeamInvites(team, heroku) {
    const { body: teamInvites } = await heroku.get(`/teams/${team}/invitations`, {
        headers: {
            Accept: 'application/vnd.heroku+json; version=3.team-invitations',
        },
    });
    return teamInvites;
}
