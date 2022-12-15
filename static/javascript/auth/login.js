$(function(){

    let login_url = "http://localhost:9000/auth/login/"

    $("#login-login-button").click(function(){

        let username = $('#username').val()
        let password = $('#password').val()

        $.ajax({
            url: login_url,
            type: 'POST',
            data: {
                "username": username,
                "password": password
            },
            datatype: 'json',
            success: function(result){
                window.location.href = "http://localhost:9000/auth/loggedin/"
            },
            error:  function(result){
                if(result.responseJSON.message == 'User Not Found'){
                    $("#password-error-box").empty()
                    $("#username-error-box").empty().append(result.responseJSON.message)
                }
                else if(result.responseJSON.message == 'Invalid Password!'){
                    $("#username-error-box").empty()
                    $("#password-error-box").empty().append(result.responseJSON.message)
                }
            }
        });

    });

    $("#login-signup-button").click(function(){

        window.location.replace("http://localhost:9000/auth/signup/")

    });

})