/*
the Game Board
    - Contain pegs
    - Determine the game state -- Not Started, In Progress, End
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
        game_board = {},
        remaining_pegs = 15;
    
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

        game_state  = peggame.globals.STATE.IN_PROGRESS;

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
        remaining_pegs--;
    };

    this.reassign_peg = function(old_pos, new_pos) {
        game_board[new_pos] = game_board[old_pos];
        game_board[new_pos].set_position(new_pos);
        game_board[old_pos] = null;
    };

    // if you can move it, recalc the board and return true.
    // else return false.
    this.move_peg = function(old_pos, new_pos) {
        if (game_board[old_pos]) {
            var peg = game_board[old_pos];
            var removed_peg = peg.move_peg_return_removed(new_pos);
            
            if (removed_peg !== "") {
                this.reassign_peg(old_pos, new_pos);
                this.remove_peg(removed_peg);
                this.out();
                if (this.is_the_game_over()){
                    this.end_game();
                }
                
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

    // Is the game still in progress or over?
    // return true for yes, false for no
    this.is_the_game_over = function() {
        // base assumption: the game is over.
        // easier to falsify this than prove it.
        var in_progress = false;
        
        // check each peg that's still on game board
        // get its available moves
        $.each(game_board, function(key, value) {
            if (value) {
                var moves_available = value.get_moves_available();

                // check the position of the available moves on the board
                // if they're not taken, then there are still moves left for at least one peg.
                // so set the state to in_progress and return false at the first instance of an available move.
                $.each(moves_available, function(key2, value2) {
                    if (game_board[value2]) {
                        game_state = peggame.globals.STATE.IN_PROGRESS;
                        in_progress = true;
                        return false; 
                    }
                });

            }
        });

        // if you got here, the game is over
        if (!in_progress && (game_state !== peggame.globals.STATE.NOT_STARTED)) {
            game_state = peggame.globals.STATE.END;
            return true;
        }
    };

    this.out = function() {
        $("#main").append(  "remaining_pegs: " + remaining_pegs + "<br/>" +
                            "game_state: " + game_state + "<br/>" + 
                            JSON.stringify(game_board) + "<br/><br/>");
    };

    this.end_game = function() {
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