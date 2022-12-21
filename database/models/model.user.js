let mongoose = require("mongoose");

let UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    friends: Array,
});

let User = mongoose.model("user", UserSchema)

module.exports.User = User;
