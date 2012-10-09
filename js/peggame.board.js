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
        game_state              = peggame.globals.STATE.NOT_STARTED,
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

        this.out();
        var that = this;

        game_state  = peggame.globals.IN_PROGRESS

        $.each(game_board, function(key, value) {
            var peg = new peggame.Peg();
            that.add_peg(peg, key);
            game_board[key].init(key);
        });

        if (initial_open_position) {
            that.remove_peg(initial_open_position);
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
            var removed_peg = peg.move_peg_return_removed(new_pos);
            
            if (removed_peg !== "") {
                game_board[new_pos] = game_board[old_pos];
                game_board[new_pos].set_position(new_pos);
                this.remove_peg(old_pos);
                this.remove_peg(removed_peg);
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
        var in_progress = false;
        $.each(game_board, function(key, value) {
            if (value) {
                var moves_available = value.get_moves_available();
                $.each(moves_available, function(key2, value2) {
                    if (game_board[value2]) {
                        game_state = peggame.globals.STATE.IN_PROGRESS;
                        in_progress = true;
                        return false; 
                    }
                });
                remaining_pegs++;

            }
        });

        if (in_progress) {
            return remaining_pegs;
        }

        if (game_state !== peggame.globals.STATE.NOT_STARTED) {
            game_state = peggame.globals.STATE.END;
            this.end_game(remaining_pegs);
            return false;
        }
    };

    this.out = function() {
        $("#main").append(  "remaining_pegs: " + this.calculate_board_state() + "<br/>" +
                            "game_state: " + game_state + "<br/>" + 
                            JSON.stringify(game_board) + "<br/><br/>");
    };

    this.end_game = function(remaining_pegs) {
        if (remaining_pegs >= 4) {
            $("#main").append(  "<p>Over 3 pieces left!</p> " + 
                                "<p>You are an <strong>EG-NO-RA-MOOSE</strong></p>");
        } else if (remaining_pegs === 3) {
            $("#main").append(  "<p>3 pieces left!</p> " + 
                                "<p>You are <strong>JUST PLAIN DUMB</strong></p>");
        } else if (remaining_pegs === 2) {
            $("#main").append(  "<p>2 pieces left!</p> " + 
                                "<p>You are <strong>PRETTY SMART</strong></p>");
        } else if (remaining_pegs === 1) {
            $("#main").append(  "<p>1 pieces left!</p> " + 
                                "<p>You are a <strong>GENIUS!</strong></p>");
        } else {
            throw "Something went wrong at the end of the game!";
        }
    };

    return this;

};
})();