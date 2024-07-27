
const { checkSchema, validationResult } = require("express-validator");
const ErrorResponse = require("../helpers/response");
const { findUserById } = require("../services/user");
const xss = require("xss");

const checkHasExisting = async (sendTo) => {
    const user = await findUserById(sendTo);
    if(!user) throw 'User not found';
}

exports.validateSendMessage = async (req, res, next) => {
    await checkSchema({
        receiver: { 
            errorMessage: 'Invalid user',
            notEmpty: true,
            trim: true,
            custom: {
                options: checkHasExisting,
                bail: true
            }
        },
        message: {
            trim: true,
            customSanitizer: {
                options: (message) => {
                    return xss(message)
                },
            }
        }
    }).run(req);

    const results = validationResult(req);
    if (!results.isEmpty()) {
      return next(new ErrorResponse(400, results?.errors.map(error => error?.msg)[0], results?.errors));
    }
    next();
}