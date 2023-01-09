process.env.NODE_ENV = "test"

let jwt = require("jsonwebtoken")
let config = require("../config/auth.config")

let group = require("../database/app/app.group")

let chai = require("chai");
let chaiHttp = require("chai-http")
chai.use(chaiHttp)
let httpMocks = require("node-mocks-http");

let mongoose = require("mongoose");
let Group = require("../database/models/model.group").Group;
let User = require("../database/models/model.user").User;
let Message = require("../database/models/model.message").Message;
let Request = require("../database/models/model.request").Request;


let sinon = require('sinon');

suite("Group Functionality Suite", function(){

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
        Group.deleteMany({}, (error) => {
            done()
        })
    })

    teardown(function(done){
        Message.deleteMany({}, (error) => {
            done()
        })
    })

    teardown(function(done){
        Request.deleteMany({}, (error) => {
            done()
        })
    })

    test("Test that create group function works", async function(){

        this.request.session.token = this.token
        this.request.body.group_name = "test_group"

        await group.CreateGroup(this.request, this.response, this.next)
        chai.assert.equal(this.response._getStatusCode(), 200, "Status Code is not correct")
        chai.assert.equal(this.response._getData().message, "Group was created!", "Group was not created!")

    })

    test("Test that SendTextmessage returns correct response when sending text message", async function(){

        this.request.session.token = this.token

        this.request.body.type = "text"
        this.request.body.text = "test-text"
        this.request.body.dm_id = "test_dm_id"
        this.request.body.senderUsername = "test-username"

        await group.SendTextMessage(this.request, this.response, this.next)

        chai.assert.equal(this.response._getStatusCode(), 200, "Status code is incorrect")
        chai.assert.equal(this.response._getData().message, "Message was sent!", "Message was not sent!")
    })

    test("Test that SendTextmessage returns correct response when sending image message", async function(){

        this.request.session.token = this.token

        this.request.body.type = "image"
        this.request.body.text = "test-text"
        this.request.body.dm_id = "test_dm_id"
        this.request.body.senderUsername = "test-username"

        await group.SendTextMessage(this.request, this.response, this.next)

        chai.assert.equal(this.response._getStatusCode(), 200, "Status code is incorrect")
        chai.assert.equal(this.response._getData().message, "Message was sent!", "Message was not sent!")
    })

    test("Test that Invite Friend to group returns correct response when Inviting friend to group", async function(){

        this.request.session.token = this.token

        this.request.body.recipientId = "63bc962501a5ec246c6683d1"
        this.request.body.groupId = "63bc962501a5ec246c6683d1"

        this.stub_findById = sinon.stub(User, 'findById').callsFake(function(){return new User({
            username: "test-username"
        })})

        await group.InviteFriendToGroup(this.request, this.response, this.next)

        chai.assert.equal(this.response._getStatusCode(), 200, "Status code is incorrect")
        chai.assert.equal(this.response._getData().message, "Group Invite Sent!", "Group invite was not sent")

        this.stub_findById.restore()
    });

    test("Test that LeaveGroup function works and returns correct response code when successfully leaving group", async function(){

        this.request.session.token = this.token
        this.request.body.groupId = "63bc962501a5ec246c6683d1"

        this.stub_findById = sinon.stub(Group, 'findById').callsFake(function(){return new Group({
            group_members: ["63bc962501a5ec246c6683d1"]
        })})

        await group.LeaveGroup(this.request, this.response, this.next)

        chai.assert.equal(this.response._getStatusCode(), 200, "Status code is incorrect")
        chai.assert.equal(this.response._getData().message, "Group left!", "group was not left")

        this.stub_findById.restore()
    })

    test("Test that DeleteGroup function works and returns correct response code when successfully deleting group", async function(){

        this.request.session.token = this.token
        this.request.body.groupId = "63bc962501a5ec246c6683d1"

        this.stub_findById = sinon.stub(Group, 'findByIdAndDelete').callsFake(function(){return true})

        await group.DeleteGroup(this.request, this.response, this.next)

        chai.assert.equal(this.response._getStatusCode(), 200, "Status code is incorrect")
        chai.assert.equal(this.response._getData().message, "Group deleted!", "group was not deleted")
        
        this.stub_findById.restore()
    })

    test("Test that CheckuserIsInGroup returns expecected result when User is not in group", async function(){

        this.request.session.token = this.token

        this.stub_findById = sinon.stub(Group, 'findById').callsFake(function(){return new Group({})})

        await group.CheckUserIsInGroup(this.request, this.response, this.next)
        chai.assert.equal(this.response._getStatusCode(), 400, "Status code is incorrect")
        chai.assert.equal(this.response._getData().message, "User is not in this group!", "User is in this group")

        this.stub_findById.restore()
    })

    test("Test that CheckuserIsInGroup returns expecected result when User is in group", async function(){

        this.request.session.token = this.token

        this.stub_findById = sinon.stub(Group, 'findById').callsFake(function(){return new Group({
            group_members: ["user_id"]
        })})

        await group.CheckUserIsInGroup(this.request, this.response, this.next)
        chai.assert.equal(this.next.callCount, 1, "Next was not called!")
        
        this.stub_findById.restore()
    })

    test("Test that CheckifAlreadyInGroup returns expected result when user is not already in group", async function(){

        this.request.session.token = this.token

        this.stub_findById = sinon.stub(Group, 'findById').callsFake(function(){return new Group({
            group_members: ["63bc962501a5ec246c6683d1"]
        })})

        await group.CheckIfAlreadyInGroup(this.request, this.response, this.next)
        chai.assert.equal(this.next.callCount, 1, "Next was not called!")

        this.stub_findById.restore()

    })

    test("Test that CheckifAlreadyInGroup returns expected result when user is already in group", async function(){

        this.request.session.token = this.token

        this.stub_findById = sinon.stub(Group, 'findById').callsFake(function(){return new Group({
            group_members: [jwt.decode(this.token)]
        })})

        await group.CheckIfAlreadyInGroup(this.request, this.response, this.next)
        chai.assert.equal(this.response._getStatusCode(), 400, "Status code is incorrect")
        chai.assert.equal(this.response._getData().message, "User is already in group!", "User is not already in this group")

        this.stub_findById.restore()

    })

    test("Test that CheckGroupNameNotEmpty returns expected result when group name is not empty", async function(){
        this.request.body.group_name = "not_empty"

        await group.CheckGroupNameNotEmpty(this.request, this.response, this.next)
        chai.assert.equal(this.next.callCount, 1, "Next was not called!")
    })

    test("Test that CheckGroupNameNotEmpty returns expected result when group name is empty", async function(){
        this.request.body.group_name = ""

        await group.CheckGroupNameNotEmpty(this.request, this.response, this.next)

        chai.assert.equal(this.response._getStatusCode(), 400, "Status code is incorrect")
        chai.assert.equal(this.response._getData().message, "Group name cannot be empty!", "Group name was not empty")
    })

    test("Test that CheckMessageNotEmpty returns correct result when message is not empty", async function(){

        this.request.body.text = "not_empty"

        await group.CheckMessageNotEmpty(this.request, this.response, this.next)

        chai.assert.equal(this.next.callCount, 1, "Next was not called!")
        // chai.assert.equal(this.response._getStatusCode(), 400, "Status code is incorrect")
        // chai.assert.equal(this.response._getData().message, "Cannot send an empty message!", "Message was not empty")
    });

    test("Test that CheckMessageNotEmpty returns correct result when message is not empty", async function(){

        this.request.body.text = ""

        await group.CheckMessageNotEmpty(this.request, this.response, this.next)
        chai.assert.equal(this.response._getStatusCode(), 400, "Status code is incorrect")
        chai.assert.equal(this.response._getData().message, "Cannot send an empty message!", "Message was not empty")
    });

    test("Test that CheckNotAlreadyInvited returns correct result when user is not already invited", async function(){

        this.stub_findOne = sinon.stub(Request, 'findOne').callsFake(function(){return null})

        await group.CheckNotAlreadyInvited(this.request, this.response, this.next)
        chai.assert.equal(this.next.callCount, 1, "Next was not called!")

        this.stub_findOne.restore()
    })

    test("Test that CheckNotAlreadyInvited returns correct result when user is already invited", async function(){

        this.stub_findOne = sinon.stub(Request, 'findOne').callsFake(function(){return new Request({
            group_members: [jwt.decode(this.token)]
        })})

        await group.CheckNotAlreadyInvited(this.request, this.response, this.next)
        chai.assert.equal(this.response._getStatusCode(), 400, "Status code is incorrect")
        chai.assert.equal(this.response._getData().message, "User has already been invited!", "User has not already been invited")

        this.stub_findOne.restore()
    })

    test("Test that CheckifGroupAdmin returns correct result if user is admin", async function(){

        this.request.session.token = this.token

        this.stub_findById = sinon.stub(Group, 'findById').callsFake(function(){return new Group({
            group_admin: "user_id"
        })})

        await group.CheckIsGroupAdmin(this.request, this.response, this.next)
        chai.assert.equal(this.next.callCount, 1, "Next was not called!")

        this.stub_findById.restore()
    })

    test("Test that CheckifGroupAdmin returns correct result if user is not admin", async function(){

        this.request.session.token = this.token

        this.stub_findById = sinon.stub(Group, 'findById').callsFake(function(){return new Group({
            group_admin: "not_user_id"
        })})

        await group.CheckIsGroupAdmin(this.request, this.response, this.next)
        chai.assert.equal(this.response._getStatusCode(), 400, "Status code is incorrect")
        chai.assert.equal(this.response._getData().message, "User is not the group admin!", "User is the group admin")

        this.stub_findById.restore()
    })

});
