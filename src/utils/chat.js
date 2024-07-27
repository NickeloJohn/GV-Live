const { WebPubSubServiceClient } = require("@azure/web-pubsub");

const HUB_NAME = "chat_app";
const serviceClient = new WebPubSubServiceClient(process.env?.WEB_PUB_SUB_ACCESS, HUB_NAME);

const fetchClientAccessTokenURL = async (userId, roomId = null) => {
    if (roomId) {
        const userIdAndRoomId = `${userId}-${roomId}`;
        const token = await serviceClient.getClientAccessToken({ userId: userIdAndRoomId, groups: [roomId] });
        return token?.url;
    } else {
        const token = await serviceClient.getClientAccessToken({ userId: '64f5818b24788d9565e3a1c3' });
        return token?.url;
    }
}

const getClientAccessTokenURL = async(userId, roomId = null) => {
    const userIdAndRoomId = `${userId}-${roomId}`;
    const token = await serviceClient.getClientAccessToken({ userId: userIdAndRoomId, groups: [roomId] });
    return token?.url;
}

module.exports = {
    fetchClientAccessTokenURL,
    getClientAccessTokenURL
}