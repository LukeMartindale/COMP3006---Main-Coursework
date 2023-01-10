$(function(){

    let login_url = "http://"+ window.location.host + "/auth/login/"

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
                window.location.href = "https://"+ window.location.host + "/app/groups"
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

        window.location.replace("https://"+ window.location.host + "/auth/signup/")

    });

})