const ErrorResponse = require("../helpers/response");

exports.signUpMiddleware = (req, res, next) => {
    const payload = req.body;

    if (!payload?.email) return next(new ErrorResponse(400, 'Email is required'));
    if (!payload?.password || !payload?.cpassword) return next(new ErrorResponse(400, 'Password is required'));
    if (payload?.password !== payload?.cpassword) return next(new ErrorResponse(400, 'Password not Match.'));

    next();
}

exports.verifyOTPMiddleware = (req, res, next) => {
    const payload = req.body;
    const userId = req.params.id;

    if (!userId) return next(new ErrorResponse(400, 'Invalid params id'));
    if (!payload?.otpNumber) return next(new ErrorResponse(400, 'otpNumber is required'));

    next();
}