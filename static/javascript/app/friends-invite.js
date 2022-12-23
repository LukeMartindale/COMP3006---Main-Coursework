let socket = io("http://localhost:9000");

function inviteFriend(){

    let invite_url = "http://localhost:9000/app/friends/invitefriend"
    let friend_id = $("#invite-member").val()

    $.ajax({
        url: invite_url,
        type: 'POST',
        data: {
            "recipientId": friend_id,
        },
        datatype: 'json',
        success: function(result){
            socket.emit("Friend Request Sent", {"friendId": friend_id})
        },
        error: function(result){
            if(result.responseJSON.message == "Already sent friend request to this user!"){
                $(".error-box").empty().append("Already sent friend request to this user!")
            }

        }
    })

}

$(function(){

    $("#invite-button").click(function(){

        inviteFriend();

    });

    $("#invite-member").keypress(function(e) {
        if(e.which === 13) {
            inviteFriend();
        }
    })

});