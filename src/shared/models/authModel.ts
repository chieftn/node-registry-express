import { GRANTS, SCOPES } from '../constants/authConstants';

type SCOPES_TYPE = (typeof SCOPES)[keyof typeof SCOPES];
export type ScopeType = SCOPES_TYPE | `repository:${string}:${string}`;

export type GrantType = (typeof GRANTS)[keyof typeof GRANTS];

export interface RefreshTokenResponse {
    refresh_token: string;
}

export interface AccessTokenResponse {
    access_token: string;
}
