const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const MongooseHelper = require('../utils/mongoose');

const { Database1 } = require('../utils/database');

const ChatMessageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.ObjectId,
        ref: 'Chat',
        required: true,
        index: true
    },
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    message: {
        type: String,
        required: true
    },
    ...MongooseHelper.timeStamps
});

ChatMessageSchema.plugin(mongoosePaginate);
module.exports = Database1.model('ChatMessage', ChatMessageSchema);
