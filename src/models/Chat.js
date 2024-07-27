const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const { Database1 } = require('../utils/database');

const ChatSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            index: true
        }
    ],
    name: {
        type: String,
        default: 'One to One Chat Room',
    },
    latestMessage: {
        type: String,
        ref: 'ChatMessage',
        default: null
    },
    isGroup: {
        type: Boolean,
        default: false
    },
    participantsAdmin: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            index: true
        }
    ],
    type: {
        type: String,
        enum: ['private', 'group', 'support'],
        default: 'private',
        index: true,
    },
    roomId: {
        type: String,
        default: null,
        index: true
    },
    inviteLink: {
        type: String,
        // default: function() {
        //     // Generate a unique identifier for the chat
        //     const uniqueId = mongoose.Types.ObjectId().toString();

        //     // Create an invite link using the unique identifier
        //     const inviteLink = `https://yourwebsite.com/chat/${uniqueId}`;

        //     return inviteLink;
        // }
    },
    seenBy: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
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
});

ChatSchema.plugin(mongoosePaginate);
module.exports = Database1.model('Chat', ChatSchema);
