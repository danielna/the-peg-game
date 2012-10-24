//
// Manage game events
// 

$(document).ready(function() {

    $(".pegs .peg").on("click", function() {
        $(this).toggleClass("active");
    });

});