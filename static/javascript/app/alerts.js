let socket = io("http://localhost:9000");

function alertTime(){
    $(".alert-box").addClass("no-alerts")
}

function alertTimeAlt(){
    $(".alert-content").addClass("no-alerts")
}

$(function(){

    socket.on("Friend:" + USER_ID, function(alert){
        if(window.location.href == "http://localhost:9000/app/groups" || window.location.href == "http://localhost:9000/app/friends") {
            $(".content").prepend("<a href='http://localhost:9000/app/notifications' class='alert-box create-wrapper' id='alerts-box'></a>")
            $("#alerts-box").append("<div class='create-content' id='create-content'>")
            $("#create-content").append("<h2 class='create-title'>New Friend Request!</h2>")
            window.setTimeout(alertTime, 7000)
        } else if(window.location.href == "http://localhost:9000/app/notifications"){
            window.location.reload()
        } else {
            console.log("TEST Socket Friend")
            $(".alert-wrapper").prepend("<a href='http://localhost:9000/app/notifications' class='alert-content'>New Friend Request</a>")
            window.setTimeout(alertTimeAlt, 7000)
        }
    });

    socket.on("Group:" + USER_ID, function(alert){
        if(window.location.href == "http://localhost:9000/app/groups" || window.location.href == "http://localhost:9000/app/friends") {
            $(".content").prepend("<a href='http://localhost:9000/app/notifications' class='alert-box create-wrapper' id='alerts-box'></a>")
            $("#alerts-box").append("<div class='create-content' id='create-content'>")
            $("#create-content").append("<h2 class='create-title'>New Group Invite!</h2>")
            window.setTimeout(alertTime, 7000)
        } else if(window.location.href == "http://localhost:9000/app/notifications"){
            window.location.reload()
        } else {
            console.log("TEST Socket Group")
            $(".alert-wrapper").prepend("<a href='http://localhost:9000/app/notifications' class='alert-content'>New Group Invite</a>")
            window.setTimeout(alertTimeAlt, 7000)
        }
    });

});