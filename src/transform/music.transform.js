const { capitalize } = require("../utils/functions")
const { transformImageUrl } = require("../utils/transform")


const transformMusicCategory = (category) => {
    return {
        id: category._id,
        name: capitalize(category.name),
        icon: transformImageUrl(category.file),
    }
}

const transformMusicCategories = (categories) => {
    return categories.map((category) => transformMusicCategory(category))
}

const transformMusic = (music) => {
    return {
        id: music._id,
        name: music.name,
        file: transformImageUrl(music.file)
    }
}

const transformMusics = (musics) => {
    return musics.map((music) => transformMusic(music))
}

module.exports = {
    transformMusicCategories,
    transformMusicCategory,
    transformMusics,
    transformMusic
}