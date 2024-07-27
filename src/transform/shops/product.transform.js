const ShopOrderHistory = require('../../models/ShopOrderHistory');
const ShopProduct = require('../../models/ShopProduct');
const { getRatings, getMerchantNameById, getMerchantById } = require('../../services/helper.service');
const { getFullName } = require('../../utils/functions');
const { transformImageUrl } = require('../../utils/transform');

const getDefaultImageFromVariantion = (variation) => {
  if (Array.isArray(variation) && variation.length > 0) {
    return variation[0].image;
  } else if (typeof variation === 'object' && variation !== null) {
    return variation.image;
  } else {
    return 'https://placehold.co/200x200';
  }
};

const getDefaultPriceFromVariantion = (variation) => {
  if (Array.isArray(variation) && variation.length > 0) {
    return variation[0].price;
  } else if (typeof variation === 'object' && variation !== null) {
    return variation.price;
  } else {
    return 0;
  }
};

const transformGetAllProduct = async (product) => {
  const defaultImageVariation = getDefaultImageFromVariantion(product?.variation);
  return {
    id: product._id,
    name: product.name,
    description: product.description,
    discountPrice: 0,
    ratings: product?.rating || 0,
    ratingsCount: await getRatings(product._id),
    sold: product?.sold || 0,
    discount: product?.discount || 0,
    stocks: product?.stocks || 0,
    variation: product?.variation,
    image: transformImageUrl(defaultImageVariation) || 'https://placehold.co/200x200',
    price: getDefaultPriceFromVariantion(product?.variation),
    type: product.type
  };
};

const transformGetProductDetails = async (product) => {
	const merchant= await getMerchantById(product.merchant, 'name profilePicture');

  return {
    id: product._id,
    merchant: {
      id: merchant._id,
      name: merchant.name,
      image: merchant?.profilePicture?.filename ? transformImageUrl(merchant.profilePicture) : 'https://placehold.co/200x200'
    },
    name: product.name,
    description: product.description,
    ratings: product?.rating || 0,
    ratingsCount: product?.ratingsCount || 0,
    sold: product?.sold || 0,
    stocks: product?.stocks || 0,
    variation: product.variation
      .filter((variation) => variation.status === 'active')
      .map((variation) => {
        return {
          id: variation._id,
          name: variation.name,
          price: variation.price,
          stocks: variation.stocks,
          size: variation.size,
          color: variation.color,
          sku: variation.sku,
          itemWeight: variation.itemWeight,
          image: transformImageUrl(variation.image) || 'https://placehold.co/200x200'
        };
    }),
    productGallery: product.productGallery.map((image) => ({ url: transformImageUrl(image), contentType: image?.contentType ?? image?.filename?.split('.')?.pop()?.toLowerCase() ?? "" })),
    type: product.type
  };
};

const setTransformProducts = async (product) => {
  const data = {
    id: product._id,
    name: product.name,
    description: product.description,
    ratings: product?.rating || 0,
    ratingsCount: product?.ratingCount || 0,
    sold: product?.sold || 0,
    price: product?.price || 0,
    image: product?.image,
    type: product.type
  };

  // if the product has default price set default price only
  if (product?.defaultPrice) data.price = product.defaultPrice;
  if (product?.defaultImage) data.image = product.defaultImage;

  data.image = transformImageUrl(data.image) || 'https://placehold.co/200x200';

  return data;
};

const transformGetAllProducts = async (products) => {
  return await Promise.all(products.map(setTransformProducts));
};

const transformGetAllProductsService = async (product) => {
  return {
    id: product._id,
    name: product.name,
    description: product.description,
    discountPrice: 0,
    ratings: product?.rating || 0,
    ratingsCount: await getRatings(product._id),
    sold: product?.sold || 0,
    discount: product?.discount || 0,
    image: transformImageUrl(product?.images) || 'https://placehold.co/200x200',
    price: product?.price || 0,
    type: product.type
  };
};

const transformGetAllProductsServices = async (products) => {
  return await Promise.all(products.map((product) => transformGetAllProductsService(product)));
};

const transformProductReview = async (review) => {
  let product = await ShopOrderHistory.findOne({ _id: review?.order, 'products.productId': review.product }).select('products');
  product = product.products.map((e) => ({ productId: e.productId, variantId: e.variantId }));

  let variation = await ShopProduct.findOne({ _id: review.product });
  variation = variation.variation?.filter((e) => JSON.stringify(product[0].variantId) === JSON.stringify(e._id));

  // console.log("compare ", JSON.stringify(product[0].variantId) === JSON.stringify(variation[0]))

  return {
    id: review._id,
    user: {
      id: review.user._id,
      name: getFullName(review.user),
      image: transformImageUrl(review.user.profilePicture) || 'https://placehold.co/200x200'
    },
    rating: review.rating,
    message: review.message,
    variation: variation[0] ?? {},
    attachments: review.attachments.map((attachment) => ({ url: transformImageUrl(attachment), contentType: attachment?.contentType ?? '' })),
    createdAt: review.createdAt,
    updatedAt: review.updatedAt
  };
};

const transformProductReviews = async (reviews) => {
  const transformedReviews = await Promise.all(reviews.map((review) => transformProductReview(review)));
  return transformedReviews;
};

module.exports = {
  transformGetAllProduct,
  transformGetAllProducts,
  setTransformProducts,
  transformGetProductDetails,
  transformProductReviews,
  transformProductReview,
  transformGetAllProductsServices
};
