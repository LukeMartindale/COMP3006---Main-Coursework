let mongoose = require("mongoose");

let GroupSchema = new mongoose.Schema({
    group_name: String,
    group_admin: String,
    group_members: Array,
    type: String,
});

let Group = mongoose.model("group", GroupSchema)

module.exports.Group = Group;
