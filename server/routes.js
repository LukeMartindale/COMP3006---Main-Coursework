async function homePage(request, response) {
    response.render("home_page", {"id": request.params.id})
}

module.exports.homePage = homePage;
