const axios = require("axios");
const moment = require("moment");

class Paymaya {

    async createPayment (transaction) {

        const referenceNumber = transaction?.referenceNumber;

        const requestBody = {
            totalAmount: {
                currency: transaction.currency || "PHP",
                value: parseFloat(transaction?.amount || 0),
                details: {
                    discount: 0,
                    serviceCharge: 0,
                    subtotal: transaction.amount + transaction?.transactionFee
                }
            },
            buyer: {
                firstName: transaction.user?.firstName || '',
                middleName: transaction.user?.middleName || '',
                lastName: transaction.user?.lastName || '',
                contact: {
                    phone: transaction.user?.phoneNumber || '',
                    email: transaction.user?.email || ''
                },
                ipAddress: ''
            },
            items: [
                {
                    name: transaction.title,
                    code: referenceNumber,
                    quantity: transaction?.quantity || 1,
                    description: `This transaction will be charged with a PhP ${transaction?.transactionFee}.00 convenience fee.`,
                    amount: {
                        value: transaction?.amount,
                        details: {
                            discount: 0,
                            subtotal: transaction?.amount
                        }
                    },
                    totalAmount: {
                        value: transaction?.amount,
                        details: {
                            discount: 0,
                            subtotal: transaction?.amount
                        }
                    }
                },
                {
                    name: ' Transaction fee',
                    code: referenceNumber,
                    amount: {
                        value: transaction?.transactionFee,
                        details: {
                            discount: 0,
                            subtotal: transaction?.transactionFee
                        }
                    },
                    totalAmount: {
                        value: transaction?.transactionFee,
                        details: {
                            discount: 0,
                            subtotal: transaction?.transactionFee
                        }
                    }
                }
            ],
            redirectUrl: {
                success: transaction.successUrl || 'https://google.com?status=success',
                failure: transaction.failureUrl || 'https://google.com?status=fail',
                cancel: transaction.cancelUrl || 'https://google.com?status=cancel'
            },
            requestReferenceNumber: referenceNumber
        }

        return this.sendPayment(requestBody);
    }

    async sendPayment(requestBody) {
        //base64_encode equivalent
        const authorization = Buffer.from(`${process.env.PAYMAYA_CHECKOUT_PUBLIC_KEY}:${process.env.PAYMAYA_CHECKOUT_SECRET_KEY}`, 'utf8').toString('base64');
        const data = await axios
            .post(`${process.env.PAYMAYA_CHECKOUT_URL}`, requestBody, {
                headers: { Authorization: 'Basic ' + authorization }
            })
            .then((res) => {
                if(process.env?.NODE_ENV === "PRODUCTION") console.log(JSON.stringify({ message: 'PaymayaSuccessSendPayment', requestBody }))
                return res.data;
            })
            .catch((err) => {
                if(process.env?.NODE_ENV === "PRODUCTION") console.log(JSON.stringify({ message: 'PaymayaErrorSendPayment', requestBody }))
                throw new Error('ERROR PAYMENT PAYMAYA');
            });

        const responseData = {
            data: {
                paymentId: data.checkoutId,
                referenceNumber: requestBody.requestReferenceNumber,
                checkoutUrl: data.redirectUrl,
                status: 'PENDING',
                createdAt: moment().format('YYYY-MM-DD HH:m:s'),
                expiresAt: moment().add(1, 'hours').format('YYYY-MM-DD HH:m:ss')
            }
        };

        return {
            success: true,
            data: responseData
        };
    }

    async sendPaymentTransaction(requestBody) {
        //base64_encode equivalent
        const base64 = `${process.env.PAYMAYA_CHECKOUT_PUBLIC_KEY}:${process.env.PAYMAYA_CHECKOUT_SECRET_KEY}`;
        const authorization = Buffer.from(base64, 'utf8').toString('base64');

        const url = process.env.PAYMAYA_CHECKOUT_URL;
        const data = await axios
            .post(url, requestBody, {
                headers: { Authorization: 'Basic ' + authorization }
            })
            .then((res) => {
                if(process.env?.NODE_ENV === "PRODUCTION") console.log(JSON.stringify({ message: 'PaymayaSuccessSendPayment', requestBody }))
                return res.data;
            })
            .catch((err) => {
                if(process.env?.NODE_ENV === "PRODUCTION") console.log(JSON.stringify({ message: 'PaymayaErrorSendPayment', requestBody }))
                throw new Error('ERROR PAYMENT PAYMAYA');
            });

        const responseData = {
            data: {
                paymentId: data.checkoutId,
                referenceNumber: requestBody.requestReferenceNumber,
                checkoutUrl: data.redirectUrl,
                status: 'PENDING',
                createdAt: moment().format('YYYY-MM-DD HH:m:s'),
                expiresAt: moment().add(1, 'hours').format('YYYY-MM-DD HH:m:ss')
            }
        };

        return {
            success: true,
            data: responseData
        };
    }

    async validateTransaction(paymentId) {
        //base64_encode equivalent
        const authorization = Buffer.from(`${process.env.PAYMAYA_CHECKOUT_SECRET_KEY}:`, 'utf8').toString('base64');
        const url = `${process.env.PAYMAYA_CHECKOUT_URL}/${paymentId}`;
        console.log(url)
        const data = await axios
            .get(url, {
                headers: { Authorization: 'Basic ' + authorization }
            })
            .then((res) => {
                const responseData = res.data;
                if(process.env?.NODE_ENV === "PRODUCTION") console.log(JSON.stringify({ message: 'validateTransaction', responseData, paymentId }))
                return {
                    paymentScheme: responseData.paymentScheme,
                    status: responseData.status,
                    paymentStatus: responseData.paymentStatus,
                    paymentDetails: responseData.paymentDetails,
                    receiptNumber: responseData.receiptNumber,
                    requestReferenceNumber: responseData.requestReferenceNumber,
                    paymentScheme: responseData.paymentScheme
                };
            })
            .catch((err) => {
                if(process.env?.NODE_ENV === "PRODUCTION") console.log(JSON.stringify({ message: 'validateTransaction', err, paymentId }))
                throw new Error(err);
            });

        return data;
    }
}

exports.Paymaya = new Paymaya();