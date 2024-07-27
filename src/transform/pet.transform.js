const helperService = require("../services/helper.service");
const { getFullName } = require("../utils/functions");
const { transformImageUrl } = require("../utils/transform");

/**
 * @param {*} obj 
 * @returns {string}
 */
const getPetCategoryName = async (obj) => {
    if (!obj.category) {
        const categoryName = await helperService.getPetCategoryNameById(obj.petCategory);
        return categoryName;
    }
    return obj.category;
};

const transformPetProfile = async (obj, userId) => {
    const { id, user, name, username, originalName, breed, quirks, gender, birthday, color, date, profilePicture, category, medicalProfile, isFollowed, about, moods, isDefault } = obj;

    const immunization = {
        name: medicalProfile?.immunization?.name || "",
        date: medicalProfile?.immunization?.date || ""
    };

    const antiRabbies = {
        name: medicalProfile?.antiRabbies?.name || "",
        date: medicalProfile?.antiRabbies?.date || ""
    };

    const boosters = {
        name: medicalProfile?.boosters?.name || "",
        date: medicalProfile?.boosters?.date || ""
    }

    const deworming = {
        name: medicalProfile?.deworming?.name || "",
        date: medicalProfile?.deworming?.date || ""
    }

    const neutred = {
        name: medicalProfile?.neutred?.name || "",
        date: medicalProfile?.neutred?.date || ""
    }

    const allergies = medicalProfile?.allergies || "";
    const condition = medicalProfile?.medicalCondition || "";
    const foodPreferences = medicalProfile?.foodPreferences || "";

    const [
        totalFollower,
        totalFollowing,
        isFollowingPet
    ] = await Promise.all([
        helperService.getTotalPetFollowers(obj._id),
        helperService.getTotalPetFollowing(obj._id),
        helperService.isPetAlreadyFollowed(obj._id, userId)
    ]);

    return {
        id,
        user,
        name: originalName || name,
        username,
        breed,
        category: await getPetCategoryName(obj),
        quirks,
        gender,
        birthday,
        color,
        moods,
        medicalProfile: {
            foodPreferences,
            immunization,
            antiRabbies,
            boosters,
            deworming,
            neutred,
            allergies,
            condition
        },
        profilePicture: profilePicture || profile,
        totalFollower: totalFollower,
        totalFollowing: totalFollowing,
        isFollowed: isFollowingPet,
        about,
        isDefault
    };
};

const transformPetProfilePost = async (obj) => {
    const { id, name, profilePicture, isFollowed } = obj;

    return {
        id,
        name,
        profilePicture,
        isFollowed
    };
};

/**
 * @param {array} pets
 * @returns {Promise<Array>}
 */
const transformPetListProfile = async (pets) => {
    const petCategoryIds = pets.map((pet) => pet.petCategory);
    const petCategories = await helperService.getPetCategoriesByIds(petCategoryIds);

    const petCategoryMap = new Map();
    petCategories.forEach((petCategory) => {
        petCategoryMap.set(petCategory._id.toString(), petCategory.pet.name || '');
    });

    const transformedPets = await Promise.all(pets.map(async (pet) => {
        pet.category = petCategoryMap.get(pet.petCategory.toString()) || '';
        return transformPetProfile(pet);
    }));

    return transformedPets;
};

const transformPetMostPopular = (data, user, pet) => {
    return {
        user: {
            id: user?._id,
            fullName: getFullName(user),
            profilePicture: transformImageUrl(user.profilePicture)
        },
        pet: {
            id: pet?._id,
            name: pet?.name || "",
            profilePicture: transformImageUrl(pet?.profile)
        }
    }
}

const transformPetMostPopulars = (datas, users, pets) => {
    const userMap = new Map();
    users.forEach((user) => {
        userMap.set(user._id.toString(), user);
    });

    const petMap = new Map();

    pets.forEach((pet) => {
        petMap.set(pet._id.toString(), pet);
    });

    return datas.map((data) => {
        const user = userMap.get(data.followedUser.toString());
        const pet = petMap.get(data.followedPet.toString());
        return transformPetMostPopular(data, user, pet);
    });
};

module.exports = {
    transformPetProfile,
    transformPetListProfile,
    transformPetProfilePost,
    transformPetMostPopulars
}