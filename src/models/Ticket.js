const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const MongooseHelper = require('../utils/mongoose');
const { Database1 } = require('../utils/database');

const { TICKET_STATUS } = require('../utils/constant');
const TicketStatusSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: Object.values(TICKET_STATUS),
    default: TICKET_STATUS.OPEN
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

const TicketSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: 'User', 
            index: true
        },
        issue: { 
            type: String, 
            required: true 
        },
        ticketStatus: [TicketStatusSchema],
        // status: { 
        //     type: String, 
        //     enum: ['open', 'resolved'], 
        //     default: 'open' 
        // },
        resolution: { 
            type: String 
        },
        communication: [
            { 
                message: String, 
                sentAt: Date 
            }
        ],
        ...MongooseHelper.timeStamps
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

TicketSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
  });

TicketSchema.plugin(mongoosePaginate);
module.exports = Database1.model('Ticket', TicketSchema);
