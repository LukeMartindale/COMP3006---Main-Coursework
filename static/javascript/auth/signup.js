$(function(){

    let signup_url = "http://"+ window.location.host + "/auth/signup/"

    $("#signup-signup-button").click(function(){

        let username = $('#username').val()
        let password = $('#password').val()

        if(username != ""){
            $.ajax({
                url: signup_url,
                type: 'POST',
                data: {
                    "username": username,
                    "password": password
                },
                datatype: 'json',
                success: function(result){
                    window.location.replace("https://"+ window.location.host + "/auth/login/")
                },
                error:  function(result){
                    if(result.responseJSON.message == 'Username already exists!'){
                        $("#password-error-box").empty()
                        $("#username-error-box").empty().append(result.responseJSON.message)
                    }
                    if(result.responseJSON.message == 'Username cannot be empty!'){
                        $("#password-error-box").empty()
                        $("#username-error-box").empty().append(result.responseJSON.message)
                    }
                }
            });
        } else {
            $("#password-error-box").empty()
            $("#username-error-box").empty().append("Username cannot be empty!")
        }



    });

    $("#signup-login-button").click(function(){

        window.location.replace("https://"+ window.location.host + "/auth/login/")

    });


});