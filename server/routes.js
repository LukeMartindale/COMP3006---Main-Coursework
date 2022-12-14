let database = require("../database/database")

async function homePage(request, response) {
    let users = await database.getTest();
    response.render("home_page", {"id": request.params.id, "users": users})
}

async function loginPage(request, response) {
    response.render("login")
}

module.exports.homePage = homePage;
module.exports.loginPage = loginPage;
