const axios = require('axios');

exports.axiosRequest = async ({ method = "get", url, data = {}, headers = {}, user, typeOfRequest = "axios_call" }) => {
    let axiosCallRequestLogs =  {
        start: 'start calling api request for ' + url,
        typeOfRequest,
        data,
        headers,
        user,
        url
    };

    const responseResults = await axios({
        method: method?.toLowerCase(),
        url: url,
        data: data,
        headers: headers
    }).catch( err => {

        axiosCallRequestLogs = {
            ...axiosCallRequestLogs,
            responseErrorResults: err.response?.data
        };
    
        if (process.env.NODE_ENV === 'production') console.info(JSON.stringify(axiosCallRequestLogs));
        else console.info(err?.response?.data);
        
        return {
            error: err.response?.data || err.response
        }
    });

    axiosCallRequestLogs = {
        ...axiosCallRequestLogs,
        responseResults: responseResults?.data || responseResults
    };

    if (process.env.NODE_ENV === 'production') console.info(JSON.stringify(axiosCallRequestLogs));
    // else console.info(responseResults.data);

    return responseResults;
}