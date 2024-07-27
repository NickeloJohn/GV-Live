const Joi = require('joi');
const { objectId, password } = require('./custom.validation');

const signupEmailAndPassword = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        referralCode: Joi.string().optional().allow(''), 
    })
};

const signupConfirmPassword = {
    body: Joi.object().keys({
        password: Joi.string().optional().custom(password),
        cpassword: Joi.string().optional().valid(Joi.ref('password')).messages({
            'any.only': 'Confirm password must match password'
        }),
    })
}

const useReferralCode = {
    body: Joi.object().keys({
        referralCode: Joi.string().required()
    })
};

const setFingerprint = {
    body: Joi.object().keys({
        fingerprintUID: Joi.string().required(),
        type: Joi.string().required().valid('set', 'login')
    })
};

const setFaceId = {
    body: Joi.object().keys({
        faceIdUID: Joi.string().required(),
        type: Joi.string().required().valid('set', 'login')
    })
};

const verifyEmailOTP = {
    body: Joi.object().keys({
        userId: Joi.string().required().custom(objectId),
        otpNumber: Joi.string().required()
    })
};

const resendEmailOTP = {
    body: Joi.object().keys({
        userId: Joi.string().required().custom(objectId)
    })
};


module.exports = {
    signupEmailAndPassword,
    verifyEmailOTP,
    useReferralCode,
    resendEmailOTP,
    signupConfirmPassword,
    setFingerprint,
    setFaceId
}