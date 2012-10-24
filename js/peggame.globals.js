//
// Global vars
//
// The board positions:
// ---- A
// --- B C
// -- D E F 
// - G H I J 
//  K L M N O

peggame = {};

peggame.globals = {

    STATE: {
        NOT_STARTED: "Not Started",
        IN_PROGRESS: "In Progress",
        END: "End"
    },

    available_moves: function(position) {
        // current position: moves { potential_move: taken_position}
        var move_map = { 
            A: {
                    D: "B",
                    F: "C"
            }, 
            B: {
                    G: "D",
                    I: "E"
            },  
            C: {
                    H: "E",
                    J: "F"
            }, 
            D: {
                    A: "B",
                    K: "G",
                    F: "E",
                    M: "H"
            }, 
            E: {
                    N: "I",
                    L: "H"
            }, 
            F: {
                    A: "C",
                    D: "E",
                    M: "I",
                    O: "J"
            }, 
            G: {
                    B: "D",
                    I: "H"
            }, 
            H: {
                    C: "E",
                    J: "I"
            },  
            I: {
                    B: "E",
                    G: "H"
            },  
            J: {
                    C: "F",
                    H: "I"
            }, 
            K: {
                    D: "G",
                    M: "L"
            },  
            L: {
                    E: "H",
                    N: "M"
            }, 
            M: {
                    D: "H",
                    F: "I",
                    K: "L",
                    O: "N"
            },  
            N: {
                    E: "I",
                    L: "M"
            },  
            O: {
                    F: "J",
                    M: "N"
            }
        };
        if (move_map[position]) {
            return move_map[position];
        } else {
            throw "No move for that position:" + position;
        }
    }

};
