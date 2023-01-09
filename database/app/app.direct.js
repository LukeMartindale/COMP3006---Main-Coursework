let Message = require("../models/model.message").Message;

let jwt = require("jsonwebtoken");
let DirectMessage = require("../models/model.direct-message").DirectMessage;

SendTextMessage = (request, response) => {

    if(request.body.type == "text") {
        let message = new Message({
            text: request.body.text,
            sentOn: new Date(),
            groupId: request.body.dm_id,
            senderId: jwt.decode(request.session.token).id,
            senderUsername: request.body.senderUsername,
            type: 'direct-message',
        })

        message.save()

        response.status(200).send({"message": "Message was sent!"})
    }
    if(request.body.type == "image") {
        let message = new Message({
            text: request.body.text,
            sentOn: new Date(),
            groupId: request.body.dm_id,
            senderId: jwt.decode(request.session.token).id,
            senderUsername: request.body.senderUsername,
            type: 'direct-image',
        })

        message.save()

        response.status(200).send({"message": "Message was sent!"})
    }
}

CheckMessageNotEmpty = async(request, response, next) => {

    if(request.body.text == ""){
        response.status(400).send({"message": "Cannot send an empty message!"})
    } else {
        next()
    }
    
}

CheckUserIsInGroup = async(request, response, next) => {

    let directmessage = await DirectMessage.findById(request.params.id)
    if(directmessage.group_members.includes(jwt.decode(request.session.token).id)){
        next()
    } else {
        response.status(400).send({"message": "User is not in this dm!"})
    }

}

let direct = {
    SendTextMessage,
    CheckMessageNotEmpty,
    CheckUserIsInGroup,
}

module.exports = direct
