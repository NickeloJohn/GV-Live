const ActionLog = require('../models/ActionLog');

class ActionService {
  async getUserActionHistory(userId, actionType) {
    const query = { userId };

    if (!query) throw new ErrorResponse(httpStatus.NOT_FOUND, 'History is not exist');
    
    if (actionType) {
      query.actionType = actionType;
    }
    return ActionLog.find(query).sort({ date: -1 });
  }
}

module.exports = new ActionService();