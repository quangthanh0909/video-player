$(document).ready(function(){
    $("#btnUp").click(function(){
        $("#listVid").slideToggle();
    });

    $(".cap1").click(function(){
        alert(1);
        $(this).next().slideToggle();
    })
});