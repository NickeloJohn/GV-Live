const { transformImageUrl } = require("../../utils/transform")


const transformProductCategory = (category) => {
    return {
        id: category._id,
        name: category.name,
        icon: transformImageUrl(category.icon) || "https://placehold.co/200x200",
        status: category.status,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
    }
}

const transformProductSubCategory = (category) => {
    return {
        id: category._id,
        name: category.name,
        status: category.status,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
    }
}

const transformProductCategories = (categories) => {
    return categories.map(category => transformProductCategory(category));
}

const transformProductSubCategories = (categories) => {
    return categories.map(category => transformProductSubCategory(category));
}

module.exports = {
    transformProductCategory,
    transformProductCategories,
    transformProductSubCategories
}