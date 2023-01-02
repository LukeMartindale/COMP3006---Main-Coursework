let User = require("../database/models/model.user").User;

let mongoose = require("mongoose");

function emptyTestDatabase(){

    //empty test database
    User.deleteMany({}, (error) => {
        if(error){
            console.log(error)
        }
    })

}

let test_helpers = {
    emptyTestDatabase,
}

module.exports = test_helpers
