
$(document).ready(function() {

    var peg_board,
        dom_pointers = {
            pegs: ".peg",
            pegs_remaining_count: "#pegs-remaining-container span",
            status_msg: "#status span",
            start_message: "#start-message",
            end_message: "#end-message",
            reset_button: "#reset-button",
            reset_game_container: "#reset-game-container"
        };


    /**
     *  Intialize a new game.
     */
    pegBoard = new peggame.Board();
    
    // ToDo: On game reset, give the option of resetting the starting peg position. 
    $(dom_pointers.pegs).on("click", function start_game() {
        var id = $(this).attr("id");
        pegBoard.start_game(id, dom_pointers);

        $(dom_pointers.start_message).hide();
        $(dom_pointers.pegs).off("click", start_game);
    });    

    /**
     * Help menu
     */
    $('#help').avgrund({
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

});