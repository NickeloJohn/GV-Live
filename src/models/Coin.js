const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Database1 } = require('../utils/database');
const MongooseHelper = require('../utils/mongoose');

const CoinSchema = new mongoose.Schema({
  coins: {
    type: Number,
    required: true,
    index: true
  },
  price_peso: {
    type: Number,
    default: 0
  },
  price_usd: {
    type: Number,
    default: 0
  },
  ...MongooseHelper.timeStamps
});

CoinSchema.plugin(mongoosePaginate);
module.exports = Database1.model('Coin', CoinSchema);
