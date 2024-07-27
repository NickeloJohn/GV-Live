const axios = require("axios");
const moment = require("moment");

class GrabExpress {
    constructor() {
        this.clientId = process.env.GRAB_EXPRESS_CLIENT_ID;
        this.clientSecret = process.env.GRAB_EXPRESS_CLIENT_SECRET;
        this.grant_type = process.env.GRAB_EXPRESS_GRANT_TYPE;
        this.scope = process.env.GRAB_EXPRESS_SCOPE;
        this.token = null;
        this.tokenExpiration = null;
    }

    async getToken() {
        const url = 'https://partner-api.grab.com/grabid/v1/oauth2/token';
        const headers = {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json'
        };
        const data = {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: this.grant_type,
            scope: this.scope
        };

        try {
            const response = await axios.post(url, data, { headers });
            this.token = response.data.access_token;
            this.tokenExpiration = moment().add(response.data.expires_in, 'seconds');
            return this.token;
        } catch (error) {
            console.error('Error fetching token:', error);
            throw error;
        }
    }

    async getValidToken() {
        if (this.token && moment().isBefore(this.tokenExpiration)) {
            return this.token;
        } else {
            return await this.getToken();
        }
    }

    async makeApiRequest(method, url, logKey = '', data = null) {
        const token = await this.getValidToken();
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        console.log(JSON.stringify({ action: `Start ${logKey}`, payload: data }))

        try {
            const response = await axios({ method, url, headers, data });

            console.log(JSON.stringify({ action: `End ${logKey}`, payload: data, responseHeaders: response.headers, responseData: response.data }))
            
            return response.data;
        } catch (error) {
            console.error(`Error calling ${url}:`, error);
            throw error;
        }
    }

    async getDeliveryQuotes(data = null) {
        const url = 'https://partner-api.grab.com/grab-express-sandbox/v1/deliveries/quotes';
        return await this.makeApiRequest('POST', url, 'getDeliveryQuotes', data);
    }

    async getMultiStopDeliveryQuotes(data = null) {
        const url = 'https://partner-api.grab.com/grabfood-sandbox/partner/express/v1/deliveries/quotes';
        return await this.makeApiRequest('POST', url, 'getMultiStopDeliveryQuotes', data);
    }

    async createDelivery(data = null) {
        const url = 'https://partner-api.grab.com/grab-express-sandbox/v1/deliveries';
        return await this.makeApiRequest('POST', url, 'createDelivery', data);
    }

    async createMultiStopDelivery(data = null) {
        const url = 'https://partner-api.grab.com/grabfood-sandbox/partner/express/v1/deliveries';
        return await this.makeApiRequest('POST', url, 'createMultiStopDelivery', data);
    }

    async submitDeliveryTip(data = null) {
        const url = 'https://partner-api.grab.com/grab-express-sandbox/v1/deliveries/tip/submit';
        return await this.makeApiRequest('POST', url, 'submitDeliveryTip', data);
    }

    async getDeliveryDetails(deliveryID = '') {
        const url = `https://partner-api.grab.com/grab-express-sandbox/v1/deliveries/${deliveryID}`;
        return await this.makeApiRequest('GET', url, 'getDeliveryDetails');
    }

    async cancelDelivery(deliveryID = '') {
        const url = `https://partner-api.grab.com/grab-express-sandbox/v1/deliveries/${deliveryID}`;
        return await this.makeApiRequest('DELETE', url, 'cancelDelivery');
    }

    async cancelDeliveryByMerchantOrderId(merchantOrderID = '') {
        const url = `https://partner-api.grab.com/grab-express-sandbox/v1/merchant/deliveries/${merchantOrderID}`;
        return await this.makeApiRequest('DELETE', url, 'cancelDeliveryByMerchantOrderId');
    }
}

module.exports = new GrabExpress();
