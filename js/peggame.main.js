
$(document).ready(function() {

    var peg_board,
        dom_pointers = {
            pegs: ".peg",
            pegs_remaining_count: "#pegs-remaining-container span",
            status_msg: "#status span",
            end_message: "#end-message",
            reset_button: "#reset-button",
            reset_game_container: "#reset-game-container"
        };


    /**
     *  Intialize a new game.
     */
    pegBoard = new peggame.Board();
    // ToDo: Allow players to select a starting position.
    pegBoard.start_game("O", dom_pointers);
    

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