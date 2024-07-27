const multer = require("multer");

const inMemoryStorage = multer.memoryStorage();
const upload = multer({ storage: inMemoryStorage });

const uploadPostAttachments = upload.array('attachments', 1);
const uploadPet = upload.single('file');
const uploadSingleFile = upload.single('file'); // for single file upload
const uploadCommentAttachments = upload.array('attachments', 5);

const uploadProfilePicture = upload.single('profilePicture');
const uploadPostMedia = upload.fields([
    {
        name: 'media',
        maxCount: 1
    },
    {
        name: 'thumbnail',
        maxCount: 1
    }
]);
const uploadRatingAttachments = upload.array('attachments', 5);
const uploadPostCommentAttachments = upload.fields([
    {
        name: 'media',
        maxCount: 5
    },
    {
        name: 'thumbnail',
        maxCount: 1
    }
]);

module.exports = {
    uploadPostAttachments,
    uploadPet,
    uploadSingleFile,
    uploadCommentAttachments,
    uploadProfilePicture,
    uploadPostMedia,
    uploadRatingAttachments,
    uploadPostCommentAttachments
}
