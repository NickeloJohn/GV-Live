const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const MongooseHelper = require('../utils/mongoose');
const { Database1 } = require('../utils/database');

const PostUserViewSchema = new mongoose.Schema(
    {
      postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
      },
      count: {
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

PostUserViewSchema.plugin(mongoosePaginate);
module.exports = Database1.model('PostUserView', PostUserViewSchema);
