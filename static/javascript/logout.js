$(function(){

    let logout_url = "http://localhost:9000/auth/logout/"

    $("#logout-button").click(function(){

        $.ajax({
            url: logout_url,
            type: 'POST',
            datatype: 'json',
            success: function(result){
                console.log("Signup")
                console.log(result)
            }
        })

    })

});