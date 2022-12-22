let Group = require("../models/model.group").Group;
let Message = require("../models/model.message").Message;
let Request = require("../models/model.request").Request;
let User = require("../models/model.user").User;

const { request } = require("express");
let jwt = require("jsonwebtoken");
let mongoose = require("mongoose");

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
        senderUsername: request.body.senderUsername,
    })

    message.save((error, message) => {
        if(error){
            response.status(500).send({"message": error})
            return;
        }
        response.status(200).send({"message": "Message was sent!"})
    });

}

InviteFriendToGroup = async (request, response) => {

    let user = await User.findById(jwt.decode(request.session.token).id)

    let user_request = new Request({
        senderId: jwt.decode(request.session.token).id,
        senderUsername: user.username,
        recipientId: mongoose.Types.ObjectId(request.body.recipientId),
        type: 'group-invite',
        groupId: request.body.groupId,
        sentOn: new Date(),
        status: 'pending',
        responseRequired: true,
    });

    user_request.save((error, message) => {
        if(error){
            response.status(500).send({"message": error})
            return;
        }
        response.status(200).send({"message": "Group Invite Sent!"})
    });

}

CheckIfAlreadyInGroup = async(request, response) => {

    

}

let group = {
    CreateGroup,
    SendTextMessage,
    InviteFriendToGroup,
}

module.exports = group
