let mongoose = require("mongoose");

let RequestSchema = new mongoose.Schema({
    sender: String,
    recipient: String,
    type: String,
    sentOn: Date,
    status: String,
});
