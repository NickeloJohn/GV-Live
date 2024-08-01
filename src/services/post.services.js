const httpStatus = require("http-status");
const Post = require("../models/Post");
const ErrorResponse = require("../utils/ErrorResponse");
const PostComment = require("../models/PostComment");

class PostService {
  async getFlaggedPosts() {
      const flaggedPost = await Post.find({ "flagged.isFlagged": true });
      if (!flaggedPost)
      throw new ErrorResponse(httpStatus.BAD_REQUEST, "Unable to approve post");
      return{}
  }


  async approvePost(postId, userId) {
    const post = await Post.findById(postId);
  
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

    if (!post) throw new ErrorResponse(httpStatus.BAD_REQUEST, "Post is not flagged or flagged property is missing" );

    const flag = post.flagged || (post.flagged = {});
    flag.isAdminAction = true;
    flag.typeContent = "photo"
    flag.adminAction = "remove";
    flag.userId = userId;
    flag.adminActionAt = new Date();
    post.status = "deleted";
    await post.save();
  }

  async getFlaggedComments()  {
    const comment = await PostComment.find({ flagged: true});
    if (!comment) throw new ErrorResponse(httpStatus.BAD_REQUEST, "Post is not flagged or flagged property is missing" );

    return{}

};

async moderateComment(commentId, action, userId){
    const comment = {
        moderatedBy: userId,
        moderationTimestamp: new Date()
    };

    if (!comment) throw new ErrorResponse(httpStatus.BAD_REQUEST, "Comment is not found" );

    if (action === 'approve') {
        comment.isApproved = true;
        comment.isRemoved = false;
    } else if (action === 'remove') {
        comment.isApproved = false;
        comment.isRemoved = true;
    }
    console.log(comment)
    return await PostComment.findByIdAndUpdate(commentId, comment, { new: true });
};


}

module.exports = new PostService();
