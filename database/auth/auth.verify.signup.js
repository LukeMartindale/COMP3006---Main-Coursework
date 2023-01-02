const { response } = require("express");

let User = require("../models/model.user").User;

CheckIfUsernameExists = (request, response, next) => {

    User.findOne({"username": request.body.username}).exec((error, user) => {

        if(error) {
            response.status(500).send({"message": error});
            return;
        };

        if(user) {
            response.status(400).send({"message": "Username already exists!"})
            return;
        };

        next();

    });

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
