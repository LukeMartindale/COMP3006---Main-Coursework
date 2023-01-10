if(window.location.hostname == "localhost"){
    url_prefix = "http://localhost:9000"
}

let socket = io(url_prefix);

function alertTime(){
    $(".alert-box").addClass("no-alerts")
}

function alertTimeAlt(){
    $(".alert-content").addClass("no-alerts")
}

$(function(){

    socket.on("Friend:" + USER_ID, function(alert){
        if(window.location.href == url_prefix + "/app/groups" || window.location.href == url_prefix + "/app/friends") {
            $(".content").prepend("<a href='http://localhost:9000/app/notifications' class='alert-box create-wrapper' id='alerts-box'></a>")
            $("#alerts-box").append("<div class='create-content' id='create-content'>")
            $("#create-content").append("<h2 class='create-title'>New Friend Request!</h2>")
            window.setTimeout(alertTime, 7000)
        } else if(window.location.href == url_prefix + "/app/notifications"){
            window.location.reload()
        } else {
            $(".alert-wrapper").prepend("<a href='http://localhost:9000/app/notifications' class='alert-content'>New Friend Request</a>")
            window.setTimeout(alertTimeAlt, 7000)
        }
    });

    socket.on("Group:" + USER_ID, function(alert){
        if(window.location.href == url_prefix + "/app/groups" || window.location.href == url_prefix + "/app/friends") {
            $(".content").prepend("<a href='http://localhost:9000/app/notifications' class='alert-box create-wrapper' id='alerts-box'></a>")
            $("#alerts-box").append("<div class='create-content' id='create-content'>")
            $("#create-content").append("<h2 class='create-title'>New Group Invite!</h2>")
            window.setTimeout(alertTime, 7000)
        } else if(window.location.href == url_prefix + "/app/notifications"){
            window.location.reload()
        } else {
            $(".alert-wrapper").prepend("<a href='http://localhost:9000/app/notifications' class='alert-content'>New Group Invite</a>")
            window.setTimeout(alertTimeAlt, 7000)
        }
    });

    socket.on("User:" + USER_ID, function(alert){
        if(window.location.href == url_prefix + "/app/groups"){
            if(alert.type == "group"){
                if($("#" + alert.group_id + "-alert-counter").hasClass("no-alerts")){
                    $("#" + alert.group_id + "-alert-counter").removeClass("no-alerts")
                }
                let val = parseInt($("#" + alert.group_id + "-alert-counter").text())
                val++
                $("#" + alert.group_id + "-alert-counter").text(val)
            } else if(alert.type == "direct"){
                if($("#friend-alert-counter").hasClass("no-alerts")){
                    $("#friend-alert-counter").removeClass("no-alerts")
                }
                let val = parseInt($("#friend-alert-counter").text())
                val++
                $("#friend-alert-counter").text(val)
            };

        } else if(window.location.href == url_prefix + "/app/friends") {
            if(alert.type == "group"){
                if($("#group-alert-counter").hasClass("no-alerts")){
                    $("#group-alert-counter").removeClass("no-alerts")
                }
                let val = parseInt($("#group-alert-counter").text())
                val++
                $("#group-alert-counter").text(val)
            } else if(alert.type == "direct"){
                console.log("direct")
                if($("#" + alert.sender_id + "-alert-counter").hasClass("no-alerts")){
                    $("#" + alert.sender_id + "-alert-counter").removeClass("no-alerts")
                }
                let val = parseInt($("#" + alert.sender_id + "-alert-counter").text())
                val++
                $("#" + alert.sender_id + "-alert-counter").text(val)
            };
        } else if(window.location.href == url_prefix + "/app/notifications") {
            if(alert.type == "group"){
                if($("#group-alert-counter").hasClass("no-alerts")){
                    $("#group-alert-counter").removeClass("no-alerts")
                }
                let val = parseInt($("#group-alert-counter").text())
                val++
                $("#group-alert-counter").text(val)
            } else if(alert.type == "direct"){
                console.log("direct")
                if($("#friend-alert-counter").hasClass("no-alerts")){
                    $("#friend-alert-counter").removeClass("no-alerts")
                }
                let val = parseInt($("#friend-alert-counter").text())
                val++
                $("#friend-alert-counter").text(val)
            };
        }
    })

});