const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

const MongooseHelper = require('../utils/mongoose');
const { Database1 } = require('../utils/database');

const PostCommentSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            index: true
        },
        post: {
            type: mongoose.Schema.ObjectId,
            ref: 'Post',
            index: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        // attachments: [MongooseHelper.defaultFile],
        status: {
            type: String,
            enum: ['active', 'deleted'],
            default: 'active'
        },
        replies: {
            type: Number,
            default: 0
        },
        likes: {
            type: Number,
            default: 0
        },
        ...MongooseHelper.timeStamps
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

PostCommentSchema.plugin(mongoosePaginate);

module.exports = Database1.model('PostComment', PostCommentSchema);
