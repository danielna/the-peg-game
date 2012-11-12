$(document).ready(function() {

    var pegBoard = new peggame.Board();

    // todo: select a starting position
    pegBoard.start_game("O");
    
    //
    // Help
    $('#help-me').avgrund({
        height: 300,
        holderClass: 'custom',
        showClose: true,
        showCloseText: 'Close',
        enableStackAnimation: true,
        onBlurContainer: '.wrapper',
        template: '<h2>The Peg Game</h2>' +
        '<p>Inspired by the mental anguish of the popular Cracker Barrel game.</p>' + 
        '<p>The goal is to have one peg remaining.</p>' + 
        '<p>Remove pegs by jumping over them.  Red pegs are clickable, blue are active and yellow areas designate possible moves.</p>' + 
        '<p>View the source on <a href="https://github.com/danielna/the-peg-game" title="Github" target="_blank">github</a>. It\'s a continual work in progress. </p>'
    });

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