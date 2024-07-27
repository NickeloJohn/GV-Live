const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../middlewares/asyncHandler');
const { getViewContent, approveContent, removeContent } = require('../../controllers/post.controller');


router.get('/view-flagged-photo', asyncHandler(getViewContent))
router.put('/posts/approve/:postId', asyncHandler(approveContent));
router.delete('/posts/remove/:postId',asyncHandler(removeContent));


module.exports = router;