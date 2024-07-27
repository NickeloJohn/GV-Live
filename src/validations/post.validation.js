

const Joi = require('joi');
const { PROFILE_PRIVACY_STATUS } = require('../utils/constant');
const { objectId, buildToArray, buildToArrayObjectIds } = require('./custom.validation');

const createPostValidation = {
    body: Joi.object().keys({
        title: Joi.string().required().trim(),
        description: Joi.string().required().trim(),
        tags: Joi.string().optional(),
        privacySetting: Joi.string().valid(...PROFILE_PRIVACY_STATUS).required(),
        category: Joi.string().custom(buildToArrayObjectIds).required(),
        musicId: Joi.string().custom(objectId).optional(),
        isLive: Joi.boolean().optional(),
        isAllowedComments: Joi.boolean().required()
    })
};

const updatePostValidation = {
    body: Joi.object().keys({
        title: Joi.string().required().trim(),
        tags: Joi.array().items(Joi.string()).optional(),
        description: Joi.string().required(),
        privacySetting: Joi.string().valid(...PROFILE_PRIVACY_STATUS).required(),
        category: Joi.array().items(Joi.string().custom(objectId)).required(),
        musicId: Joi.string().custom(objectId).optional(),
        isLive: Joi.boolean().optional(),
        isAllowedComments: Joi.boolean().required()
    })
};


module.exports = {
    createPostValidation,
    updatePostValidation
}