const { sourceClient, targetClient } = require('./client');

const fs = require('fs');
const https = require('https');
const stream = require('stream');

const fetchImageAssetsJson = async () => {
    if (fs.existsSync('.temp/imageAssets.json')) {
        console.log('imageAssets.json already exists, skipping fetch');
        return;
    }

    let imageAssets = [];
    const batchSize = 100;

    let hasMore = true;
    let batchStart = 0;

    console.log('fetching imageAssets.json');
    while (hasMore) {
        const imageAssetsJsonResponse = await sourceClient.fetch(
            `*[_type == 'sanity.imageAsset'][${batchStart}...${batchStart + batchSize}]{...}`
        );

        if (imageAssetsJsonResponse.length === 0) {
            hasMore = false;
            break;
        }

        imageAssets = [...imageAssets, ...imageAssetsJsonResponse];

        batchStart = batchStart + batchSize;
    }

    if (!fs.existsSync('.temp')) {
        fs.mkdirSync('.temp');
    }

    fs.writeFileSync(`.temp/imageAssets.json`, JSON.stringify(imageAssets), {
        encoding: 'utf-8',
    });
};

function getImageAsset(imageAssetJson, fileName) {
    return new Promise((resolve, reject) => {
        https
            .get(imageAssetJson.url, (res) => {
                const dataStream = new stream.Transform();

                res.on('data', (chunk) => {
                    dataStream.push(chunk);
                });

                res.on('end', () => {
                    fs.writeFileSync(`.temp/imageAssets/${fileName}`, dataStream.read());
                    resolve();
                });
            })
            .on('error', (e) => {
                reject(`error while downloading '${fileName}': ${e.message}`);
            });
    });
}

const fetchImageAssets = async () => {
    const imageAssetsString = fs.readFileSync(`.temp/imageAssets.json`, { encoding: 'utf-8' });
    const imageAssetsJson = JSON.parse(imageAssetsString);

    if (!fs.existsSync('.temp/imageAssets')) {
        fs.mkdirSync('.temp/imageAssets');
    }

    console.log('fetching imageAssets');
    for (let i = 0; i < imageAssetsJson.length; i++) {
        const imageAssetJson = imageAssetsJson[i];

        const fileNameSplit = imageAssetJson.path.split('/');
        const fileName = fileNameSplit[fileNameSplit.length - 1];

        if (fs.existsSync(`.temp/imageAssets/${fileName}`)) {
            console.log(`imageAsset '${fileName}' already exists, skipping.`);
            continue;
        }

        await getImageAsset(imageAssetJson, fileName);

        console.log(`saved imageAsset '${fileName}'`);
    }
};

const uploadImageAssets = async () => {
    const imageAssetsString = fs.readFileSync(`.temp/imageAssets.json`, { encoding: 'utf-8' });
    const imageAssetsJson = JSON.parse(imageAssetsString);

    let failed = [];

    for (let i = 0; i < imageAssetsJson.length; i++) {
        const imageAssetJson = imageAssetsJson[i];

        const fileNameSplit = imageAssetJson.path.split('/');
        const fileName = fileNameSplit[fileNameSplit.length - 1];

        await targetClient.assets
            .upload('image', fs.createReadStream(`.temp/imageAssets/${fileName}`), {
                preserveFilename: false,
                filename: imageAssetJson.originalFilename,
                title: imageAssetJson.title,
                description: imageAssetJson.description,
            })
            .then((doc) => {
                console.log(`uploaded imageAsset '${fileName}' to Sanity with ID '${doc._id}'`);
            })
            .catch(() => {
                console.log(`failed to upload imageAsset '${fileName}' to Sanity`);
                failed = [...failed, imageAssetJson];
            });
    }

    if (failed.length > 0) {
        fs.writeFileSync('.temp/failed.json', JSON.stringify(failed), { encoding: 'utf-8' });
        console.log(`One or more imageAssets failed to upload, see '.temp/failed.json' for a list`);
    }
};

const migrate = async () => {
    await fetchImageAssetsJson();
    await fetchImageAssets();
    await uploadImageAssets();

    console.log(
        'Finished copying imageAssets, remember to remove the .temp directory unless there is a failed.json file inside'
    );
};

module.exports = migrate();
