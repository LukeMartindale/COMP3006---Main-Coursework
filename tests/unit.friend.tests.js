process.env.NODE_ENV = "test"

let jwt = require("jsonwebtoken")
let config = require("../config/auth.config")

let friend = require("../database/app/app.friend")

let chai = require("chai");
let chaiHttp = require("chai-http")
chai.use(chaiHttp)
let httpMocks = require("node-mocks-http");

let mongoose = require("mongoose");
let User = require("../database/models/model.user").User;
let Request = require("../database/models/model.request").Request;

let sinon = require('sinon');

suite("Friend Functions Suite", function(){

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

    suiteTeardown(function(done){
        mongoose.connection.close()
        this.server.close()
        setTimeout(function(){
            done()
        }, 500)
    })
    
    teardown(function(done){
        User.deleteMany({}, (error) => {
            done()
        })
    })

    teardown(function(done){
        Request.deleteMany({}, (error) => {
            done()
        })
    })

    test("Test InviteFirend Returns expected result when friend request sent", async function(){

        this.request.session.token = this.token

        this.stub_findById = sinon.stub(User, 'findById').callsFake(function(){return new User({username:"test-username"})})

        await friend.InviteFriend(this.request, this.response, this.next)

        chai.assert.equal(this.response._getStatusCode(), 200, "Status code is incorrect")
        chai.assert.equal(this.response._getData().message, "Friend Request Sent!", "Friend request was not sent!")

        this.stub_findById.restore()

    })

    test("Test CheckFriendExists returns expected result when users are already friends", async function(){

        this.request.session.token = this.token
        this.request.body.recipientId = "recipientId"

        this.stub_findById = sinon.stub(User, 'findById').callsFake(function(){return new User({
            friends: [
                {friend: "recipientId"}
            ]
        })});

        await friend.CheckIfAlreadyFriends(this.request, this.response, this.next)
        chai.assert.equal(this.response._getStatusCode(), 400, "Status code is incorrect")
        chai.assert.equal(this.response._getData().message, "Already Friends", "Not Already Friends!")

        this.stub_findById.restore()

    })

    test("Test CheckFriendExists returns expected result when users are not already friends", async function(){

        this.request.session.token = this.token
        this.request.body.recipientId = "recipientId"

        this.stub_findById = sinon.stub(User, 'findById').callsFake(function(){return new User({
            friends: [
                {friend: "test-user"}
            ]
        })});

        await friend.CheckIfAlreadyFriends(this.request, this.response, this.next)
        chai.assert.equal(this.next.callCount, 1, "Next was not called!")

        this.stub_findById.restore()

    })

    test("test CheckIfAlreadySentFriendRequest returns expected result when friend request has already been sent", async function(){

        this.request.session.token = this.token
        this.request.body.recipientId = "recipientId"

        this.stub_findOne = sinon.stub(Request, 'findOne').callsFake(function(){return new Request({})})

        await friend.CheckIfAlreadySentFriendRequest(this.request, this.response, this.next)
        chai.assert.equal(this.response._getStatusCode(), 400, "Status code is incorrect")
        chai.assert.equal(this.response._getData().message, "Already sent friend request to this user!", "Not Already Sent Friend Request to this user!")

        this.stub_findOne.restore()

    })

    test("Test CheckIfAlreadySentFriendRequest returns expected result when friend request has not already been sent", async function(){

        this.request.session.token = this.token
        this.request.body.recipientId = "recipientId"

        this.stub_findOne = sinon.stub(Request, 'findOne').callsFake(function(){return null})

        await friend.CheckIfAlreadySentFriendRequest(this.request, this.response, this.next)
        chai.assert.equal(this.next.callCount, 1, "Next was not called!")

        this.stub_findOne.restore()

    })

    test("Test CheckNotSendingRequestToSelf returns expected result when not sending friend request to self", async function(){

        this.request.session.token = this.token
        this.request.body.recipientId = "user_id"

        await friend.CheckNotSendingRequestToSelf(this.request, this.response, this.next)

        chai.assert.equal(this.response._getStatusCode(), 400, "Status code is incorrect")
        chai.assert.equal(this.response._getData().message, "You cannot send a friend request to yourself!", "Request was sent to self")

    })

    test("Test CheckNotSendingRequestToSelf returns expected result when not sending friend request to self", async function(){

        this.request.session.token = this.token
        this.request.body.recipientId = "not_user_id"

        await friend.CheckNotSendingRequestToSelf(this.request, this.response, this.next)

        chai.assert.equal(this.next.callCount, 1, "Next was not called!")

    })

    test("Test UnfriendUser returns expected result", async function(){

        this.request.session.token = this.token
        this.request.body.friendId = "friend_id"

        this.user_snub = sinon.stub(User, 'findById').callsFake(function(){return new User({
            friend: []
        })})

        await friend.UnfriendUser(this.request, this.response, this.next)

        chai.assert.equal(this.response._getStatusCode(), 200, "Status code is incorrect")
        chai.assert.equal(this.response._getData().message, "Unfriended User!", "user was not unfriended")

        this.user_snub.restore()

    })

});
