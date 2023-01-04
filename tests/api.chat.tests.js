process.env.NODE_ENV = "test"

let chai = require("chai");
let chaiHttp = require("chai-http")
chai.use(chaiHttp)

let mongoose = require("mongoose");
let User = require("../database/models/model.user").User;
let Group = require("../database/models/model.group").Group;
let Message = require("../database/models/model.message").Message;
let Request = require("../database/models/model.request").Request;
let DirectMessage = require("../database/models/model.direct-message").DirectMessage;

suite("Chat Group Suite", function(){

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
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(function(error, response){
            agent.post("/app/groups/creategroup/").send({"group_name": "existing_group"}).end(function(error, response){
                done()
            })
        })
    })

    setup(function(done){
        chai.request(this.server).post("/auth/signup/").send(this.new_user).end(function(error, response){
            done()
        })
    })

    teardown(function(done){
        User.deleteMany({}, (error) => {
            done()
        })
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

    test("Test that user can get groups page", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.new_user).end(function(error, response){
            agent.get("/app/groups/").end(function(error, response){
                chai.assert.equal(response.status, 200, "Status Code Is not correct!")
                done()
            })
        })
    })

    test("Test that user can get create groups page", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.new_user).end(function(error, response){
            agent.get("/app/groups/creategroup/").end(function(error, response){
                chai.assert.equal(response.status, 200, "Status Code Is not correct!")
                done()
            })
        })
    })

    test("Test that user can create a new group", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.new_user).end(function(error, response){
            agent.post("/app/groups/creategroup/").send({"group_name": "new_group"}).end(function(error, response){
                chai.assert.equal(response.status, 200, "Status Code Is not correct!")
                chai.assert.equal(JSON.parse(response.text).message, "Group was created!", "Group was not created!")
                done()
            })
        })
    })

    test("Test cannot create group with an empty name", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.new_user).end(function(error, response){
            agent.post("/app/groups/creategroup/").send({"group_name": ""}).end(function(error, response){
                chai.assert.equal(response.status, 400, "Status Code Is not correct!")
                chai.assert.equal(JSON.parse(response.text).message, "Group name cannot be empty!", "Group was not created!")
                done()
            })
        })
    })

    test("Test that user can get page for a specific group", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.new_user).end(function(error, response){
            agent.post("/app/groups/creategroup/").send({"group_name": "new_group"}).end(async function(error, response){
                let group = await Group.findOne({"group_name": "new_group"})
                agent.get("/chat/group/" + group._id.toString()).end(function(error, response){
                    chai.assert.equal(response.status, 200, "Status Code Is not correct!")
                    done()
                })
            })
        })
    })

    test("Test that user cannot get page for group they are not a member of", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.new_user).end(async function(error, response){
            let group = await Group.findOne({"group_name": "existing_group"})
            agent.get("/chat/group/" + group._id.toString()).end(function(error, response){
                chai.assert.equal(response.status, 400, "Status Code Is not correct!")
                chai.assert.equal(JSON.parse(response.text).message, "User is not in this group!", "User is in this group!")
                done()
            })
        })
    });

    test("Test that user can get settings page for a specific group", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.new_user).end(function(error, response){
            agent.post("/app/groups/creategroup/").send({"group_name": "new_group"}).end(async function(error, response){
                let group = await Group.findOne({"group_name": "new_group"})
                agent.get("/chat/group/" + group._id.toString() + "/settings/").end(function(error, response){
                    chai.assert.equal(response.status, 200, "Status Code Is not correct!")
                    done()
                })
            })
        })
    })

    test("Test that user cannot get settings page for group they are not a member of", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.new_user).end(async function(error, response){
            let group = await Group.findOne({"group_name": "existing_group"})
            agent.get("/chat/group/" + group._id.toString() + "/settings/").end(function(error, response){
                chai.assert.equal(response.status, 400, "Status Code Is not correct!")
                chai.assert.equal(JSON.parse(response.text).message, "User is not in this group!", "User is in this group!")
                done()
            })
        })
    });

    test("Test user can send a group text message", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(async function(error, response){
            let group = await Group.findOne({"group_name": "existing_group"})
            agent.post("/chat/group/").send({"text": "test-text", "groupId": group._id.toString(), "senderUsername": "existing-user", "type": "text"}).end(function(error, response){
                chai.assert.equal(response.status, 200, "Status code is not correct!")
                chai.assert.equal(JSON.parse(response.text).message, "Message was sent!", "Message was not sent!")
                done()
            });
        })
    })

    test("Test user can send a group image message", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(async function(error, response){
            let group = await Group.findOne({"group_name": "existing_group"})
            agent.post("/chat/group/").send({"text": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1280px-Image_created_with_a_mobile_phone.png", "groupId": group._id.toString(), "senderUsername": "existing-user", "type": "image"}).end(function(error, response){
                chai.assert.equal(response.status, 200, "Status code is not correct!")
                chai.assert.equal(JSON.parse(response.text).message, "Message was sent!", "Message was not sent!")
                done()
            });
        })
    })

    test("Test user cannot send an empty group message", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(async function(error, response){
            let group = await Group.findOne({"group_name": "existing_group"})
            agent.post("/chat/group/").send({"text": "", "groupId": group._id.toString(), "senderUsername": "existing-user", "type": "text"}).end(function(error, response){
                chai.assert.equal(response.status, 400, "Status code is not correct!")
                chai.assert.equal(JSON.parse(response.text).message, "Cannot send an empty message!", "Message was not empty!")
                done()
            });
        })
    })

    test("Test can invite user to a group", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(async function(error, response){
            let group = await Group.findOne({"group_name": "existing_group"})
            let recipient = await User.findOne({"username": "new-user"})
            agent.post("/chat/group/invite/").send({"recipientId": recipient._id.toString(), "groupId": group._id.toString(), "type": "group-invite"}).end(function(error, response){
                chai.assert.equal(response.status, 200, "Status code is not correct!")
                chai.assert.equal(JSON.parse(response.text).message, "Group Invite Sent!", "Group invite was not empty!")
                done()
            });
        });
    });

    test("Test if user is already a member of a group", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(async function(error, response){
            let group = await Group.findOne({"group_name": "existing_group"})
            let recipient = await User.findOne({"username": "new-user"})
            group.group_members.push(recipient._id.toString())
            await group.save()
            agent.post("/chat/group/invite/").send({"recipientId": recipient._id.toString(), "groupId": group._id.toString(), "type": "group-invite"}).end(function(error, response){
                chai.assert.equal(response.status, 400, "Status code is not correct!")
                chai.assert.equal(JSON.parse(response.text).message, "User is already in group!", "User was not already in group!")
                done()
            });
        });
    });

    test("Test if user has already been invited to the group", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(async function(error, response){
            let group = await Group.findOne({"group_name": "existing_group"})
            let recipient = await User.findOne({"username": "new-user"})
            agent.post("/chat/group/invite/").send({"recipientId": recipient._id.toString(), "groupId": group._id.toString(), "type": "group-invite"}).end(function(error, response){
                agent.post("/chat/group/invite/").send({"recipientId": recipient._id.toString(), "groupId": group._id.toString(), "type": "group-invite"}).end(function(error, response){
                    chai.assert.equal(response.status, 400, "Status code is not correct!")
                    chai.assert.equal(JSON.parse(response.text).message, "User has already been invited!", "User was not already invited!")
                    done()
                });
            });
        });
    });

    test("Test can leave a group you are a member of", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(async function(error, response) {
            let group = await Group.findOne({"group_name": "existing_group"})
            agent.post("/chat/group/leave/").send({"groupId": group._id.toString()}).end(function(error, response){
                chai.assert.equal(response.status, 200, "Status code is not correct!")
                chai.assert.equal(JSON.parse(response.text).message, "Group left!", "Group was not left")
                done()
            });
        });
    });

    test("Test can delete a group you are a member of", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(async function(error, response) {
            let group = await Group.findOne({"group_name": "existing_group"})
            agent.post("/chat/group/delete/").send({"groupId": group._id.toString()}).end(async function(error, response){
                group = await Group.findOne({"group_name": "existing_group"})
                chai.assert.equal(response.status, 200, "Status code is not correct!")
                chai.assert.equal(JSON.parse(response.text).message, "Group deleted!", "Group was not left")
                chai.assert.equal(group, null, "Group was not deleted")
                done()
            });
        });
    });

});

