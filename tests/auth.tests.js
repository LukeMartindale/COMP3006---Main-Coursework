process.env.NODE_ENV = 'test'

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server/server");
let should = chai.should()
let helpers = require("./test-helper")

let User = require("../database/models/model.user").User;

chai.use(chaiHttp)

suite("Auth Tests", async function(){

    setup(async function(done){



        helpers.emptyTestDatabase()

        let user = new User({
            "username": "test-user",
            "password": "test-password"
        })

        user.save()

        this.user = {
            "username": "test-user",
            "password": "test-password"
        };

        done()

    })

    test("test test", function(){
        chai.assert.isTrue(false)
    })
    

    // test("Test that user can signup", function(){

    //     chai.request(server).post("/auth/signup/").send(this.user).end(function(error, response){

    //             chai.assert.equal(response.status, 200, "Status Code Is not correct!")

    //             console.log(response.status)

    //         })

    // });

    // test("Test", function(){

    //     chai.request(server).post("/auth/signup/").send(this.user).end(function(error, response){

    //         chai.assert.equal(response.status, 200, "Status Code Is not correct!")

    //         console.log(response.status)

    //     })

    // });

    // test("Test user can login", function(){

    //     let user = {
    //         "username": "Luke Martindale",
    //         "password": "Testing1234"
    //     };

    //     chai.request(server).post("/auth/login/").send(user).end((error, response) => {
    //         console.log(response)
    //         console.log(response.status)
    //     })

    // })

    // test("Test user can successfully create a new account", function() {

    //     let user = {
    //         "username": "test_user",
    //         "password": "testing1234"
    //     };

    //     chai.request(server).get("/auth/signup/").end((error, response) => {
    //         chai.assert(response.status, 200, "Wrong Status Code!")
    //     })

    //     // chai.request(this.app)
    //     //     .post("/auth/signup/")
    //     //     .send(user)


    //     // chai.request(this.app).get("/auth/signup/").end(function(error, response) {
    //     //     console.log(response)
    //     // })

    // })
    
});
