let User = require("../models/model.user").User;

CheckIfUsernameExists = async (request, response, next) => {

    let user = await User.findOne({"username": request.body.username})

    if(user) {
        response.status(400).send({"message": "Username already exists!"})
        return;
    };

    next();

}

CheckUsernameNotEmpty = (request, response, next) => {

    if(request.body.username == ""){
        response.status(400).send({"message": "Username cannot be empty!"})
        return;
    }
    
    next()
}

CheckPasswordNotEmpty = (request, response, next) => {

    if(request.body.password == ""){
        response.status(400).send({"message": "Password cannot be empty!"})
        return;
    }
    
    next()
}

let verifySignUp = {
    CheckIfUsernameExists,
    CheckUsernameNotEmpty,
    CheckPasswordNotEmpty,
}

module.exports = verifySignUp;
