$(function(){

    if(window.location.hostname == "localhost"){
        url_prefix = "http://localhost:9000"
    }

    $("#back-button").click(function(){
        window.location.href = url_prefix + "/app/groups"
    });

});