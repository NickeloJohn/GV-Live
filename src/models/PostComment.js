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
        postId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Post',
            required: true
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
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
        flagged: {
            type: Boolean,
            default: false
        },
        flagReason: {
            type: String,
            default: ''
        },
        isApproved: {
            type: Boolean,
            default: false
        },
        isRemoved: {
            type: Boolean,
            default: false
        },
        moderatedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
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
