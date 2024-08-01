const httpStatus = require("http-status");
const { postService } = require("../services");
const { getFlaggedComments, moderateComment } = require("../services/post.services");

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

  async getFlaggedComments(req, res){
    const comments = await getFlaggedComments();
    res.json({ 
      c: 200, 
      m: 'Success', 
      d: comments 
    });
};


async ModerateComment(req, res){
    const { commentId, action } = req.body;
    const userId = req.user.id;

    const comment = await moderateComment(commentId, action, userId);
    res.json({ 
      c: 200, 
      m: 'Success', 
      d: comment 
    });
};
}

module.exports = new PostController();
