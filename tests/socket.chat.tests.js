process.env.NODE_ENV = "test"

let chai = require("chai");
let chaiHttp = require("chai-http")
chai.use(chaiHttp)

let mongoose = require("mongoose");
let Group = require("../database/models/model.group").Group;
let User = require("../database/models/model.user").User;
let DirectMessage = require("../database/models/model.direct-message").DirectMessage;

let io = require("socket.io-client")

suite("Socket Chat Suite", function(){

    suiteSetup(function(done){
        this.server = require("../server/server").server; 

        setTimeout(function(){
            done()
        }, 500)
    })

    suiteSetup(function(done){
        this.socket_1 = io("http://localhost:9000");
        this.socket_2 = io("http://localhost:9000");
        done()
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
            "username": "existing-user",
            "password": "existing-password",
        }
        this.new_user = {
            "username": "new-user",
            "password": "new-password",
        }
        done()
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

    setup(function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(function(error, response){
            agent.post("/app/groups/creategroup/").send({"group_name": "existing_group"}).end(function(error, response){
                done()
            })
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
        DirectMessage.deleteMany({}, (error) => {
            done()
        })
    })

    test("Test Send Group Message Socket emits to group", async function(){
        let group = await Group.findOne({"group_name": "existing_group"})
        let user = await User.findOne({"username": "existing-user"})
        this.socket_1.emit("Send Group Message", {"group_id": group._id.toString(), "username": "existing-user", "text": "test-text"})
        this.socket_2.on("Group-Message:" + group._id.toString(), function(message){
            chai.assert.equal(message.group_id, group._id.toString(), "Incorrect group id")
            chai.assert.equal(message.username, user.username, "Incorrect username")
            chai.assert.equal(message.text, "test-text", "Incorrect message text")
        });
    })

    test("Test Send Group Message Socket emits to group does not emit to user who emitted", async function(){
        let group = await Group.findOne({"group_name": "existing_group"})
        this.socket_1.emit("Send Group Message", {"group_id": group._id.toString(), "username": "existing-user", "text": "test-text"})
        this.socket_1.on("Group-Message:" + group._id.toString(), function(message){
            chai.assert.isTrue(false)
        });
    })

    test("Test Send Group Image Socket emits to group", async function(){
        let group = await Group.findOne({"group_name": "existing_group"})
        let user = await User.findOne({"username": "existing-user"})
        this.socket_1.emit("Send Group Image", {"group_id": group._id.toString(), "username": "existing-user", "text": "test-text"})
        this.socket_2.on("Group-Image:" + group._id.toString(), function(message){
            chai.assert.equal(message.group_id, group._id.toString(), "Incorrect group id")
            chai.assert.equal(message.username, user.username, "Incorrect username")
            chai.assert.equal(message.text, "test-text", "Incorrect message text")
        });
    })

    test("Test Send Group Image Socket emits to group does not emit to user who emitted", async function(){
        let group = await Group.findOne({"group_name": "existing_group"})
        this.socket_1.emit("Send Group Image", {"group_id": group._id.toString(), "username": "existing-user", "text": "test-text"})
        this.socket_1.on("Group-Image:" + group._id.toString(), function(message){
            chai.assert.isTrue(false)
        });
    })

    test("Test send Group Message Socket emits to correct user", async function(){
        let group = await Group.findOne({"group_name": "existing_group"})
        let user = await User.findOne({"username": "existing-user"})
        this.socket_1.emit("Send Group Message", {"group_id": group._id.toString(), "username": "existing-user", "text": "test-text"})
        this.socket_2.on("User:" + user._id.toString(), function(message){
            chai.assert.equal(message.group_id, group._id.toString(), "Incorrect group id")
            chai.assert.equal(message.type, "group", "Incorrect type")
        })
    })

    test("Test Send Group Message Socket emits to user does not emit to user who emitted", async function(){
        let group = await Group.findOne({"group_name": "existing_group"})
        let user = await User.findOne({"username": "existing-user"})
        this.socket_1.emit("Send Group Message", {"group_id": group._id.toString(), "username": "existing-user", "text": "test-text"})
        this.socket_1.on("User:" + user._id.toString(), function(message){
            chai.assert.isTrue(false)
        });
    })

    test("Test Send Direct Message Socket emits to direct message", async function(){
        let dm = await DirectMessage.findOne()
        let user = await User.findOne({"username": "existing-user"})
        this.socket_1.emit("Send Direct Message", {"dm_id": dm._id.toString(), "username": "existing-user", "text": "test-text"})
        this.socket_2.on("Direct-Message:" + dm._id.toString(), function(message){
            chai.assert.equal(message.dm_id, dm._id.toString(), "Incorrect dm id")
            chai.assert.equal(message.username, user.username, "Incorrect username")
            chai.assert.equal(message.text, "test-text", "Incorrect message text")
        });
    })

    test("Test Send Direct Message Socket emits to direct message but does not emit to user who sent message", async function(){
        let dm = await DirectMessage.findOne()
        this.socket_1.emit("Send Direct Message", {"dm_id": dm._id.toString(), "username": "existing-user", "text": "test-text"})
        this.socket_1.on("Direct-Message:" + dm._id.toString(), function(message){
            chai.assert.isTrue(false)
        });
    })

    test("Test Send Direct Image Socket emits to direct message", async function(){
        let dm = await DirectMessage.findOne()
        let user = await User.findOne({"username": "existing-user"})
        this.socket_1.emit("Send Direct Image", {"dm_id": dm._id.toString(), "username": "existing-user", "text": "test-image"})
        this.socket_2.on("Direct-Image:" + dm._id.toString(), function(message){
            chai.assert.equal(message.dm_id, dm._id.toString(), "Incorrect dm id")
            chai.assert.equal(message.username, user.username, "Incorrect username")
            chai.assert.equal(message.text, "test-image", "Incorrect message text")
        });
    })

    test("Test Send Direct Image Socket emits to direct message but does not emit to user who sent message", async function(){
        let dm = await DirectMessage.findOne()
        this.socket_1.emit("Send Direct Image", {"dm_id": dm._id.toString(), "username": "existing-user", "text": "test-text"})
        this.socket_1.on("Direct-Image:" + dm._id.toString(), function(message){
            chai.assert.isTrue(false)
        });
    })

    test("Test send Direct Message Socket emits to correct user", async function(){
        let dm = await DirectMessage.findOne()
        let user = await User.findOne({"username": "existing-user"})
        this.socket_1.emit("Send Direct Message", {"dm_id": dm._id.toString(), "username": "existing-user", "text": "test-text"})
        this.socket_2.on("User:" + user._id.toString(), function(message){
            chai.assert.equal(message.dm_id, dm._id.toString(), "Incorrect dm id")
            chai.assert.equal(message.type, "direct", "Incorrect type")
        })
    })

    test("Test Send Direct Message Socket emits to user does not emit to user who emitted", async function(){
        let dm = await DirectMessage.findOne()
        let user = await User.findOne({"username": "existing-user"})
        this.socket_1.emit("Send Direct Message", {"dm_id": dm._id.toString(), "username": "existing-user", "text": "test-text"})
        this.socket_1.on("User:" + user._id.toString(), function(message){
            chai.assert.isTrue(false)
        });
    })

})
