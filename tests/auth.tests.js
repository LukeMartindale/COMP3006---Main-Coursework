process.env.NODE_ENV = "test"

let chai = require("chai");
let mongoose = require("mongoose");

let app = require("../server/app").app;

suite("Auth Suite", function(){

    suiteSetup(function(done){
        console.log("SuiteSetup")

        let url = `mongodb+srv://TheMartindale:dxWrO4fnEic4ay8A@cluster0.rh5pgvb.mongodb.net/slanttestdb?retryWrites=true&w=majority`;

        mongoose.connect(url).then(function(){
            console.log("Test Connect")
            done()
        })
        
    })

    suiteTeardown(function(){
        console.log("SuiteTeardown")
        mongoose.connection.close()
    })

    test("Test", function(){

        chai.assert.isTrue(true)
    })

});

mongoose.connection.close()
