import axios from 'axios';
import type { Manifest } from '../models/dockerModel';

export interface GetManifestParameters {
    manifestName: string;
    repositoryToken: string;
    repositoryName: string;
    registryName: string;
}
export const getManifest = async (params: GetManifestParameters): Promise<Manifest> => {
    const { registryName, repositoryName, repositoryToken, manifestName } = params;

    const url = `https://${registryName}.azurecr.io/v2/${repositoryName}/manifests/${manifestName}`;
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${repositoryToken}`,
            Accept: 'application/vnd.oci.image.manifest.v1+json',
        },
    });

    const manifest = (await response.data) as Manifest;
    return manifest;
};

export interface GetBlobParameters {
    blobDigest: string;
    repositoryToken: string;
    repositoryName: string;
    registryName: string;
}
export const getBlob = async (params: GetBlobParameters): Promise<any> => {
    const { registryName, repositoryName, repositoryToken, blobDigest } = params;

    const url = `https://${registryName}.azurecr.io/v2/${repositoryName}/blobs/${blobDigest}`;
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${repositoryToken}`,
            Accept: 'application/vnd.oci.image.manifest.v1+json',
        },
    });

    const responseData = await response.data;
    return responseData;
};
