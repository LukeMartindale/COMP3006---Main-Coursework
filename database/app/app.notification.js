let Request = require("../models/model.request").Request;
let Group = require("../models/model.group").Group;

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

let notification = {
    CheckIfAlreadyInGroup,
}

module.exports = notification