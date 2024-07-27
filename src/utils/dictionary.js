

// exports.createUserDictionary = (users, field = '_id') => {
//   const userMap = new Map();
//   users.forEach((user) => {
//       userMap.set(user[field].toString(), user);
//   });


//   return userMap;
// }

// exports.createFollowedDictionary = (usersFollowed, field = 'followed') => {
//   const followedUsersMap = new Map();
//   usersFollowed.forEach((follow) => {
//       followedUsersMap.set(follow[field].toString(), true);
//   });
//   return followedUsersMap;
// }

class Dictionary {
 
  createUserDictionary(users, field = '_id') {
    const userMap = new Map();
    users.forEach((user) => {
        userMap.set(user[field].toString(), user);
    });

    return userMap;
  }

  createFollowedDictionary(usersFollowed, field = 'followed') {
    const followedUsersMap = new Map();
    usersFollowed.forEach((follow) => {
        followedUsersMap.set(follow[field].toString(), true);
    });
    return followedUsersMap;
  }

  createPostLikesByUserDictionary(postLikes, field = 'post') {
    const postLikesMap = new Map();
    postLikes.forEach((like) => {
        postLikesMap.set(like[field].toString(), like);
    });
    return postLikesMap;
  }

  createGiftCategoriesDictionary(giftCategories, field = '_id') {
    const giftCategoriesMap = new Map();
    giftCategories.forEach((category) => {
        giftCategoriesMap.set(category[field].toString(), category);
    });
    return giftCategoriesMap;
  }

  createUsersFollowedDictionary(usersFollowed) {
    const followedUsersMap = new Map();
    usersFollowed.forEach((follow) => {
        const field = follow.follower.toString()+follow.followed.toString();
        followedUsersMap.set(field, true);
    });
    return followedUsersMap;
  }

  async getUsersDictionaryInServiceByUserIds(userIds) {
    const users = await userService.getUserByIds(userIds, 'firstName lastName username email profilePicture');
    console.log(this)
    return await this.createUserDictionary(users, '_id');
  }

  async getPostLikesDictionaryInServiceByPostIdAndUserId(postIds, req) {
    const postLikes = await postLikeService.getPostLikesByPostIdAndUserId(postIds, req.user._id);
    const postLikesDictionary = this.createPostLikesByUserDictionary(postLikes, 'post');
    return postLikesDictionary;
  }

}

module.exports = new Dictionary();