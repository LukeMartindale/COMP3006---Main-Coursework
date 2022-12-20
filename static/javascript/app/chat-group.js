function sendMessage() {

    let send_url = "http://localhost:9000/chat/group/"
    let user_text = $("#chat-input").val()

    $.ajax({
        url: send_url,
        type: 'POST',
        data: {
            "text": user_text,
            "groupId": group_id
        },
        datatype: 'json',
        success: function(result){
            console.log("Message Sent!")
        },
        error: function(result){
            console.log(error)
        }
    });

}

$(function(){

    // Prevent From going to newline on pressing enter key nd send message on enter key press.
    $("#chat-input").keypress(function(e) {
        if(e.which === 13 && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    })

    $("#send-button").click(function() {

        sendMessage();

    });



})