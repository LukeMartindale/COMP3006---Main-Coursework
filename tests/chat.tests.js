process.env.NODE_ENV = "test"

let chai = require("chai");
let chaiHttp = require("chai-http")
chai.use(chaiHttp)

let sinon = require("sinon");
let verify = require("../database/auth/auth.verify.jwt")

let mongoose = require("mongoose");
let User = require("../database/models/model.user").User;
let Message = require("../database/models/model.message").Message;

suite("Chat Group Suite", function(){

    suiteSetup(function(done){
        this.sandbox = sinon.createSandbox()
        this.sandbox.stub(verify, 'verifyToken').callsFake((request, response, next) => next())
        this.server = require("../server/server"); 

        setTimeout(function(){
            done()
        }, 500)
    })

    suiteSetup(function(done){

        //create credentials for an existing user on the system
        this.existing_user = {
            "username": "test-user",
            "password": "test-password",
        }

        this.existing_user_2 = {
            "username": "test-user-2",
            "password": "test-password-2",
        }


        //create credentials for a new user to the system
        this.new_user = {
            "username": "new-user",
            "password": "new-password",
        }

        this.new_message = {
            "text": "new-message",
            "groupId": "test-id",
            "senderId": String,
            "senderUsername": "test-user",
            "type": "group-message",
        }

        //Connect to test database
        let url = `mongodb+srv://TheMartindale:dxWrO4fnEic4ay8A@cluster0.rh5pgvb.mongodb.net/slanttestdb?retryWrites=true&w=majority`;
        mongoose.connect(url)
        .then(function(){
            done()
        })

    })

    suiteTeardown(function(done){
        mongoose.connection.close()
        this.server.close()
        this.sandbox.restore()

        setTimeout(function(){
            done()
        }, 500)

    })

    setup(function(done){
        chai.request(this.server).post("/auth/signup/").send(this.existing_user).end(function(error, response){
            done()
        })
    })

    setup(function(done){
        chai.request(this.server).post("/auth/signup/").send(this.existing_user_2).end(function(error, response){
            done()
        })
    })

    teardown(function(done){
        User.deleteMany({}, (error) => {
            done()
        })
    })

    test("Test user is able to login", function(done){
        chai.request(this.server).post("/auth/login/").send(this.existing_user).end(function(error, response) {
            chai.assert.equal(response.status, 200, "Status Code Is not correct!")
            chai.assert.equal(JSON.parse(response.text).username, "test-user", "username is not correct!")
            done()
        })
    });

    test("Test user can send a message to group", function(done){
        done()
    })

});
