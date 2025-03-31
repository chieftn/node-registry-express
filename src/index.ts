import express, { Request, Response } from 'express';
import { SCOPES } from './shared/constants/authConstants';
import { MEDIA_TYPES, ANNOTATIONS } from './shared/constants/manifestConstants';
import type { GraphEntry } from './shared/models/graphModel';
import { getRefreshToken, getAccessToken } from './shared/services/authService';
import { getRepositories, getManifests } from './shared/services/registryService';
import { getManifest, getBlob } from './shared/services/dockerService';

const tenantId = '72f988bf-86f1-41af-91ab-2d7cd011db4';
const armBearerToken = 'bearer token here';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/graphEntries', async (req: Request, res: Response) => {
    try {
        const start = performance.now();
        const entries: GraphEntry[] = [];
        const registryName = 'rkessler';
        const { refresh_token: refreshToken } = await getRefreshToken({
            armBearerToken,
            tenantId,
            registryName: 'rkessler',
        });

        // get registry access token;
        const { access_token: catalogToken } = await getAccessToken({
            refreshToken,
            registryName,
            scope: SCOPES.catalog,
        });

        // get repositories
        const repositoryNames = await getRepositories({
            catalogToken,
            registryName,
        });

        // loop repository
        for (const repositoryName of repositoryNames) {
            const { access_token: repositoryToken } = await getAccessToken({
                refreshToken,
                registryName,
                scope: `repository:${repositoryName}:pull`,
            });

            const manifests = await getManifests({
                repositoryName,
                repositoryToken,
                registryName,
            });

            // get manifests with matching config media type
            const graphManifests = manifests.filter((s) => s.configMediaType === MEDIA_TYPES.dataflowGraph);

            console.log(graphManifests);
            const tags = graphManifests
                .map((s) => s.tags || [])
                .reduce<string[]>((prev, curr) => prev.concat(curr), []);
            const tagsSet = new Set(tags);

            // de-duplicate
            for (const tag of tagsSet) {
                const manifest = await getManifest({
                    manifestName: tag,
                    repositoryToken,
                    repositoryName,
                    registryName,
                });

                if (manifest.layers[0]) {
                    entries.push({
                        name: `${repositoryName}:${repositoryName}`, // opportunity for improvement here
                        description: manifest.annotations[ANNOTATIONS.description] || '',
                        imageUrl: `${registryName}.azurecr.io/${repositoryName}:${tag}`,
                        imageDigest: manifest.layers[0].digest,
                    });
                }
            }
        }

        const end = performance.now();
        console.log(`Call to doSomething took ${(end - start) / 1000} seconds.`);
        res.json({ entries });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.get('/images/:registryName/:repositoryName/:blobDigest', async (req: Request, res: Response) => {
    const { registryName, repositoryName, blobDigest } = req.params;
    const { refresh_token: refreshToken } = await getRefreshToken({
        armBearerToken,
        tenantId,
        registryName: 'rkessler',
    });

    const { access_token: repositoryToken } = await getAccessToken({
        refreshToken,
        registryName,
        scope: `repository:${repositoryName}:pull`,
    });

    const blob = await getBlob({
        blobDigest,
        repositoryToken,
        repositoryName,
        registryName,
    });

    console.log(blob);
    res.json({ content: blob });
});

app.get('/', async (req: Request, res: Response) => {
    res.send('Hello from Express + TypeScript!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
