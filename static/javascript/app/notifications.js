$(function(){

    $(".notification-friend-accept").click(function(){

        let accept_url = "http://localhost:9000/app/notifications"

        $.ajax({
            url: accept_url,
            type: 'POST',
            data: {
                "request_id": this.id
            },
            datatype: 'json',
            success: function(result){
                console.log(result)
                location.reload()
            },
            error: function(result){
                console.log(result)
            }
        })

    });

    $(".notification-friend-decline").click(function(){

        alert(this.id)

    });

    $(".notification-group-accept").click(function(){

        alert(this.id)

        let accept_url = "http://localhost:9000/app/notifications"

        $.ajax({
            url: accept_url,
            type: 'POST',
            data: {
                "request_id": this.id
            },
            datatype: 'json',
            success: function(result){
                console.log(result)
                location.reload()
            },
            error: function(result){
                console.log(result)
            }
        })

    });

    $(".notification-clear").click(function(){

        alert(this.id)

    });

})