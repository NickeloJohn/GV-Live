const jwt = require("jsonwebtoken");

const keyConfig = {
    keys: [
        {
            kid: "X5eXk4xyojNFum1kl2Ytv8dlNP4-c57dO6QGTVBwaNk",
            nbf: 1493763266,
            use: "sig",
            kty: "RSA",
            e: "AQAB",
            n: "tVKUtcx_n9rt5afY_2WFNvU6PlFMggCatsZ3l4RjKxH0jgdLq6CScb0P3ZGXYbPzXvmmLiWZizpb-h0qup5jznOvOr-Dhw9908584BSgC83YacjWNqEK3urxhyE2jWjwRm2N95WGgb5mzE5XmZIvkvyXnn7X8dvgFPF5QwIngGsDG8LyHuJWlaDhr_EPLMW4wHvH0zZCuRMARIJmmqiMy3VD4ftq4nS5s8vJL0pVSrkuNojtokp84AtkADCDU_BUhrc2sIgfnvZ03koCQRoZmWiHu86SuJZYkDFstVTVSR0hiXudFlfQ2rOhPlpObmku68lXw-7V-P7jwrQRFfQVXw",
        },
    ],
};

function prepadSigned(hexStr) {
    const msb = hexStr[0];
    if (
        (msb >= "8" && msb <= "9") ||
        (msb >= "a" && msb <= "f") ||
        (msb >= "A" && msb <= "F")
    ) {
        return "00" + hexStr;
    } else {
        return hexStr;
    }
}

function toHex(number) {
    const nstr = number.toString(16);
    if (nstr.length % 2 == 0) return nstr;
    return "0" + nstr;
}

// encode ASN.1 DER length field
// if <=127, short form
// if >=128, long form
function encodeLengthHex(n) {
    if (n <= 127) return toHex(n);
    else {
        const n_hex = toHex(n);
        const length_of_length_byte = 128 + n_hex.length / 2; // 0x80+numbytes
        return toHex(length_of_length_byte) + n_hex;
    }
}

const rsaPublicKeyPem = (modulusB64, exponentB64) => {
    const modulus = new Buffer.from(modulusB64, "base64");
    const exponent = new Buffer.from(exponentB64, "base64");

    const modulusHex = prepadSigned(modulus.toString("hex"));
    const exponentHex = prepadSigned(exponent.toString("hex"));

    const modlen = modulusHex.length / 2;
    const explen = exponentHex.length / 2;

    const encodedModlen = encodeLengthHex(modlen);
    const encodedExplen = encodeLengthHex(explen);
    const encodedPubkey = `30${encodeLengthHex(
        modlen +
            explen +
            encodedModlen.length / 2 +
            encodedExplen.length / 2 +
            2
    )}02${encodedModlen}${modulusHex}02${encodedExplen}${exponentHex}`;

    const derB64 = new Buffer.from(encodedPubkey, "hex").toString("base64");

    const pem = `-----BEGIN RSA PUBLIC KEY-----\n${derB64
        .match(/.{1,64}/g)
        .join("\n")}\n-----END RSA PUBLIC KEY-----\n`;

    return pem;
};

const delay = async (time = 1000) => {
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

exports.verifyAzureB2CToken = async (token, time = 0) => {
    const publicKey = rsaPublicKeyPem(keyConfig.keys[0].n, keyConfig.keys[0].e);
    await delay(time);
    try {
        return jwt.verify(token, publicKey, { algorithms: ["RS256"] });
    } catch (err) {
        throw new Error("Invalid token or Public Key");
    }
};
