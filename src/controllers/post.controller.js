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
    const userId = req.user.id; 

    const approve = await postService.approvePost(postId, userId);
    res.json({
      c: httpStatus.OK,
      m: "Post approved successfully",
      d: {}
    });
  }

  async removePost(req, res) {
    const { postId } = req.params;
    const userId = req.user.id; 

    const remove = await postService.removePost(postId, userId);
    res.json({
      c: httpStatus.OK,
      m: "Post removed successfully",
      d: {}
    });
  }
}

module.exports = new PostController();
