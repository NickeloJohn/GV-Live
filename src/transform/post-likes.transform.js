const { getFullName } = require('../utils/functions');

const transformAuthor = (user) => {
  return {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    fullname: user?.fullName || getFullName(user)
  };
};

const transformPostLike = (postLike, user) => {
  return {
    id: postLike.id,
    user: transformAuthor(user),
    type: postLike.type
  };
};

const transformPostLikes = (postLikes, users) => {
  return postLikes.map((postLike) => {
    const user = users?.find((user) => user.id === postLike.user.toString());
    return transformPostLike(postLike, user);
  });
};

module.exports = {
  transformPostLike,
  transformPostLikes
};
