if(window.location.hostname == "localhost"){
    url_prefix = "http://localhost:9000"
}

function sendMessage() {

    let send_url = url_prefix + "/chat/direct/"
    let notification_url = url_prefix + "/app/notifications/groupmessage"
    let user_text = $("#chat-input").val()

    if(user_text.length > 0){
        $.ajax({
            url: send_url,
            type: 'POST',
            data: {
                "text": user_text,
                "dm_id": dm_id,
                "senderUsername": username,
                "type": "text",
            },
            datatype: 'json',
            success: function(result){
                console.log("Message Sent!")
            },
            error: function(result){
                console.log(result)
            }
        });

        $.ajax({
            url: notification_url,
            type: 'POST',
            data: {
                "groupId": dm_id,
                "type": "direct",
            },
            datatype: 'json',
            error: function(result){
                console.log(result)
            }
        })


        socket.emit("Send Direct Message", {"text": user_text, "senderId": USER_ID,"senderUsername": username, "dm_id": dm_id})

        $(".message-wrapper").append(
            "<div class=\"user-message\"><div class=\"user-message-content\"><p class=\"message-text\">" + user_text + "</p></div></div>")

        $('html, body').scrollTop($(document).height());
    }
}

function sendImage() {

    let send_url = url_prefix + "/chat/direct/"
    let notification_url = url_prefix + "/app/notifications/groupmessage/"
    let user_text = $(".dropdown-input").val()

    if(user_text.length > 0){
        $.ajax({
            url: send_url,
            type: 'POST',
            data: {
                "text": user_text,
                "dm_id": dm_id,
                "senderUsername": username,
                "type": "image",
            },
            datatype: 'json',
            success: function(result){
                console.log("Message Sent!")
            },
            error: function(result){
                console.log(result)
            }
        });

        $.ajax({
            url: notification_url,
            type: 'POST',
            data: {
                "groupId": dm_id,
                "type": "direct",
            },
            datatype: 'json',
            error: function(result){
                console.log(result)
            }
        })

        socket.emit("Send Direct Image", {"text": user_text, "senderId": USER_ID, "senderUsername": username, "dm_id": dm_id})
        
        $(".message-wrapper").append(
            "<div class=\"user-message\"><div class=\"user-message-content\"><img class=\"user-image\" src=" + user_text + "></div></div>")

        $('html, body').scrollTop($(document).height());
    }
}

function unfriendUser(){

    let unfriend_url = url_prefix + "/app/friends/unfriend/"

    $.ajax({
        url: unfriend_url,
        type: 'POST',
        data: {
            "friendId": FRIEND_ID
        },
        datatype: 'json',
        success: function(result){
            window.location.replace(url_prefix + "/app/friends/")
        },
        error: function(result){
            console.log(result)
        }
    });

}

$(function(){

    $.ajax({
        url: url_prefix + "/app/notifications/directmessage/resolve/",
        type: 'POST',
        data: {
            "groupId": dm_id,
        },
        datatype: 'json',
        error: function(result){
            console.log(result)
        }

    })

    $('html, body').scrollTop($(document).height());

    // Prevent From going to newline on pressing enter key nd send message on enter key press.
    $("#chat-input").keypress(function(e) {
        if(e.which === 13 && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
            $("#chat-input").val("")
        }
    })

    $("#send-button").click(function() {
        sendMessage();
        $("#chat-input").val("")
    });

    socket.on("Direct-Message:" + dm_id, function(message){

        $(".message-wrapper").append(
            "<div class=\"group-message\"><div class=\"group-message-content\"><h4>" + message.senderUsername + "</h4><p class=\"message-text\">" + message.text + "</p></div></div>")

        $('html, body').scrollTop($(document).height());
                
    })

    socket.on("Direct-Image:" + dm_id, function(message){

        $(".message-wrapper").append(
            "<div class=\"group-message\"><div class=\"group-message-content\"><h4>" + message.senderUsername + "</h4><img class=\"user-image\" src=" + message.text + "></div></div>")
    
        $('html, body').scrollTop($(document).height());

    });

    $("#image-button").click(function(){

        $(".dropdown").toggleClass("dropdown-shown")

    });

    $("#image-send-button").click(function() {
        sendImage()
        $(".dropdown-input").val("")
        $(".dropdown").toggleClass("dropdown-shown")
    });

    $(".back-button").click(function(){

        window.location.href = url_prefix + "/app/friends"

    });

    $("#unfriend-button").click(function(){
        unfriendUser()
    });

});
