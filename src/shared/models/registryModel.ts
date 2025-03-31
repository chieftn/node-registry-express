export interface RepositoryCatalogResponse {
    repositories: string[];
}

export interface ManifestResponse {
    registry: string;
    imageName: string;
    manifests: Manifest[];
}

export interface Manifest {
    digest: string;
    imageSize: string;
    createdTime: string;
    lastUpdateTime: string;
    mediaType: string;
    configMediaType: string;
    tags: string[];
    changeableAttributes: {
        deleteEnabled: boolean;
        writeEnabled: boolean;
        readEnabled: boolean;
        lsitEnabled: boolean;
    };
}
