let mongoose = require("mongoose");

let UserSchema = new mongoose.Schema({
    username: String,
    password: String,
});

let User = mongoose.model("user", UserSchema)

module.exports.User = User;
