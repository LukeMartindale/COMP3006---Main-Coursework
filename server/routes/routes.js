let database = require("../../database/database")

async function homePage(request, response) {

    response.render("home-page")

}

async function homePageTest(request, response) {
    
    let users = await database.getTest();

    response.render("home_page_test", {"id": request.params.id, "users": users})
}

module.exports.homePage = homePage;
module.exports.homePageTest = homePageTest;

