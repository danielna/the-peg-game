$(document).ready(function() {

    var pegBoard = new peggame.Board();

    // todo: select a starting position
    pegBoard.start_game("O");
    

    //
    // Clicking pegs runs the show
    //
    $(".pegs .peg").on("click", function() {
        
        var thisPeg = $(this);
        var thisId = thisPeg.attr("id");

        if (thisPeg.hasClass("possible-move")) {
            
            var activeId = $(".peg.active").attr("id");
            pegBoard.move_peg(activeId, thisId);
            clear_moves();

        } else if (thisPeg.hasClass("on") && !thisPeg.hasClass("active")) {
            
            clear_moves();
            $(this).toggleClass("active");    
            var peg = pegBoard.get_peg(thisId);
            var possible_moves = peg.get_moves_available();
            highlight_possible_moves(possible_moves);

        } else if (thisPeg.hasClass("active")) {           
            clear_moves();
        }
    });

    $("#reset-button").on("click", function() {
        reset_game();
    });

    // todo: refactor this
    var reset_game = function () {
        $(".peg").removeClass("possible-move active on");
        $(".peg").addClass("on");
        $("#pegs-remaining-container > span").text("");
        $("#status span").text("You have not started");
        $("#end-message").html("");
        $("#reset-game").hide();

        $("#O").removeClass("on");
        pegBoard = new peggame.Board();
        pegBoard.start_game("O");
    };


    //
    // Helper functions
    //
    var highlight_possible_moves = function(possible_moves) {
        $.each(possible_moves, function(key, value) {
            var possible = $("#" + key);
            var taken = $("#" + value);
            if (!possible.hasClass("on") && taken.hasClass("on")) {
                possible.toggleClass("possible-move");
            }
        });
    };

    var clear_moves = function() {
        $(".pegs .peg").removeClass("possible-move active");
    };

});