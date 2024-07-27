const redis = require('redis');
const IORedis = require('ioredis');

const config = require("../config/config");
const { debugLogger } = require('./functions');
const ErrorResponse = require('./ErrorResponse');

let redisClient = null;
let redisErrorConnect = null;

const IORedisConnect = () => {
    // If a connection already exists, return it
    if (redisClient) {
        debugLogger('Existing Redis connection reused.');
        return redisClient;
    }

    try {
        const { socket: { host, port, tls }, password, connectionString } = config.redisConfigConnection;
     
        redisClient = new IORedis({ host: host, port, password, retryStrategy: null, lazyConnect: true });

        redisClient.on('ready', () => debugLogger(`Redis is connected  ${host}:${port}`));
        redisClient.on('error', (err) => {
            debugLogger(`Error in Redis connection: ${host}:${port}`, err);
            redisErrorConnect = err;
        });

        // await redisClient.connect();

        return redisClient;
    } catch (error) {
        redisErrorConnect = error;
        debugLogger('Error while creating Redis connection: ', error);
    }
}

const RedisClient = async () => {
    // If a connection already exists, return it
    try {
        if (redisClient) {
            debugLogger('Existing Redis connection reused.');
            return redisClient;
        }

        const { socket: { host, port, tls }, password, connectionString } = config.redisConfigConnection;
     
        // redisClient = new IORedis({ host: host, port, password, retryStrategy: null, lazyConnect: true });
        redisClient = await redis.createClient({
            socket: {
                host: host,
                port: port,
                tls: tls
            },
            password: password
        })


        redisClient.on('ready', () => {
            debugLogger(`Successfully connected to redis: ${host}:${port}`);
        });

        redisClient.on('error', (err) => {
            if (!redisErrorConnect)
            {
                debugLogger(`Error in Redis connection: ${host}:${port}`, err);
                redisErrorConnect = err
            }
            return err;
        });

        await redisClient.connect();
        return redisClient;

    } catch (error) {
        redisErrorConnect = error;
        debugLogger('Error while creating Redis connection: ', error);
        return null
    }
}

(async () => {
    // redisClient = await RedisClient().catch();
})()

const getRedisCache = async (key) => {
    if (redisErrorConnect) return null;

    try {
        const cacheDoctor = await redisClient.get(key);
        return JSON.parse(cacheDoctor);
    } catch (error) {
        debugLogger('Failed to get Redis cache:', error);
        return null;
    }
}

const setRedisCache = async (key, obj, EXPIRE = null) => {
    if (redisErrorConnect) return null;

    try {
        const cacheDoctor = await redisClient.set(key, JSON.stringify(obj));
        if (EXPIRE) await redisClient.expire(key, EXPIRE);
        return cacheDoctor;
    } catch (error) {
        debugLogger('Failed to set Redis cache:', error);
        return null;
    }
}

const deleteRedisCache = async (keyName = "") => {
    if (redisErrorConnect) return;

    try {
        const res = await redisClient.del(keyName);
        const result = await redisClient.exists(keyName);
        console.log(result)
    } catch (error) {
        debugLogger('Failed to delete Redis key:', error);
    }
}

const clientRedis = async () => {
    return redisClient;
}

module.exports = {
    getRedisCache,
    setRedisCache,
    deleteRedisCache,
    clientRedis,
    IORedisConnect,
    RedisClient
}