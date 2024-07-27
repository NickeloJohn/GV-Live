const mongoose = require("mongoose")

exports.timeStamps = {
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
        select: false
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        index: true,
        select: false
    }
}

exports.file = {
    file: {
        filePath: String,
        filename: String,
        container: String,
        originalFilename: String,
        fileSize: Number,
        fileType: String
    }
}

exports.MediaSchema = new mongoose.Schema(
    {
        type: {
            type: String
        },
        filePath: String,
        filename: String,
        container: String,
        originalFilename: String,
        fileSize: Number,
        thumbnail: {
            filePath: String,
            filename: String,
            container: String,
        }
    }
)

exports.shopFiles = {
    type: {
        type: String,
        enum: ['FRONT_IMAGE', 'PROFILE', 'BANNER']
    },
    filePath: String,
    filename: String,
    container: String,
    originalFilename: String,
    fileSize: Number
}

exports.defaultFile = {
    filePath: String,
    filename: String,
    container: String,
    contentType: String,
    originalFilename: String,
    fileSize: Number
}

exports.fileLocation = {
    filePath: String,
    container: String,
}

exports.productFile = new mongoose.Schema(
    {
        type: {
            type: String
        },
        filePath: String,
        filename: String,
        container: String,
        originalFilename: String,
        fileSize: Number,
        thumbnail: {
            filePath: String,
            filename: String,
            container: String,
        }
    }
)