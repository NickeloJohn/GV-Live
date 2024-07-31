const httpStatus = require("http-status");
const Post = require("../models/Post");
const ErrorResponse = require("../utils/ErrorResponse");

class PostService {
  async getFlaggedPosts() {
      const flaggedPost = await Post.find({ "flagged.isFlagged": false });
      if (!flaggedPost)
      throw new ErrorResponse(httpStatus.BAD_REQUEST, "Unable to approve post");
      console.log(flaggedPost)
      return{}
  }


  async approvePost(postId, userId) {
    const post = await Post.findById(postId);
    console.log(post)
  
    if (!post) {
      throw new ErrorResponse(httpStatus.BAD_REQUEST, "Unable to approve post");
    }
  
    const flag = post.flagged || (post.flagged = {});

    flag.isAdminAction = true;
    flag.typeContent = "photo"
    flag.adminAction = "approve";
    flag.userId = userId;
    flag.adminActionAt = new Date();

    await post.save();
  
    console.log(flag)
    return {};
  }

  async removePost(postId, userId) {
    const post = await Post.findById(postId);

    if (!post)
      throw new ErrorResponse(
        httpStatus.BAD_REQUEST,
        "Post is not flagged or flagged property is missing"
      );

    const flag = post.flagged || (post.flagged = {});
    flag.isAdminAction = true;
    flag.typeContent = "photo"
    flag.adminAction = "remove";
    flag.userId = userId;
    flag.adminActionAt = new Date();
    post.status = "deleted";
    await post.save();
  }


}

module.exports = new PostService();
