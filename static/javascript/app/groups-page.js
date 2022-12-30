$(function(){

    $.ajax({
        url: "http://localhost:9000/app/notifications/unread/",
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
            }
        }
    });

});
