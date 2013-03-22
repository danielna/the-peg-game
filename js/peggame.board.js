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
        remaining_pegs,
        dom_pointers = {},
        starting_position,
        $peg,
        $pegs_remaining_count,
        $status_msg,
        $start_message,
        $end_message,
        $reset_button,
        $reset_game_container;
    

     /*
      * Run the show.
      * 
      * Set jquery objects to cache.
      * Set the initial open position and the click events.
      */
    var start_game = function(initial_open_position, set_dom_pointers) { 
        var _this = this;
      
        starting_position = initial_open_position;
        dom_pointers = set_dom_pointers;

        $pegs = $(dom_pointers.pegs);
        $pegs_remaining_count = $(dom_pointers.pegs_remaining_count);
        $status_msg = $(dom_pointers.status_msg);
        $end_message = $(dom_pointers.end_message);
        $reset_button = $(dom_pointers.reset_button);
        $reset_game_container = $(dom_pointers.reset_game_container);

        remaining_pegs = 15;

        reset();
        out();
        game_state = peggame.globals.STATE.IN_PROGRESS;

        $.each(game_board, function(key, value) {
            var peg = new peggame.Peg();
            add_peg(peg, key);
            game_board[key].init(key);
        });

        if (starting_position) {
            remove_peg(starting_position);
        }

        if (!window.setClickEvents) {
            manageClickEvents();
        }
    };


     /*
      * Let the board manage its own interactions.
      */
    var manageClickEvents = function() {

        /** 
         * Add peg click events
         * 
         * (1) If clicked peg is a possible move, move the currently active peg to this peg and clear all moves.
         * (2) Else if clicked peg exists on the board and it's not currently active, activate it and highlight potential moves.
         * (3) Else if clicked peg is active, user is deactivating it.  Clear all moves.
         */
         window.setClickEvents = true;

        $pegs.on("click", function() {
            
            var $peg = $(this), //jq object
                thisId = $peg.attr("id"),
                activeId = $pegs.filter(".active").attr("id");

            if ($peg.hasClass("possible-move")) {
                
                move_peg(activeId, thisId);
                clear_moves();

            } else if ($peg.hasClass("on") && !$peg.hasClass("active")) {
                var peg = get_peg(thisId),  // object
                    possible_moves = peg.get_moves_available();

                clear_moves();
                $peg.toggleClass("active");    
                highlight_possible_moves(possible_moves);

            } else if ($peg.hasClass("active")) {          

                clear_moves();
            
            }
        });

        /*
         * Highlight possible moves on the board, relative to the active peg.
         */
        var highlight_possible_moves = function(possible_moves) {
            $.each(possible_moves, function(key, value) {
                var possible = $("#" + key),
                    taken = $("#" + value);

                if (!possible.hasClass("on") && taken.hasClass("on")) {
                    possible.toggleClass("possible-move");
                }
            });
        };

        /*
         * Reset possible moves and the active peg from the board.
         */
        var clear_moves = function() {
            $pegs.removeClass("possible-move active");
        };


        /** 
         * Click the reset button
         */
        $reset_button.on("click", function() {
            $pegs.removeClass("possible-move active on").addClass("on");
            $pegs_remaining_count.text("");
            $status_msg.text("Not Started");
            $end_message.html("");
            $reset_game_container.hide();
            
            reset();
            $("#" + starting_position).removeClass("on");

            start_game(starting_position, dom_pointers);
        });

    };


    /** 
     * Reset the board
     */
    var reset = function() {
        game_state = peggame.globals.STATE.NOT_STARTED,
        game_board  = { 
            A: null, B: null, C: null, 
            D: null, E: null, F: null, 
            G: null, H: null, I: null, 
            J: null, K: null, L: null, 
            M: null, N: null, O: null 
        };
    };


    /** 
     * Return the peg at a given position
     */
    var get_peg = function(position) {
        return game_board[position];
    };


    /** 
     * Add a peg at a given position
     */
    var add_peg = function(peg, position) {
        game_board[position] = peg;

        $("#" + position).addClass("on");
    };


    /** 
     * Remove a peg at a given position
     */
    var remove_peg = function(position) {
        game_board[position] = null;
        remaining_pegs--;

        $("#" + position).removeClass("on");

    };


    /** 
     * Reassign a peg to a new position.
     * Assign the old position to null (empty).
     */
    var reassign_peg = function(old_pos, new_pos) {
        game_board[new_pos] = game_board[old_pos];
        game_board[new_pos].set_position(new_pos);
        game_board[old_pos] = null;
        
        $("#" + new_pos).addClass("on");
        $("#" + old_pos).removeClass("on");
    };


    /** 
     * Move a peg from an old position to a new position.
     *
     * If you can move the peg to a new position, recalculate the board and return true.
     * Else return false.
     */
    var move_peg = function(old_pos, new_pos) {
        if (game_board[old_pos]) {
            
            var peg = game_board[old_pos],
                removed_peg = peg.move_peg_return_removed(new_pos);
            
            if (removed_peg !== "") {
                reassign_peg(old_pos, new_pos);
                remove_peg(removed_peg);
                out();

                // after moving/removing, check if the game is over
                if (is_the_game_over()){
                    game_state = peggame.globals.STATE.END;
                    out();
                    end_game();
                }
                
                return true;
            
            } else {
                console.error("move_peg", "something went wrong with getting the removed peg position");
                return false;
            }

        } else {
            console.error("move_peg", "something went wrong with old_pos");
            return false;
        }
    };

    
    /** 
     * Check if the game is over
     *
     * return true if the game is still in progress,
     * return false if the game is over
     */
    var is_the_game_over = function() {
        
        // Base assumption: the game is over. Easier/faster to falsify this than prove it.
        var in_progress = false;
        
        // Check each peg that's still on game board.
        $.each(game_board, function(key, value) {
            if (value) {
                var moves_available = value.get_moves_available();

                // Check the position of the available moves on the board
                // If they're not taken, then there are still moves left for at least one peg.
                // So set the state to in_progress and return false at the first instance of an available move.
                // For a move to be "available", the taken peg must exist and the potential move must not be taken.
                $.each(moves_available, function(key2, value2) {
                    if (game_board[value2] && (!game_board[key2])) {
                        game_state = peggame.globals.STATE.IN_PROGRESS;
                        in_progress = true;
                        return false; 
                    }
                });
            }
        });

        // If you got here, the game is over... as long as the game has started.
        if (!in_progress && (game_state !== peggame.globals.STATE.NOT_STARTED)) {
            game_state = peggame.globals.STATE.END;
            return true;
        }
    };


    /** 
     * Output the status of the game at any given time.
     *
     * Includes remaining peg count and status message.
     */
    var out = function() {
        $pegs_remaining_count.text(remaining_pegs);
        $status_msg.html(game_state);
    };


    /** 
     * End the game.
     *
     * Display the appropriate message.
     */
    var end_game = function() {
        $reset_game_container.show();
        if (remaining_pegs >= 4) {
            $end_message.append(  "<p>Over 3 pieces left!</p> " + 
                                "<p>You are an <strong>EEG-NO-RA-MOOSE</strong></p>" + 
                                "<img src='img/moose.jpg'/>");
        } else if (remaining_pegs === 3) {
            $end_message.append(  "<p>3 pieces left!</p> " + 
                                "<p>You are <strong>JUST PLAIN DUMB</strong></p>" + 
                                "<img src='img/dumb.jpg'/>");
        } else if (remaining_pegs === 2) {
            $end_message.append(  "<p>2 pieces left!</p> " + 
                                "<p>You are <strong>PRETTY SMART</strong></p>" + 
                                "<img src='img/prettysmart.jpg'/>");
        } else if (remaining_pegs === 1) {
            $end_message.append(  "<p>1 pieces left!</p> " + 
                                "<p>You are a <strong>GENIUS!</strong></p>" + 
                                "<img src='img/genius.jpg'/>");
        } else {
            console.error("Something went wrong at the end of the game!");
        }
    };

    return {
        start_game: start_game
    };

};
})();