process.env.NODE_ENV = "test"

let jwt = require("jsonwebtoken")
let config = require("../config/auth.config")

let directmessage = require("../database/app/app.direct")

let chai = require("chai");
let chaiHttp = require("chai-http")
chai.use(chaiHttp)
let httpMocks = require("node-mocks-http");

let mongoose = require("mongoose");
let DirectMessage = require("../database/models/model.direct-message").DirectMessage;

let sinon = require('sinon');

suite("Direct SendTextMessage Suite", function(){

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

    test("Test that SendTextmessage returns correct response when sending text message", async function(){

        this.request.session.token = this.token

        this.request.body.type = "text"
        this.request.body.text = "test-text"
        this.request.body.dm_id = "test_dm_id"
        this.request.body.senderUsername = "test-username"

        await directmessage.SendTextMessage(this.request, this.response, this.next)

        chai.assert.equal(this.response._getStatusCode(), 200, "Status code is incorrect")
        chai.assert.equal(this.response._getData().message, "Message was sent!", "Message was not sent!")
    })

    test("Test that SendTextmessage returns correct response when sending image message", async function(){

        this.request.session.token = this.token

        this.request.body.type = "image"
        this.request.body.text = "test-text"
        this.request.body.dm_id = "test_dm_id"
        this.request.body.senderUsername = "test-username"

        await directmessage.SendTextMessage(this.request, this.response, this.next)

        chai.assert.equal(this.response._getStatusCode(), 200, "Status code is incorrect")
        chai.assert.equal(this.response._getData().message, "Message was sent!", "Message was not sent!")
    })

    test("Test that CheckMessageNotEmpty returns expected resulted when message is not empty", async function(){

        this.request.body.text = "test-text"
        
        await directmessage.CheckMessageNotEmpty(this.request, this.response, this.next)
        chai.assert.equal(this.next.callCount, 1, "Next was not called!")

    })

    test("Test that CheckMessageNotEmpty returns expected resulted when message is empty", async function(){

        this.request.body.text = ""
        
        await directmessage.CheckMessageNotEmpty(this.request, this.response, this.next)

        chai.assert.equal(this.response._getStatusCode(), 400, "Status code is incorrect")
        chai.assert.equal(this.response._getData().message, "Cannot send an empty message!", "Message was not empty!")
    })

    test("Test that CheckuserIsInGroup returns expecected result when User is not in group", async function(){

        this.request.session.token = this.token

        this.stub_findById = sinon.stub(DirectMessage, 'findById').callsFake(function(){return new DirectMessage({})})

        await directmessage.CheckUserIsInGroup(this.request, this.response, this.next)
        chai.assert.equal(this.response._getStatusCode(), 400, "Status code is incorrect")
        chai.assert.equal(this.response._getData().message, "User is not in this dm!", "User is in this DM")

        this.stub_findById.restore()
    })

    test("Test that CheckuserIsInGroup returns expecected result when User is in group", async function(){

        this.request.session.token = this.token

        this.stub_findById = sinon.stub(DirectMessage, 'findById').callsFake(function(){return new DirectMessage({
            group_members: ["user_id"]
        })})

        await directmessage.CheckUserIsInGroup(this.request, this.response, this.next)
        chai.assert.equal(this.next.callCount, 1, "Next was not called!")
        
        this.stub_findById.restore()
    })

})
