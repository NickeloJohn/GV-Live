const httpStatus = require("http-status");
const Post = require("../models/Post");
const User = require("../models/User");

class PostService {
  async getFlaggedPosts() {
    return await Post.find({ "flagged.isFlagged": true });
  }

  async approvePost(postId, adminId) {
    const post = await Post.findById(postId);

    if (!post) throw new ErrorResponse(httpStatus.BAD_REQUEST, 'Unable to approve');
    const flag = post.flagged;

    if (flag.isFlagged) {
      flag.isAdminAction = true;
      flag.adminAction = "approve";
      flag.adminId = adminId;
      flag.adminActionAt = new Date();
      await post.save();
    }

    return {};
  }

  async removePost(postId, adminId) {
    const post = await Post.findById(postId);

    if (!post) throw new ErrorResponse(httpStatus.BAD_REQUEST, 'Unable to remove');
    const flag = post.flagged;

    if (flag.isFlagged) {
      flag.isAdminAction = true;
      flag.adminAction = "remove";
      flag.adminId = adminId;
      flag.adminActionAt = new Date();
      post.status = "deleted";
      await post.save();
    }

    return {};
  }

  async approveComment(postId, commentId, adminId) {
    const post = await Post.findById(postId);

    if (!post) throw new ErrorResponse(httpStatus.BAD_REQUEST, 'Unable to approveComment');

    const comment = post.comments.id(commentId);

    if (!comment) throw new ErrorResponse(httpStatus.BAD_REQUEST, 'Comment not found');

    const flag = comment.flagged;

    if (flag.isFlagged) {
      flag.isAdminAction = true;
      flag.adminAction = "approve";
      flag.adminId = adminId;
      flag.adminActionAt = new Date();
      await post.save();
    }

    return {};
  }

  async removeComment(postId, commentId, adminId) {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    const flag = comment.flagged;

    if (flag.isFlagged) {
      flag.isAdminAction = true;
      flag.adminAction = "remove";
      flag.adminId = adminId;
      flag.adminActionAt = new Date();
      comment.status = "deleted";
      await post.save();
    }

    return {};
  }

}

module.exports = new PostService();
