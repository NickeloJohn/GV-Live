const mongoose = require("mongoose")

// Connect to DB
const connectDB = async () => {
    let conn;

    switch (process.env.NODE_ENV) {
        case "local":
            conn = await mongoose.connect(
                process.env.PRIMARY_CONNECTION_STRING,
                {
                    family: 4
                }
            );
        break;

        case "development":
            conn = await mongoose.connect(
                process.env.PRIMARY_CONNECTION_STRING,
                {
                    family: 4
                }
            );
        break;

        case "qa":
            conn = await mongoose.connect(
                process.env.PRIMARY_CONNECTION_STRING);
        break;

        case "staging":
            conn = await mongoose.connect(
                process.env.PRIMARY_CONNECTION_STRING);
        break;

        case "production":
            conn = await mongoose.connect(
                process.env.PRIMARY_CONNECTION_STRING);
        break;
    
        default:
            conn = await mongoose.connect(
                process.env.PRIMARY_CONNECTION_STRING,
                {
                    family: 4
                }
            );
        break;
    }

    console.log(
        `MongoDB connected: ${conn.connection.host}`
    );

    return conn;
};

module.exports = connectDB;
