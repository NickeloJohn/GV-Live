const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const MongooseHelper = require('../utils/mongoose');
const { Database1 } = require('../utils/database');
const { PROFILE_PRIVACY_STATUS } = require('../utils/constant');

const transform = (doc, obj) => {
  // if (obj?.attachments) {
  //     if (obj.attachments.length > 0) {
  //         obj.attachments = obj.attachments.map((attachment) => {
  //             attachment.fileURL = `${process?.env?.BASE_URL}/public/assets/${attachment?.container}/${attachment?.filePath?.replace(/\//g, '-')}?subscription-key=${
  //                 process.env?.APIM_SUBSCRIPTION_KEY || ''
  //             }`;
  //             return attachment;
  //         });
  //     }
  // }
};



const PostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
        required: true,
        index: true,
      },
    ],
    title: {
      type: String,
      default: null,
      index: true,
    },
    body: {
      type: String,
      default: null,
      index: true,
    },
    media: [MongooseHelper.MediaSchema],
    music: MongooseHelper.defaultFile,
    privacySetting: {
      type: String,
      enum: PROFILE_PRIVACY_STATUS,
    },
    isAllowedComments: {
      type: Boolean,
      default: true,
    },
    visibleTo: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    location: {
      type: String,
      default: null,
    },
    likes: {
      type: Number,
      default: 0,
      index: true,
    },
    comments: {
      type: Number,
      default: 0,
      index: true,
    },
    shares: {
      type: Number,
      default: 0,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
      index: true,
    },
    reposts: {
      type: Number,
      default: 0,
      index: true,
    },
    reports: {
      type: Number,
      trim: true,
      index: true,
    },
    tags: {
      type: Array,
      trim: true,
      index: true,
    },
    repost: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "deleted", "pet_deleted", "user_deleted"],
      default: "active",
      index: true,
    },
    isLive: {
      type: Boolean,
      default: false,
      index: true,
    },
    content: String,
    typeContent: { type: String, 
    enum: ["photo", "video"] },
    flagged: {
      isFlagged: { type: Boolean, 
      default: false },
      typeContent: { type: String, 
      enum: ["photo", "video"]},
      isAdminAction: { type: Boolean,
      default: false },
      adminAction: { type: String, 
      enum: ['approve', 'remove', 'warning', 'timeout', 'banned'] },
      userId: { type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' },
      adminActionAt: { type: Date }
    },
    
    ...MongooseHelper.timeStamps,
  },
  {
    toJSON: { virtuals: true, transform },
    toObject: { virtuals: true, transform },
  }
);

PostSchema.index({ createdAt: 1, likes: 1 });
PostSchema.plugin(mongoosePaginate);
module.exports = Database1.model('Post', PostSchema);
