const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
const { RedisStore } = require('rate-limit-redis')
const { RateLimiterRedis } = require('rate-limiter-flexible');

const redis = require("./redis");
const ErrorResponse = require("./ErrorResponse");
const httpStatus = require("http-status");
const { debugLogger } = require("./functions");
const { asyncHandler } = require("../middlewares/asyncHandler");

let globalRateMiddleware;
let convertTreatRateLimiterMiddleware;

const createUserLimiter = rateLimit({
	windowMs: 30 * 1000, //  30 seconds
	max: 5, // Limit each IP to 100 requests per `window` (here, per 30 seconds)
    message: 'Too many requests from this IP, please try again later'
});

const speedLimiter = slowDown({
    windowMs: 30 * 1000, // 30 seconds
    delayAfter: 20, // allow 20 requests per 30 seconds, then...
    delayMs: 500 // begin adding 500ms of delay per request above 100:
});

const defaultLimiter = rateLimit({
	windowMs: 30 * 1000, //  30 seconds
	max: 100, // Limit each IP to 100 requests per `window` (here, per 30 seconds)
    message: 'Too many requests from this IP, please try again later'
});


const rateLimiter = ({ seconds, maxRequests = 1, isGlobalKeyName = false }) => async (req, res, next) => {
    try {
        const client = await redis.clientRedis();

        if (client)
        {
            req.ipRequest = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            let id = `${req.method}:${req.path}:${req.ipRequest}`;
            if (isGlobalKeyName) id = req.ipRequest;

            const requestCount = await client.incr(id);

            if (requestCount === 1) {
                await client.expire(id, seconds);
                timeToLive = seconds;
            } else {
                timeToLive = await client.ttl(id);
            }

            if (requestCount > maxRequests) {
                return res.status(429).json({
                    c: 429,
                    message: `Too many requests from this IP, please wait try again later`,
                    data: {}
                });
            }
        }

    } catch (error) {
        debugLogger({
            message: 'Error in rateLimiter',
            error: JSON.stringify(error)
        });
    }

    next();
};

module.exports = {
    createUserLimiter,
    speedLimiter,
    defaultLimiter,
    rateLimiter
}