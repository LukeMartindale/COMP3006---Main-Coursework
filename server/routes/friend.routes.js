let jwt = require("jsonwebtoken")

let User = require("../../database/models/model.user").User;

async function addfriendPage(request, response) {

    let user_id = jwt.decode(request.session.token).id

    let user = await User.findById(user_id)

    response.render("app/friends-invite-page", {"user_id": user._id})

}

module.exports.addfriendPage = addfriendPage
