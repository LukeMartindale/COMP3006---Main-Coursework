$(function(){

    if(window.location.hostname == "localhost"){
        url_prefix = "http://localhost:9000"
    }

    let logout_url = url_prefix + "/auth/logout/"

    $("#logout-button").click(function(){

        $.ajax({
            url: logout_url,
            type: 'POST',
            datatype: 'json',
            success: function(result){
                window.location.replace(url_prefix + "/auth/login/")
            }
        })

    })

});