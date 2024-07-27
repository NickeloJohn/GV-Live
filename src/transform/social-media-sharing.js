const { transformImageUrl } = require("../utils/transform");

const transformPetForSocialMediaSharing = (pet) => {
    return {
        id: pet.id,
        profilePicture: transformImageUrl(pet.profile),
        name: pet.name || ''
    }
}

const transformPostForSocialMediaSharing = (post) => {
    return {
        id: post.id,
        media: transformImageUrl(post.media[0].thumbnail),
        body: post.body || ''
    }
}

const transformProductForSocialMediaSharing = (product) => {
    return {
        id: product.id,
        image: transformImageUrl(product.images) || '',
        price: product.price || '',
        sold: product.sold || '',
        name: product.name || '',
        description: product.description || '',
        rating: product.rating || '',
    }
}

module.exports = {
    transformPetForSocialMediaSharing,
    transformPostForSocialMediaSharing,
    transformProductForSocialMediaSharing
}