const httpStatus = require('http-status');
const ModerationService = require('../services/moderation.service');

class ModerationController {
  async getFlaggedContentPhoto(req, res) {
   
      const content = await ModerationService.getFlaggedContentPhoto();
      res.json({
        c: httpStatus.OK,
        m: 'Flagged photos and comments are listed in the moderation queue.',
        d: content
      });

  }

  async viewContentPhoto(req, res) {
    try {
      const content = await ModerationService.viewContentPhoto(req.params.id);
      res.status(200).json(content);
    } catch (error) {
      if (error.message === 'Content Not Found') {
        res.status(404).json({ error: 'Content Not Found' });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }

  async approveContentPhoto(req, res) {
    try {
      const content = await ModerationService.approveContentPhoto(req.params.id, req.body.adminId);
      res.status(200).json(content);
    } catch (error) {
      if (error.message === 'Content Not Found') {
        res.status(404).json({ error: 'Content Not Found' });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }

  async removeContentPhoto(req, res) {
    try {
      const content = await ModerationService.removeContentPhoto(req.params.id, req.body.adminId);
      res.status(200).json(content);
    } catch (error) {
      if (error.message === 'Content Not Found') {
        res.status(404).json({ error: 'Content Not Found' });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
}

module.exports = new ModerationController();
