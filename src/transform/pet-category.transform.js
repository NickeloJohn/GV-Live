
const transformPetCategory = (petCategory) => {
    return {
        id: petCategory._id,
        name: petCategory.pet.name,
    }
}

const transformGetPetCategories = (petCategories) => {
    return petCategories.filter(petCategory => petCategory.pet.name !== "everything").map(petCategory => transformPetCategory(petCategory));
}

module.exports = {
    transformGetPetCategories
}