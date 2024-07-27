const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const MongooseHelper = require('../utils/mongoose');
const { Database1 } = require('../utils/database');

const PostLikeSchema = new mongoose.Schema(
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
            enum: ['like', 'dislike'], // You can add more types as needed
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

PostLikeSchema.plugin(mongoosePaginate);
module.exports = Database1.model('PostLike', PostLikeSchema);
