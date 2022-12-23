let socket = io("http://localhost:9000");

function sendMessage() {

    let send_url = "http://localhost:9000/chat/group/"
    let user_text = $("#chat-input").val()

    console.log(user_text.length > 0)

    if(user_text.length > 0){
        $.ajax({
            url: send_url,
            type: 'POST',
            data: {
                "text": user_text,
                "groupId": group_id,
                "senderUsername": username,
            },
            datatype: 'json',
            success: function(result){
                console.log("Message Sent!")
            },
            error: function(result){
                console.log(result)
            }
        });

        socket.emit("Send Group Message", {"text": user_text, "senderUsername": username, "group_id": group_id})

        $(".message-wrapper").append(
            "<div class=\"user-message\"><div class=\"user-message-content\"><p class=\"message-text\">" + user_text + "</p></div></div>")
    
        $('html, body').scrollTop($(document).height());

    }



}

$(function(){

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

    $(".back-button").click(function(){

        window.location.href = "http://localhost:9000/app/groups"

    });

})