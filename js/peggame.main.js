$(document).ready(function() {

    var pegBoard = new peggame.Board();
    pegBoard.start_game("A");

    pegBoard.move_peg("D", "A");

    pegBoard.move_peg("K", "D");

});