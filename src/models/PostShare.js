const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const MongooseHelper = require('../utils/mongoose');
const { Database2 } = require('../utils/database');
const { SHARE_TYPE } = require('../utils/constant');

const PostShareSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: 'User', // Reference to the user who performed the action
            index: true
        },
        post: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: 'Post', // Reference to the post that was liked/unliked
            index: true
        },
        type: {
            type: String,
            enum: Object.values(SHARE_TYPE),
            default: SHARE_TYPE.APP,
            required: true,
            index: true
        },
        ...MongooseHelper.timeStamps
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

PostShareSchema.plugin(mongoosePaginate);
module.exports = Database2.model('PostShare', PostShareSchema);
