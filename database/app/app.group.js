let Group = require("../models/model.group").Group;
let Message = require("../models/model.message").Message;
let Request = require("../models/model.request").Request;
let User = require("../models/model.user").User;

const { request, response } = require("express");
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

    if(request.body.type == "text") {
        let message = new Message({
            text: request.body.text,
            sentOn: new Date(),
            groupId: request.body.groupId,
            senderId: jwt.decode(request.session.token).id,
            senderUsername: request.body.senderUsername,
            type: 'group-message',
        })
    
        message.save((error, message) => {
            if(error){
                response.status(500).send({"message": error})
                return;
            }
            response.status(200).send({"message": "Message was sent!"})
        });
    }
    if(request.body.type == "image") {
        let message = new Message({
            text: request.body.text,
            sentOn: new Date(),
            groupId: request.body.groupId,
            senderId: jwt.decode(request.session.token).id,
            senderUsername: request.body.senderUsername,
            type: 'group-image',
        })

        message.save((error, message) => {
            if(error){
                response.status(500).send({"message": error})
                return;
            }
            response.status(200).send({"message": "Message was sent!"})
        });
    }
    


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

};

LeaveGroup = async (request, response) => {

    let user_id = jwt.decode(request.session.token).id;
    let group = await Group.findById(request.body.groupId);

    group.group_members = group.group_members.filter(e => e != user_id)

    group.save()

    response.status(200).send({"message": "Group left!"})

};

CheckIfAlreadyInGroup = async(request, response, next) => {

    let group = await Group.findById(request.body.groupId).exec()
    if(group.group_members.includes(request.body.recipientId)){
        response.status(400).send({"message": "User is already in group!"});
        return;
    }
    next()

}

CheckGroupNameNotEmpty = async(request, response, next) => {

    if(request.body.group_name == ""){
        response.status(400).send({"message": "Group name cannot be empty!"});
        return;
    }
    next()

}

CheckMessageNotEmpty = async(request, response, next) => {

    if(request.body.text == ""){
        response.status(400).send({"message": "Cannot send an empty message!"})
    } else {
        next()
    }
    
}

CheckNotAlreadyInvited = async(request, response, next) => {

    let user_request = await Request.findOne({groupId: request.body.groupId, recipientId: request.body.recipientId, status: 'pending'}).exec()

    if(user_request){
        response.status(400).send({"message": "User has already been invited!"})

    } else {
        next()
    }

}

let group = {
    CreateGroup,
    SendTextMessage,
    InviteFriendToGroup,
    LeaveGroup,
    CheckIfAlreadyInGroup,
    CheckGroupNameNotEmpty,
    CheckNotAlreadyInvited,
    CheckMessageNotEmpty,
}

module.exports = group
