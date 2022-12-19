let database = require("../../database/database")
let jwt = require("jsonwebtoken")

let User = require("../../database/models/model.user").User;

async function homePage(request, response) {

    let user_id = jwt.decode(request.session.token).id
    
    user = await User.findById(user_id).exec()

    response.render("home-page", {"id": user_id, "username": user.username})

}

async function homePageTest(request, response) {
    
    let users = await database.getTest();

    response.render("home_page_test", {"id": request.params.id, "users": users})
}

module.exports.homePage = homePage;
module.exports.homePageTest = homePageTest;

