const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const MongooseHelper = require("../utils/mongoose");
const { Database1 } = require("../utils/database");

const ActionLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: ['approve', 'remove'],
      require: true,
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FlaggedContent",
      require: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    actionType: {
      type: String,
      enum: ["warning", "timeout", "ban"],
      required: true,
    },
    contentType: {
      type: String,
      enum: ['photo', 'video'],
      required: true
    },
    details: { type: String, required: true },
    ...MongooseHelper.timeStamps,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ActionLogSchema.plugin(mongoosePaginate);
ActionLogSchema.plugin(require("mongoose-aggregate-paginate-v2"));

module.exports = Database1.model("ActionLog", ActionLogSchema);
