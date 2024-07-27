const config = require('../config/config');
const { decryptMessage, getFullName, objectToString } = require('../utils/functions');
const { transformImageUrl } = require('../utils/transform');

const buildUserDataFromUserDictionary = (participants, usersDictionary) => {
  return participants.map((participant) => {
    const user = usersDictionary.get(objectToString(participant));
    return {
      _id: user?._id || null,
      fullName: getFullName(user) || 'Unknown User',
      profilePicture: transformImageUrl(user?.profilePicture) || 'https://via.placeholder.com/150'
    };
  });
};

const transformChatInbox = (chat, usersDictionary) => {
  chat = chat.toObject();

  const data = {
    roomId: chat.roomId,
    latestMessage: chat.latestMessage ? decryptMessage(chat.latestMessage, config.chat.passphrase) : '',
    sendAt: chat.updatedAt,
    participants: chat.participants
  };

  if (usersDictionary) {
    data.participants = buildUserDataFromUserDictionary(chat.participants, usersDictionary);
  }

  return data;
};

module.exports = {
  transformChatInbox
};
