let jwt = require("jsonwebtoken")
let config = require("../../config/auth.config.js")

let User = require("../../database/models/model.user").User;
let Group = require("../../database/models/model.group").Group;
let Requests = require("../../database/models/model.request").Request;

// App Routes
async function groupsPage(request, response) {

    let user_id = jwt.decode(request.session.token).id

    groups = await Group.find({ "group_members": { "$in": [user_id]}})

    response.render("app/groups-page", {"id": user_id, "groups": groups})

}

async function friendsPage(request, response) {

    let user = await User.findById(jwt.decode(request.session.token).id).select(['-password']).exec();
    let friends = await User.find({"friends.friend": {"$in": [user._id]}}).select(['-password', '-__v']);

    response.render("app/friends-page", {"id": jwt.decode(request.session.token).id, "friends": friends, "user": user})

}

async function notificationsPage(request, response) {

    let user_id = jwt.decode(request.session.token).id

    notifications = await Requests.find({"recipientId": user_id, "status": "pending", "type": ["friend-request", "group-invite"]}).exec()

    response.render("app/notifications-page", {"id": jwt.decode(request.session.token).id, "notifications": notifications})

}

async function accountPage(request, response) {

    let user = await User.findById(jwt.decode(request.session.token).id).select(["-password"])

    response.render("app/account-page", {"user": user, "user_id": user._id})

}

// Create, Add & Update Routes
async function creategroupPage(request, response) {

    let user_id = jwt.decode(request.session.token).id

    response.render("app/groups-create-page", {"user_id": user_id})

}

//home page
async function homePage(request, response) {
    let token = request.session.token;

    if(!token) {
        return response.status(200).redirect("/auth/login/")
    }

    jwt.verify(token, config.secret, (error, decoded) => {
        if(error){
            return response.status(401).send({"message": "Not Authorised!"})
        }
        request.userId = decoded.id;
        return response.status(200).redirect("/app/groups/")
    });
}

module.exports.groupsPage = groupsPage;
module.exports.friendsPage = friendsPage;
module.exports.notificationsPage = notificationsPage;
module.exports.accountPage = accountPage;

module.exports.creategroupPage = creategroupPage;

module.exports.homePage = homePage;
