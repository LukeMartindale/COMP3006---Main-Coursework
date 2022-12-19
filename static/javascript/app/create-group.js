$(function(){

    let create_url = "http://localhost:9000/app/groups/creategroup/"

    $("#create-button").click(function() {

        let group_name = $('#create-group').val()

        $.ajax({
            url: create_url,
            type: 'POST',
            data: {
                "group_name": group_name,
            },
            datatype: 'json',
            success: function(result){
                alert("Group Created")
            }

        })

    })

})