const PET_GENDER = ['male', 'female', '']

const ACTIVE_STATUS = 'Active';
const IN_ACTIVE_STATUS = 'In Active';
const DEFAULT_STATUS = [ACTIVE_STATUS, IN_ACTIVE_STATUS];

const TREAT = 'gift';
const EXCLUSIVE = 'exclusive';
const COINS = 'coins';
const TREATS_TYPE = [TREAT, EXCLUSIVE, COINS];

const P_PAYMAYA_METHOD = 'PAYMAYA';
const P_PAYMENT_METHOD = [P_PAYMAYA_METHOD];

const P_PENDING = 'pending';
const P_CANCELLED = 'cancelled';
const P_EXPIRED = 'expired';
const P_COMPLETED = 'completed';
const P_PAYMENT_STATUS = [P_PENDING, P_CANCELLED, P_EXPIRED, P_COMPLETED];

const T_CREDIT = 'credit';
const T_DEBIT = 'debit';
const T_VOID = 'void';
const T_FOR_PAYMENT = 'for_payment';

const T_COIN_ADD = 'coin_add';
const T_COIN_DEDUCT = 'coin_deduct';
const T_COIN_TYPE_SEND_TO_POST = 'post';
const T_COIN_TYPE_SEND_TO_COMMENT = 'comment';
const T_COIN_TYPE_SEND_TO_PET = 'pet';
const T_COIN_TYPE_SEND_TO_PROFILE = 'profile';
const T_COIN_TYPE_SEND_TO_RECEIVE_FROM = [T_COIN_TYPE_SEND_TO_POST, T_COIN_TYPE_SEND_TO_COMMENT, T_COIN_TYPE_SEND_TO_PET, T_COIN_TYPE_SEND_TO_PROFILE];
const TREATS_TRANSACTION_TYPE = [T_COIN_ADD, T_COIN_DEDUCT, T_FOR_PAYMENT];
const DEFAULT_IMAGE = 'https://placehold.co/200x200';


const PRICE_COIN_VALUE_COUNTRY = {
    PH: {
        field: 'price_peso',
        currency: 'PHP',
        currencySymbol: '₱'
    }
};

const WALLET_TRANSACTION_TYPE  = {
    POST: 'sent_treats_to_post',
    COMMENT: 'sent_treats_to_comment',
    PET: 'sent_treats_to_pet',
    PROFILE: 'sent_treats_to_profile',
    RECHARGE: 'recharge_coins', // buying coins
    TREATS_TRANSACTION: 'convert_treats_to_unleash_coins_treats_transaction', // convert treats to coins
    RECHARGE_PAID: 'recharge_coins_paid', // buying coins
    USAGE: 'usage_coins', // use coins
    COINS_TRANSACTION: 'convert_treats_to_unleash_coins_coin_transaction', // treats already converted to coins
    CLAIM_REWARDS: 'claim_rewards'
}

const WALLET_TRANSACTION_NAME  = {
    POST: 'Sent treats to a post',
    COMMENT: 'Sent treats to a comment',
    PET: 'Sent treats to a pet',
    PROFILE: 'Sent treats to a profile',
    RECHARGE: 'Recharge coins',
    USAGE: 'Usage coins',
    TREATS_TRANSACTION:'Convert treats to unleash coins (Treats transaction)',
    COINS_TRANSACTION:'Convert treats to unleash coins, (Coins transaction)',
    CLAIM_REWARDS: 'Claim rewards'
}

const PAYMENT_METHOD = {
    PAYMAYA: 'PAYMAYA',
    GOOGLE_PAY: 'GOOGLE_PAY',
    CASH_ON_DELIVERY: 'CASH_ON_DELIVERY',
    COINS: 'COINS',
    REWARDS: 'REWARDS'
}

const PAYMENT_STATUS = {
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    PENDING: 'pending',
    DECLINED: 'declined',
    EXPIRED: 'expired',
    FAILED: 'failed',
    UNKNOWN: 'unknown'
}

const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed', //The order has been acknowledged and confirmed by the seller.
    READY_FORM_PICKUP: 'ready_for_pickup',
    FOR_DELIVERY: "for_delivery",
    DELIVERED: 'delivered', //The order has been delivered to the buyer.
    COMPLETED: 'completed', //The order has been completed.

    AWAITING_CUSTOMER: 'awaiting_customer', //The order is awaiting the customer to take action.
    SERVICED: 'serviced', //The order has been serviced.

    // PROCESSING: 'processing', //The seller is preparing the item, which may include packaging and
    // SHIPPED: 'shipped', //The order has been shipped by the seller.
    // IN_TRANSIT: 'in_transit', //The order is being delivered to the buyer.
    CANCELLED: 'cancelled', //The order has been cancelled.
    CANCELLED_USER: 'cancelled_user', //The order has been cancelled.
    // REFUNDED: 'refunded', //The order has been refunded.
    // RETURNED: 'returned', //The order has been returned to the seller.
    // REJECTED: 'rejected', //The order has been rejected by the seller.
    ORDER_RECEIVED: 'order_received', //The order has been received by the buyer.
    TO_REVIEW: 'to_review'
}

const ORDER_STATUS_CANCELLED = {
    PROCESS: 'process',
    PENDING_REFUND: 'pending_refund',
    REFUNDED: 'refunded',
    CANCELLED: 'cancelled',
}

const ORDER_STATUS_RETURN = {
    PROCESS: 'process',
    RETURN: 'return',
    RETURNED: 'returned',
    CANCELLED: 'cancelled',
}

