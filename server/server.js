//Import required modules and packages
let http = require("http");
let fs = require("fs");
let mongoose = require("mongoose");
let socketIo = require("socket.io");

let app = require("./app").app;

let User = require("../database/models/model.user").User;
let Group = require("../database/models/model.group").Group;
let DirectMessage = require("../database/models/model.direct-message").DirectMessage;

//set port used for server
let port = 9000;

//Get database credentials
let credentials = {
    "name": "TheMartindale",
    "password": "dxWrO4fnEic4ay8A"
}

url = `mongodb+srv://${credentials.name}:${credentials.password}@cluster0.rh5pgvb.mongodb.net/slantdb?retryWrites=true&w=majority`; 

//connect to db
if(process.env.NODE_ENV == undefined){
    mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => {
        console.log("Successfully connected to Main Database");
    })
    .catch(error => {
        console.error("Error: ", error)
    })
}


//create server and export for use elsewhere
let server = http.createServer(app)
let io = socketIo(server);

io.on("connection", function(socket) {

    //Broadcast does work it just doesnt emit to itself / the one sending the msg

    socket.on("SEND", function() {
        let msg = "This is a test message form the server"
        socket.broadcast.emit("RECIEVED", msg)
    })

    socket.on("Send Group Message", async function(message) {

        socket.broadcast.emit("Group-Message:" + message.group_id, message)

        let group = await Group.findById(message.group_id).exec()

        for(let i=0; i< group.group_members.length; i++){
            socket.broadcast.emit("User:" + group.group_members[i], {"type": "group", "group_id": message.group_id})
        }
        
    });

    socket.on("Send Group Image", async function(message){

        socket.broadcast.emit("Group-Image:" + message.group_id, message)

        let group = await Group.findById(message.group_id).exec()

        for(let i=0; i< group.group_members.length; i++){
            socket.broadcast.emit("User:" + group.group_members[i], {"type": "group", "group_id": message.group_id})
        }

    });

    socket.on("Send Direct Message", async function(message) {

        socket.broadcast.emit("Direct-Message:" + message.dm_id, message)

        let dm = await DirectMessage.findById(message.dm_id).exec()

        for(let i=0; i< dm.group_members.length; i++){
            socket.broadcast.emit("User:" + dm.group_members[i], {"type": "direct", "dm_id": message.dm_id, "sender_id": message.senderId})
        }
        
    });

    socket.on("Send Direct Image", async function(message){

        socket.broadcast.emit("Direct-Image:" + message.dm_id, message)

        let dm = await DirectMessage.findById(message.dm_id).exec()

        for(let i=0; i< dm.group_members.length; i++){
            socket.broadcast.emit("User:" + dm.group_members[i], {"type": "direct", "dm_id": message.dm_id, "sender_id": message.senderId})
        }

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

module.exports = server