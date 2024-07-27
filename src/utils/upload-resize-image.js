const sharp = require("sharp");
const fs = require('fs');
const util = require('util');
const stream = require('stream');

const { uploadFileToAzure, isImage, createRandomFilename, generateRandomFilename } = require("./functions");
const UploadUtils = require("../utils/upload");
const { create } = require("../models/User");
const config = require("../config/config");
const path = require("path");

const defaultImageSizeInPost = (buffer) => {
    return sharp(buffer)
        .resize({ width: 409, height: 362 })
        .toFormat('png')
        .toBuffer()
        .then((data) => data)
        .catch((err) => err);
}

exports.makeThumbnailPostImage = (buffer) => {
    return sharp(buffer)
        .resize({ width: 200, height: 200 })
        .toFormat('png')
        .toBuffer()
        .then((data) => data)
        .catch((err) => err);
}

exports.uploadResizeFileImagePost = async (req, file) => {
    req.file = file;

    if (isImage(req.file)) {
        // ovewrite buffer image to a new size image
        req.file.buffer = await defaultImageSizeInPost(req.file.buffer);
    }

    const upload = new UploadUtils(req.file);

    const container = 'users';
    const filePath = `${req.user.id}/posts/${req.postId}/${upload.file.filename}`;

    await upload.toAzureStorage(container, filePath);

    delete upload.file.user;

    return upload;
};

exports.generateVideoThumbnail = async (buffer, outputThumbnailPath, captureTime = 2) => {
    try {
        // Create a Promise to capture the thumbnail using fluent-ffmpeg
        const videoStream = new stream.PassThrough();
        videoStream.end(buffer);

        const filename = generateRandomFilename('png');
        const folder = path.resolve(`./tmp/posts/thumbnail`);
        const thumbnailPath = path.resolve(`${folder}/${filename}`);

            ffmpeg()
            .setFfmpegPath(ffmpegPath)
            .input(videoStream)
            .inputFormat('mp4')
            .seekInput(captureTime)
            .frames(1)
            .output(thumbnailPath)
            .on('end', () => {
                console.log('Thumbnail successfully created');
              })
              .on('error', (err) => {
                console.error('Error generating thumbnail:', err);
              })
            .run();

        // Capture the thumbnail using the Promise

        // const info = await sharp(thumbnailPath)
        //     .resize({ width: 200, height: 200 })
        //     .toFormat('png')
        //     .toBuffer()
        //     .then((data) => data)
        //     .catch((err) => err);

        // Resize and save the thumbnail using the Promise
        console.log('Thumbnail successfully created:', info);

        return info;
    } catch (error) {
        console.error('Error generating thumbnail:', error);
    }
};
  