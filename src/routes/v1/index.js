const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const routerPath = path.join(__dirname);

// Automatically load all other router files
fs.readdirSync(routerPath)
    .filter((file) => file !== 'index.js' && file !== "shops") // Exclude index.js
    .map((file) => file.replace('.js', '')) // Remove .js extension
    .forEach((routeSuffix) => {
        const routerFile = require(`./${routeSuffix}`);
        const routeName = routeSuffix.replace('.route', '');
        router.use(`/${routeName}`, routerFile);
    });

module.exports = router;
