export interface Manifest {
    schemaVersion: number;
    mediaType: string;
    config: {
        mediaType: string;
        size: number;
        digest: string;
    };
    layers: ManifestLayer[];
    annotations: Record<string, string>;
}

export interface ManifestLayer {
    mediaType: string;
    size: number;
    digest: string;
}
