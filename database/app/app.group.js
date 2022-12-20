let Group = require("../models/model.group").Group;
let Message = require("../models/model.message").Message;

let jwt = require("jsonwebtoken")

CreateGroup = (request, response) => {

    let group = new Group({
        group_name: request.body.group_name,
        group_admin: jwt.decode(request.session.token).id,
        group_members: jwt.decode(request.session.token).id,
    })

    group.save((error, group) => {
        if(error){
            response.status(500).send({"message": error});
            return
        }
        response.status(200).send({"message": "Group was created!"})
        
    })

}

SendTextMessage = (request, response) => {
    
    let message = new Message({
        text: request.body.text,
        sentOn: new Date(),
        groupId: request.body.groupId,
        senderId: jwt.decode(request.session.token).id,
    })

    message.save((error, message) => {
        if(error){
            response.status(500).send({"message": error})
            return;
        }
        response.status(200).send({"message": "Message was sent!"})
    });

}

let group = {
    CreateGroup,
    SendTextMessage,
}

module.exports = group
