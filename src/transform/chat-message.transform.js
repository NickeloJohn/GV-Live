const config = require("../config/config")
const { decryptMessage, objectToString } = require("../utils/functions")


const transformChatMessages = (data, userId) => {
  data = data.toObject();
  
  return {
    roomId: data.roomId,
    sender: data.sender,
    message: decryptMessage(data.message, config.chat.passphrase),
    isMine: objectToString(data.sender) === userId,
    date: data.createdAt
  }
}


module.exports = {
  transformChatMessages
}
