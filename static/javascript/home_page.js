$(function() {

    let socket = io("http://localhost:9000/")
    console.log("js loads")

    let msg = "This is a test message"

    $("#send").click(function() {

        $("#test-div").append("msg");
        socket.emit("SEND")

    });



    socket.on("RECIEVED", function(msg){
        $("#test-div").append("msg");
        console.log("TEST RECIEVED")
    })

});