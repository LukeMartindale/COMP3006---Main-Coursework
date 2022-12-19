let database = require("../../database/database")
let jwt = require("jsonwebtoken")

let User = require("../../database/models/model.user").User;

// App Routes
async function groupsPage(request, response) {

    let user_id = jwt.decode(request.session.token).id
    
    user = await User.findById(user_id).exec()

    response.render("app/groups-page", {"id": user_id, "username": user.username})

}

async function friendsPage(request, response) {

    response.render("app/friends-page")

}

async function notificationsPage(request, response) {

    response.render("app/notifications-page")

}

// Create, Add & Update Routes
async function creategroupPage(request, response) {

    response.render("app/create-group-page")

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

module.exports.creategroupPage = creategroupPage;

module.exports.homePage = homePage;
module.exports.homePageTest = homePageTest;

