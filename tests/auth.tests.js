process.env.NODE_ENV = "test"

let chai = require("chai");
let chaiHttp = require("chai-http")
chai.use(chaiHttp)

let mongoose = require("mongoose");
let User = require("../database/models/model.user").User;

let server = require("../server/server");

suite("Auth Signup Suite", function(){

    suiteSetup(function(done){
        //Connect to test database
        let url = `mongodb+srv://TheMartindale:dxWrO4fnEic4ay8A@cluster0.rh5pgvb.mongodb.net/slanttestdb?retryWrites=true&w=majority`;
        mongoose.connect(url)
        .then(function(){
            done()
        })
    })

    suiteTeardown(function(){
        mongoose.connection.close()
    })

    teardown(function(done){
        User.deleteMany({}, (error) => {
            done()
        })
    })

    test("Test user can signup", function(done){

        let user = {
            "username": "Luke Martindale",
            "password": "testing1234",
        }

        chai.request(server).post("/auth/signup/").send(user).end(function(error, response){
            chai.assert.equal(response.status, 200, "Status Code Is not correct!")
            done()
        })
    });

});

server.close()
