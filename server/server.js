//Import required modules and packages
let http = require("http");
let fs = require("fs");
let mongoose = require("mongoose");
let socketIo = require("socket.io");

let app = require("./app").app;

//set port used for server
let port = 9000;

//Get database credentials
let credentials = JSON.parse(fs.readFileSync("../config/database-credentials.json"))

//connect to db
let url = `mongodb+srv://${credentials.name}:${credentials.password}@cluster0.rh5pgvb.mongodb.net/slantdb?retryWrites=true&w=majority`;
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => {
        console.log("Successfully connected to Database");
    })
    .catch(error => {
        console.error("Error: ", error)
    })

//create server and export for use elsewhere
let server = http.createServer(app)
let io = socketIo(server);

io.on("connection", function(socket) {

    //Broadcast does work it just doesnt emit to itself / the one sending the msg

    socket.on("SEND", function() {
        let msg = "This is a test message form the server"
        socket.broadcast.emit("RECIEVED", msg)
    })

    socket.on("Send Group Message", function(message) {

        socket.broadcast.emit("Group-Message:" + message.group_id, message)
        
    });

    socket.on("Friend Request Sent", function(alert){

        socket.broadcast.emit("Friend:" + alert.friendId, alert)

    })

    socket.on("Group Invite Sent", function(alert){

        socket.broadcast.emit("Group:" + alert.recipientId, alert)

    });

});

//Set server to listen on port 9000
server.listen(port, function(){
    console.log("Server is listening on port " + port);
})
