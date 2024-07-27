const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const MongooseHelper = require("../utils/mongoose");
const {P_PENDING, T_COIN_TYPE_RECEIVE_FROM, TREATS_TYPE,  WALLET_TRANSACTION_TYPE, PAYMENT_METHOD, PAYMENT_STATUS } = require("../utils/constant");
const { Database1 } = require("../utils/database");

const PaymentSchema = new mongoose.Schema(
    {
        method: {
            type: String,
            enum: Object.values(PAYMENT_METHOD)
        },
        status: {
            type: String,
            enum: Object.values(PAYMENT_STATUS),
            default: PAYMENT_STATUS.PENDING
        },
        amount: {
            type: Number,
            required: true
        },
        expiredAt: {
            type: Date,
            default: null,
            index: true
        },
        cancelledAt: {
            type: Date,
            default: null,
            index: true
        },
        completedAt: {
            type: Date,
            default: null,
            index: true
        },
        purchaseTokenSuccess: {
            type: String,
        },
        purchaseTokenFailed: {
            type: String,
        },
        applePayTransactionId: {
            type: String,
            index: true,
            select: false
        },
        applePayReceipt: {
            type: Object,
            select: false
        }
    },
    {
        select: false,
        _id: false
    }
)

const MetaDataSchema = new mongoose.Schema(
    {
        recipientName: {
            type: String,
            lowercase: true,
            trim: true
        },
        senderName: {
            type: String,
            lowercase: true,
            trim: true
        },
        treatName: {
            type: String,
            lowercase: true,
            trim: true
        },
        treatType: {
            type: String,
            enum: TREATS_TYPE
        },
        treatImage: MongooseHelper.fileLocation
    },
    {
        select: false
    }
);

const TransactionReferenceSchema = new mongoose.Schema(
    {
        transactionId: {
            type: mongoose.Schema.ObjectId,
        },
        coins: {
            type: Number, // value of treat coins
        },
        coinsCoversionFeePercentage: {
            type: Number,
            required: true,
        },
        treatName: {
            type: String,
            lowercase: true,
            trim: true
        },
    },
    {
        select: false
    }
)

const WalletTransactionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: Object.values(WALLET_TRANSACTION_TYPE),
            index: true
        },
        user: { // user transaction is for payment
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            index: true
        },
        recipient: { // reipient is for sending treat
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            index: true
        },
        sender: { // sender is for sending treat
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            index: true
        },
        treat: {
            type: mongoose.Schema.ObjectId,
            ref: 'Treat'
        },
        pet: {
            type: mongoose.Schema.ObjectId,
            ref: 'Pet',
            index: true
        },
        coins: {
            type: Number,
            required: true,
            index: true
        },
        treatTotalConverted: {
            type: Number,
        },
        quantity: {
            type: Number,
        },
        postId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Post'
        },
        commentId: {
            type: mongoose.Schema.ObjectId,
            ref: 'PostComment'
        },
        coinsId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Coins'
        },
        message: {
            type: String,
            trim: true
        },
        usageId: {
            type: mongoose.Schema.ObjectId,
            ref: 'WalletTransaction'
        },
        transactionReference: [TransactionReferenceSchema],
        // transactionType: {
        //     type: String,
        //     enum: Object.values(WALLET),
        //     required: true
        // },
        payment: PaymentSchema,
        metaData: MetaDataSchema,
        createdAt: {
            type: Date,
            default: Date.now,
            index: true,
            select: false
        },
        updatedAt: {
            type: Date,
            default: Date.now,
            index: true,
            select: false
        }
    }
);

WalletTransactionSchema.index({ "recipient": 1, "payment.type": 1});

WalletTransactionSchema.plugin(mongoosePaginate);
WalletTransactionSchema.plugin(require('mongoose-aggregate-paginate-v2'));

module.exports = Database1.model('WalletTransaction', WalletTransactionSchema);