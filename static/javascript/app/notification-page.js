if(window.location.hostname == "localhost"){
    url_prefix = "http://localhost:9000"
}

$(function(){

    $.ajax({
        url: url_prefix + "/app/notifications/group/unread/",
        type: 'GET',
        datatype: 'json',
        success: function(data){
            console.log(data)
            for(let i=0; i< data.group_requests.length; i++){
                if($("#group-alert-counter").hasClass("no-alerts")){
                    $("#group-alert-counter").removeClass("no-alerts")
                }
                let val = parseInt($("#group-alert-counter").text())
                val++
                $("#group-alert-counter").text(val)
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