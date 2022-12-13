//Import required modules and packages
let express = require("express")
let path = require("path");
let http = require("http");
let routes = require("./routes")
let socketIo = require("socket.io")

//set port used for server
let port = 9000;

//Setup express app
let app = express()
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../static")));

//create server and export for use elsewhere
let server = http.createServer(app)
let socket = socketIo(server);

socket.on("connection", function(soc) {

    soc.on("test send", function(msg) {
        soc.broadcast.emit("Test Message", msg)
    })

});

//Setup app routes
app.get("/", routes.homePage)
app.get("/:id", routes.homePage, (req, res) => {
    res.send(req.params)
})

//Set server to listen on port 9000
server.listen(port, function(){
    console.log("Listening on port " + port);
})
