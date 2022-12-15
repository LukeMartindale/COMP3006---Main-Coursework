//Import required modules and packages
let express = require("express")
let path = require("path");
let http = require("http");
let routes = require("./routes")
let fs = require("fs");
let mongoose = require("mongoose")
let socketIo = require("socket.io")
let cookieSession = require("cookie-session");
let cookieParser = require("cookie-parser")

let test_routes = require("./auth.routes")
let auth = require("../database/auth/auth.user");
let auth_verify_signup = require("../database/auth/auth.verify.signup");
let auth_verify_jwt = require("../database/auth/auth.verify.jwt");
const bodyParser = require("body-parser");

//set port used for server
let port = 9000;





//Setup express app
let app = express()
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../static")));
app.use(express.json())
app.use(cookieSession({
    name: "slant-session",
    secret: "COOKIE_SECRET",
}))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())





//Setup app routes
app.get("/", routes.homePage)
app.get("/:id/", routes.homePage, (request, response) => {
    response.send(request.params)
})

//Setup user auth routes
app.get("/auth/signin/", routes.loginPage)

//Check if user is logged in
app.get("/auth/loggedin/", [auth_verify_jwt.verifyToken], test_routes.LoggedIn)

//Routes for user auth functions
app.post("/auth/signup/", [auth_verify_signup.CheckIfUsernameExists], auth.SignUp)
app.post("/auth/login/", auth.LogIn)
app.post("/auth/logout/", auth.LogOut)





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

});





//Set server to listen on port 9000
server.listen(port, function(){
    console.log("Server is listening on port " + port);
})
