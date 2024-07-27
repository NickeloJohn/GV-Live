const config = require("../config/config");
const { getUserById, getPetById } = require("../services/helper.service");
const { getFullName } = require("../utils/functions");
const { transformImageUrl } = require("../utils/transform");

const messageTemplate = ({
    message, fullname, petname
}) => {
    if (fullname) {
        message = message.replace(/{fullname}/g, fullname);
    };
    if (petname) {
        message = message.replace(/{petname}/g, petname);
    }
    return message
}

const transformNotification = async (notification) => {
    let user = {};
    let pet = {}
    let selectField = "profilePicture firstName lastName middleName";
    let userId = notification.senderId || notification.user;
    let petId = notification.petId;

    if (userId && !notification.merchantId) {
        const userData = await getUserById(userId, selectField);
        user = setUser(userData);
    } else if (notification.merchantId) {
        // const userData = await getUserById(notification.merchantId, selectField);
        // user = setUser(userData);
    }

    if(petId) {
        const selectedField = 'name';
        pet = await getPetById(petId, selectedField);
    }

    const message = messageTemplate({
        message: notification.message,
        fullname: user.fullname,
        petname: pet.name
    });

    return {
        id: notification.id,
        message: message,
        read: notification.read,
        user: user,
        type: notification.type,
        deeplink: `${config.mobileDeeplinkUrl}?${notification.deeplink}`,
        createdAt: notification.createdAt
    }
}

const setUser = (userData) => {
    let image = transformImageUrl(userData?.profilePicture);
    return {
        id: userData?._id || "",
        profilePicture: image,
        fullname: getFullName(userData),
    };
}

const transformNotifications = async (notifications) => {
    return await Promise.all(notifications.map((notification) => transformNotification(notification)));
}

module.exports = {
    transformNotification,
    transformNotifications
}