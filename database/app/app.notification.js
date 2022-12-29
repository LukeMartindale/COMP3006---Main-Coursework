let jwt = require("jsonwebtoken")
let mongoose = require("mongoose");

let Request = require("../models/model.request").Request;
let Group = require("../models/model.group").Group;
let User = require("../../database/models/model.user").User;

CheckIfAlreadyInGroup = async(request, response, next) => {

    let notification = await Request.findByIdAndUpdate(request.body.request_id).exec()
    let group = await Group.findById(notification.groupId).exec()

    if(notification.groupId != undefined){
        if(group.group_members.includes(notification.recipientId)){
            response.status(400).send({"Message": "User is already in group"});
            return;
        }
    }
    next()
}

CheckIfAlreadyFriends = async(request, response, next) => {

    let user_request = await Request.findById(request.body.request_id).exec()
    let user = await User.findById(jwt.decode(request.session.token).id)

    if(request.body.type == "accept") {
        if(user_request.groupId == undefined){
            for(let i=0; i< user.friends.length; i++){
                if(String(user.friends[i].friend) == user_request.senderId){
                    response.status(400).send({"message": "Already friends with this user!"})
                    return;
                }
            };
        }
    }
    next();
}

let notification = {
    CheckIfAlreadyInGroup,
    CheckIfAlreadyFriends,
}

module.exports = notification