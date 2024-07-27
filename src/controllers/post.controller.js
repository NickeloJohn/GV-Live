const httpStatus = require("http-status");
const { postService } = require("../services");

class PostController {
  async getViewContent(req, res) {
    const content = await postService.getViewFlagged();
    res.json({
      c: httpStatus.OK,
      m: "Flagged content (photos and videos) are listed in the moderation queue.",
      d: {}
    });
  }

  async approveContent(req, res) {
    const { postId } = req.params;
    const { adminId } = req.user;

    const approve = await postService.approveContent(postId, adminId);
    res.json({
      c: httpStatus.OK,
      m: "Post approved successfully",
      d: {}
    });
  }

  async removeContent(req, res) {
    const { postId } = req.params;
    const { adminId } = req.user;

    const remove = await postService.removeContent(postId, adminId);
    res.json({
      c: httpStatus.OK,
      m: "Post removed successfully",
      d: {}
    });
  }
}

module.exports = new PostController();
