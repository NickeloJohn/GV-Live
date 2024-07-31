const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const { Database1 } = require('../utils/database');

const RoleSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'User', 
        required: true },
        role: 
        { type: String, 
        required: true },
        changedAt: 
        { type: Date,
        required: true }
});

RoleSchema.plugin(mongoosePaginate);
RoleSchema.plugin(require('mongoose-aggregate-paginate-v2'));

module.exports = Database1.model('Role', RoleSchema);
