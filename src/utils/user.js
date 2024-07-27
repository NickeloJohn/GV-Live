const moment = require("moment");
const _ = require('lodash');
const { customAlphabet } = require("nanoid");


const createOTPNumber = () => {
    const nanoid = customAlphabet(`1234567890${Date.now()}`, 10)
    return nanoid(6).toUpperCase().slice(0, 6) //=> "f01a2"
}

exports.createOTPNumber = createOTPNumber

exports.requestLogInfo = (req) => {
    return {
        registerLogInfo: {
            createdUserIp: req.ip || "no-ip",
            deviceID: req.headers['x-app-device-id'] || "no-app-device-id",
            deviceType: req?.headers['x-app-version'] || "no-app-version"
        }
    }
}

exports.createEmailOTP = () => {
    const otpNumber = createOTPNumber();
    return {
        code: otpNumber,
        createdAt: moment().toDate(),
        resendAt: moment().add(1, 'minutes').toDate(),
        expiredAt: moment().add(5, 'minutes').toDate()
    };
}

exports.createSMSOTP = () => {
    const otpNumber = createOTPNumber();
    return {
        code: otpNumber,
        createdAt: moment().toDate(),
        resendAt: moment().add(1, 'minutes').toDate(),
        expiredAt: moment().add(5, 'minutes').toDate()
    }
}

exports.validatePassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(password);
}

exports.excludePrivateData = (users) => {
    users = JSON.parse(JSON.stringify(users))
    users = users.map(user => {
        return {
            firstName: user?.firstName,
            middleName: user?.middleName,
            lastName: user?.lastName,
            email: user?.email,
            id: user?.id,
            files: user?.files
        }
    });
    return users;
}