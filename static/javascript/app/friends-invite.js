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
            console.log("Friend Request Sent!")
        },
        error: function(result){
            console.log(result)
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