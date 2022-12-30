$(function(){

    $.ajax({
        url: "http://localhost:9000/app/notifications/direct/unread/",
        type: 'GET',
        datatype: 'json',
        success: function(data){
            console.log(data)
            for(let i=0; i< data.direct_requests.length; i++){
                if($("#" + data.direct_requests[i].senderId + "-alert-counter").hasClass("no-alerts")){
                    $("#" + data.direct_requests[i].senderId + "-alert-counter").removeClass("no-alerts")
                }
                let val = parseInt($("#" + data.direct_requests[i].senderId + "-alert-counter").text())
                val++
                $("#" + data.direct_requests[i].senderId + "-alert-counter").text(val)
            }
        }
    });

});