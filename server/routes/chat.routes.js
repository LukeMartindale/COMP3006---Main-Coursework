let jwt = require("jsonwebtoken")

let Message = require("../../database/models/model.message").Message;

async function groupchatPage(request, response) {

    let group_id = request.params.id;

    messages = await Message.find({ "groupId": group_id})

    response.render("app/chat-group-page", {"messages": messages, "group_id": group_id});

}

module.exports.groupchatPage = groupchatPage;
