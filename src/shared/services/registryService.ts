import axios from 'axios';
import type { RepositoryCatalogResponse, ManifestResponse, Manifest } from '../models/registryModel';
import { SCOPES } from '../constants/authConstants';
import { getAccessToken } from './authService';

export interface GetRepositoriesParameters {
    catalogToken: string;
    registryName: string;
}
export const getRepositories = async (parameters: GetRepositoriesParameters): Promise<string[]> => {
    const { catalogToken, registryName } = parameters;

    const url = `https://${registryName}.azurecr.io/acr/v1/_catalog`;
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${catalogToken}`,
            Accept: 'application/json, text/javascript, */*; q=0.01',
            'Content-Type': 'application/json',
        },
    });

    const catalog = (await response.data) as RepositoryCatalogResponse;
    return catalog.repositories;
};

export interface GetManifestsParameters {
    repositoryToken: string;
    registryName: string;
    repositoryName: string;
}
export const getManifests = async (parameters: GetManifestsParameters): Promise<Manifest[]> => {
    const { repositoryToken, registryName, repositoryName } = parameters;

    const url = `https://${registryName}.azurecr.io/acr/v1/${repositoryName}/_manifests`;
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${repositoryToken}`,
        },
    });

    const manifestResponse = (await response.data) as ManifestResponse;
    return manifestResponse.manifests;
};
