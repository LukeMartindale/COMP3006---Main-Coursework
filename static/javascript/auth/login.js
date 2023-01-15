$(function(){

    if(window.location.hostname == "localhost"){
        url_prefix = "http://localhost:9000"
    }

    console.log(window.location.hostname)
    console.log(window.location.host)

    let login_url = url_prefix + "/auth/login/"

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
                window.location.href = url_prefix + "/app/groups"
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

        window.location.replace(url_prefix + "/auth/signup/")

    });

})