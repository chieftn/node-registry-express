import axios from 'axios';
import { FIELDS, GRANTS } from '../constants/authConstants';
import { RefreshTokenResponse, AccessTokenResponse, ScopeType } from '../models/authModel';

export interface GetRefreshTokenParameters {
    armBearerToken: string;
    registryName: string;
    tenantId: string;
}
export const getRefreshToken = async (params: GetRefreshTokenParameters): Promise<RefreshTokenResponse> => {
    const { armBearerToken, tenantId, registryName } = params;
    const url = `https://${registryName}.azurecr.io/oauth2/exchange`;

    const formData = new URLSearchParams();
    formData.append(FIELDS.grantType, GRANTS.accessToken);
    formData.append(FIELDS.service, `${registryName}.azurecr.io`);
    formData.append(FIELDS.tenant, tenantId);
    formData.append(FIELDS.accessToken, armBearerToken);

    const response = await axios.post(url, formData, {
        headers: {
            Accept: 'application/json, text/javascript, */*; q=0.01',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    const tokenResponse = (await response.data) as RefreshTokenResponse;
    return tokenResponse;
};

export interface GetAccessTokenParameters {
    refreshToken: string;
    registryName: string;
    scope: ScopeType;
}
export const getAccessToken = async (params: GetAccessTokenParameters): Promise<AccessTokenResponse> => {
    const { refreshToken, registryName, scope } = params;
    const url = `https://${registryName}.azurecr.io/oauth2/token`;

    const formData = new URLSearchParams();
    formData.append(FIELDS.grantType, GRANTS.refresh_token);
    formData.append(FIELDS.service, `${registryName}.azurecr.io`);
    formData.append(FIELDS.scope, scope);
    formData.append(FIELDS.refreshToken, refreshToken);

    const response = await axios.post(url, formData, {
        headers: {
            Accept: 'application/json, text/javascript, */*; q=0.01',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    const tokenResponse = (await response.data) as AccessTokenResponse;
    return tokenResponse;
};
