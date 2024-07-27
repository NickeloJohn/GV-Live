const { transformImageUrl } = require("../../utils/transform");
const { DEFAULT_IMAGE } = require('../../utils/constant');
const config = require('../../config/config');

const transformGetAllReward = (product) => {
    return {
        id: product?._id,
        name: product?.name,
        description: product?.description,
        price: Math.round((product?.price / config.bitsConversionRate)),
        ratings: product?.rating,
        sold: product?.sold,
        variation: product?.variation,
        stocks: product?.stocks,
        type: product?.type,
        image: transformImageUrl(product.images) || DEFAULT_IMAGE,
    }
}

const transformGetAllRewards = (products) => {
    return products.map(product => transformGetAllReward(product));
}

module.exports = {
    transformGetAllReward,
    transformGetAllRewards
}