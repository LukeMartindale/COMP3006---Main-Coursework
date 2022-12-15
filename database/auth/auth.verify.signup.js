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

let verifySignUp = {
    CheckIfUsernameExists
}

module.exports = verifySignUp;
