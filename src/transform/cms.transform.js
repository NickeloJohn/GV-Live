const _ = require("lodash");
const helperService = require("../services/helper.service");
const { transformImageUrl } = require("../utils/transform");
const { removeSpaces } = require("../utils/functions");

const transformCMSPostCategory = (data) => {
    return {
        id: data.id,
        name: data?.pet?.name || "Empty pet category name",
        icon: data?.pet?.icon ? transformImageUrl(data.pet.icon) : "",
        image: data?.pet?.image ? transformImageUrl(data.pet.image) : "",
    }
}

const transformCMSPostSubCategory = (data) => {
    return {
        id: data.id,
        name: removeSpaces(data?.petSub?.name || ""),
        icon: data?.pet?.icon ? transformImageUrl(data.pet.icon) : "",
        parentId: data?.petSub?.category || ""
    }
}

const transformCMSPetQuirk = (data) => {
    return {
        id: data.id,
        name: data?.petQuirk?.name || "Empty pet quirk name",
        parentId: data?.petQuirk?.category || ""
    }
}

const transformCMSPostCategories = async (datas) => {

    const sortedDatas = datas.slice(); // Create a shallow copy of datas

    // Sort the data array in place based on the conditions
    // make it first item everthing in array
    sortedDatas.sort((a, b) => {
        if (a.type === 'pet_category' && b.type !== 'pet_category') return -1;
        if (a.type !== 'pet_category' && b.type === 'pet_category') return 1;
        if (a.pet.name === 'everything') return -1;
        if (b.pet.name === 'everything') return 1;
        return 0;
    });

    const results = await Promise.all(
        sortedDatas.map((data) => transformCMSPostCategory(data))
    );
    
    return results;
};

const transformCMSPostSubCategories = (datas) => {
    const results = datas.map((data) => transformCMSPostSubCategory(data));
    return results;
};

const transformCMSPetQuirks = (datas) => {
    const results = datas.map((data) => transformCMSPetQuirk(data));
    return results;
};

const transformCMSShopCategory = (data) => {
    const { id, _id, shop } = data;
    const { name = "", icon, subCategories = [] } = shop || {};

    return {
        id: id || _id,
        name,
        icon: icon ? transformImageUrl(icon) : "https://placehold.co/100x100",
        subCategories: subCategories.map(({ id, _id, name = "", productType = [] }) => ({
            id: id || _id,
            name,
            productType: productType.map(({ id, _id, name = "" }) => ({
                id: id || _id,
                name,
            })),
        })),
    };
};

const transformCMSShopCategories = (datas) => {
    const results = datas.map((data) => transformCMSShopCategory(data));
    return results;
};

const transformCancelReasons = (list) => {
    return list.map((val) => {
        return {
            id: val._id,
            description: val.description,
        }
    });
}


module.exports = {
    transformCMSPostCategory,
    transformCMSPostCategories,
    transformCMSPostSubCategories,
    transformCMSShopCategory,
    transformCMSShopCategories,
    transformCMSPetQuirks,
    transformCancelReasons
}