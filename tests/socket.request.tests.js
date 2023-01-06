process.env.NODE_ENV = "test"

let chai = require("chai");
let chaiHttp = require("chai-http")
chai.use(chaiHttp)

let mongoose = require("mongoose");

let io = require("socket.io-client")

suite("Socket Request Suite", function(){

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

    test("Test friend requests is sent to correct user", function(done){
        this.socket_1.emit("Friend Request Sent", {"friendId": "friend-id"})
        this.socket_2.on("Friend:friend-id", function(alert){
            chai.assert.equal(alert.friendId, "friend-id", "Friend Id is not correct")
        })
        done()
    })

    test("Test friend requests is not sent to user who sent friend request", function(done){
        this.socket_1.emit("Friend Request Sent", {"friendId": "friend-id"})
        this.socket_1.on("Friend:friend-id", function(alert){
            chai.assert.isTrue(false)
        })
        done()
    })

    test("Test Group Invite is sent to correct user", function(done){
        this.socket_1.emit("Group Invite Sent", {"recipientId": "recipientId"})
        this.socket_2.on("Group:recipientId", function(alert){
            chai.assert.equal(alert.recipientId, "recipientId", "recipientId is not correct")
        })
        done()
    })

    test("Test friend requests is not sent to user who sent friend request", function(done){
        this.socket_1.emit("Group Invite Sent", {"recipientId": "recipientId"})
        this.socket_1.on("Group:recipientId", function(alert){
            chai.assert.isTrue(false)
        })
        done()
    })

})
