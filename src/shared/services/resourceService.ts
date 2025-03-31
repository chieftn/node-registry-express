import type { Resource } from '../models/resourceModel';

export interface GetRegistryEndpointsParameters {
    armBearerToken: string;
    tenant: string;
}
export const GetRegistryEndpoints = (params: GetRegistryEndpointsParameters): Promise<Resource[]> => {
    return Promise.resolve([]);
};

export interface GetContainerRegistryResourcesParameters {
    armBearerToken: string;
    registryEndpoints: Resource[];
    tenant: string;
}
export const getContainerRegistryResources = async (
    params: GetContainerRegistryResourcesParameters
): Promise<Resource[]> => {
    return Promise.resolve([
        {
            id: 'rkessler',
        },
    ]);
};
