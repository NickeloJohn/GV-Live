const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../middlewares/asyncHandler');
const { getFlaggedPosts, approvePost, removePost, approveComment, removeComment } = require('../../controllers/post.controller');

router.get('/flagged/posts', asyncHandler(getFlaggedPosts));
router.put('/approve/:postId', asyncHandler(approvePost));
router.delete('/posts/remove/:postId', asyncHandler(removePost));

router.put('/comments/approve/:postId/:commentId', asyncHandler(approveComment));
router.delete('/comments/remove/:postId/:commentId', asyncHandler(removeComment));


module.exports = router;
