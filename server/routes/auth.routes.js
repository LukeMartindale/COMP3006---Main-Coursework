async function signupPage(request, response){

    response.render("auth/signup")

}

async function loginPage(request, response) {

    response.render("auth/login")

}

exports.LoggedIn = (request, response) => {

    response.render("auth/loggedin")
    
}

module.exports.signupPage = signupPage;
module.exports.loginPage = loginPage;
