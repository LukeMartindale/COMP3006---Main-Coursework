//Import required modules and packages
let express = require("express")
let path = require("path");
let routes = require("./routes")
let port = 9000;

//Setup express app
let app = express()
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../static")));

//Setup app routes
app.get("/", routes.homePage)
app.get("/:id", routes.homePage, (req, res) => {
    res.send(req.params)
})


//Set server to listen on port 9000
app.listen(port, function(){
    console.log("Listening on port " + port);
})
