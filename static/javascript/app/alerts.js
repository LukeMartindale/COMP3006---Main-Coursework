let socket = io("http://localhost:9000");

function alertTime(){
    $(".alert-box").addClass("no-alerts")
}

$(function(){

    socket.on("Friend:" + USER_ID, function(alert){
        if(window.location.href == "http://localhost:9000/app/groups" || window.location.href == "http://localhost:9000/app/friends") {
            $(".content").prepend("<a href='http://localhost:9000/app/notifications' class='alert-box create-wrapper' id='alerts-box'></a>")
            $("#alerts-box").append("<div class='create-content' id='create-content'>")
            $("#create-content").append("<h2 class='create-title'>New Friend Request!</h2>")
            window.setTimeout(alertTime, 7000)
        }
        if(window.location.href == "http://localhost:9000/app/notifications"){
            window.location.reload()
        }
    });

    socket.on("Group:" + USER_ID, function(alert){
        if(window.location.href == "http://localhost:9000/app/groups" || window.location.href == "http://localhost:9000/app/friends") {
            $(".content").prepend("<a href='http://localhost:9000/app/notifications' class='alert-box create-wrapper' id='alerts-box'></a>")
            $("#alerts-box").append("<div class='create-content' id='create-content'>")
            $("#create-content").append("<h2 class='create-title'>New Group Invite!</h2>")
            window.setTimeout(alertTime, 7000)
        }
        if(window.location.href == "http://localhost:9000/app/notifications"){
            window.location.reload()
        }
    });

});