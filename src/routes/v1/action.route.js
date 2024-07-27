const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../middlewares/asyncHandler');

const { getUserActionHistory } = require('../../controllers/action.controller');

router.get('/user/:userId/action-history', asyncHandler(getUserActionHistory));


module.exports = router;