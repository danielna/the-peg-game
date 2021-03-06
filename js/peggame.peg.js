/*
the Pegs
    - Maintain position
    - Maintain available moves
*/

(function () {
peggame.Peg = function () {

    var 
        position = null,
        moves_available = {};

    this.init = function(set_position) {
        position = set_position;
        moves_available = peggame.globals.available_moves(position);
    };

    this.calculate_moves_available = function(){
        moves_available = peggame.globals.available_moves(position);
    };

    this.get_moves_available = function() { 
        return moves_available;
    };

    this.get_position = function() {
        return position;
    };

    this.set_position = function(set_position){
        position = set_position;
        this.calculate_moves_available();
    };

    this.move_peg_return_removed = function(new_position) {
        this.calculate_moves_available();
        if (moves_available[new_position]) {
            return moves_available[new_position];
        } else {
            console.info("Error!", "move_peg_return_removed returns nothing");
            return "";
        }
    };

    return this;

};
})();