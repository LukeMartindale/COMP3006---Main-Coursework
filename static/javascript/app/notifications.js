$(function(){

    $(".notification-accept").click(function(){

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
            },
            error: function(result){
                console.log(result)
            }
        })

    });

    $(".notification-decline").click(function(){

        alert(this.id)

    });

    $(".notification-clear").click(function(){

        alert(this.id)

    });

})