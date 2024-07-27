const getStream = require('into-stream');
const azure = require('@azure/storage-blob');
const { AbortController } = require('@azure/abort-controller');
const config = require('../config/config');
const moment = require('moment');

// https://github.com/Azure-Samples/azure-sdk-for-js-storage-blob-stream-nodejs/blob/master/v12/routes/index.js
// https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-nodejs-legacy

const ONE_MINUTE = 60 * 1000;
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 }

class AzureStorageBlob {

    /**
     * @param {Object} params0
     * container must be a container name from azure storage account
     * path directory should be /container/path NOTE !! include folder name if the filename is containing a folder
     * path directory is automatic create a folder if the path folder is not existing including the file upload
     */
    constructor(options = null) {
        this.credentials = new azure.StorageSharedKeyCredential(
            process.env.AZURE_STORAGE_NAME,
            process.env.AZURE_STORAGE_KEY
        );

        if (options) {
            const { container, path } = options;
            const blobServiceClient = new azure.BlobServiceClient(
                config.azureStorage.url,
                this.credentials
            );
    
            this.containerClient = blobServiceClient.getContainerClient(container);
            this.blockBlobClient = this.containerClient.getBlobClient(path).getBlockBlobClient();
            this.aborter = AbortController.timeout(30 * ONE_MINUTE);
        }
    }

    async deletePath(path) {
        try {
            const deleteContainerResponse = await this.containerClient.deleteBlob(path);
            console.log(`Container was deleted successfully. requestId: ${deleteContainerResponse.requestId} ${path}`);
        } catch (error) {
            console.error(`Error deleting blob: ${error}`);
        }
    }

    async upload(file, type = 'buffer') {
        try {
            if (type === 'buffer') {
                return await this._uploadFromBuffer(file.buffer);
            } else if (type === 'base64') {
                return await this._uploadFromBase64(file);
            }
        } catch (error) {
            console.error(`Error uploading file: ${error}`);
        }
    }

    async _uploadFromBuffer(buffer) {
        const stream = getStream(buffer);
        return await this.blockBlobClient.uploadStream(stream, uploadOptions.bufferSize, uploadOptions.maxBuffers, {
            blobHTTPHeaders: { blobContentType: 'image/jpeg' }
        });
    }

    async _uploadFromBase64(base64String) {
        const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        const buffer = Buffer.from(matches[2], 'base64');
        return await this.blockBlobClient.upload(buffer, buffer.byteLength);
    }

    async setBase64Encoded() {
        const downloadResponse = await this.blockBlobClient.download(0);
        const readable = downloadResponse.readableStreamBody;
        readable.setEncoding('base64');
        let data = '';
        for await (const chunk of readable) {
            data += chunk;
        }
        return data;
    }

    /**
     * @param {Object} res must be an object or response object
     */
    async download(res) {
        const downloadResponse = await this.blockBlobClient.download(0, this.aborter);
        return downloadResponse.readableStreamBody.pipe(res);
    }

    generateSasToken(containerName, blobName) {
        const sharedKeyCredential = this.credentials;

        const sasToken = azure.generateBlobSASQueryParameters({
            containerName,
            blobName,
            permissions: azure.BlobSASPermissions.parse("r"), // "r" for read
            startsOn: new Date(),
            expiresOn: moment().add(1, 'weeks') // 1 day later
        }, sharedKeyCredential).toString();
    
        return sasToken;
    }
}

exports.AzureStorage = AzureStorageBlob;