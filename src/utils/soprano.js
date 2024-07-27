const axios = require('axios');

const sopranoSendSMSGET = async (destination, message, settings = {}) => {
    let err;
    let isInAppSent = '';

    const result = await axios
        .get(
            `${process.env.SOPRANO_ENDPOINT_URL}/cgphttp/servlet/sendmsg?username=${process.env.SOPRANO_USERNAME}&password=${process.env.SOPRANO_PASSWORD}&destination=${destination}&text=${message}&source=MWELLPH`
        )
        .catch((error) => {
            err = error;
        });

    if (settings.message) isInAppSent = await moengageSendInAppNotification(settings);

    if (isInAppSent) {
        console.log(
            JSON.stringify({
                message: `StartMoengage - ${settings.campaign}`,
                settings: settings,
                data: isInAppSent?.data
            })
        );
    }

    if (err) console.log(JSON.stringify({ message: 'failedSMSSendMessage', responseError: error?.data, message, destination }));
    else console.log(JSON.stringify({ message: 'successSMSSendMessage', responseSuccess: result?.data, message, destination }));
};

exports.sendTwilioSMS = async (destination, message, prefix = '+63') => {
    let err;

    let receiver = prefix + destination;

    const params = new URLSearchParams();
    params.append('Body', message);
    params.append('From', process.env.TWILIO_SENDER_NAME);
    params.append('To', receiver);

    // get a token from bayad endpoint
    const result = await axios
        .post(`${process.env.TWILIO_BASE_URL}/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, params, {
            auth: {
                username: process.env.TWILIO_ACCOUNT_SID,
                password: process.env.TWILIO_AUTH_TOKEN
            }
        })
        .catch((error) => (err = error?.response));

    if (err) console.log(JSON.stringify({ message: 'TwilioError', error: error?.response?.data }));
    else console.log(JSON.stringify({ message: 'TwilioSuccess', success: result?.data }));
};

exports.sendSMSOTP = async (payload) => {
    const number = payload?.phoneNumber;
    const SMSMessage = `Your Mwell App One-Time PIN (OTP) is:${payload.code} `;

    try {
        if (payload?.phoneNumberPrefix === '+63') await sopranoSendSMSGET(number, SMSMessage);
        else await sendTwilioSMS(number, SMSMessage, payload?.phoneNumberPrefix);
    } catch (e) {
        console.log(JSON.stringify({ message: 'TwilioErrorCode', error: e?.message || e }));
    }
};
