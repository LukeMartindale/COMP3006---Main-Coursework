let Message = require("../models/model.message").Message;

let jwt = require("jsonwebtoken");

SendTextMessage = (request, response) => {
    
    let message = new Message({
        text: request.body.text,
        sentOn: new Date(),
        groupId: request.body.dm_id,
        senderId: jwt.decode(request.session.token).id,
        senderUsername: request.body.senderUsername,
        type: 'direct-message',
    })

    message.save((error, message) => {
        if(error){
            response.status(500).send({"message": error})
            return;
        }
        response.status(200).send({"message": "Message was sent!"})
    });

}

CheckMessageNotEmpty = async(request, response, next) => {

    if(request.body.text == ""){
        response.status(400).send({"message": "Cannot send an empty message!"})
    } else {
        next()
    }
    
}

let direct = {
    SendTextMessage,
    CheckMessageNotEmpty,
}

module.exports = direct
