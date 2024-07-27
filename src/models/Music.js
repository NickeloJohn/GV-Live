const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const MongooseHelper = require('../utils/mongoose');
const { Database1 } = require('../utils/database');

const MusicSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
            index: true
        },
        name: {
            type: String,
            required: true,
            index: true
        },
        file: MongooseHelper.defaultFile,
        ...MongooseHelper.timeStamps
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

MusicSchema.plugin(mongoosePaginate);
module.exports = Database1.model('Music', MusicSchema);
