
const jwt = require('jsonwebtoken');

const config = require('../config/config');
const ErrorResponse = require('../utils/response');
const { asyncHandler } = require('./asyncHandler');
const { userService } = require('../services');


exports.protectAuth = (routers = null) => asyncHandler(async (req, res, next) => {
    if (!req.headers?.authorization && !req.headers.authorization?.startsWith('Bearer')) return next(new ErrorResponse(401, 'Unauthorized access'));

    const token = req.headers.authorization.split(' ')[1];

    let error;
    let decode;
    let isBasicToken = false;
    
    try {
        decode = jwt.verify(token, config.jwt.secretExpirationKey);
        isBasicToken = true;
    } catch (err) {
        console.log(err)
        error = err;
    }
  
    if (error) return next(new ErrorResponse(401, 'Token expired'));
    // req.user = await userService.getUserById(decode.id);
    req.user = decode;
    req.user._id = decode.id;

    if (!req.user?.country) {
        req.user.country = "PH";
    }

    req.logRequest = {
        ...req.logRequest,
        user: req.user?.id
    };

    req.token = token;
    next();
});


exports.authorize = (roles) => (req, res, next) => {
    for (const key in  req?.user?.roles) {
        if (roles.includes(req.user.roles[key])) {
           return next();
        }

        if ((req?.user?.roles.length - 1) === parseInt(key)) {
            return next(new ErrorResponse(403, "Unauthorized access"));
        }
    }
    
}
