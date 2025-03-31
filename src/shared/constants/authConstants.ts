export const GRANTS = {
    accessToken: 'access_token',
    refresh_token: 'refresh_token',
} as const;

export const SCOPES = {
    catalog: 'registry:catalog:*',
} as const;

export const FIELDS = {
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
    grantType: 'grant_type',
    service: 'service',
    tenant: 'tenant',
    scope: 'scope',
};
