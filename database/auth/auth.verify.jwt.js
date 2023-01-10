let config = require("../../config/auth.config.js")
let User = require("../models/model.user").User;
let jwt = require("jsonwebtoken")

verifyToken = (request, response, next) => {
    let token = request.session.token;

    if(process.env.NODE_ENV == undefined){
        url_prefix = "http://localhost:9000"
    }

    if(process.env.NODE_ENV == "test"){
        url_prefix = "http://localhost:9000"
    }

    if(!token) {
        return response.status(403).redirect(url_prefix + "/auth/login");
    };

    jwt.verify(token, config.secret, (error, decoded) => {
        if(error){
            return response.status(401).send({"message": "Not Authorised!"})
        }
        request.userId = decoded.id;
        next();
    });

}

let verifyJWT = {
    verifyToken
}

module.exports = verifyJWT;
