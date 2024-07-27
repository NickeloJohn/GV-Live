const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const MongooseHelper = require('../utils/mongoose');
const { Database1 } = require('../utils/database');

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        parent: {
            type: String,
            default: null,
        },
        type: {
            type: String,
            enum: ['interest'],
        },
        ...MongooseHelper.timeStamps
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

CategorySchema.plugin(mongoosePaginate);
CategorySchema.plugin(require('mongoose-aggregate-paginate-v2'));

module.exports = Database1.model('Category', CategorySchema);
