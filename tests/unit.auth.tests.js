process.env.NODE_ENV = "test"

let verifyToken = require("../database/auth/auth.verify.jwt").verifyToken;
let verifySignup = require("../database/auth/auth.verify.signup");

let chai = require("chai");
let chaiHttp = require("chai-http")
chai.use(chaiHttp)

let httpMocks = require("node-mocks-http");

let sinon = require('sinon');

suite("Auth VerifyToken function Suite", function(){

    setup(function(done){
        this.request = httpMocks.createRequest({"session": {"token": ""}})
        this.response = httpMocks.createResponse()
        this.next = sinon.spy()
        this.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOWIyNmQyYTU1Mzk0M2FiZmIxZmE3ZSIsImlhdCI6MTY3MzA0NTc4MCwiZXhwIjoxNjczMTMyMTgwfQ.NNij7BA51_TgctZ4ycLornOy_aA0NZjN73s5X8QIBeY"
        done()
    });

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

    setup(function(done){
        this.request = httpMocks.createRequest({"body": {"username": "", "password": ""}})
        this.response = httpMocks.createResponse()
        this.next = sinon.spy()
        done()
    });

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
