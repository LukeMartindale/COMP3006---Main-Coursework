let jwt = require("jsonwebtoken")

let Message = require("../../database/models/model.message").Message;
let DirectMessage = require("../../database/models/model.direct-message").DirectMessage;
let User = require("../../database/models/model.user").User;

async function directmessagePage(request, response) {

    let dm_id = request.params.id;
    let user = await User.findById(jwt.decode(request.session.token).id).select(['-password']);

    let messages = await Message.find({ "groupId": dm_id, "type": "direct-message"});
    let directmessage = await DirectMessage.findOne({ "_id": dm_id });

    for(let i=0; i<directmessage.group_members.length; i++){
        if(directmessage.group_members[i] != jwt.decode(request.session.token).id){
            friend_user = await User.findById(directmessage.group_members[i]).select('username');
            break;
        }
    }

    response.render("app/direct-chat-page", {"messages": messages, "directmessage": directmessage, "user": user, "user_id": user._id, "friend_user": friend_user});

}

module.exports.directmessagePage = directmessagePage;
