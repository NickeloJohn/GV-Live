const Joi = require('joi');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ErrorResponse = require('../utils/ErrorResponse');
// const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' }, abortEarly: false })
        .validate(object);

    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return next(new ErrorResponse(httpStatus.BAD_REQUEST, errorMessage));
    }
    Object.assign(req, value);
    return next();
};

module.exports = validate;
