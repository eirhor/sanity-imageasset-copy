const createClient = require('@sanity/client');
require('dotenv').config();

const sourceClient = createClient({
    projectId: process.env.SOURCE_PROJECTID,
    dataset: process.env.SOURCE_DATASET,
    useCdn: false,
    apiVersion: '2022-01-12',
    token: process.env.SOURCE_ACCESS_TOKEN,
});

const targetClient = createClient({
    projectId: process.env.TARGET_PROJECTID,
    dataset: process.env.TARGET_DATASET,
    useCdn: false,
    apiVersion: '2022-01-12',
    token: process.env.TARGET_ACCESS_TOKEN,
});

module.exports = {
    sourceClient,
    targetClient,
};
