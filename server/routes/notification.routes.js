let jwt = require("jsonwebtoken")

let Request = require("../../database/models/model.request").Request;
let User = require("../../database/models/model.user").User;

async function requestResponse(request, response){
    
    let notification = await Request.findByIdAndUpdate(request.body.request_id).exec()
    let sender_user = await User.findById(notification.senderId).exec()
    let recipient_user = await User.findById(notification.recipientId).exec()

    notification.status = 'resolved'
    sender_user.friends.push(recipient_user._id)
    recipient_user.friends.push(sender_user._id)

    notification.save()
    sender_user.save()
    recipient_user.save()

}

module.exports.requestResponse = requestResponse;
