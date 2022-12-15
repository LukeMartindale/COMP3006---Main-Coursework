let mongoose = require("mongoose");

let GroupSchema = new mongoose.Schema({
    group_name: String,
    group_members: Array,
});