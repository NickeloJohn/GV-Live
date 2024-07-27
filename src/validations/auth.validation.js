const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const login = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required()
    })
};

const loginPhoneNumber = {
    body: Joi.object().keys({
        phoneNumber: Joi.string().required(),
        phoneNumberPrefix: Joi.string().required(),
    })
};

const loginAsGoogle = {
    body: Joi.object().keys({
        accessToken: Joi.string().required(),
    })
};

const loginAsFacebook = {
    body: Joi.object().keys({
        accessToken: Joi.string().required(),
    })
};

const loginAsApple = {
    body: Joi.object().keys({
        accessToken: Joi.string().required(),
    })
};

const verifySMSPhoneNumber = {
    body: Joi.object().keys({
        otpNumber: Joi.string().required(),
        userId: Joi.string().required(),
    })
};

const forgotPasswordStep1 = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        type: Joi.string().required().valid('verify', 'deeplink').default('verify')
    })
};

const forgotPasswordStep2 = {
    body: Joi.object().keys({
        token: Joi.string().required(),
        password: Joi.string().required().custom(password),
        cpassword: Joi.string().required().valid(Joi.ref('password')).messages({
            'any.only': 'Confirm password does not match with password'
        })
    })
};

const forgotPasswordStep3 = {
    body: Joi.object().keys({
        token: Joi.string().optional(),
        userId: Joi.string().required().custom(objectId),
        password: Joi.string().required().custom(password),
        cpassword: Joi.string().required().valid(Joi.ref('password')).messages({
            'any.only': 'Confirm password does not match with password'
        })
    })
};

const refreshToken = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    })
};

const appleIdWebhhok = {
    body: Joi.object().keys({
        code: Joi.string().allow(),
        id_token: Joi.string().allow(),
        user: Joi.string().allow()
    })
};

module.exports = {
    login,
    loginPhoneNumber,
    verifySMSPhoneNumber,
    loginAsGoogle,
    loginAsFacebook,
    forgotPasswordStep1,
    forgotPasswordStep2,
    forgotPasswordStep3,
    loginAsApple,
    refreshToken,
    appleIdWebhhok
}