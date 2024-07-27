const httpStatus = require('http-status');
const actionHistoryService = require('../services/action.service')

class ActionHistoryController {
  async getUserActionHistory(req, res) {
      const { userId } = req.params;
      const { actionType } = req.query;
      const history = await actionHistoryService.getUserActionHistory(userId, actionType);
      
      res.json({
        c: httpStatus.OK,
        m: 'Users account history',
        d: history
      });
  }
  }


module.exports = new ActionHistoryController();
