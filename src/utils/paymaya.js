const axios = require("axios");
const moment = require("moment");
const config = require("../config/config");

class Paymaya {

    constructor() {
        this.authorizationHeader = this.getAuthorizationHeader();
    }

    getAuthorizationHeader() {
        const base64Credentials = Buffer.from(`${process.env.PAYMAYA_CHECKOUT_PUBLIC_KEY}:${process.env.PAYMAYA_CHECKOUT_SECRET_KEY}`, 'utf8').toString('base64');
        return 'Basic ' + base64Credentials;
    }

    async createPayment(transaction) {
        const referenceNumber = transaction?.referenceNumber;
        const requestBody = this.buildRequestBody(transaction, referenceNumber);
        return this.sendPaymentRequest(requestBody);
    }

    buildRequestBody(transaction, referenceNumber) {
        return {
            totalAmount: {
                currency: transaction.currency || "PHP",
                value: transaction.amount + transaction?.transactionFee,
                details: {
                    discount: 0,
                    serviceCharge: 0,
                    subtotal: transaction.amount + transaction?.transactionFee
                }
            },
            buyer: this.buildBuyerObject(transaction),
            items: this.buildItemsArray(transaction, referenceNumber),
            redirectUrl: {
                success: transaction.successUrl || 'https://google.com?status=success',
                failure: transaction.failureUrl || 'https://google.com?status=fail',
                cancel: transaction.cancelUrl || 'https://google.com?status=cancel'
            },
            requestReferenceNumber: referenceNumber
        };
    }

    buildBuyerObject(transaction) {
        return {
            firstName: transaction.user?.firstName || '',
            middleName: transaction.user?.middleName || '',
            lastName: transaction.user?.lastName || '',
            contact: {
                phone: transaction.user?.phoneNumber || '',
                email: transaction.user?.email || ''
            },
            ipAddress: ''
        };
    }

    buildItemsArray(transaction, referenceNumber) {
        const transactionItems = transaction.items.map((item) => {
            return {
                name: item.name,
                code: item.productId,
                quantity: item.quantity,
                // description: `This transaction will be charged with a PhP ${transaction?.transactionFee}.00 convenience fee.`,
                amount: {
                    value: item.price,
                    details: {
                        discount: 0,
                        subtotal: item.discountPrice * item.quantity
                    }
                },
                totalAmount: {
                    value: item.price,
                    details: {
                        discount: 0,
                        subtotal: item.discountPrice * item.quantity
                    }
                }
            };
        });

        const feeItem = {
            name: 'Shipping fee',
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
        };

        return [...transactionItems, feeItem];
    }

    async sendPaymentRequest(requestBody) {
        try {
            const response = await axios.post(config.paymaya.checkoutUrl, requestBody, {
                headers: { Authorization: this.authorizationHeader }
            });

            if (process.env?.NODE_ENV === "PRODUCTION") {
                console.log(JSON.stringify({ message: 'PaymayaSuccessSendPayment', requestBody }));
            }
            return this.formatResponseDataPaymentRequest(response.data, requestBody.requestReferenceNumber);
        } catch (error) {
            this.logError('PaymayaErrorSendPayment', requestBody, error);
            throw new Error('ERROR PAYMENT PAYMAYA');
        }
    }

    formatResponseDataPaymentRequest(data, referenceNumber) {
        return {
            success: true,
            data: {
                paymentId: data.checkoutId,
                referenceNumber: referenceNumber,
                checkoutUrl: data.redirectUrl,
                status: 'PENDING',
                createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                expiresAt: moment().add(1, 'hours').format('YYYY-MM-DD HH:mm:ss')
            }
        };
    }

    async validateTransaction(paymentId) {
        try {
            const authorization = Buffer.from(`${config.paymaya.secretKey}:`, 'utf8').toString('base64');
            const url = `${process.env.PAYMAYA_CHECKOUT_URL}/${paymentId}`;
            const response = await axios.get(url, { headers: { Authorization: 'Basic ' + authorization } });

            if (process.env?.NODE_ENV === "PRODUCTION") {
                console.log(JSON.stringify({ message: 'validateTransaction', responseData: response.data, paymentId }));
            }

            return this.extractTransactionData(response.data);
        } catch (error) {
            throw new Error(error);
        }
    }

    extractTransactionData(data) {
        return {
            paymentScheme: data.paymentScheme,
            status: data.status,
            paymentStatus: data.paymentStatus,
            paymentDetails: data.paymentDetails,
            receiptNumber: data.receiptNumber,
            requestReferenceNumber: data.requestReferenceNumber,
            paymentScheme: data.paymentScheme
        };
    }

    logError(message, requestBody, error) {
        if (process.env?.NODE_ENV === "PRODUCTION") {
            console.log(JSON.stringify({ message, requestBody, error: error.message }));
        }
    }
}

module.exports = new Paymaya();
