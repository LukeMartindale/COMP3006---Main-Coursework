let jwt = require("jsonwebtoken")

let User = require("../../database/models/model.user").User;

async function addfriendPage(request, response) {

    response.render("app/friends-invite-page")

}

module.exports.addfriendPage = addfriendPage
