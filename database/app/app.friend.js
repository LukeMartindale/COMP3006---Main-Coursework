let jwt = require("jsonwebtoken")
let mongoose = require("mongoose");

let User = require("../models/model.user").User;
let Request = require("../models/model.request").Request;


InviteFriend = async (request, response) => {

    let user_id = jwt.decode(request.session.token).id

    let user = await User.findById(user_id)

    user_request = new Request({
        senderId: jwt.decode(request.session.token).id,
        senderUsername: user.username,
        recipientId: mongoose.Types.ObjectId(request.body.recipientId),
        type: 'friend-request',
        sentOn: new Date(),
        status: 'pending',
        responseRequired: true,
    })

    await user_request.save()

    response.status(200).send({"message": "Friend Request Sent!"})

};

CheckFriendExists = async (request, response, next) => {

    let recipientId = request.body.recipientId

    if(mongoose.Types.ObjectId.isValid(recipientId)){
        let user = await User.findById(mongoose.Types.ObjectId(recipientId)).exec();

        if(!user){
            console.log("Not User")
        }
        next();
    } else {
        response.status(500).send({"message": "Invalid User ID!"})
    }

};

CheckIfAlreadyFriends = async (request, response, next) => {

    let user_id = jwt.decode(request.session.token).id
    let recipientId = request.body.recipientId

    let user = await User.findById(user_id)

    for(let i=0; i< user.friends.length; i++){
        if(user.friends[i].friend == recipientId){
            response.status(400).send({"message":"Already Friends"})
            return;
        }
    }
    next()
}

CheckIfAlreadySentFriendRequest = async (request, response, next) => {

    let user_id = jwt.decode(request.session.token).id
    let recipientId = request.body.recipientId

    let user_request = await Request.findOne({"senderId": user_id, "recipientId": recipientId, "status": "pending"})

    if(user_request) {
        response.status(400).send({"message":"Already sent friend request to this user!"})
    } else {
        next()
    }

}

CheckNotSendingRequestToSelf = async (request, response, next) => {

    if(jwt.decode(request.session.token).id == request.body.recipientId){
        response.status(400).send({"message":"You cannot send a friend request to yourself!"})
    } else {
        next()
    }

}

UnfriendUser = async (request, response) => {

    let user = await User.findById(jwt.decode(request.session.token).id)
    let friend = await User.findById(request.body.friendId)

    user.friends = user.friends.filter(e => e.friend != request.body.friendId)
    friend.friends = friend.friends.filter(e => e.friend != jwt.decode(request.session.token).id)

    user.save()
    friend.save()

    response.status(200).send({"message": "Unfriended User!"})

}

let friend = {
    InviteFriend,
    CheckFriendExists,
    CheckIfAlreadyFriends,
    CheckIfAlreadySentFriendRequest,
    CheckNotSendingRequestToSelf,
    UnfriendUser,
}

module.exports = friend
