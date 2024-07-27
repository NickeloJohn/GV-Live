const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const MongooseHelper = require('../utils/mongoose');
const { DEFAULT_STATUS } = require('../utils/constant');
const { Database3 } = require('../utils/database');

const GiftSchema = new mongoose.Schema({
  giftCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'GiftCategory',
    required: true,
    index: true
  },
  treatCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'GiftCategory',
    required: true,
    index: true
  },
  coins: {
    type: Number,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: DEFAULT_STATUS
  },
  ...MongooseHelper.timeStamps
});

GiftSchema.plugin(mongoosePaginate);
module.exports = Database3.model('Gift', GiftSchema);
