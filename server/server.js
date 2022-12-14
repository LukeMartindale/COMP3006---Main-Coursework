//Import required modules and packages
let express = require("express")
let path = require("path");
let http = require("http");
let routes = require("./routes")
let fs = require("fs");
let mongoose = require("mongoose")
let socketIo = require("socket.io")

//set port used for server
let port = 9000;



//Setup express app
let app = express()
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../static")));

//Setup app routes
app.get("/", routes.homePage)
app.get("/:id/", routes.homePage, (req, res) => {
    res.send(req.params)
})

//Setup user login routes
app.get("/auth/login/", routes.loginPage)



//Get database credentials
let credentials = JSON.parse(fs.readFileSync("../config/database-credentials.json"))

//connect to db
let url = `mongodb+srv://${credentials.name}:${credentials.password}@cluster0.rh5pgvb.mongodb.net/slantdb?retryWrites=true&w=majority`;
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true});



//create server and export for use elsewhere
let server = http.createServer(app)
let io = socketIo(server);

io.on("connection", function(socket) {

    //Broadcast does work it just doesnt emit to itself / the one sending the msg

    socket.on("SEND", function() {
        let msg = "This is a test message form the server"
        socket.broadcast.emit("RECIEVED", msg)
    })

});



//Set server to listen on port 9000
server.listen(port, function(){
    console.log("Listening on port " + port);
})
