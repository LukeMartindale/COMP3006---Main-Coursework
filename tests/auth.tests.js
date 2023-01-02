process.env.NODE_ENV = "test"

let chai = require("chai");
let chaiHttp = require("chai-http")
chai.use(chaiHttp)

let mongoose = require("mongoose");
let User = require("../database/models/model.user").User;

let server = require("../server/server");

suite("Auth Signup", function(){

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
        let temp = new User(this.existing_user)
        temp.save(() => {
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

});

server.close()
