/*
the Game Board
    - Contain pegs
    - Determine the game state -- Not Started: null, In Progress: null, Won: null, Lost
    - Maintain available and taken positions

    The board positions:
    ---- A
    --- B C
    -- D E F 
    - G H I J 
     K L M N O

*/

(function () {
peggame.Board = function () {

    var 
        game_state = peggame.globals.STATE.NOT_STARTED,
        game_board = {};
    
    this.reset = function() {
        game_state              = peggame.globals.STATE.IN_PROGRESS,
        game_board              = { 
            A: null, B: null, C: null, 
            D: null, E: null, F: null, 
            G: null, H: null, I: null, 
            J: null, K: null, L: null, 
            M: null, N: null, O: null 
        };
    };

    this.start_game = function(initial_open_position) { 
        this.reset();

        $.each(game_board, function(key, value) {
            game_board[key] = new peggame.Peg();
            game_board[key].init(key);
        });

        if (initial_open_position) {
            game_board[initial_open_position] = null;
        }

    };

    this.add_peg = function(peg, position) {
        game_board[position] = peg;
    };

    this.remove_peg = function(position) {
        game_board[position] = null;
    };

    // if you can move it, recalc the board and return true.
    // else return false.
    this.move_peg = function(old_pos, new_pos) {
        if (game_board[old_pos]) {
            var peg = game_board[old_pos];
            console.info("old_pos:", old_pos);
            console.info(" and new_pos:", new_pos);
            var result = peg.move_peg_return_removed(new_pos);
            
            if (result !== "") {
                game_board[new_pos] = game_board[old_pos];
                game_board[old_pos] = null;
                game_board[result] = null;
                this.out();
                return true;
            } else {
                console.info("move_peg", "something went wrong with getting the removed peg position");
                return false;
            }

        } else {
            console.info("move_peg", "something went wrong with old_pos");
            return false;
        }
    };

    // set the game_state as in progress or end
    // return -1 if in progress,
    // return remaining pegs if end.
    //
    // todo: need to incorporate this into move_pegs?
    this.calculate_board_state = function() {
        var remaining_pegs = 0;
        $.each(game_board, function(key, value) {
            if (game_board[key]) {
                var moves_available = game_board[key].get_moves_available();
                $.each(moves_available, function(key2, value2) {
                    if (game_board[moves_available[key2]]) {
                        game_state = peggame.globals.STATE.IN_PROGRESS;
                        return -1; 
                    }
                });
                remaining_pegs++;
            }
        });

        // todo: this is screwed up
        game_state = peggame.globals.STATE.END;
        return remaining_pegs;
    };

    this.out = function() {
        $("#main").append(  "remaining_pegs: " + this.calculate_board_state() + "<br/>" +
                            "game_state: " + game_state + "<br/>" + 
                            JSON.stringify(game_board) + "<br/>");
    };

    return this;

};
})();