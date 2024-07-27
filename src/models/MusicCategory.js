const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const MongooseHelper = require('../utils/mongoose');
const { Database1 } = require('../utils/database');
const { MUSIC_CATEGORY_STATUS } = require('../utils/constant');

const MusicCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: Object.values(MUSIC_CATEGORY_STATUS),
      default: MUSIC_CATEGORY_STATUS.ACTIVE
    },
    file: MongooseHelper.defaultFile,
    ...MongooseHelper.timeStamps
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

MusicCategorySchema.plugin(mongoosePaginate);
module.exports = Database1.model('MusicCategory', MusicCategorySchema);
