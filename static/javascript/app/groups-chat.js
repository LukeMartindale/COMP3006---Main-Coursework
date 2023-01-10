if(window.location.hostname == "localhost"){
    url_prefix = "http://localhost:9000"
}

function sendMessage() {

    let send_url =  url_prefix + "/chat/group/"
    let notification_url = url_prefix + "/app/notifications/groupmessage"
    let user_text = $("#chat-input").val()

    if(user_text.length > 0){
        $.ajax({
            url: send_url,
            type: 'POST',
            data: {
                "text": user_text,
                "groupId": group_id,
                "senderUsername": username,
                "type": "text",
            },
            datatype: 'json',
            error: function(result){
                console.log(result)
            }
        });

        $.ajax({
            url: notification_url,
            type: 'POST',
            data: {
                "groupId": group_id,
                "type": "group",
            },
            datatype: 'json',
            error: function(result){
                console.log(result)
            }
        })

        socket.emit("Send Group Message", {"text": user_text, "senderUsername": username, "group_id": group_id})

        $(".message-wrapper").append(
            "<div class=\"user-message\"><div class=\"user-message-content\"><p class=\"message-text\">" + user_text + "</p></div></div>")
    
        $('html, body').scrollTop($(document).height());

    }

}

function sendImage() {

    let send_url = url_prefix + "/chat/group/"
    let notification_url = url_prefix + "/app/notifications/groupmessage"
    let user_text = $(".dropdown-input").val()

    if(isImgUrl(user_text)){
        if(user_text.length > 0){
            $.ajax({
                url: send_url,
                type: 'POST',
                data: {
                    "text": user_text,
                    "groupId": group_id,
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
                    "groupId": group_id,
                    "type": "group",
                },
                datatype: 'json',
                error: function(result){
                    console.log(result)
                }
            })

            socket.emit("Send Group Image", {"text": user_text, "senderUsername": username, "group_id": group_id})
            
            $(".message-wrapper").append(
                "<div class=\"user-message\"><div class=\"user-message-content\"><img class=\"user-image\" src=" + user_text + "></div></div>")

            $('html, body').scrollTop($(document).height());
        }
    }
}

function isImgUrl(url) {
    return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  }

$(function(){

    //When chat is loaded send to endpoint to mark all unread 
    // message notifications for this group as resolved
    $.ajax({
        url: url_prefix + "/app/notifications/groupmessage/resolve",
        type: 'POST',
        data: {
            "groupId": group_id,
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

    socket.on("Group-Message:" + group_id, function(message){

        $(".message-wrapper").append(
            "<div class=\"group-message\"><div class=\"group-message-content\"><h4>" + message.senderUsername + "</h4><p class=\"message-text\">" + message.text + "</p></div></div>")

        $('html, body').scrollTop($(document).height());

    });

    socket.on("Group-Image:" + group_id, function(message){

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

        window.location.href = url_prefix + "/app/groups"

    });

})