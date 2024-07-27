const { objectToString } = require("../utils/functions");
const { transformImageUrl } = require("../utils/transform");


exports.transformGetTreats = (treat, treatCategories) => {
    let name = '--';
    let icon = '--';
    let type = '--';

    if (treatCategories) 
    {
        treatCategories = treatCategories.find( treatCategory => objectToString(treatCategory._id) === objectToString(treat.treatCategory))
        name = treatCategories?.name;
        type = treatCategories?.type;
        icon = transformImageUrl(treatCategories?.icon);
    }

    return {
        id: treat._id,
        name: name,
        status: treat.status,
        coin: treat.coins,
        icon: icon,
        type: type
    }
}