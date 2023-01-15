if(window.location.hostname == "localhost"){
    url_prefix = "http://localhost:9000"
} else {
    url_prefix = "https://" + window.location.hostname
}

$(function(){
    
    $("#invite-button").click(function(){

        invite_url = url_prefix + "/chat/group/invite"

        let value = $('#member-select').find(":selected").val();
        if(value != "blank"){

            $.ajax({
                url: invite_url,
                type: 'POST',
                data: {
                    "recipientId": value,
                    "groupId": group_id,
                },
                datatype: 'json',
                success: function(result){
                    $(".error-box").empty().append("Invite to group sent")
                    socket.emit("Group Invite Sent", {"recipientId": value, "groupId": group_id})
                },
                error: function(result){
                    if(result.responseJSON.message == "User is already in group!"){
                        $(".error-box").empty().append(result.responseJSON.message)
                    }
                    if(result.responseJSON.message == "User has already been invited!"){
                        $(".error-box").empty().append(result.responseJSON.message)
                    }
                }

            });
        } else {
            $(".error-box").empty().append("Please select a friend to invite!")
        }

    });

    $("#leave-button").click(function(){

        leave_url = url_prefix + "/chat/group/leave"

        $.ajax({
            url: leave_url,
            type: 'POST',
            data: {
                "groupId": group_id,
            },
            datatype: 'json',
            success: function(result){
                window.location.replace(url_prefix + "/app/groups")
            },
            error: function(result){
                console.log(result)
            }

        })

    });

    $("#delete-button").click(function(){

        delete_url = url_prefix + "/chat/group/delete"

        $.ajax({
            url: delete_url,
            type: 'POST',
            data: {
                "groupId": group_id,
            },
            datatype: 'json',
            success: function(result){
                window.location.replace(url_prefix + "/app/groups")
            },
            error: function(result){
                console.log(result)
            }

        })

    })

    $("#back-button").click(function(){

        window.location.href = url_prefix + "/chat/group/" + group_id

    });

});