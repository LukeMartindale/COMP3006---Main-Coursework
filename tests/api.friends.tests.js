process.env.NODE_ENV = "test"

let chai = require("chai");
let chaiHttp = require("chai-http")
chai.use(chaiHttp)

let mongoose = require("mongoose");
let User = require("../database/models/model.user").User;
let Request = require("../database/models/model.request").Request;
let DirectMessage = require("../database/models/model.direct-message").DirectMessage;

suite("Friends Suite", function(){

    suiteSetup(function(done){
        this.server = require("../server/server").server; 

        setTimeout(function(){
            done()
        }, 500)
    })

    suiteSetup(function(done){

        //create credentials for an existing user on the system
        this.existing_user = {
            "username": "existing-user",
            "password": "existing-password",
        }

        this.new_user = {
            "username": "new-user",
            "password": "new-password",
        }

        this.other_user = {
            "username": "other-user",
            "password": "other-password"
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
        chai.request(this.server).post("/auth/signup/").send(this.new_user).end(function(error, response){
            done()
        })
    })

    setup(function(done){
        chai.request(this.server).post("/auth/signup/").send(this.other_user).end(function(error, response){
            done()
        })
    })


    setup(async function(){
        let existing_user = await User.findOne({"username": this.existing_user.username})
        let other_user = await User.findOne({"username": this.other_user.username})

        let directmessage = new DirectMessage({
            "group_members": [existing_user._id.toString(), other_user._id.toString()]
        })
        await directmessage.save()

        dm = await DirectMessage.findOne()
        existing_user.friends.push({
            "friend": other_user._id,
            "dm_id": dm._id
        })
        other_user.friends.push({
            "friend": existing_user._id,
            "dm_id": dm._id
        })

        await existing_user.save()
        await other_user.save()
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

    teardown(function(done){
        DirectMessage.deleteMany({}, (error) => {
            done()
        })
    })

    test("Test can get friends page", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(function(error, response){
            agent.get("/app/friends/").end(function(error, response){
                chai.assert.equal(response.status, 200, "Status Code Is not correct!")
                done()
            })
        })
    })

    test("Test can get friends invite page", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(function(error, response){
            agent.get("/app/friends/invitefriend/").end(function(error, response){
                chai.assert.equal(response.status, 200, "Status Code Is not correct!")
                done()
            })
        })
    });

    test("Test can send friend request", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(async function(error, response){
            let new_user = await User.findOne({"username": "new-user"})
            agent.post("/app/friends/invitefriend/").send({"recipientId": new_user._id.toString()}).end(function(error, response){
                chai.assert.equal(response.status, 200, "Status Code Is not correct!")
                chai.assert.equal(JSON.parse(response.text).message, "Friend Request Sent!", "Friend Request was not sent!")
                done()
            })
        })
    })

    test("Test that friend exists", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(async function(error, response){
            let new_user = await User.findOne({"username": "new-user"})
            agent.post("/app/friends/invitefriend/").send({"recipientId": "not_a_user_id"}).end(function(error, response){
                chai.assert.equal(response.status, 500, "Status Code Is not correct!")
                chai.assert.equal(JSON.parse(response.text).message, "Invalid User ID!", "User ID was not Invalid!")
                done()
            })
        })
    })

    test("Test that will not allow user to invite another user they are alreaady friends with", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(async function(error, response){
            let other_user = await User.findOne({"username": "other-user"})
            agent.post("/app/friends/invitefriend/").send({"recipientId": other_user._id.toString()}).end(function(error, response){
                chai.assert.equal(response.status, 400, "Status Code Is not correct!")
                chai.assert.equal(JSON.parse(response.text).message, "Already Friends", "Not already friends")
                done()
            })
        })
    });

    test("Test that not able to send friend request to self", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(async function(error, response){
            let existing_user = await User.findOne({"username": "existing-user"})
            agent.post("/app/friends/invitefriend/").send({"recipientId": existing_user._id.toString()}).end(function(error, response){
                chai.assert.equal(response.status, 400, "Status Code Is not correct!")
                chai.assert.equal(JSON.parse(response.text).message, "You cannot send a friend request to yourself!", "Did not try to friend self")
                done()
            })
        })
    });

    test("test that user is able to unfriend a user they are friends with", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(async function(error, response){
            let other_user = await User.findOne({"username": "other-user"})
            agent.post("/app/friends/unfriend/").send({"friendId": other_user._id.toString()}).end(function(error, response){
                chai.assert.equal(response.status, 200, "Status Code Is not correct!")
                chai.assert.equal(JSON.parse(response.text).message, "Unfriended User!", "User was not unfriended")
                done()
            })
        })
    })


});
