if(window.location.hostname == "localhost"){
    url_prefix = "http://localhost:9000"
} else {
    url_prefix = "https://" + window.location.hostname
}

$(function(){

    $.ajax({
        url: url_prefix + "/app/notifications/group/unread/",
        type: 'GET',
        datatype: 'json',
        success: function(data){
            console.log(data)
            for(let i=0; i< data.group_requests.length; i++){
                if($("#" + data.group_requests[i].senderId + "-alert-counter").hasClass("no-alerts")){
                    $("#" + data.group_requests[i].senderId + "-alert-counter").removeClass("no-alerts")
                }
                let val = parseInt($("#" + data.group_requests[i].senderId + "-alert-counter").text())
                val++
                $("#" + data.group_requests[i].senderId + "-alert-counter").text(val)

                if($("#group-alert-counter").hasClass("no-alerts")){
                    $("#group-alert-counter").removeClass("no-alerts")
                }
                let val_2 = parseInt($("#group-alert-counter").text())
                val_2++
                $("#group-alert-counter").text(val_2)

            }
        }
    });

    $.ajax({
        url: url_prefix + "/app/notifications/direct/unread/",
        type: 'GET',
        datatype: 'json',
        success: function(data){
            for(let i=0; i< data.direct_requests.length; i++){
                if($("#friend-alert-counter").hasClass("no-alerts")){
                    $("#friend-alert-counter").removeClass("no-alerts")
                }
                let val = parseInt($("#friend-alert-counter").text())
                val++
                $("#friend-alert-counter").text(val)
            }
        }
    });

});
