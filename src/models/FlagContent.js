const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const MongooseHelper = require('../utils/mongoose');
const { Database1 } = require('../utils/database');

const FlagContentSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
          },
          type: {
            type: String,
            enum: ['photo', 'video'],
            required: true,
          },
        content: {
            type: String,
            require: true
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'removed'],
            default: 'pending',
          },
        ...MongooseHelper.timeStamps
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

FlagContentSchema.plugin(mongoosePaginate);
FlagContentSchema.plugin(require('mongoose-aggregate-paginate-v2'));

module.exports = Database1.model('FlagContent', FlagContentSchema);
