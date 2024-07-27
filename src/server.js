
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const { rateLimit } = require('express-rate-limit')
 
const app = express();

const router = require('./routes/v1');
const errorHandler = require("./middlewares/errorHandler");
const redis = require('./utils/redis');
const User = require("./models/User");
const { sanitizeParameters } = require("./validations/custom.validation");
const { rateLimiter } = require("./utils/rate-limiter");

const setHeader = function (req, res, next) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
    res.setHeader('X-Frame-Options', "SAMEORIGIN");
    res.setHeader('X-Content-Type-Options', "nosniff");
    res.setHeader('X-Xss-Protection', "1; mode=block");
    res.setHeader('Referrer-Policy', "no-referrer");
    res.setHeader('Permissions-Policy', `geolocation=(self "https://unleash.ph")`);

    const NOT_LOG_REQUEST_PAYLOAD = [
        "/api/v1/signin/email", 
        "/api/v1/signup/email"
    ];

    req.logRequest = {
        originalUrl: req.url,
        method: req.method,
        payload: (!NOT_LOG_REQUEST_PAYLOAD.includes(req.url)) ? req.body : null,
    };

    req.redis = redis;
    req.router = router;
    next();
};

const SECONDS = 60;
const MINUTES = 5;
const FIVE_MINUTES = SECONDS * MINUTES;
app.use(rateLimiter({ seconds: FIVE_MINUTES, maxRequests: 3000, isGlobalKeyName: true }));

// sanitize request data
app.set('trust proxy', 1);
app.use(helmet());
app.use(xss());
app.use(express.json({ limit: "10mb"}));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(cors());
app.use(setHeader);

// app.use("/docs", require('./routes/v1/docs.route'));
app.get("/", async (req, res, next) => {
    const data = {}
    if (req?.query?.type === "check_ip") {
        data.ipRequest = req.ipRequest;
    }
    res.status(200).json({  c: 200, m: "Welcome to the API", d: data });
});

app.get("/test-connections", async (req, res, next) => {
    if (req?.query?.type === "database")
    {
        try {
            const user = await User.findOne({ email: "bataljade9614@gmail.com" });
            res.status(200).json({  c: 200, m: "Success connected to db", user });
        } catch (error) {
           res.status(500).json({  c: 500, m: "Failed connected to db", error, message: error?.message });
        }
    }
    else if (req?.query?.type === "redis")
    {
        try {
            
            const KEYCACHE = `TEST_REDIS_CONNECTION`;
            let testRedis = await redis.getRedisCache(KEYCACHE);

            if (!testRedis) {
                testRedis = await redis.setRedisCache(KEYCACHE, "Successfully connected to redis");
            }

            res.status(200).json({  c: 200, m: "Successfully fetch status of redis", d: testRedis });
        } catch (error) {
           res.status(500).json({  c: 500, m: "Failed connected to redis", error, message: error?.message });
        }
    }
});

app.use("/api/v1/", sanitizeParameters, router);
app.use(errorHandler);

module.exports = app;