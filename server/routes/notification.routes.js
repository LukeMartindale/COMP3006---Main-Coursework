let jwt = require("jsonwebtoken")

let Request = require("../../database/models/model.request").Request;
let User = require("../../database/models/model.user").User;
let Group = require("../../database/models/model.group").Group;
let DirectMessage = require("../../database/models/model.direct-message").DirectMessage;

async function requestResponse(request, response){

    let user_request = await Request.findById(request.body.request_id).exec()

    if(request.body.type == "accept") {

        if(user_request.groupId == undefined){
            //User accepts friend request

            let notification = await Request.findByIdAndUpdate(request.body.request_id).exec()
            let sender_user = await User.findById(notification.senderId).exec()
            let recipient_user = await User.findById(notification.recipientId).exec()

            //Create a new direct message chat for these users
            let directmessage = new DirectMessage({
                group_members: [sender_user._id.toString(), recipient_user._id.toString()]
            })
        
            //add the user and their direct message chat id to the users account
            sender_user.friends.push({"friend": recipient_user._id, "dm_id": directmessage._id})
            recipient_user.friends.push({"friend": sender_user._id, "dm_id": directmessage._id})

            //Mark notification as resolved so will no longer be displayed
            notification.status = 'resolved'

            //Save all changes and creations to the database
            directmessage.save()
            notification.save()
            sender_user.save()
            recipient_user.save()
    
            response.status(200).send({"message": "User invited to group"})
    
        } else {
            //User accepts group invite
    
            let notification = await Request.findByIdAndUpdate(request.body.request_id).exec()
            let group = await Group.findById(notification.groupId).exec()
            let recipient_user = await User.findById(notification.recipientId).exec()
    
            notification.status = 'resolved'
            group.group_members.push(recipient_user._id.toString())
    
            notification.save()
            group.save()
    
            response.status(200).send({"message": "Friend request send to user"})
    
        }

    } else {

        let notification = await Request.findByIdAndUpdate(request.body.request_id).exec()
        notification.status = 'resolved'
        notification.save()

        response.status(200).send({"message": "Notification Declined"})

    }

}

async function groupmessageNotification(request, response) {

    let group = await Group.findById(request.body.groupId).exec()

    for(let i=0; i<group.group_members.length; i++){
        if(group.group_members[i] != jwt.decode(request.session.token).id){
            let notification = new Request({
                senderId: request.body.groupId,
                recipientId: group.group_members[i],
                type: 'group-message',
                sentOn: new Date(),
                status: 'pending',
                responseRequired: false,
            });
            notification.save()
        }
    }

    response.status(200).send({"message": "Group message notification(s) sent"})

}

async function readgroupmessageNotification(request, response) {

    let user_requests = await Request.find({"senderId": request.body.groupId, "recipientId": jwt.decode(request.session.token).id, "status": "pending", "type": ["group-message"]}).exec()

    for(let i=0; i< user_requests.length; i++){

        user_requests[i].status = "resolved"
        user_requests[i].save()

    }
    response.status(200).send({"message": "Marked unread messages as read!"})

}

async function getUnreadGroupMessages(request, response) {

    let group_requests = await Request.find({"recipientId": jwt.decode(request.session.token).id, "status": "pending", "type": "group-message"}).exec()

    response.status(200).send({"group_requests": group_requests})

}

module.exports.requestResponse = requestResponse;
module.exports.groupmessageNotification = groupmessageNotification;
module.exports.readgroupmessageNotification = readgroupmessageNotification;
module.exports.getUnreadGroupMessages = getUnreadGroupMessages;
