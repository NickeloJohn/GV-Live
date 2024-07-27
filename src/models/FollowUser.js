const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const MongooseHelper = require('../utils/mongoose');
const { Database1 } = require('../utils/database');

const FollowUserSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'User',
      index: true
    },
    followed: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      index: true,
      required: true
    },
    totalFollower: {
      type: Number,
      default: 0
    },
    totalFollowing: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      enum: ['followed', 'following', 'unfollow', 'blocked'],
      index: true
    },
    ...MongooseHelper.timeStamps
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

FollowUserSchema.plugin(mongoosePaginate);
FollowUserSchema.plugin(require('mongoose-aggregate-paginate-v2'));

module.exports = Database1.model('FollowUser', FollowUserSchema);
