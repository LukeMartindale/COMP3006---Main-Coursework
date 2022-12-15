let database = require("../../database/database")

async function homePageTest(request, response) {
    
    let users = await database.getTest();

    response.render("home_page_test", {"id": request.params.id, "users": users})
}


module.exports.homePageTest = homePageTest;

