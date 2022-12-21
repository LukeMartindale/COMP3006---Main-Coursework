//Import required modules and packages
let express = require("express");
let path = require("path");

//Import Routes
let routes = require("./routes/routes");
let group_routes = require("./routes/group.routes");
let friends_routes = require("./routes/friend.routes");
let notification_routes = require("./routes/notification.routes");
let auth_routes = require("./routes/auth.routes");

//Import app use requirements
let cookieSession = require("cookie-session");
let cookieParser = require("cookie-parser");
let bodyParser = require("body-parser");

//Import auth route validators and functions
let auth = require("../database/auth/auth.user");
let auth_verify_signup = require("../database/auth/auth.verify.signup");
let auth_verify_jwt = require("../database/auth/auth.verify.jwt");

//Import requirements for create, add routes
let group = require("../database/app/app.group");
let friend = require("../database/app/app.friend")


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



//Route for the app
app.get("/app/groups/", [auth_verify_jwt.verifyToken], routes.groupsPage)
app.get("/app/groups/creategroup/", [auth_verify_jwt.verifyToken], routes.creategroupPage)
app.post("/app/groups/creategroup/", [auth_verify_jwt.verifyToken], group.CreateGroup)

app.get("/app/friends/", [auth_verify_jwt.verifyToken], routes.friendsPage)
app.get("/app/friends/invitefriend", [auth_verify_jwt.verifyToken], friends_routes.addfriendPage)
app.post("/app/friends/invitefriend", [auth_verify_jwt.verifyToken, friend.CheckFriendExists, friend.CheckIfAlreadyFriends], friend.InviteFriend)

app.get("/app/notifications/", [auth_verify_jwt.verifyToken], routes.notificationsPage)
app.post("/app/notifications/", [auth_verify_jwt.verifyToken], notification_routes.requestResponse)

//Route for chats
app.get("/chat/group/:id/", [auth_verify_jwt.verifyToken], group_routes.groupchatPage)
app.get("/chat/group/:id/settings/", [auth_verify_jwt.verifyToken], group_routes.groupchatsettingsPage)
app.post("/chat/group/", [auth_verify_jwt.verifyToken], group.SendTextMessage)

//Routes for user auth functions
app.get("/auth/login/", auth_routes.loginPage)
app.post("/auth/login/", auth.LogIn)

app.get("/auth/signup/", auth_routes.signupPage)
app.post("/auth/signup/", [auth_verify_signup.CheckIfUsernameExists], auth.SignUp)

app.post("/auth/logout/", auth.LogOut)




//TEST ROUTES
//test home page
app.get("/home-page/", [auth_verify_jwt.verifyToken], routes.homePage)
app.get("/", routes.homePageTest)
app.get("/:id/", routes.homePageTest, (request, response) => {
    response.send(request.params)
})
//Check if user is logged in
app.get("/auth/loggedin/", [auth_verify_jwt.verifyToken], auth_routes.LoggedIn)


module.exports.app = app;
