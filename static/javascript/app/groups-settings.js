$(function(){
    

    $("#invite-button").click(function(){

        invite_url = "http://localhost:9000/chat/group/invite"
        console.log(group_id)

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
                    console.log("Success")
                },
                error: function(result){
                    console.log(result)
                }

            });

            alert("Not Blank")
        } else {

            alert("Blank")
        }

        alert(temp)

    });

});