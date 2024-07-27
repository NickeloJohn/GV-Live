const Joi = require('joi');
const httpStatus = require('http-status');

const ErrorResponse  = require('./../utils/ErrorResponse');
const { asyncHandler } = require('../middlewares/asyncHandler');

const objectId = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return helpers.message('"{{#label}}" must be a valid mongo id');
    }
    return value;
};

const buildToArray = (value, helpers) => {
    value = JSON.parse(value);
    if (value.length === 0) {
        return helpers.message('"{{#label}}" must be an array with at least 1 element');
    }
    return value;
}

const buildToArrayObjectIds = (value, helpers) => {
    value = JSON.parse(value);
    if (value.length === 0) {
        return helpers.message('"{{#label}}" must be an array with at least 1 element');
    }
    
    for(val of value) {
        if (!val.match(/^[0-9a-fA-F]{24}$/)) {
            return helpers.message('"{{#label}}" must be an array of valid mongo ids');
        }
    }
    
    return value;
}

const convertToBoolean = (value, helpers) => {
    if (value === 'true') {
        return true;
    }
    return false;
}

const password = (value, helpers) => {
    if (value.length < 8) {
        return helpers.message('password must be at least 8 characters');
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        return helpers.message('password must contain at least 1 letter and 1 number');
    }
    return value;
};

const sanitizeParameters = asyncHandler(async (req, res, next) => {
    const schema = Joi.object({
        limit: Joi.number().integer().max(20).optional(),
        page: Joi.number().integer().optional(),
        mySubscribes: Joi.boolean().optional(),
        postId: Joi.string().custom(objectId).optional(),
        petCategoryId: Joi.string().optional(),
        petName: Joi.string().optional(),
        keyword: Joi.string().optional(),
        token: Joi.string().optional(),
        name: Joi.string().optional(),
        minPrice: Joi.number().integer().optional(),
        maxPrice: Joi.number().integer().optional(),
        rating: Joi.number().optional(),
        numberOfSales: Joi.number().integer().optional(),
        type: Joi.string().optional(),
        platform: Joi.string().optional(),
        code: Joi.string().optional(),
        regionCode: Joi.string().optional(),
        id_token: Joi.string().optional(),
        user: Joi.string().optional(),
        breedsOnly: Joi.boolean().optional(),
        petCategoryOnly: Joi.boolean().optional(),
        showTopics: Joi.boolean().optional(),
        categoryId: Joi.string().optional().custom(objectId),
        subCategoryId: Joi.string().optional().custom(objectId),
        petCategoryId: Joi.string().optional().custom(objectId),
        'subscription-key': Joi.string().optional(),
        isLive: Joi.boolean().optional(),
        status: Joi.string().optional(),
        regionCode: Joi.string().optional(),
    });
    
    const { error, value } = schema.validate(req.query);
    if (error) {
        throw new ErrorResponse(400, error.details[0].message);
    }
    
    req.query = value;
    next();
});

module.exports = {
    objectId,
    password,
    buildToArray,
    buildToArrayObjectIds,
    sanitizeParameters
};
