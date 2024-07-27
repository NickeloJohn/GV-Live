const axios= require("axios");

exports.mockResponseGetComments = async () => {
    const res = await axios.get('https://8b07ffb8-8e03-44f2-b6de-82535c7c784c.mock.pstmn.io/posts/b3e791a0-e88d-44dc-85f2-47b19a1404b3/comments?page=1&limit=10');
    return res.data
}