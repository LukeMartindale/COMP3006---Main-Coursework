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
            "username": "test-user",
            "password": "test-password",
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

    test("Test that user can create a new group", function(done){
        let agent = chai.request.agent(this.server)
        agent.post("/auth/login/").send(this.existing_user).end(function(error, response){
            agent.post("/app/groups/creategroup/").send({"group_name": "test_group"}).end(function(error, response){
                chai.assert.equal(response.status, 200, "Status Code Is not correct!")
                chai.assert.equal(JSON.parse(response.text).message, "Group was created!", "Group was not created!")
                done()
            })
        })
    })

    test("Test user can send a message to group", function(done){
        done()
    })

});
