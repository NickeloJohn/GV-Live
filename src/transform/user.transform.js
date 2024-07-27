const { getFullName } = require("../utils/functions");


const buildAddress = (address) => {
	return {
		houseNumber: address?.houseNumber || "",
		street: address?.street || "",
		stateOrRegion: address?.stateOrRegion || "",
		province: address?.province || "",
		townCity: address?.townCity || "",
		barangay: address?.barangay || "",
		zipCode: address?.zipCode || "",
	}

}

const transformUser = (user) => {

  return {
		id: user?.id || "",
		firstName: user?.firstName || "",
		middleName: user?.middleName || "",
		lastName: user?.lastName || "",
		fullName: getFullName(user),
		email: user?.email || "",
		phoneNumber: user?.phoneNumber || "",
		profilePicture: user?.profilePicture || "https://placehold.it/100x100",
		totalFollower: user?.totalFollower || 0,
		totalFollowing: user?.totalFollowing || 0,
		birthday: user?.birthday || "",
		address: buildAddress(user?.address),
		bio: user?.bio || "",
		sign: user?.sign,
		languages: user?.languages || [],
		interests: user?.interests || [],
		settings: {
			isPasswordSet: user?.settings?.isPasswordSet || false,
			isFaceIdSet: user?.settings?.isFaceIdSet || false,
			isFingerPrintSet: user?.settings?.isFingerPrintSet || false,
			isEmailVerified: user?.isEmailVerified || false,
		},
		totalFollowers: user?.totalFollowers || 0,
		totalFollowing: user?.totalFollowing || 0,
	}

};


module.exports = {
	transformUser
}