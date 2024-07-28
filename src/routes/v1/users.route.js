const express = require('express');
const router = express.Router();

const { defaultLimiter } = require('../../utils/rate-limiter');
const { uploadSingleFile } = require('../../utils/multer-upload');
const { protectAuth } = require('../../middlewares/protectAuth');
const { followUser, unFollowUser, removeFollower, getAllUserFollowing, getAllUserFollowed, getAllSuggestToFollow, getInterest, updateProfile, getMe, getUserHistory } = require('../../controllers/user.controller');
const { asyncHandler } = require('../../middlewares/asyncHandler');
const validate = require('../../middlewares/validate');
const { updateProfileValidation } = require('../../validations/user.validation');

router.use(defaultLimiter, protectAuth(router));


router.get('/me', asyncHandler(getMe));
router.get('/:userId/history', asyncHandler(getUserHistory));
router.put('/:userId', 
  uploadSingleFile,
  validate(updateProfileValidation),
  asyncHandler(updateProfile)
);

router.post('/:userId/follow', asyncHandler(followUser));
router.delete('/:userId/unfollow', asyncHandler(unFollowUser));
router.delete('/:userId/remove', asyncHandler(removeFollower));
router.get('/:userId/followers', asyncHandler(getAllUserFollowed));
router.get('/:userId/following', asyncHandler(getAllUserFollowing));
router.get('/:userId/suggest-to-follow', asyncHandler(getAllSuggestToFollow));
router.get('/:userId/interest', asyncHandler(getInterest));



module.exports = router;