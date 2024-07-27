const httpStatus = require('http-status');
const ActionLog = require('../models/ActionLog');
const FlagContent = require('../models/FlagContent');
const { transformFlaggedContent } = require('../transform/moderation.transform');

class ModerationService {
  async getFlaggedContentPhoto() {
    const content = await FlagContent.find({ status: 'pending' });
    return content.map(transformFlaggedContent);
  }

  async viewContentPhoto(id) {
    const view = await FlagContent.findById(id);
    if (!view) throw new ErrorResponse(httpStatus.NOT_FOUND, 'ViewContent is not exist');
    return view;
  }

  async approveContentPhoto(id, adminId) {
    const approve = await FlagContent.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
    if (!approve) throw new ErrorResponse(httpStatus.NOT_FOUND, 'Unable to approve');
    await ActionLog.create({ adminId, action: 'approve', contentId: id });
    return approve;
  }

  async removeContentPhoto(id, adminId) {
    const remove = await FlagContent.findByIdAndUpdate(id, { status: 'removed' }, { new: true });
    if (!remove) throw new ErrorResponse(httpStatus.NOT_FOUND, 'Unable to remove');
    await ActionLog.create({ adminId, action: 'remove', contentId: id });
    return remove;
  }
}

module.exports = new ModerationService();
