const httpStatus = require("http-status");

const { followService, userService, categoryService } = require("../services");
const { FOLLOWS_TYPE } = require("../utils/constant");
const { transformAllUserFollowing, transformAllUserFollowed } = require("../transform/follow.transform.js");
const { transformCategoryInterest } = require("../transform/category.transform.js");
const { transformUser } = require("../transform/user.transform.js");

class UserController {

  async followUser(req, res, next) {
    const follow = await followService.followUser(req);

    res.json({
      c: httpStatus.OK,
      m: 'Successfully followed this user',
      d: follow
    });
  }

  async unFollowUser(req, res, next) {
    const follow = await followService.unFollowUser(req);

    res.json({
      c: httpStatus.OK,
      m: 'Successfully unfollowed this user',
      d: follow
    });
  }

  async removeFollower(req, res, next) {
    const follow = await followService.removeFollower(req);

    res.json({
      c: httpStatus.OK,
      m: 'Successfully removed this follower',
      d: follow
    });
  }

  async getAllUserFollowed(req, res, next) {
    const paginatedResult = await followService.getAllUserFollowed(req);

    // Get all the follower ids 
    const followerIds = paginatedResult.list.map(follower => follower[FOLLOWS_TYPE.FOLLOWER]);
    
    const usersFollowed = await followService.getUsersFollowed(followerIds, req.user.id);
    const users = await userService.getUserByIds(followerIds);

    paginatedResult.list = await transformAllUserFollowed(paginatedResult.list, users, usersFollowed);
    
    res.json({
      c: httpStatus.OK,
      m: 'Successfully fetch user followed',
      d: paginatedResult
    });
  }

  async getAllUserFollowing(req, res, next) {
    const paginatedResult = await followService.getAllUserFollowing(req);

    const followingIds = paginatedResult.list.map(follower => follower[FOLLOWS_TYPE.FOLLOWING]);
    const users = await userService.getUserByIds(followingIds);

    paginatedResult.list = await transformAllUserFollowing(paginatedResult.list, users);
    res.json({
      c: httpStatus.OK,
      m: 'Successfully fetch user following',
      d: paginatedResult
    });

  }

  async getAllSuggestToFollow(req, res, next) {

    const paginatedResult = await userService.getAllUserSuggestToFollow(req);

    // const followingIds = paginatedResult.list.map(follower => follower[FOLLOWS_TYPE.FOLLOWING]);
    // const users = await userService.getUserByIds(followingIds);

    // paginatedResult.list = await transformAllUserFollowing(paginatedResult.list, users);
    res.json({
      c: httpStatus.OK,
      m: 'Successfully fetch user suggest to follow',
      d: paginatedResult
    });
  }

  async getInterest(req, res, next) {
    const results = await categoryService.getInterest(req);
    results.list = results.list.map(transformCategoryInterest);

    res.json({
      c: httpStatus.OK,
      m: 'Successfully choose interest',
      d: results
    });
  }

  async getMe(req, res, next) {
    const user = await userService.getMe(req);

    res.json({
      c: httpStatus.OK,
      m: 'Successfully fetch user profile',
      d: {
        ...transformUser(user)
      }
    });
  }

  async updateProfile(req, res, next) {
    const user = await userService.updateProfile(req);

    res.json({
      c: httpStatus.OK,
      m: 'Successfully update profile',
      d: user
    });
  }
}

module.exports = new UserController();