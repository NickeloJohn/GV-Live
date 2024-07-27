const mongoose = require('mongoose');
const { Database1 } = require('../utils/database');

const UserReferralSchema = new mongoose.Schema({
    referralCode: {
        type: String,
        required: true,
        index: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    usedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    usedStatusUser: {
        type: String,
        enum: ['verified', 'unverified'],
    },
    usedAt: {
        type: Date,
        default: Date.now, 
        index: true
    },
});

module.exports = Database1.model('UserReferral', UserReferralSchema);
