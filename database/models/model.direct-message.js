let mongoose = require("mongoose");

let DMSchema = new mongoose.Schema({
    group_members: Array,
});

let DirectMessage = mongoose.model("direct-message", DMSchema)

module.exports.DirectMessage = DirectMessage;