$(function(){

    let create_url = "http://localhost:9000/app/groups/creategroup/"

    $("#create-button").click(function() {

        let group_name = $('#create-group').val()

        if(group_name != ""){
            $.ajax({
                url: create_url,
                type: 'POST',
                data: {
                    "group_name": group_name,
                },
                datatype: 'json',
                success: function(result){
                    window.location.href = "http://localhost:9000/app/groups"
                },
                error: function(result){
                    $("#group-error-box").empty().append(result.responseJSON.message)
                }
    
            })
        } else {
            $("#group-error-box").empty().append("Group name cannot be empty!")
        }



    })

})