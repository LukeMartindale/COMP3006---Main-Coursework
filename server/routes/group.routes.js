let jwt = require("jsonwebtoken")

let Message = require("../../database/models/model.message").Message;
let Group = require("../../database/models/model.group").Group;
let User = require("../../database/models/model.user").User;

async function groupchatPage(request, response) {

    let group_id = request.params.id;

    let user = await User.findById(jwt.decode(request.session.token).id).select(['-password']);

    let messages = await Message.find({ "groupId": group_id, "type": "group-message"});
    let group = await Group.findOne({ "_id": group_id });

    response.render("app/groups-chat-page", {"messages": messages, "group": group, "user": user, "user_id": user._id});

}

async function groupchatsettingsPage(request, response) {

    let group = await Group.findOne({ "_id": request.params.id });

    let user = await User.findById(jwt.decode(request.session.token).id).select(['-password']).exec();
    let friends = await User.find({"friends.friend": {"$in": [user._id]}}).select(['-password', '-friends', '-__v']);

    response.render("app/groups-settings-page.ejs", {"group": group, "friends": friends, "user_id": user._id})

}

module.exports.groupchatPage = groupchatPage;
module.exports.groupchatsettingsPage = groupchatsettingsPage;
