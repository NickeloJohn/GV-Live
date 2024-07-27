const mongoose = require('mongoose');

const { NOTIFICATION_TYPE } = require('../utils/constant');
const { Database1 } = require('../utils/database');
const mongoosePaginate = require('mongoose-paginate-v2');

const NotificationSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false,
    index: true
  },
  receiverId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  deeplink: {
    type: String
  },
  referenceId: {
    // referenceid is the id of the object which is being referred to type of notification
    type: mongoose.Schema.ObjectId,
    required: false,
    index: true
  },
  type: {
    type: String,
    enum: Object.values(NOTIFICATION_TYPE),
    default: NOTIFICATION_TYPE.SYSTEM,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

NotificationSchema.plugin(mongoosePaginate);
module.exports = Database1.model('Notification', NotificationSchema);
