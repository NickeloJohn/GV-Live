const { getFullName } = require("../utils/functions");
const { transformAuthorInformation } = require("./user.transform")


const transformAuthor = (user) => {
    return {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      fullname: user?.fullName || getFullName(user)
    };
};

const transformPostComment = (postComment, user) => {

    let userLike = "unlike"
    let getLikes = 0;

    return {
        id: postComment?.id || postComment?._id,
        author: transformAuthor(user),
        content: postComment?.content,
        replies: postComment?.replies,
        likeType: userLike,
        likes: postComment?.likes || getLikes || 0,
        createdAt: postComment?.createdAt,
        updatedAt: postComment?.updatedAt,
    }
}


module.exports = {
    transformPostComment,
}