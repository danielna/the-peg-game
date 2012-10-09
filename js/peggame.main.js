$(document).ready(function() {

    var pegBoard = new peggame.Board();
    pegBoard.start_game("A");

    pegBoard.move_peg("D", "A"); //B

    pegBoard.move_peg("K", "D"); //G

    pegBoard.move_peg("M", "K"); //L

    pegBoard.move_peg("O", "M"); //N

    pegBoard.move_peg("F", "O"); //J

    pegBoard.move_peg("A", "F"); //C

    pegBoard.move_peg("E", "L"); //H

    pegBoard.move_peg("L", "N"); //M

    pegBoard.move_peg("F", "M"); //I

    pegBoard.move_peg("N", "L"); //M

    pegBoard.move_peg("K", "M"); //L

});