const { transformImageUrl } = require("../utils/transform");

const transformGetGifts = (gift, giftCategory) => {
  let name = '--';
  let icon = '--';
  let type = '--';

  if (giftCategory) {
    name = giftCategory?.name;
    type = giftCategory?.type;
    icon = transformImageUrl(giftCategory?.icon);
  }

  return {
    id: gift._id,
    name: name,
    status: gift.status,
    coin: gift.coins,
    icon: icon,
    type: type
  };
};


module.exports = {
  transformGetGifts
}