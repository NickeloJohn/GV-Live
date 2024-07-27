const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const { Database1 } = require('../utils/database');

const LocationSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['country', 'state', 'city', 'town', 'village', 'provinces', 'regions'],
    },
    code: {
        type: String,
        index: true,
    },
    name: {
        type: String,
        index: true,
    },
    regionName: {
        type: String,
        index: true,
    },
    isCapital: {
        type: Boolean,
        default: false,
    },
    provinceCode: mongoose.Schema.Types.Mixed,
    districtCode: mongoose.Schema.Types.Mixed,
    regionCode: {
        type: String,
        default: null,
        index: true,
    },
    islandGroupCode: {
        type: String,
        index: true
    },
    psgc10DigitCode: {
        type: String,
        index: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Location',
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        index: true,
        select: false
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
        index: true,
        select: false
    }
},
{
    autoIndex: true,
    autoCreate: true
});

LocationSchema.plugin(mongoosePaginate);
module.exports = Database1.model('Location', LocationSchema);
