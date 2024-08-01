const express = require('express');
const router = express.Router();

const { defaultLimiter } = require('../../utils/rate-limiter');
const { uploadSingleFile } = require('../../utils/multer-upload');
const { protectAuth } = require('../../middlewares/protectAuth');
const { followUser, unFollowUser, removeFollower, getAllUserFollowing, getAllUserFollowed, getAllSuggestToFollow, getInterest, updateProfile, getMe, getUserHistory, suspendUserController, getUserProfileController, getUsersWithRoles, assignRoleToUser, adjustPermissions, createTicket, getTickets, getTicketById, resolveTicket, addCommunication } = require('../../controllers/user.controller');
const { asyncHandler } = require('../../middlewares/asyncHandler');
const validate = require('../../middlewares/validate');
const { updateProfileValidation } = require('../../validations/user.validation');

router.use(defaultLimiter, protectAuth(router));


router.get('/me', asyncHandler(getMe));
router.get('/:userId/history', asyncHandler(getUserHistory));
router.get('/role', asyncHandler(getUsersWithRoles));
router.get('/assign-role', asyncHandler(assignRoleToUser));
router.post('/adjust-permissions', asyncHandler(adjustPermissions));

router.post('/tickets', asyncHandler (createTicket));
router.get('/get-tickets', asyncHandler(getTickets));
router.get('/tickets/:ticketId', asyncHandler(getTicketById));
router.put('/tickets/:ticketId/resolve', asyncHandler(resolveTicket));
router.post('/tickets/:ticketId/communication', asyncHandler(addCommunication));


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