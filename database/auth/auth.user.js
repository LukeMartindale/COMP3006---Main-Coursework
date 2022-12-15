let config = require("../../config/auth.config.js")
let User = require("../user.model").User;

let jwt = require("jsonwebtoken")
let bcrypt = require("bcryptjs");

SignUp = (request, response) => {

    console.log(request.body)
    console.log(request.body.password)

    let user = new User({
        username: request.body.username,
        password: bcrypt.hashSync(request.body.password, 8),
    });

    user.save((error, user) => {
        if(error){
            response.status(500).send({"message": error});
            return;
        }
        response.status(200).send({"message": "User was created!"})
    })

}

LogIn = (request, response) => {

    User.findOne({
        username: request.body.username,
    }).exec((error, user) => {
        if(error){
            response.status(500).send({"message": error})
            return
        };

        if(!user) {
            return response.status(401).send({"message": "User Not Found"});
        };

        let passwordValid = bcrypt.compareSync(request.body.password, user.password)

        if(!passwordValid) {
            return response.status(401).send({"message": "Invalid Password!"});
        };

        let token = jwt.sign({ id: user.id}, config.secret, {
            expiresIn: 86400,
        });

        request.session.token = token;

        response.status(200).send({
            id: user._id,
            username: user.username,
        });

    });
}

LogOut = async (request, response) => {
    try {
        request.session = null;
        return response.status(200).send({"message": "Signed Out!"})
    } catch (error) {
        this.next(error)
    }
}

let auth = {
    SignUp,
    LogIn,
    LogOut,
}

module.exports = auth
