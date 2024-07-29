const httpStatus = require("http-status");
const { postService } = require("../services");

class PostController {
  async getFlaggedPosts(req, res) {
    const content = await postService.getFlaggedPosts();
    res.json({
      c: httpStatus.OK,
      m: "Flagged posts are listed in the moderation queue.",
      d: content
    });
  }

  async approvePost(req, res) {
    const { postId } = req.params;
    const { adminId } = req.user;

    await postService.approvePost(postId, adminId);
    res.json({
      c: httpStatus.OK,
      m: "Post approved successfully",
      d: {}
    });
  }

  async removePost(req, res) {
    const { postId } = req.params;
    const { adminId } = req.user;

    await postService.removePost(postId, adminId);
    res.json({
      c: httpStatus.OK,
      m: "Post removed successfully",
      d: {}
    });
  }

  async approveComment(req, res) {
    const { postId, commentId } = req.params;
    const { adminId } = req.user;

    await postService.approveComment(postId, commentId, adminId);
    res.json({
      c: httpStatus.OK,
      m: "Comment approved successfully",
      d: {}
    });
  }

  async removeComment(req, res) {
    const { postId, commentId } = req.params;
    const { adminId } = req.user;

    await postService.removeComment(postId, commentId, adminId);
    res.json({
      c: httpStatus.OK,
      m: "Comment removed successfully",
      d: {}
    });
  }

}

module.exports = new PostController();
