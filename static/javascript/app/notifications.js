$(function(){

    $(".notification-friend-accept").click(function(){

        let accept_url = "http://localhost:9000/app/notifications"

        $.ajax({
            url: accept_url,
            type: 'POST',
            data: {
                "request_id": this.id,
                "type": "accept",
            },
            datatype: 'json',
            success: function(result){
                location.reload()
            },
            error: function(result){
                console.log(result)
            }
        })

        location.reload()

    });

    $(".notification-friend-decline").click(function(){

        let decline_url = "http://localhost:9000/app/notifications"

        $.ajax({
            url: decline_url,
            type: 'POST',
            data: {
                "request_id": this.id,
                "type": "decline",
            },
            datatype: 'json',
            success: function(result){
                location.reload()
            },
            error: function(result){
                console.log(result)
            }
        })

        location.reload()

    });

    $(".notification-group-accept").click(function(){

        let accept_url = "http://localhost:9000/app/notifications"

        $.ajax({
            url: accept_url,
            type: 'POST',
            data: {
                "request_id": this.id,
                "type": "accept",
            },
            datatype: 'json',
            success: function(result){
                location.reload()
            },
            error: function(result){
                console.log(result)
            }
        })

        location.reload()

    });

    $(".notification-group-decline").click(function(){

        let decline_url = "http://localhost:9000/app/notifications"

        $.ajax({
            url: decline_url,
            type: 'POST',
            data: {
                "request_id": this.id,
                "type": "decline",
            },
            datatype: 'json',
            success: function(result){
                location.reload()
            },
            error: function(result){
                console.log(result)
            }
        })

        location.reload()

    });

    $(".notification-clear").click(function(){

        alert(this.id)

    });

})