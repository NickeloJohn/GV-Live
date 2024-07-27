const Joi = require('joi');
const { objectId } = require('./custom.validation');


const updateProfileValidation = {
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        middleName: Joi.string().optional(),
        lastName: Joi.string().required(),
        birthday: Joi.string().optional(),
        gender: Joi.string().valid('male', 'female').optional(),
        address: {
            houseNumber: Joi.string().optional(),
            street: Joi.string().optional(),
            stateOrRegion: Joi.string().optional(),
            province: Joi.string().optional(),
            townCity: Joi.string().optional(),
            barangay: Joi.string().optional(),
            zipCode: Joi.string().optional()
        },
        languages: Joi.array().optional(),
        sign: Joi.string().optional(),
        bio: Joi.string().optional(),
    })
};

const chooseInterestValidation = {
    body: Joi.object().keys({
        interests: Joi.array().items(Joi.string().custom(objectId)).required()
    })
};

module.exports = {
    updateProfileValidation,
    chooseInterestValidation
}