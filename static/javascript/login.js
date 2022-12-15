$(function(){

    let signup_url = "http://localhost:9000/auth/signup/"
    let login_url = "http://localhost:9000/auth/login/"

    $("#signup-button").click(function(){

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
                console.log("Signup")
                console.log(result)
            },
            error:  function(result){
                console.log("Signup Error")
                console.log(result)
            }
        })

    })

    $("#login-button").click(function(){

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
                console.log("Login")
                console.log(result)
                window.location.replace("http://localhost:9000/auth/loggedin/")
            },
            error:  function(result){
                console.log("Login Error")
                console.log(result)
                console.log(result.responseJSON)
            }
        })

    })

})