$(function(){

    let signup_url = "http://localhost:9000/auth/signup/"

    $("#signup-signup-button").click(function(){

        let username = $('#username').val()
        let password = $('#password').val()

        $.ajax({
            url: signup_url,
            type: 'POST',
            data: {
                "username": username,
                "password": password
            },
            datatype: 'json',
            success: function(result){
                window.location.replace("http://localhost:9000/auth/login/")
            },
            error:  function(result){
                if(result.responseJSON.message == 'Username already exists!'){
                    $("#password-error-box").empty()
                    $("#username-error-box").empty().append(result.responseJSON.message)
                }
            }
        });

    });

    $("#signup-login-button").click(function(){

        window.location.replace("http://localhost:9000/auth/login/")

    });


});