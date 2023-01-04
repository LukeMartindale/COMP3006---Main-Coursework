process.env.NODE_ENV = "test"

let chai = require("chai");
let chaiHttp = require("chai-http")
chai.use(chaiHttp)

let mongoose = require("mongoose");
let User = require("../database/models/model.user").User;
let Group = require("../database/models/model.group").Group;
let Message = require("../database/models/model.message").Message;

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
        // this.sandbox.restore()

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

});
