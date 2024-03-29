//Import required modules and packages
let express = require("express");
let path = require("path");

//Import Routes
let routes = require("./routes/routes");
let group_routes = require("./routes/group.routes");
let friends_routes = require("./routes/friend.routes");
let notification_routes = require("./routes/notification.routes");
let direct_routes = require("./routes/direct-message.routes");
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
let direct = require("../database/app/app.direct");
let friend = require("../database/app/app.friend");
let notification = require("../database/app/app.notification");

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
app.post("/app/groups/creategroup/", [auth_verify_jwt.verifyToken, group.CheckGroupNameNotEmpty], group.CreateGroup)

app.get("/app/friends/", [auth_verify_jwt.verifyToken], routes.friendsPage)
app.get("/app/friends/invitefriend/", [auth_verify_jwt.verifyToken], friends_routes.addfriendPage)
app.post("/app/friends/invitefriend/",
    [
        auth_verify_jwt.verifyToken, 
        friend.CheckFriendExists, 
        friend.CheckIfAlreadyFriends, 
        friend.CheckIfAlreadySentFriendRequest, 
        friend.CheckNotSendingRequestToSelf
    ], friend.InviteFriend)
app.post("/app/friends/unfriend/", [auth_verify_jwt.verifyToken], friend.UnfriendUser)

app.get("/app/notifications/", [auth_verify_jwt.verifyToken], routes.notificationsPage)
app.get("/app/notifications/group/unread/", [auth_verify_jwt.verifyToken], notification_routes.getUnreadGroupMessages)
app.get("/app/notifications/direct/unread/", [auth_verify_jwt.verifyToken], notification_routes.getUnreadDirectMessages)
app.post("/app/notifications/", 
    [
        auth_verify_jwt.verifyToken, 
        notification.CheckIfAlreadyInGroup, 
        notification.CheckIfAlreadyFriends
    ], notification_routes.requestResponse)
app.post("/app/notifications/groupmessage/", [auth_verify_jwt.verifyToken], notification_routes.groupmessageNotification)
app.post("/app/notifications/groupmessage/resolve/", [auth_verify_jwt.verifyToken], notification_routes.readgroupmessageNotification)
app.post("/app/notifications/directmessage/resolve/", [auth_verify_jwt.verifyToken], notification_routes.readdirectmessageNotification)

app.get("/app/account", [auth_verify_jwt.verifyToken], routes.accountPage)

//Route for chats
app.get("/chat/group/:id/", [auth_verify_jwt.verifyToken, group.CheckUserIsInGroup], group_routes.groupchatPage)
app.get("/chat/group/:id/settings/", [auth_verify_jwt.verifyToken, group.CheckUserIsInGroup], group_routes.groupchatsettingsPage)
app.post("/chat/group/", [auth_verify_jwt.verifyToken, group.CheckMessageNotEmpty], group.SendTextMessage)
app.post("/chat/group/invite/", [auth_verify_jwt.verifyToken, group.CheckIfAlreadyInGroup, group.CheckNotAlreadyInvited], group.InviteFriendToGroup)
app.post("/chat/group/leave/", [auth_verify_jwt.verifyToken], group.LeaveGroup)
app.post("/chat/group/delete", [auth_verify_jwt.verifyToken], group.DeleteGroup)

app.get("/chat/direct/:id/", [auth_verify_jwt.verifyToken, direct.CheckUserIsInGroup], direct_routes.directmessagePage)
app.post("/chat/direct/", [auth_verify_jwt.verifyToken, direct.CheckMessageNotEmpty], direct.SendTextMessage)

//Routes for user auth functions
app.get("/auth/login/", auth_routes.loginPage)
app.post("/auth/login/", auth.LogIn)

app.get("/auth/signup/", auth_routes.signupPage)
app.post("/auth/signup/", [auth_verify_signup.CheckIfUsernameExists, auth_verify_signup.CheckUsernameNotEmpty, auth_verify_signup.CheckPasswordNotEmpty], auth.SignUp)

app.post("/auth/logout/",[auth_verify_jwt.verifyToken], auth.LogOut)

app.get("/", routes.homePage)

module.exports.app = app;
