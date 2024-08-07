const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../middlewares/asyncHandler');
const { getFlaggedPosts, approvePost, removePost, getFlaggedComments, ModerateComment} = require('../../controllers/post.controller');
const { defaultLimiter } = require('../../utils/rate-limiter');
const { protectAuth } = require('../../middlewares/protectAuth');

router.use(defaultLimiter, protectAuth(router));

router.get('/flagged-comments', asyncHandler (getFlaggedComments));
router.post('/moderate-comment', asyncHandler (ModerateComment));
router.get('/flagged/posts', asyncHandler(getFlaggedPosts));
router.put('/:postId/approve', asyncHandler(approvePost));
router.delete('/remove/:postId', asyncHandler(removePost));




module.exports = router;
