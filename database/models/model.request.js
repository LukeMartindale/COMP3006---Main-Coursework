let mongoose = require("mongoose");

let RequestSchema = new mongoose.Schema({
    senderId: String,
    recipientId: String,
    type: String,
    sentOn: Date,
    status: String,
});

let Request = mongoose.model("request", RequestSchema)

module.exports.Request = Request;