suite("Chat Direct Message Suite", function(){

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
        let new_user = await User.findOne({"username": this.new_user.username})

        let directmessage = new DirectMessage({
            "group_members": [existing_user._id.toString(), new_user._id.toString()]
        })
        await directmessage.save()

        dm = await DirectMessage.findOne()
        existing_user.friends.push({
            "friend": new_user._id,
            "dm_id": dm._id
        })
        new_user.friends.push({
            "friend": existing_user._id,
            "dm_id": dm._id
        })

        await existing_user.save()
        await new_user.save()

    })

    teardown(function(done){
        User.deleteMany({}, (error) => {
            done()
        })
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

    teardown(function(done){
        DirectMessage.deleteMany({}, (error) => {
            done()
        })
    })

    test("Test can get Specific direct message page", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(async function(error, response) {
            let directmessage = await DirectMessage.findOne()
            agent.get("/chat/direct/" + directmessage._id.toString()).end(function(error, response){
                chai.assert.equal(response.status, 200, "Status code is not correct")
                done()
            })
        });
    })

    test("Test cannot get Specific direct message page not a member of", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.other_user).end(async function(error, response) {
            let directmessage = await DirectMessage.findOne()
            agent.get("/chat/direct/" + directmessage._id.toString()).end(function(error, response){
                chai.assert.equal(response.status, 400, "Status code is not correct")
                chai.assert.equal(JSON.parse(response.text).message, "User is not in this dm!", "Message was not sent!")
                done()
            })
        });
    })

    test("Test can send Direct Message Text Message", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(async function(error, response) {
            let directmessage = await DirectMessage.findOne()
            agent.post("/chat/direct/").send({"text": "test-message", "type": "text", "dm_id": directmessage._id.toString(), "senderUsername": "existing-user"}).end(function(error, response){
                chai.assert.equal(response.status, 200, "Status code is not correct")
                chai.assert.equal(JSON.parse(response.text).message, "Message was sent!", "Message was not sent!")
                done()
            })
        });
    })

    test("Test can send Direct Message Image Message", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(async function(error, response) {
            let directmessage = await DirectMessage.findOne()
            agent.post("/chat/direct/").send({"text": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1280px-Image_created_with_a_mobile_phone.png", "type": "image", "dm_id": directmessage._id.toString(), "senderUsername": "existing-user"}).end(function(error, response){
                chai.assert.equal(response.status, 200, "Status code is not correct")
                chai.assert.equal(JSON.parse(response.text).message, "Message was sent!", "Message was not sent!")
                done()
            })
        });
    })

    test("Test cannot send empty Direct Message Message", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(function(error, response) {
            agent.post("/chat/direct/").send({"text": ""}).end(function(error, response){
                chai.assert.equal(response.status, 400, "Status code is not correct")
                chai.assert.equal(JSON.parse(response.text).message, "Cannot send an empty message!", "Message was not empty!")
                done()
            })
        });
    })

})
