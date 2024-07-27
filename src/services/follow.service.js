const httpStatus = require("http-status");
const FollowUser = require("../models/FollowUser");
const ErrorResponse = require("../utils/ErrorResponse");
const { objectToString, defaultPaginate } = require("../utils/functions");


class FollowService {
  async getIsUserAlreadyFollowed(userId, followedUserId) {
    const followed = await FollowUser.findOne({
      follower: userId,
      followed: followedUserId
    }).select('type');

    return followed;
  }

  async followUser(req) {
    const userId = req.user.id;
    const followedUserId = req.params.userId;

    if (objectToString(followedUserId) === objectToString(userId)) throw new ErrorResponse(httpStatus.BAD_REQUEST, 'Cannot follow yourself');

    const followed = await this.getIsUserAlreadyFollowed(userId, followedUserId);

    let followUser;
    if (followed) {
      if (followed.type === 'unfollow') {
        followUser = await FollowUser.findOneAndUpdate(
          {
            follower: userId,
            followed: followedUserId
          },
          {
            type: 'followed'
          },
          {
            new: true
          }
        );
      } else {
        throw new ErrorResponse(httpStatus.BAD_REQUEST, 'Already followed this user');
      }
    } else {
      followUser = new FollowUser({
        follower: req.user.id,
        followed: req.params.userId,
        type: 'followed'
      });

      await followUser.save();
    }

    return followUser;
  }

  async unFollowUser(req) {
    const userId = req.user.id;
    const followedUserId = req.params.userId;

    // Check if the user is currently following the user
    const followed = await this.getIsUserAlreadyFollowed(userId, followedUserId);
    if (!followed) throw new ErrorResponse(httpStatus.BAD_REQUEST, 'Not following this user');

    await FollowUser.findOneAndUpdate(
      {
        follower: req.user.id,
        followed: req.params.userId
      },
      {
        type: 'unfollow'
      },
      {
        new: true
      }
    );

    return {};
  }

  async removeFollower(req) {
    const userId = req.user.id;
    const followedUserId = req.params.userId;
 
    // Check if the user is currently following the user
    const followed = await this.getIsUserAlreadyFollowed(followedUserId, userId);
    if (!followed) throw new ErrorResponse(httpStatus.BAD_REQUEST, 'Not following this user');

    await FollowUser.findByIdAndDelete(followed._id);

    return {}
  }
  
  async getUsersFollowed(followerIds, userId) {
    const usersFollowed = await FollowUser.find({ 
        followed: { $in: followerIds },
        follower: userId,
        type: 'followed' 
    }).select('followed follower').lean();

    return usersFollowed;
  }

  async getAllUserFollowed(req) {
    const userId = req.params.userId === 'me' ? req.user.id : req.params.userId;
    const filter = {
        followed: userId,
        type: 'followed'
    };

    const options = { ...defaultPaginate(req.query) };
    const paginatedResult = await FollowUser.paginate(filter, options);

    return paginatedResult;
  }

  async getAllUserFollowing(req) {
    const userId = req.params.userId === "me" ? req.user.id : req.params.userId;
    const filter = {
        follower: userId,
        type: 'followed'
    };
  
    const options = { ...defaultPaginate(req.query) };
    const paginatedResult = await FollowUser.paginate(filter, options);
  
    return paginatedResult;
  }

  async getAllUserFollowingByUserId(userId, select = '') {
    const filter = {
      follower: userId,
      type: 'followed'
    };

    const followList = FollowUser.find(filter)
    if (select) followList.select(select);
    return await followList;

  }

}

module.exports = new FollowService();