const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const MongooseHelper = require("../utils/mongoose");
const { DEFAULT_STATUS, IN_ACTIVE_STATUS, TREATS_TYPE, TREAT } = require("../utils/constant");
const { Database3 } = require("../utils/database");


const GiftCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            capitalize: true 
        },
        icon: MongooseHelper.defaultFile,
        status: {
            type: String,
            enum: DEFAULT_STATUS,
            default: IN_ACTIVE_STATUS
        },
        type: {
            type: String,
            enum: TREATS_TYPE,
            default: TREAT
        },
        ...MongooseHelper.timeStamps
    }
);


GiftCategorySchema.plugin(mongoosePaginate);
module.exports = Database3.model('GiftCategory', GiftCategorySchema);