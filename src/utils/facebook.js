const { axiosRequest } = require("./axios");

const fetchFacebookAccessToken = async(accessToken) => {
    const responseFbToken = await axiosRequest({
        url: `https://graph.facebook.com/me?access_token=${accessToken}`,
        method: 'GET',
        typeRequest: `DECODE facebook token ${accessToken}`
    });

    return responseFbToken?.data
}

module.exports = {
    fetchFacebookAccessToken
}