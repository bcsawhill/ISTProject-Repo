import { APIClient } from '@heroku-cli/command';
import * as Heroku from '@heroku-cli/schema';
/**
 * Standard role description for consistent usage across commands
 */
export declare const ROLE_DESCRIPTION = "member role (admin, collaborator, member, owner)";
/**
 * Check if team invite acceptance feature is enabled for a team
 */
export declare function isTeamInviteFeatureEnabled(team: string, heroku: APIClient): Promise<boolean>;
/**
 * Get team invitations with proper headers
 */
export declare function getTeamInvites(team: string, heroku: APIClient): Promise<Heroku.TeamInvitation[]>;
