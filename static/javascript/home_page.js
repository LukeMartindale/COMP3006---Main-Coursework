$(function() {

    alert("test")

    let socket = io("http://localhost:9000")

    let msg = "FUCK YOU"

    socket.emit("test send", msg);

    socket.on("Test Message", function(msg) {
        alert(msg)
    })

});