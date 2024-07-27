const { PRICE_COIN_VALUE_COUNTRY } = require('../utils/constant');

const transformGetcoins = (obj, req) => {
  const { field = 'price_peso', currency = 'PHP', currencySymbol = '₱' } = PRICE_COIN_VALUE_COUNTRY[req.user?.country || "PH"];

  amount = obj[field];

  return {
    id: obj._id,
    coins: obj.coins,
    amount: amount,
    bonus: 0,
    currency: currency,
    currencySymbol: currencySymbol,
    global_product_id: `com.hs.unleash.${obj._id}`
  };
};

module.exports = {
  transformGetcoins
};
