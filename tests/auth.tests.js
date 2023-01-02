process.env.NODE_ENV = "test"

let chai = require("chai");
let chaiHttp = require("chai-http")
chai.use(chaiHttp)

let mongoose = require("mongoose");
let User = require("../database/models/model.user").User;

let server = require("../server/server");

suite("Auth Signup Suite", function(){

    suiteSetup(function(done){

        //create credentials for an existing user on the system
        this.existing_user = {
            "username": "test-user",
            "password": "test-password",
        }

        //create credentials for a new user to the system
        this.new_user = {
            "username": "new-user",
            "password": "new-password",
        }

        //Connect to test database
        let url = `mongodb+srv://TheMartindale:dxWrO4fnEic4ay8A@cluster0.rh5pgvb.mongodb.net/slanttestdb?retryWrites=true&w=majority`;
        mongoose.connect(url)
        .then(function(){
            done()
        })

    })

    suiteTeardown(function(){
        mongoose.connection.close()
    })

    setup(function(done){
        chai.request(server).post("/auth/signup/").send(this.existing_user).end(function(error, response){
            done()
        })
    })

    teardown(function(done){
        User.deleteMany({}, (error) => {
            done()
        })
    })

    test("Test user can signup", function(done){
        chai.request(server).post("/auth/signup/").send(this.new_user).end(function(error, response){
            chai.assert.equal(response.status, 200, "Status Code Is not correct!")
            done()
        })
    });

    test("Test cannot signup with a username which already exists", function(done){
        chai.request(server).post("/auth/signup/").send(this.existing_user).end(function(error, response){
            chai.assert.equal(response.status, 400, "Status Code Is not correct!")
            chai.assert.equal(JSON.parse(response.text).message, "Username already exists!", "Incorrect Message")
            done()
        })
    })

    test("Test cannot signup with an empty username", function(done){
        let temp_user = {"username": "", "password": "new_password"}
        chai.request(server).post("/auth/signup/").send(temp_user).end(function(error, response){
            chai.assert.equal(response.status, 400, "Status Code Is not correct!")
            chai.assert.equal(JSON.parse(response.text).message, "Username cannot be empty!", "Incorrect Message")
            done()
        })
    })

    test("Test cannot signup with an empty password", function(done){
        let temp_user = {"username": "new_user", "password": ""}
        chai.request(server).post("/auth/signup/").send(temp_user).end(function(error, response){
            chai.assert.equal(response.status, 400, "Status Code Is not correct!")
            chai.assert.equal(JSON.parse(response.text).message, "Password cannot be empty!", "Incorrect Message")
            done()
        })
    })

});

suite("Auth Login Suite", function(){

    suiteSetup(function(done){

        //create credentials for an existing user on the system
        this.existing_user = {
            "username": "existing_user",
            "password": "test_password",
        }

        //create credentials for a new user to the system
        this.new_user = {
            "username": "new_user",
            "password": "new_password",
        }

        //Connect to test database
        let url = `mongodb+srv://TheMartindale:dxWrO4fnEic4ay8A@cluster0.rh5pgvb.mongodb.net/slanttestdb?retryWrites=true&w=majority`;
        mongoose.connect(url)
        .then(function(){
            done()
        })

    })

    suiteTeardown(function(){
        mongoose.connection.close()
    })

    setup(function(done){
        chai.request(server).post("/auth/signup/").send(this.existing_user).end(function(error, response){
            done()
        })
    })

    teardown(function(done){
        User.deleteMany({}, (error) => {
            done()
        })
    })

    test("Test user is able to login", function(done){
        chai.request(server).post("/auth/login/").send(this.existing_user).end(function(error, response) {
            chai.assert.equal(response.status, 200, "Status Code Is not correct!")
            chai.assert.equal(JSON.parse(response.text).username, "existing_user", "username is not correct!")
            done()
        })
    });

    test("Test user cannot login with an invalid user", function(done){
        let temp_user = {"username": "invalid_user", "password": "existing_user_password"}
        chai.request(server).post("/auth/login/").send(temp_user).end(function(error, response) {
            chai.assert.equal(response.status, 401, "Status Code Is not correct!")
            chai.assert.equal(JSON.parse(response.text).message, "User Not Found", "User is not invalid")
            done()
        })
    });

    test("Test user cannot login with an invalid password", function(done){
        let temp_user = {"username": "existing_user", "password": "invalid_password"}
        chai.request(server).post("/auth/login/").send(temp_user).end(function(error, response) {
            chai.assert.equal(response.status, 401, "Status Code Is not correct!")
            chai.assert.equal(JSON.parse(response.text).message, "Invalid Password!", "Password is not invalid")
            done()
        })
    });

});

server.close()
