const _ = require('lodash');
const { transformImageUrl } = require('../../utils/transform');
const ShopProduct = require('../../models/ShopProduct');

const transformProduct = async (product) => {
  const shopProduct = await ShopProduct.findOne({ _id: product.productId }).select('variation');
  const variant = shopProduct.variation.find((e) => JSON.stringify(e._id) === JSON.stringify(product.variantId)) || {};

  //if product is a service, set to default product name
  if (product.type === 'services') {
    variant.name = '';
  }

  return {
    productId: product.productId,
    variantId: product.variantId,
    productName: product.name,
    name: variant?.name,
    price: product.price,
    discountPrice: product.discountPrice,
    discountPercentage: product.discountPercentage,
    quantity: product.quantity,
    merchant: product.merchant,
    type: product.type,
    image: transformImageUrl(product?.image) || 'https://placehold.co/200x200',
    isReview: product.isReviewed,
    orderId: product?.orderId,
    rating: product.rating,
    _id: product._id
  };
};

const transformProducts = async (products) => {
  return await Promise.all(products.map((product) => transformProduct(product)));
};

const transformGetAllOrderHistory = async (transaction) => {
  return {
    transactionId: transaction._id,
    orderId: transaction.orderId,
    user: transaction.user,
    merchant: {
      merchantId: transaction.merchant.merchantId,
      name: transaction.merchant.name
    },
    products: await transformProducts(transaction.products),
    payment: _.pick(transaction.payment, ['method', 'status', 'amount']),
    orderStatus: transaction.orderStatus.map(({ status, createdAt }) => ({ status, createdAt })),
    orderStatusCancelled: transaction.orderStatusCancelled?.map(({ status, createdAt }) => ({ status, createdAt })),
    orderConfirmation: transaction.orderConfirmation,
    deliveryAddress: transaction.deliveryAddress,
    totalShippingFee: transaction.totalShippingFee || 0,
    isReceived: transaction.isReceived || null,
    totalAmount: transaction.payment.amount,
    delivery: {
      expected: transaction.delivery?.expected || null
    }
  };
};

const transformGetAllOrderHistories = async (transactions) => {
  return await Promise.all(transactions.map(async (transaction) => await transformGetAllOrderHistory(transaction)));
};

const transformOrderSummary = async (orderHeader, orderDetails) => {
  return {
    orderHeader: {
      orderId: orderHeader._id,
      payment: orderHeader.paymentMethod,
      deliveryAddress: orderDetails[0].deliveryAddress
    },
    orderSummary: await Promise.all(
      orderDetails.map(async (detail) => {
        detail = await transformGetAllOrderHistory(detail);
        delete detail.deliveryAddress;
        delete detail.payment;
        return detail;
      })
    ),
    totalAmount: orderHeader.totalAmount,
    totalShippingFee: orderDetails.reduce((acc, detail) => acc + detail.totalShippingFee, 0) || 0
  };
};

const transformOrderReturnResult = async (order) => {
	const data = {
		transactionId: order._id,
		orderId: order.orderId,
		merchant: order.merchant,
		product: {
			productId: order.products.productId,
			variantId: order.products.variantId,
			name: order.products.name,
			price: order.products.price,
			quantity: order.products.quantity,
			image: transformImageUrl(order.products.image) || 'https://placehold.co/200x200',
		},
		createdAt: order.products.returnItem?.createdAt || new Date()
	}

	return data;
}

const getStatusValue = (value) => {
	const data = {
		'process': 'Returning Process',
		'return': 'Ongoing Return',
		'cancelled': 'Cancelled Return',
	}

	return data[value] || 'Unknown';
}

const setDisplayStatusReturnItem = (status) => {
	return {
		status: status.status,
		statusValue: getStatusValue(status.status),
	}
}

const transformOrderReturnDetailsResult = async (order) => {
	let data = {
		...await transformOrderReturnResult(order),
		reason: order.products.returnItem.reason,
    returnedBy: order.products.returnItem.returnedBy,
    attachments: order.products.returnItem.attachments.map((img) => {
      return {
        url: transformImageUrl(img),
        type: img.contentType
      }
    }),
		statuses: order.products.returnItem?.status.map(setDisplayStatusReturnItem)
	}

	return data;
}

module.exports = {
  transformGetAllOrderHistory,
  transformGetAllOrderHistories,
  transformOrderSummary,
	transformOrderReturnResult,
	transformOrderReturnDetailsResult
};
