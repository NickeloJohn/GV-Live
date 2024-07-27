const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Schema definition for environment variables
const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string().valid('production', 'development', 'qa', 'local').required(),
    PORT: Joi.number().default(3000),
    BASE_URL: Joi.string().required().description('Base url API'),
    BASE_URL_CDN: Joi.string().required().description('Base url CDN'),
    DATABASE1_CONNECTION_STRING: Joi.string().required().description('Mongo DB url 1'),
    DATABASE2_CONNECTION_STRING: Joi.string().required().description('Mongo DB url 2'),
    DATABASE3_CONNECTION_STRING: Joi.string().required().description('Mongo DB url 3'),
    DATABASE4_CONNECTION_STRING: Joi.string().required().description('Mongo DB url 4'),
    DATABASE5_CONNECTION_STRING: Joi.string().required().description('Mongo DB url 5'),
    AZURE_STORAGE_NAME: Joi.string().required().description('Azure storage name'),
    AZURE_STORAGE_KEY: Joi.string().required().description('Azure storage key'),
    REDIS_HOSTNAME: Joi.string().required().description('Redis Hostname'),
    REDIS_PORT: Joi.string().required().description('Redis Port'),
    REDIS_PASSWORD: Joi.string().required().description('Redis Password'),
    MOBILE_DEEPLINK_URL: Joi.string().required().description('Mobile deeplink url'),
    BITS_CONVERSION_RATE: Joi.string().required().description('Bits conversion rate required'),
    REDIS_CONNECTION_STRING: Joi.string().required().description('Redis connection string'),
    APIM_KEY: Joi.string().required().description('APIM Subscription key required'),
    APPLE_PAY_VERIFY_URL: Joi.string().required().description('Apple pay verify url required'),
    APPLE_PAY_PASSWORD: Joi.string().required().description('Apple pay password required'),
    CHAT_MESSAGES_ENCRYPTION_KEY: Joi.string().required().description('Chat messages encryption key required'),
    URL_MARKET_PLACE_FE: Joi.string().required().description('Market place front end url required'),
    JWT_SECRET_KEY: Joi.string().required().description('Secret key for JWT'),
    JWT_EXPIRATION_SECRET_KEY: Joi.string().required().description('Secret key for expiration JWT'),
    JWT_SECRET_REFRESH_KEY: Joi.string().required().description('Secret key for refresh JWT'),
    JWT_EXPIRATION_REFRESH_SECRET_KEY: Joi.string().required().description('Secret key for expiration refresh JWT'),
}).unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

// Helper function to build URL
const buildUrl = (baseUrl, path = '') => baseUrl + path;

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    baseUrl: buildUrl(envVars.BASE_URL, envVars.NODE_ENV === 'local' ? `:${envVars.PORT}` : ''),
    baseUrlApi: buildUrl(envVars.BASE_URL, envVars.NODE_ENV === 'local' ? `:${envVars.PORT}/api/v1` : '/api/v1'),
    baseUrlCdn: envVars.BASE_URL_CDN,
    azureStorage: {
        name: envVars.AZURE_STORAGE_NAME,
        key: envVars.AZURE_STORAGE_KEY,
        url: `https://${envVars.AZURE_STORAGE_NAME}.blob.core.windows.net`
    },
    paymaya: {
        publicKey: envVars.PAYMAYA_CHECKOUT_PUBLIC_KEY,
        secretKey: envVars.PAYMAYA_CHECKOUT_SECRET_KEY,
        checkoutUrl: envVars.PAYMAYA_CHECKOUT_URL,
        checkoutRedirectSuccessUrl: envVars.PAYMAYA_REDIRECT_URL_SUCCESS,
        checkoutRedirectFailedUrl: envVars.PAYMAYA_REDIRECT_URL_FAILED,
        checkoutRedirectCancelledUrl: envVars.PAYMAYA_REDIRECT_URL_CANCELLED,
        checkoutSuccessMarketPlaceUrl: envVars.URL_MARKET_PLACE_FE
    },
    mongoose: {
        database1: {
            url: envVars.DATABASE1_CONNECTION_STRING,
            options: { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }
        },
        database2: {
            url: envVars.DATABASE2_CONNECTION_STRING,
            options: { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }
        },
        database3: {
            url: envVars.DATABASE3_CONNECTION_STRING,
            options: { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }
        },
        database4: {
            url: envVars.DATABASE4_CONNECTION_STRING,
            options: { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }
        },
        database5: {
            url: envVars.DATABASE5_CONNECTION_STRING,
            options: { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }
        }
    },
    redisConfigConnection: {
        socket: {
            host: envVars.REDIS_HOSTNAME,
            port: parseInt(envVars.REDIS_PORT),
            tls: envVars.NODE_ENV === 'local' ? false : true,
        },
        connectionString: envVars.REDIS_CONNECTION_STRING,
        password: envVars.REDIS_PASSWORD
    },
    rootDirectory: path.resolve(__dirname, '../../'),
    isEnableVideoCompressApi: true,
    mobileDeeplinkUrl: envVars.MOBILE_DEEPLINK_URL,
    adb2c: {
        policyName: envVars.ADB2C_POLICY_NAME,
        clientId: envVars.ADB2C_CLIENT_ID,
        tenantId: envVars.ADB2C_TENANT_ID,
        scope: envVars.ADB2C_SCOPE,
        responseType: envVars.ADB2C_RESPONSE_TYPE,
        grantType: envVars.ADB2C_GRANT_TYPE,
        issuer: envVars.ADB2C_ISSUER,
        baseUrl: envVars.ADB2C_BASE_URL,
    },
    serviceBus: {
        connectionString: envVars.SERVICE_BUS_CONNECTION_STRING
    },
    googlePay: {
        privateKeyId: envVars.GOOGLE_PAY_PRIVATE_KEY_ID,
    },
    bitsConversionRate: envVars.BITS_CONVERSION_RATE,
    apimKey: envVars.APIM_KEY,
    applePay: {
        verifyUrl: envVars.APPLE_PAY_VERIFY_URL,
        password: envVars.APPLE_PAY_PASSWORD
    },
    chat: {
        passphrase: envVars.CHAT_MESSAGES_ENCRYPTION_KEY
    },
    jwt: {
        secretKey: envVars.JWT_SECRET_KEY,
        secretExpirationKey: envVars.JWT_EXPIRATION_SECRET_KEY,
        secretRefreshKey: envVars.JWT_SECRET_REFRESH_KEY,
        secretExpirationRefreshKey: envVars.JWT_EXPIRATION_REFRESH_SECRET_KEY
    },
};

