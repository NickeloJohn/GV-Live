// const helperService = require("../services/helper.service")
const { WALLET_TRANSACTION_TYPE } = require("../utils/constant")
const { transformImageUrl } = require("../utils/transform")
const { transformAuthorInformation, transformUserInformation } = require("./user.transform")


const basicData = (walletTransaction) => {
    return {
        id: walletTransaction._id,
        name: walletTransaction.treatName || walletTransaction.metaData.treatName,
        quantity: walletTransaction.quantity, // temporary fixed
        coins: walletTransaction.coins || 0,
        image: transformImageUrl(walletTransaction?.treatImage || walletTransaction.metaData?.treatImage) ,
        type: walletTransaction.treatType || walletTransaction.metaData.treatType,
        fullname: walletTransaction.fullname || walletTransaction.metaData?.recipientName ||'',
        recipient: walletTransaction.recipient || undefined,
    }
}

const transformWalletTransactionSentToPost = (walletTransaction) => {
    return {
        ...basicData(walletTransaction),
        message: walletTransaction.message || '',
        coins: walletTransaction?.coins,
    }
}

const transformWalletTransaction = (walletTransaction, treatValue) => {
    return {
        ...basicData(walletTransaction),
        value: treatValue ? treatValue.get(walletTransaction._id.toString()) || 0 : undefined,
    }
}

const transformWalletTransactionTopFanSender = async (walletTransactions) => {
    // Create a Map for fast user lookup
    const senderIds = walletTransactions.map((walletTransaction) => walletTransaction?.sender?.toString());
    const users = new Map();

    // Fetch user information for sender IDs in a single query
    const userResults = await helperService.getUserByIds(senderIds);
    userResults.forEach((user) => {
        users.set(user.id.toString(), transformUserInformation(user));
    });

    // Transform wallet transactions
    const results = walletTransactions.map((walletTransaction) => ({
        ...basicData(walletTransaction),
        user: users.get(walletTransaction?.sender?.toString())
    }));

    return results;
}

const statusMessages = {
    'completed': 'Recharge Successful',
    'cancelled': 'Recharge Cancelled',
    'pending': 'Recharge Pending',
    'expired': 'Recharge Expired',
    'failed': 'Recharge Failed'
};

const getStatusMessage = (payment) => {
    return statusMessages[payment?.status] || '';
}

const handleReceiveType = (walletCoinHistory, data) => {
    data.name = walletCoinHistory.metaData?.treatName || walletCoinHistory.treatName;
    data.image = transformImageUrl(walletCoinHistory.metaData?.treatImage) || '';
    data.type = walletCoinHistory.metaData?.treatType || walletCoinHistory.treatType;
    data.quantity = walletCoinHistory.quantity || 1;
}

const handleRechargeType = (walletCoinHistory) => {
    return {
        status: walletCoinHistory.payment?.status,
        amount: walletCoinHistory.payment?.amount || 0
    };
}

const handleCoinsTransactionType = async (walletCoinHistory, data) => {
    const transactionIds = walletCoinHistory.transactionReference.map(({ transactionId }) => transactionId);
    data.quantity = await helperService.sumQuantityByTransactionIds(transactionIds);
}

const transformWalletCoinHistory = (walletCoinHistory) => {
    const data = {
        id: walletCoinHistory.id,
        coins: walletCoinHistory.coins,
        createdAt: walletCoinHistory.createdAt,
    }

    const { PET, PROFILE, POST, COMMENT, RECHARGE, RECHARGE_PAID } = WALLET_TRANSACTION_TYPE;

    if (walletCoinHistory.type === RECHARGE || walletCoinHistory.type === RECHARGE_PAID) {
        data.payment = handleRechargeType(walletCoinHistory);
    }

    // const { PET, PROFILE, POST, COMMENT, RECHARGE, RECHARGE_PAID } = WALLET_TRANSACTION_TYPE;
    // const RECEIVE_TYPE = [PET, PROFILE, POST, COMMENT];

    // if (RECEIVE_TYPE.includes(walletCoinHistory.type)) {
    //     handleReceiveType(walletCoinHistory, data);
    // } else if (walletCoinHistory.type === RECHARGE || walletCoinHistory.type === RECHARGE_PAID) {
    //     await handleRechargeType(walletCoinHistory, data);
    // } else if (walletCoinHistory.type === WALLET_TRANSACTION_TYPE.COINS_TRANSACTION) {
    //     await handleCoinsTransactionType(walletCoinHistory, data);
    // }

    return data;
}

const transformWalletCoinHistories = async (walletCoinHistories) => {
    return Promise.all(walletCoinHistories.map(transformWalletCoinHistory));
}

module.exports = {
    transformWalletTransactionSentToPost,
    transformWalletTransaction,
    transformWalletTransactionTopFanSender,
    transformWalletCoinHistory,
    transformWalletCoinHistories
}