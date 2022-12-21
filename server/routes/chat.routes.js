let jwt = require("jsonwebtoken")

let Message = require("../../database/models/model.message").Message;
let Group = require("../../database/models/model.group").Group;
let User = require("../../database/models/model.user").User;

async function groupchatPage(request, response) {

    let group_id = request.params.id;

    let user = await User.findById(jwt.decode(request.session.token).id).select(['-password']);

    user_id = user._id

    console.log(user)
    console.log(user._id)

    let messages = await Message.find({ "groupId": group_id});
    let group = await Group.findOne({ "_id": group_id });

    response.render("app/chat-group-page", {"messages": messages, "group": group, "user": user, "user_id": user_id});

}

module.exports.groupchatPage = groupchatPage;
