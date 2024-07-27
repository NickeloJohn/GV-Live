const _ = require("lodash");
const moment = require("moment");

const { getProductBysIds, getProductById, getProductByIdAndVariation, getMerchantNameById, getDeliveryDay, getAllDeliveryDaysWithTotalShippingFee, getMerchantDeliveryFeePerAreaById, getAllDeliveryDatesWithTotalShippingFee, getMerchantById, getProductNameById } = require("../../services/helper.service");
const { objectToString } = require("../../utils/functions");
const pick = require("../../utils/pick");
const { transformImageUrl } = require("../../utils/transform");

const transformProductCart = async (productCart) => {
    const { product, variantId, quantity, _id: cartId } = productCart;
    let productVariation = productCart.info || (await getProductByIdAndVariation(product, variantId));

    if (!productVariation) {
        productVariation = {
            variation: {
                name: "Product not found",
                price: 0,
                image: "",
                itemWeight: 0
            }
        }
    }

    const { variation: {  name, price, _id, image, itemWeight }, merchant, delivery } = productVariation;

    return {
        merchantId: merchant,
        cartId: cartId,
        productId: product,
        variantId: _id,
        productName: await getProductNameById(product),
        name: name,
        price: price,
        quantity: quantity,
        totalPrice: price * quantity,
        image: transformImageUrl(image),
        itemWeight: itemWeight,
        delivery: delivery
    };
};

const getAllCombineDeliveryDays = (products) => {
    const allDeliveryDays = [];
    products.forEach((product) => {
        if (product.delivery) {
            product.delivery.forEach((delivery) => {
                allDeliveryDays.push(delivery);
            });
        }
    });
    return allDeliveryDays;
}

const getAllDeliveryLongestDaysInProduct = (allDeliveryDays) => {
    // filter deliveryDays base on user location
    let deliveryDays = allDeliveryDays.filter((delivery) => delivery.locationName === 'manila');
    // sort deliveryDays by deliveryMaximumDays
    deliveryDays = _.orderBy(deliveryDays, ['deliveryMaximumDays'], ['desc']);
    deliveryDays = deliveryDays[0];
    return deliveryDays;
};

const transformGroupProductsByMerchant = async (carts, user) => {
    const userDefaultAddress = user.addressShipping.find((address) => address.isDefault);

    // Group carts by merchantId
    const groupCartByMerchant = _.groupBy(carts, 'merchantId');

    // Transform each group of carts
    const newCarts = await Promise.all(Object.entries(groupCartByMerchant).map(async ([merchantId, merchantCarts]) => {
        // Get merchant name
        const selectedField = 'name profilePicture profileBanner';
        const merchant = await getMerchantById(merchantId);
        // Pick necessary fields from each cart
        // const newProducts = merchantCarts.map(cart => _.pick(cart, ['cartId', 'productId', 'variantId', 'name', 'price', 'quantity', 'totalPrice', 'image', 'itemWeight', 'delivery']));
        
        // Pick necessary fields from each cart and add new field
        const newProducts = await Promise.all(merchantCarts.map(async cart => {
            const pickedCart = _.pick(cart, ['cartId', 'productId', 'variantId', 'name', 'price', 'quantity', 'totalPrice', 'image', 'itemWeight', 'delivery']);
            const product = await getProductNameById(pickedCart.productId);
            pickedCart.productName = product.name
            return pickedCart;
        }));
        
        // Get productIds from newProducts
        const productIds = newProducts.map(product => product.productId);

        // get total weight all products per merchant
        const totalWeight = newProducts.reduce((total, product) => {
            return total + (product.itemWeight * product.quantity);
        }, 0);


        let deliveryFeePerAreas = await getMerchantDeliveryFeePerAreaById(merchantId);
        // Get delivery dates
        const deliveryDatesWithTotalShippingFee = await getAllDeliveryDatesWithTotalShippingFee(productIds, deliveryFeePerAreas, totalWeight);

        // Return the transformed cart
        return {
            merchant: {
                merchantId: merchantId,
                merchantName: merchant.name,
                merchantProfilePicture: transformImageUrl(merchant.profilePicture),
                merchantProfileBanner: transformImageUrl(merchant.profileBanner),
            },
            products: newProducts,
            deliveryDate: deliveryDatesWithTotalShippingFee
        };
    }));

    return newCarts;
}
const transformProductCarts = async (productCarts, user) => {

    let carts = await Promise.all(productCarts.map(productCart => {
        return transformProductCart(productCart)
    }));

    carts = carts.filter(cart => cart?.variantId)
    const newCarts = await transformGroupProductsByMerchant(carts, user);

    return newCarts;
};

const transformCheckout = (orderHistoryHeader, orderHistoryItems) => {
    return {
        orderId: orderHistoryHeader._id,
        payment: _.pick(orderHistoryHeader, ["method", "status", "amount", "payUrl", "paymentId"])
    }
};

module.exports = {
    transformProductCart,
    transformProductCarts,
    transformCheckout
}