const TYPE_RETURN_ITEMS = ['return', 'refund']

const ORDER_CONFIRMATION_STATUS = {
    RECEIVED: 'received',
    NOT_RECEIVED: 'not_received',
    PENDING_CONFIRMATION: 'pending_confirmation',
}

const PRODUCT_STATUS = {
    INACTIVE: 'inactive', // Product is inactive or not available for ordering
    ACTIVE: 'active', // Product is active and can be ordered by the user
    DELETED: 'deleted', // Product has been marked as deleted by the user
}

const PRODUCT_CATEGORY_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
}

const MUSIC_CATEGORY_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
}

const SECONDS = 60;

const EXPIRED_REDIST = {
    '1hour': 60 * 60 * 1, // 1 hour expiration
    '1d': 60 * 60 * 24, // 1 day expiration
}

const REDIS_KEY = {
    USER_INFORMATION: (subId) => `USER_INFORMATION_${subId}`,
    POST_CATEGORIES: (key) => `POST_CATEGORIES_${key}`,
}

const COMMENT_STATUS = {
    ACTIVE: 'active',
    DELETED: 'deleted'
}

const FOLLOWS_TYPE = 
{
  FOLLOWING: 'followed',
  FOLLOWER: 'follower'
}

const SHARE_TYPE = {
    APP: 'app',
    MESSENGER: 'messenger',
    TWITTER: 'twitter',
    INSTAGRAM: 'instagram',
    FACEBOOK: 'facebook',
    VIBER: 'viber',
    WHATSAPP: 'whatsapp',
    TELEGRAM: 'telegram'
}
const PRODUCT_TYPE = {
    PRODUCTS: 'products',
    SERVICES: 'services', 
    REWARDS: 'rewards', 

};

const SHIPPING_FEE = 39;

const NOTIFICATION_TYPE = {
    SYSTEM: 'system',
    POST: 'post',
    POST_LIKE: 'post_like',
    COMMENT: 'comment',
    COMMENT_LIKE: 'comment_like',
    PROFILE_USER: 'profile_user',
    PROFILE_PET: 'profile_pet',
    REPLY_COMMENT: 'reply_comment',
    FOLLOW_USER: 'follow_user',
    FOLLOW_PET: 'follow_pet',
    SERVICE: 'service',
    ORDER_CONFIRM: 'order_confirm',
    SEND_TREATS_TO_USER_PROFILE: 'send_treats_to_user_profile',
    SEND_TREATS_TO_PET_PROFILE: 'send_treats_to_pet_profile',
    RECEIVE_TREATS_POST: 'receive_treats_post',
    RECEIVE_TREATS_COMMENT: 'receive_treats_comment',
};

const CONFIG_PLATFORM = {
    ANDROID: 'android',
    IOS: 'ios', 
    WEB: 'web'
};

const GOOGLE_PAY_PAYMENT_STATUS = ['success', 'declined', 'pending'];

const PROFILE_PRIVACY_STATUS = ['everyone', 'only_me']

const CHAT_TYPE = {
    PRIVATE: 'private',
    GROUP: 'group'
}

const TICKET_STATUS = {
    OPEN: 'pending',
    IN_PROGRESS: 'in_progress', 
    AWAITING_CUSTOMER: 'awaiting_customer',
    RESOLVED: "resolved",
    CLOSED: "closed",
    CANCELLED: "cancelled"
  }


module.exports = {
    ACTIVE_STATUS,
    IN_ACTIVE_STATUS,
    DEFAULT_STATUS,
    TREATS_TYPE,
    TREAT,
    EXCLUSIVE,
    TREATS_TRANSACTION_TYPE,
    T_FOR_PAYMENT,
    T_VOID,
    T_DEBIT,
    T_CREDIT,
    P_PAYMENT_STATUS,
    P_PAYMENT_METHOD,
    P_PAYMAYA_METHOD,
    P_PENDING,
    P_CANCELLED,
    P_EXPIRED,

    P_COMPLETED,
    T_COIN_ADD,
    T_COIN_DEDUCT,
    T_COIN_TYPE_SEND_TO_POST,
    T_COIN_TYPE_SEND_TO_COMMENT,
    T_COIN_TYPE_SEND_TO_PET,
    T_COIN_TYPE_SEND_TO_PROFILE,
    T_COIN_TYPE_SEND_TO_RECEIVE_FROM,

    PRICE_COIN_VALUE_COUNTRY,
    PET_GENDER,
    
    WALLET_TRANSACTION_TYPE,
    WALLET_TRANSACTION_NAME,

    PAYMENT_METHOD,
    PAYMENT_STATUS,

    ORDER_STATUS,
    ORDER_CONFIRMATION_STATUS,

    EXPIRED_REDIST,
    REDIS_KEY,

    COMMENT_STATUS,

    FOLLOWS_TYPE,
    SHARE_TYPE,
    PRODUCT_TYPE,
    DEFAULT_IMAGE,

    PRODUCT_CATEGORY_STATUS,

    NOTIFICATION_TYPE,

    MUSIC_CATEGORY_STATUS,
    CONFIG_PLATFORM,

    GOOGLE_PAY_PAYMENT_STATUS,
    PROFILE_PRIVACY_STATUS,

    PRODUCT_STATUS,
    ORDER_STATUS_CANCELLED,
    ORDER_STATUS_RETURN,
    TYPE_RETURN_ITEMS,

    SHIPPING_FEE,
    CHAT_TYPE,
    TICKET_STATUS
};
