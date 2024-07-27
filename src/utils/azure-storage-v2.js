const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');
const { azureStorage } = require('../config/config');

class AzureBlobStorageHelper {
    blobClient;
    blockBlobClient;
    containerClient;
    blobServiceClient;
    fileBuffer;

    constructor({ accountName, accountKey, containerName, fileBuffer, filePath, contentType }) {
        const sharedKeyCredential = new StorageSharedKeyCredential(accountName || azureStorage.name, accountKey || azureStorage.key);
        const blobServiceClient = new BlobServiceClient(`https://${accountName || azureStorage.name}.blob.core.windows.net`, sharedKeyCredential);

        this.containerClient = blobServiceClient.getContainerClient(containerName);
        this.blobClient = this.containerClient.getBlobClient(filePath);
        this.blockBlobClient = this.blobClient.getBlockBlobClient();

        this.fileBuffer = fileBuffer;
        this.contentType = contentType;
        this.containerName = containerName;
        this.filePath = filePath;
    }

    async upload() {
        try {
            await this.blockBlobClient.upload(this.fileBuffer, this.fileBuffer.length, {
                blobHTTPHeaders: {
                    blobContentType: this.contentType
                }
            });

            return this.blockBlobClient;
        } catch (error) {
            throw new Error(`Error uploading blob: ${error.message}`);
        }
    }

    async delete(path) {
        const deleteContainerResponse = await this.containerClient.deleteBlob(path || this.filePath);
        console.log(`Container was deleted successfully. requestId: ${deleteContainerResponse.requestId} ${path || this.filePath} }`);
    }

    async listBlobs() {
        const blobs = [];
        for await (const blob of this.containerClient.listBlobsFlat()) {
            blobs.push({
                name: blob.name,
                url: blob.url
            });
        }
        return blobs;
    }

    async isContainerExist() {
        const containerClient =  this.containerClient;
        try {
            const containerExists = await containerClient.exists();
            return containerExists;
        } catch (error) {
            console.log(`Error checking container existence: ${error.message}`)
        }
    }

    async createContainer () {
        const containerName = this.containerName ? this.containerName : `newcontainer${new Date().getTime()}`;
        const createContainerResponse = await this.containerClient.create();
        console.log(`Create container ${containerName} successfully`, createContainerResponse.requestId)
    }

    async ensureContainerExists() {
        const exists = await this.isContainerExist();
        if (!exists) {
            await this.createContainer();
        }
    }
}

module.exports = AzureBlobStorageHelper;
