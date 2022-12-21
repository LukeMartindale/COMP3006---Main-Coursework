let jwt = require("jsonwebtoken")
let mongoose = require("mongoose");

let User = require("../models/model.user").User;
let Request = require("../models/model.request").Request;


InviteFriend = (request, response) => {

    user_request = new Request({
        senderId: jwt.decode(request.session.token).id,
        recipientId: mongoose.Types.ObjectId(request.body.recipientId),
        type: 'friend-request',
        sentOn: new Date(),
        status: 'Pending'
    })

    user_request.save((error, message) => {
        if(error){
            response.status(500).send({"message": error})
            return;
        }
        response.status(200).send({"message": "Friend Request Sent!"})
    });

};

CheckFriendExists = async (request, response, next) => {

    let recipientId = request.body.recipientId

    if(mongoose.Types.ObjectId.isValid(recipientId)){
        console.log("Valid")
        let user = await User.findById(mongoose.Types.ObjectId(recipientId)).exec();

        if(!user){
            console.log("Not User")
        }
        next();
    } else {
        console.log("Not Valid")
    }

};

let friend = {
    InviteFriend,
    CheckFriendExists,
}

module.exports = friend
