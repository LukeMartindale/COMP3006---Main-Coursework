let database = require("../../database/database")
let jwt = require("jsonwebtoken")

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

    let friends = await User.find({"friends": {"$in": [user._id]}}).select(['-password', '-friends', '-__v']);

    response.render("app/friends-page", {"id": jwt.decode(request.session.token).id, "friends": friends})

}

async function notificationsPage(request, response) {

    let user_id = jwt.decode(request.session.token).id

    notifications = await Requests.find({"recipientId": user_id, "status": "pending"}).exec()

    response.render("app/notifications-page", {"id": jwt.decode(request.session.token).id, "notifications": notifications})

}

async function accountPage(request, response) {

    let user = await User.findById(jwt.decode(request.session.token).id).select(["-password"])

    response.render("app/account-page", {"user": user})

}

// Create, Add & Update Routes
async function creategroupPage(request, response) {

    response.render("app/groups-create-page")

}

async function homePage(request, response) {

    let user_id = jwt.decode(request.session.token).id
    
    user = await User.findById(user_id).exec()

    response.render("home-page", {"id": user_id, "username": user.username})

}

async function homePageTest(request, response) {
    
    let users = await database.getTest();

    response.render("home_page_test", {"id": request.params.id, "users": users})
}

module.exports.groupsPage = groupsPage;
module.exports.friendsPage = friendsPage;
module.exports.notificationsPage = notificationsPage;
module.exports.accountPage = accountPage;

module.exports.creategroupPage = creategroupPage;

module.exports.homePage = homePage;
module.exports.homePageTest = homePageTest;

