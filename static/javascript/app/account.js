$(function(){

    if(window.location.hostname == "localhost"){
        url_prefix = "http://localhost:9000"
    } else {
        url_prefix = "https://" + window.location.hostname
    }

    $("#back-button").click(function(){
        window.location.href = url_prefix + "/app/groups"
    });

});