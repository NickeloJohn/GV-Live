const mongoose = require('mongoose');
const config = require('../config/config');

const Database1 = mongoose.createConnection(config.mongoose.database1.url);
const Database2 = mongoose.createConnection(config.mongoose.database2.url);
const Database3 = mongoose.createConnection(config.mongoose.database3.url);
const Database4 = mongoose.createConnection(config.mongoose.database4.url);
const Database5 = mongoose.createConnection(config.mongoose.database5.url);

module.exports = {
    Database1,
    Database2,
    Database3,
    Database4,
    Database5,

}