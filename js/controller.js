const SIZE = 3;
const CAPACITY = 9;
const EMPTY = " ";
const X = "X";
const O = "O";
const SYMBOLS = [X, O];
let turn = null;
let player = null;
let is_game_running = false;
let main_board = [
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
  EMPTY,
];
let game_state = "";
let win = null;
let bot = null;

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const next_turn = () => {
  return turn === X ? O : X;
};

class Bot {
  perform(_board) {
    throw "Not implemented!";
  }
}

class EasyBot extends Bot {
  constructor(symbol) {
    super();
    this.symbol = symbol;
  }
  perform(_board) {
    if (turn !== this.symbol) return;
    while (true) {
      if (!is_game_running) break;
      let random_field = randomInt(0, CAPACITY - 1);
      if (is_filled_up(main_board)) throw "Every field is occupied!";
      if (is_occupied(main_board, random_field)) continue;
      set_field(random_field, this.symbol);
      switch_turn();
      update_board_view();
      update_turn_state();
      update_game_state_view();
      break;
    }
  }
}

class HardBot extends Bot {
  symbol;
  debug;

  constructor(symbol, debug = false) {
    super();
    this.symbol = symbol;
    this.debug = debug;
  }

  perform(_board) {
    this.org_board = Array.from(_board);
    // Cannot perform if it's not bot's turn
    if (turn !== this.symbol) return;
    if (is_filled_up(main_board)) throw "Every field is occupied!";
    // Try to win
    for (let symbol of SYMBOLS) {
      for (let first = 0; first < CAPACITY; ++first) {
        if (this.org_board[first] !== " ") continue;
        let virtual_array = Array.from(this.org_board);
        virtual_array[first] = symbol;
        let possible_wins = find_wins(virtual_array);
        if (possible_wins.length > 0) {
          console.log("1 COMPLEX");
          set_field(first, this.symbol);
          return;
        }
        for (let second = 0; second < CAPACITY; ++second) {
          let virtual_array2 = Array.from(virtual_array);
          if (virtual_array2[second] !== " ") continue;
          virtual_array2[second] = symbol;
          possible_wins = find_wins(virtual_array2);
          if (possible_wins.length > 0) {
            let win;
            for (let possible_win of possible_wins) {
              win = possible_win;
              if (possible_win.winner === this.symbol) {
                console.log("CAN WIN!");
                set_field(second, this.symbol);
                return;
              }
            }
            console.log(`2 COMPLEX`);
            while (true) {
              let random = randomInt(0, 2);
              if (is_occupied(this.org_board, win.pos[random])) continue;
              set_field(win.pos[random], this.symbol);
              break;
            }
            return;
          }
        }
      }
    }
    // Random move
    while (true) {
      if (!is_game_running) break;
      let random_field = randomInt(0, CAPACITY - 1);
      if (is_filled_up(main_board)) throw "Every field is occupied!";
      if (is_occupied(main_board, random_field)) continue;
      set_field(random_field, this.symbol);
      break;
    }
  }
}

const clear_board = (board = main_board) => {
  for (let i = 0; i < CAPACITY; i += 1) board[i] = EMPTY;
};

const is_filled_up = (board = main_board) => {
  for (let i = 0; i < CAPACITY; i += 1) {
    if (is_field_empty(board, i)) {
      return false;
    }
  }
  return true;
};

const find_wins = (board = main_board, except = [EMPTY]) => {
  // Rows
  let result = [];
  for (let row = 0; row < SIZE; row += 1) {
    let offset = row * 3;
    let first = board[offset];
    if (except.includes(first)) break;
    let indexes = [offset];
    for (let col = 1; col < SIZE; col += 1) {
      if (board[offset + col] !== first) break;
      indexes.push(offset + col);
    }
    if (indexes.length === 3) {
      result.push({ winner: first, pos: indexes });
    }
  }
  // Columns
  for (let col = 0; col < SIZE; col += 1) {
    let first = board[col];
    if (except.includes(first)) break;
    let indexes = [col];
    for (let row = 1; row < SIZE; row += 1) {
      if (board[col + row * 3] !== first) break;
      indexes.push(col + row * 3);
    }
    if (indexes.length === 3) {
      result.push({ winner: first, pos: indexes });
    }
  }
  // Diagonals
  if (
    !except.includes(board[4]) &&
    board[0] === board[4] &&
    board[4] === board[8]
  )
    result.push({ winner: board[4], pos: [0, 4, 8] });
  if (
    !except.includes(board[4]) &&
    board[2] === board[4] &&
    board[4] === board[6]
  )
    result.push({ winner: board[4], pos: [2, 4, 6] });
  return result;
};

const check_end = () => {
  let wins = find_wins(main_board);
  if (wins.length > 0) win = find_wins(main_board)[0];
  else win = null;
  if (win != null && win.winner != null) {
    game_state = `The ${win.winner} won!`;
    end_game();
    return;
  }
  if (is_filled_up(main_board)) {
    game_state = "DRAW!";
    end_game();
    return;
  }
};

const set_field = (index, val) => {
  main_board[index] = val;
  check_end();
};

const set_player = (val) => {
  player = val;
  turn = player;
  update_turn_state();
};

const update_turn_state = () => {
  game_state = `Turn: ${turn}`;
};

const switch_turn = () => {
  turn = turn === "X" ? "O" : "X";
  update_turn_state();
};

const is_field_empty = (arr, index = 0) => {
  return arr[index] === EMPTY;
};

const is_occupied = (arr, index = 0) => {
  return !is_field_empty(arr, index);
};

const on_field_click = (index) => {
  if (!is_game_running) return;
  if (is_occupied(main_board, index)) return;
  set_field(index, turn);
  if (!is_game_running) return;
  switch_turn();
  perform_bot();
};

const perform_bot = () => {
  if (bot !== null && turn === bot.symbol) {
    bot.perform(main_board);
    switch_turn();
  } else {
    console.log("Bot perform cancelled");
  }
};

const start_game = () => {
  is_game_running = true;
};

const end_game = () => {
  is_game_running = false;
};
