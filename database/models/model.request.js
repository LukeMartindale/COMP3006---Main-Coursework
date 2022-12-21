let mongoose = require("mongoose");

let RequestSchema = new mongoose.Schema({
    senderId: String,
    senderUsername: String,
    recipientId: String,
    type: String,
    sentOn: Date,
    status: String,
    responseRequired: Boolean,
});

let Request = mongoose.model("request", RequestSchema)

module.exports.Request = Request;
