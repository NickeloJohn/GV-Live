require('dotenv/config');
const config = require('./config/config');

const connectDB = require("./config/database");
const redis = require("./utils/redis");
const app = require('./server.js');


// connectDB().then(() => {
    // require('./seed/index');
const PORT = config.port || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} ${process.env.HOST || `http://localhost:${PORT}`} mode with port ${PORT}`));

// Handle unhandled rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(err);
    console.log(`Error: ${err.message} - Promise: ${promise}`);
});
    
// }).catch((err) => console.log("Failed to connect mongodb!!! " + err))

