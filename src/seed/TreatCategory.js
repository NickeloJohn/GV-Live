const Treat = require("../models/Treat")
const TreatCategory = require("../models/TreatCategory")
const { ACTIVE_STATUS, TREAT } = require("../utils/constant")

const addTreatCategory = async () => {
    const data = {
        name: 'Nike',
        icon: {
            filename: "431790217293739341035108538840.png",
            fileSize: 912242,
            originalFilename: "welcome_new.png",
            container: "users",
            filePath: "650d92db8c7b7d558c96366d/profile/431790217293739341035108538840.png"
        },
        status: ACTIVE_STATUS,
        type: TREAT
    }
   
    return await TreatCategory.findOneAndUpdate({ name: data.name }, data, {
        upsert: true,
        new: true
    })
}

addTreatCategory()
.then(async(res) => {
    const data =  {
        treatCategory: res._id,
        value: 100,
        status: ACTIVE_STATUS
    }

    await Treat.findOneAndUpdate({
        treatCategory: res._id
    }, data, { upsert: true });
})