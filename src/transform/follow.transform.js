const { transformUser } = require("./user.transform");
const { createUserDictionary, createFollowedDictionary } = require("../utils/dictionary");
const { FOLLOWS_TYPE } = require("../utils/constant");


const transformAllUserFollowed = async (followList, users, usersFollowed) => {
    
    // create a dictionary for quick lookup
    const userDictionary = createUserDictionary(users);

    // create a dictionary for quick lookup
    const followedUserDictionary = createFollowedDictionary(usersFollowed, FOLLOWS_TYPE.FOLLOWING);

    return followList.map((follow) => {
        // check if the user is followed by the current user
        const followedUser = followedUserDictionary.get(follow.follower.toString());

        const user = userDictionary.get(follow[type].toString()) || {};
        
        return {
            ...transformUser(user),
            isFollowed: !!followedUser
            
        };
    });
};

// Transform all users that are followed by the current user
const transformAllUserFollowing = async (followList, users) => {
    
    // create a dictionary for quick lookup
    const userDictionary = createUserDictionary(users);

    return followList.map((follow) => {
        const user = userDictionary.get(follow[FOLLOWS_TYPE.FOLLOWER].toString()) || {};
        return transformUser(user);
    });
};



module.exports = {
    transformAllUserFollowing,
    transformAllUserFollowed
}