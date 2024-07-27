const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../middlewares/asyncHandler');

const { getFlaggedContentPhoto, viewContentPhoto, approveContentPhoto, removeContentPhoto } = require('../../controllers/moderation.controller');

router.get('/flagged-photos', asyncHandler(getFlaggedContentPhoto));
router.get('/flagged-photos/:id', asyncHandler(viewContentPhoto));
router.post('/flagged-photos/:id/approve', asyncHandler(approveContentPhoto));
router.post('/flagged-photos/:id/remove', asyncHandler(removeContentPhoto));


module.exports = router;