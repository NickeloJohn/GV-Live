const { ClientSecretCredential } = require("@azure/identity");
const { Client } = require("@microsoft/microsoft-graph-client");
const AuthProvider = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");
const { axiosRequest } = require("./axios");

const getClient = () => {
    const tenantId = process.env?.ADB2C_TENANT_ID;
    const clientId = process.env?.ADB2C_CLIENT_ID;
    const clientSecret = process.env?.ADB2C_CLIENT_SECRET;

    const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

    const authProvider = new AuthProvider.TokenCredentialAuthenticationProvider(credential, {
        scopes: ['https://graph.microsoft.com/.default']
    });

    const client = Client.initWithMiddleware({
        debugLogging: true,
        authProvider
    });

    return client;
};

exports.addUserToLocalADB2CWithPassword = async (user) => {
    let identities = [
        {
            signInType: 'username',
            issuer: process.env?.ADB2C_ISSUER,
            issuerAssignedId: user.adb2c.username || user?.email
        }
    ];

    const payload = {
        displayName: `${user?.firstName || "N/A"} ${user?.lastName || "N/A"}`,
        givenName: user?.firstName || "N/A",
        surname: user?.lastName || "N/A",
        accountEnabled: true,
        identities: identities
    };

    payload.passwordProfile = {
        password: user?.id || user.password,
        forceChangePasswordNextSignIn: false
    };
    payload.passwordPolicies = 'DisablePasswordExpiration, DisableStrongPassword';
    
    
    const client = getClient();
    const result = await client
        .api('/users/')
        .post(payload)
        .then((res) => {
            delete payload.passwordProfile;
            console.log(JSON.stringify({ message: 'successAddUserToADB2C', res: res, user, payload }));
            return res;
        })
        .catch((err) => {
            delete payload.passwordProfile;
            console.log(JSON.stringify({ message: 'errorAddUserToADB2C', err: err, user, payload }));

            let message = 'Something wrong in adb2c';
            if (err?.body) {
                err.body = JSON.parse(err.body);
                if (err?.body?.message?.includes('Another object with the same value')) {
                    message = 'Email already exists';
                } else if (err?.body?.message?.includes('A password must be specified to create a new user')) {
                    message = 'Password is required';
                } else {
                    message = err?.body?.message;
                }
            }

            return {
                error: true,
                statusCode: err?.statusCode,
                message: message
            };
        });

    return result;
};


exports.authenticateUserUsingPassword = async (username, password) => {
    const baseURL = process.env.ADB2C_BASE_URL;
    const applicationId = process.env.ADB2C_CLIENT_ID;
    const policy_name = process.env.ADB2C_POLICY_NAME;

    let payload = {
        username: username,
        password: password,
        grant_type: 'password',
        scope: `openid+${applicationId}+offline_access`,
        client_id: applicationId,
        response_type: 'token+id_token'
    };

    payload = Object.keys(payload)
        .map((key) => key + '=' + payload[key])
        .join('&');
    
    const { data } = await axiosRequest({
        url: `${baseURL}/${policy_name}/oauth2/v2.0/token`,
        method: 'POST',
        data: payload,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        typeRequest: 'AUTH_ADB2C_Request'
    });
    return data;
};

exports.deleteUserADB2C = async (id) => {
    const client = getClient();
    await client
        .api('/users/' + id)
        .delete()
        .then((res) => {
            console.log(JSON.stringify({ message: 'successADB2CDeleteUser', res: res, id }));
        })
        .catch((err) => {
            if (err.code === 'Request_ResourceNotFound') {
                throw new Error('User not exist on ADB2C');
            }
            console.log(JSON.stringify({ message: 'failedADB2CDeleteUser', error: err, id }));
        });
};