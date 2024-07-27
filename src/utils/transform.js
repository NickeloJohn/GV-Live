const config = require("../config/config");
const { AzureStorage } = require("./azure-storage");

const transformProductItemCart = (itemCart) => {
    const items = [];
    itemCart = JSON.parse(JSON.stringify(itemCart));

    // group item by shop
    itemCart.items.forEach((item) => {
        const findIndexProperty = items.findIndex((val) => val?.shopName === item?.shop?.name);
        const products = {
            productId: item?.product?.id,
            productName: item?.product?.name,
            quantity: item?.quantity,
            createdAt: item?.createdAt,
            updatedAt: item?.updatedAt
        };

        if (findIndexProperty === -1) {
            items.push({
                shopId: item?.shop.id,
                shopName: item?.shop?.name,
                items: Array(products)
            });
        } else items[findIndexProperty].items.push(products);
    });

    delete itemCart.items;
    itemCart.carts = items;
    return itemCart;
};


const transformUserBasicInformation = (user) => {
    const data = {
        fullname: user?.fullname,
        id: user?.id,
        role: user?.role,
        email: user?.email,
    }

    return data;
}

const transformSignInInformation = async (user) => {
    const data = {
        ...transformUserBasicInformation(user),
        isProfileFinish: user?.isProfileFinish,
        isPetReady: await isUserHaveAlreadyPet(user._id)
    }
    return data;
}

const transformImageUrl = (obj) => {
    let fileURL = "";
    if (obj) {
        if (!obj?.container) return "";
        const azureStorage = new AzureStorage();
        const sasToken = azureStorage.generateSasToken(obj?.container, obj?.filePath);
        fileURL = `${config.baseUrlCdn}/${obj?.container}/${obj?.filePath}?${sasToken}`
        // fileURL = `${config.baseUrlApi}/public/assets/${obj?.container}/${obj?.filePath?.replace(/\//g, '-')}?subscription-key=${process.env?.APIM_SUBSCRIPTION_KEY || ""}`;
    }

    return fileURL
}

const transformFileUrl = (obj) => {
    let fileURL = "";
    if (obj) {
        fileURL = `${config.baseUrlApi}/public/assets/${obj?.container}/${obj?.filePath.replace(/\//g, '-')}?subscription-key=${process.env?.APIM_SUBSCRIPTION_KEY || ""}`
    }
    return fileURL
}

module.exports = {
    transformProductItemCart,
    transformUserBasicInformation,
    transformImageUrl,
    transformSignInInformation
}