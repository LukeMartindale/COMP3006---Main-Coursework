let config = require("../../config/auth.config.js")
let User = require("../user.model").User;
let jwt = require("jsonwebtoken")

verifyToken = (request, response, next) => {
    let token = request.session.token;

    if(!token) {
        return response.status(403).send({"message": "No token!"});
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
