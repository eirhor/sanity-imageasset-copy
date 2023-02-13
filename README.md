# Copy imageAssets from one Sanity project / dataset to another

This script automates copying imageAssets between Sanity datasets and/or projects.

## Requirements

-   Node.js 16.19.0 or later

## How to run

1. Retrieve API key(s) with Editor access from [sanity.io](https://www.sanity.io)
    - Login and navigate to the source project.
    - Open the `API` tab, and `Add API token`. Name it whatever you want.
    - Take the API token, and save it as a value for `SOURCE_ACCESS_TOKEN` in `src/.env`.
        - If the target project is the same as the source, copy the same access token to `TARGET_ACCESS_TOKEN` in `src/.env`.
        - If the target project is not the same, repeat the above steps but store the API key to `TARGET_ACCESS_TOKEN` in `src/.env`.
2. Set Project IDs from [sanity.io](https://www.sanity.io)
    - Login and navigate to the source project.
    - In the project header, copy the `PROJECT ID` value and save it as value for `SOURCE_PROJECTID` in `src/.env`.
        - If the target project is the same as the source, copy the same `PROJECT ID` to `TARGET_PROJECTID` in `src/.env`.
        - If the target project is not the same, repeat the above steps but store the `PROJECT ID` to `TARGET_PROJECTID` in `src/.env`.
3. Set datasets from [sanity.io](https://www.sanity.io)
    - Login and navigate to the source project.
    - Open the `Datasets` tab, copy the `title` of the source dataset and save it as value for `SOURCE_DATASET` in `src/.env`.
        - Repeat the same steps for `TARGET_DATASET` in `src/.env`.
4. Open a terminal and run `yarn install` to get the necessary dependencies.
5. Navigate to the `src` folder in the terminal.
6. Execute the command `node ./index.js`. Wait for it to finish.
    - On completion, check the `src/.temp` folder for a `failed.json`. If this exists, there will be a array of objects inside, those assets have then failed to upload and will require manual efforts.
7. Delete the `src/.temp` folder to cleanup locally.
