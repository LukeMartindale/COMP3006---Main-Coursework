process.env.NODE_ENV = "test"

let jwt = require("jsonwebtoken")
let config = require("../config/auth.config")

let verifyToken = require("../database/auth/auth.verify.jwt").verifyToken;
let verifySignup = require("../database/auth/auth.verify.signup");

let chai = require("chai");
let chaiHttp = require("chai-http")
chai.use(chaiHttp)
let httpMocks = require("node-mocks-http");

let mongoose = require("mongoose");

let sinon = require('sinon');

suite("Auth VerifyToken function Suite", function(){

    setup(function(done){
        this.request = httpMocks.createRequest({"session": {"token": ""}})
        this.response = httpMocks.createResponse()
        this.next = sinon.spy()
        done()
    });

    setup(function(done){
        this.token = jwt.sign({id: "user_id"}, config.secret, {
            expiresIn: 86000,
        })
        done()
    })

    test("Test verify token works with valid token", function(done){
        this.request.session.token = this.token
        verifyToken(this.request, this.response, this.next)
        chai.assert.equal(this.next.callCount, 1, "Next was not called!")
        done()
    });

    test("Test verify token returns 401/Not Authorised when invalid token is sent", function(done){
        this.request.session.token = "test-token"
        verifyToken(this.request, this.response, this.next)
        chai.assert.equal(this.response._getStatusCode(), 401, "Status code is incorrect")
        chai.assert.equal(this.response._getData().message, "Not Authorised!", "Response Message is incorrect")
        done()
    });

    test("Test verify token returns 302 When token is not present", function(done){
        verifyToken(this.request, this.response, this.next)
        chai.assert.equal(this.response._getStatusCode(), 302, "Status code is incorrect")
        done()
    })

});

suite("Auth Verify Signup functions Suite", function(){

    suiteSetup(function(done){
        this.server = require("../server/server").server;

        setTimeout(function(){
            done()
        }, 500)

    })

    suiteSetup(function(done){
        //Connect to test database
        let url = `mongodb+srv://TheMartindale:dxWrO4fnEic4ay8A@cluster0.rh5pgvb.mongodb.net/slanttestdb?retryWrites=true&w=majority`;
        mongoose.connect(url)
        .then(function(){
            done()
        })
    })

    suiteSetup(function(done){
        this.existing_user = {
            "username": "test-user",
            "password": "test-password",
        }
        done()
    })

    setup(function(done){
        this.request = httpMocks.createRequest({"body": {"username": "", "password": ""}})
        this.response = httpMocks.createResponse()
        this.next = sinon.spy()
        done()
    });

    setup(function(done){
        chai.request(this.server).post("/auth/signup/").send(this.existing_user).end(function(error, response){
            done()
        })
    })

    suiteTeardown(function(done){
        mongoose.connection.close()
        this.server.close()
        setTimeout(function(){
            done()
        }, 500)
    })

    test("test CheckIfUsernameExists returns correct value when username does not already exists", async function(){
        this.request.body.username = "test-username"
        await verifySignup.CheckIfUsernameExists(this.request, this.response, this.next)
        chai.assert.equal(this.next.callCount, 1, "Next was not called!")
    })

    
    test("test CheckIfUsernameExists returns correct value when username already exists", async function(){
        this.request.body.username = this.existing_user.username
        await verifySignup.CheckIfUsernameExists(this.request, this.response, this.next)
        chai.assert.equal(this.response._getStatusCode(), 400, "Status code is incorrect")
        chai.assert.equal(this.response._getData().message, "Username already exists!", "Response Message is incorrect")
    })

    test("Test CheckUsernameNotEmpty return correct results when username is empty", function(done){
        verifySignup.CheckUsernameNotEmpty(this.request, this.response, this.next)
        chai.assert.equal(this.response._getStatusCode(), 400, "Status code is incorrect")
        chai.assert.equal(this.response._getData().message, "Username cannot be empty!", "Response Message is incorrect")
        done()
    })

    test("Test CheckUsernameNotEmpty passes when username is not empty", function(done){
        this.request.body.username = "test-username"
        verifySignup.CheckUsernameNotEmpty(this.request, this.response, this.next)
        chai.assert.equal(this.next.callCount, 1, "Next was not called!")
        done()
    })

    test("Test CheckPasswordNotEmpty return correct results when password is empty", function(done){
        verifySignup.CheckPasswordNotEmpty(this.request, this.response, this.next)
        chai.assert.equal(this.response._getStatusCode(), 400, "Status code is incorrect")
        chai.assert.equal(this.response._getData().message, "Password cannot be empty!", "Response Message is incorrect")
        done()
    })


    test("Test CheckPasswordNotEmpty passes when password is not empty", function(done){
        this.request.body.password = "test-password"
        verifySignup.CheckPasswordNotEmpty(this.request, this.response, this.next)
        chai.assert.equal(this.next.callCount, 1, "Next was not called!")
        done()
    })

});
