let mongoose = require("mongoose");

let MessageSchema = new mongoose.Schema({
    text: String,
    sentOn: Date,
    groupId: String,
    senderId: String,
    senderUsername: String,
    type: String,
});

let Message = mongoose.model("message", MessageSchema)

module.exports.Message = Message;
