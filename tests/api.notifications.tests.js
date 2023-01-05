process.env.NODE_ENV = "test"

let chai = require("chai");
let chaiHttp = require("chai-http")
chai.use(chaiHttp)

let mongoose = require("mongoose");
let User = require("../database/models/model.user").User;
let Request = require("../database/models/model.request").Request;
let Group = require("../database/models/model.group").Group;
let DirectMessage = require("../database/models/model.direct-message").DirectMessage;


suite("Notifications Suite", function(){

    suiteSetup(function(done){
        this.server = require("../server/server"); 

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

    setup(function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(async function(error, response){
            let new_user = await User.findOne({"username": "new-user"})
            agent.post("/app/friends/invitefriend/").send({"recipientId": new_user._id.toString()}).end(function(error, response){
                done()
            })
        })
    })

    setup(function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(function(error, response){
            agent.post("/app/groups/creategroup/").send({"group_name": "existing_group"}).end(function(error, response){
                done()
            })
        })
    })

    setup(function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(async function(error, response){
            let group = await Group.findOne({"group_name": "existing_group"})
            let recipient = await User.findOne({"username": "new-user"})
            agent.post("/chat/group/invite/").send({"recipientId": recipient._id.toString(), "groupId": group._id.toString(), "type": "group-invite"}).end(function(error, response){
                done()
            });
        });
    })
    
    setup(async function(){

        let group = await Group.findOne({"group_name": "existing_group"})
        let other_user = await User.findOne({"username": "other-user"})

        group.group_members.push(other_user._id.toString())

        await group.save()
    })

    setup(function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(async function(error, response){
            let group = await Group.findOne({"group_name": "existing_group"})
            agent.post("/app/notifications/groupmessage/").send({"groupId": group._id.toString(), "type": "group"}).end(function(error, response){
                done()
            });
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

    setup(function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(async function(error, response){
            let other_user = await User.findOne({"username": "other-user"})
            agent.post("/app/notifications/groupmessage/").send({"type": "direct","groupId": other_user.friends[0].dm_id.toString()}).end(function(error, response){
                done()
            });
        })
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
        Group.deleteMany({}, (error) => {
            done()
        })
    })

    teardown(function(done){
        DirectMessage.deleteMany({}, (error) => {
            done()
        })
    })

    test("Test can get notifications page", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(function(error, response){
            agent.get("/app/notifications/").end(function(error, response){
                chai.assert.equal(response.status, 200, "Status Code Is not correct!")
                done()
            })
        })
    })

    test("Test can accept a friend notification", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(async function(error, response){
            let request = await Request.findOne({"senderUsername": "existing-user"})
            agent.post("/app/notifications/").send({"request_id": request._id.toString(), "type": "accept"}).end(function(error, response){
                chai.assert.equal(response.status, 200, "Status Code Is not correct!")
                chai.assert.equal(response.body.message, "User invited to group", "User was not invited to group")
                done()
            })
        })
    });

    test("Test can accept a group notification", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(async function(error, response){
            let group = await Group.findOne({"group_name": "existing_group"})
            let request = await Request.findOne({"groupId": group._id.toString()})
            agent.post("/app/notifications/").send({"request_id": request._id.toString(), "type": "accept"}).end(function(error, response){
                chai.assert.equal(response.status, 200, "Status Code Is not correct!")
                chai.assert.equal(response.body.message, "Friend request send to user", "User was not invited to group")
                done()
            })
        })
    });

    test("Test that user can decline a request", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(async function(error, response){
            let request = await Request.findOne({"senderUsername": "existing-user"})
            agent.post("/app/notifications/").send({"request_id": request._id.toString()}).end(function(error, response){
                chai.assert.equal(response.status, 200, "Status Code Is not correct!")
                chai.assert.equal(response.body.message, "Notification Declined", "User was not invited to group")
                done()
            })
        })
    })

    test("Test can get list of unread group messages", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.other_user).end(async function(error, response){
            let other_user = await User.findOne({"username": "other-user"})
            let group = await Group.findOne({"group_name": "existing_group"})
            agent.get("/app/notifications/group/unread/").end(function(error, response){
                chai.assert.equal(response.status, 200, "Status Code Is not correct!")
                chai.assert.equal(response.body.group_requests[0].senderId, group._id.toString(), "SenderId is not the correct Group ID!")
                chai.assert.equal(response.body.group_requests[0].recipientId, other_user._id.toString(), "Recipient ID is not the correct User ID!")
                chai.assert.equal(response.body.group_requests[0].type, "group-message", "notification type is not correct!")
                chai.assert.equal(response.body.group_requests[0].status, "pending", "notification status is not correct!")
                done()
            })
        })
    });

    test("Test can get list of unread direct messages", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.other_user).end(async function(error, response){
            let other_user = await User.findOne({"username": "other-user"})
            let existing_user = await User.findOne({"username": "existing-user"})
            agent.get("/app/notifications/direct/unread/").end(function(error, response){
                chai.assert.equal(response.status, 200, "Status Code Is not correct!")
                chai.assert.equal(response.body.direct_requests[0].senderId, existing_user._id.toString(), "SenderId is not the correct Group ID!")
                chai.assert.equal(response.body.direct_requests[0].recipientId, other_user._id.toString(), "Recipient ID is not the correct User ID!")
                chai.assert.equal(response.body.direct_requests[0].type, "direct-message", "notification type is not correct!")
                chai.assert.equal(response.body.direct_requests[0].status, "pending", "notification status is not correct!")
                done()
            })
        })
    });
    

});
