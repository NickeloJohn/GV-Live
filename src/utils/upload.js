const crypto = require("crypto");
const cryptoJs = require("crypto-js");
const { AzureStorage } = require("./azure-storage");

const createRandomFilename = (filename) => {
    const extension = filename.split(".").pop();
    const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
    return `${identifier}${crypto.randomInt(0, Date.now())}.${extension}`;
};

class Upload {

    payloadFile = {};
    file = {};

    /**
     * 
     * @param {Object} file is come from req.file or multer
    */
    constructor(file) {
        this.payloadFile = file;
        this.file = {
            filename: file ? createRandomFilename(file.originalname) : null,
            fileSize: file ? file.size : null,
            originalFilename: file ? file.originalname  : null,
            container: null,
            filePath: null,
        }
    }

    async toAzureStorage (container, filePath, user) {

        if (container, filePath)
        {
            this.file.container = container;
            this.file.filePath = filePath;
            this.file.user = user;
        }

        if (!this.file?.container || !this.file?.filePath) throw new Error('Container and Filepath is required');

        const azure = new AzureStorage({
            container: this.file.container,
            path: this.file.filePath
        });
    
        const upload = await azure.upload(this.payloadFile);
        return upload;
    }

    async delete (container, filePath) {
        filePath = filePath || this.file.filePath;
        container = container || this.file.container;

        const azure = new AzureStorage({
            container: container,
            path: filePath
        });
     
        await azure.deletePath(filePath);
    }

    async isImage (mimetype) {
        return mimetype.includes('image');
    }
}

module.exports = Upload;