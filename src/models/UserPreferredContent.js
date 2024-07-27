const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const MongooseHelper = require('../utils/mongoose');
const { Database1 } = require('../utils/database');

const UserPreferredContentSchema = new mongoose.Schema(
  {
      userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        index: true
      },
      preferredContent: {
          type: Array,
          default: null,
      },
      ...MongooseHelper.timeStamps
  },
  {
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
  }
);

UserPreferredContentSchema.plugin(mongoosePaginate);
UserPreferredContentSchema.plugin(require('mongoose-aggregate-paginate-v2'));

module.exports = Database1.model('UserPreferredContent', UserPreferredContentSchema);