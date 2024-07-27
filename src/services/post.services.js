const Post = require("../models/Post");

class PostService {
  async getViewFlagged() {
    const content = await Post.find({ "flagged.isFlagged": true });
    return content;
  }

  async approveContent(postId, adminId) {
    const approve = await Post.findById(postId);

    if (!approve) {
      throw new Error("Post not found");
    }

    const flag = approve.flagged;

    if (flag.isFlagged) {
      flag.isAdminAction = true;
      flag.adminAction = "approve";
      flag.adminId = adminId;
      flag.adminActionAt = new Date();
      approve.save();
    }

    return {};
  }

  async removeContent(postId, adminId) {
    const remove = await Post.findById(postId);

    if (!remove) {
      throw new Error("Post not found");
    }

    const review = remove.flagged;

    if (review.isFlagged) {
      review.isAdminAction = true;
      review.adminAction = "remove";
      review.adminId = adminId;
      review.adminActionAt = new Date();
      remove.status = "deleted";
      remove.save();
    }

    return {};
  }
}

module.exports = new PostService();
