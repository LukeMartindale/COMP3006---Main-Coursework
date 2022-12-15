//Import required modules and packages
let express = require("express");
let path = require("path");

//Import Routes
let routes = require("./routes/routes");
let auth_routes = require("./routes/auth.routes");

//Import app use requirements
let cookieSession = require("cookie-session");
let cookieParser = require("cookie-parser");
let bodyParser = require("body-parser");

//Import auth route validators and functions
let auth = require("../database/auth/auth.user");
let auth_verify_signup = require("../database/auth/auth.verify.signup");
let auth_verify_jwt = require("../database/auth/auth.verify.jwt");



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
app.get("/", routes.homePageTest)
app.get("/:id/", routes.homePageTest, (request, response) => {
    response.send(request.params)
})

//Routes for user auth functions
app.get("/auth/login/", auth_routes.loginPage)
app.post("/auth/login/", auth.LogIn)

app.get("/auth/signup/", auth_routes.signupPage)
app.post("/auth/signup/", [auth_verify_signup.CheckIfUsernameExists], auth.SignUp)

app.post("/auth/logout/", auth.LogOut)

//Check if user is logged in
app.get("/auth/loggedin/", [auth_verify_jwt.verifyToken], auth_routes.LoggedIn)

module.exports.app = app;
