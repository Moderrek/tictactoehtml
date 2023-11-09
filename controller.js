const SIZE = 3;
const CAPACITY = 9;
const EMPTY = " ";
const X = 'X';
const O = 'O';
const SYMBOLS = [X, O];
let turn = null;
let player = null;
let is_game_running = false;
let main_board = [EMPTY, EMPTY, EMPTY,
  EMPTY, EMPTY, EMPTY,
  EMPTY, EMPTY, EMPTY];
let game_state = "";
let win = null;

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const next_turn = () => {
  return turn === X ? O : X;
}

class Bot {
  perform(_board) {
    throw "Bot nie posiada tej funkcji!";
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
      let losowe_pole = randomInt(0, CAPACITY - 1);
      if (is_filled_up(main_board)) throw "Wszystko jest zajęte";
      if (is_occupied(main_board, losowe_pole)) continue;
      set_field(losowe_pole, this.symbol);
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
    this.org_board = Array.from(_board)
    // nie wykonuje ruchu, jeżeli nie jego kolej
    if (turn !== this.symbol) return;
    if (is_filled_up(main_board)) throw "Wszystko jest zajęte";
    // przewidywanie
    for (let i = 0; i < SYMBOLS.length; ++i) {
      let symbol = SYMBOLS[i];
      for (let first = 0; first < CAPACITY; ++first) {
        for (let second = 0; second < CAPACITY; ++second) {

        }
      }
    }
    for (let i = 0; i < CAPACITY; i += 1) {
      this.board = Array.from(this.org_board);
      if (this.board[i] !== " ") continue;
      console.log("Mogę wykonać ruch na " + i);
      this.board[i] = this.symbol;
      let predicted_win = find_win(this.board);
      if (predicted_win.winner == null) continue;
      console.log("Wygra ktoś na polu " + i + " stawiam..");
      set_field(i, this.symbol);
      return;
    }
  }
}

const clear_board = (board = main_board) => {
  for (let i = 0; i < CAPACITY; i += 1) board[i] = EMPTY;
}

const is_filled_up = (board = main_board) => {
  for (let i = 0; i < CAPACITY; i += 1) {
    if (is_field_empty(board, i)) {
      return false;
    }
  }
  return true;
}

const find_wins = (board = main_board, except = [EMPTY]) => {
  // wiersze
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
  // kolumny
  for (let col = 0; col < SIZE; col += 1) {
    let first = board[col];
    if (except.includes(first)) break;
    let indexes = [col];
    for (let row = 1; row < SIZE; row += 1) {
      if (board[col + (row * 3)] !== first) break;
      indexes.push(col + (row * 3))
    }
    if (indexes.length === 3) {
      result.push({ winner: first, pos: indexes });
    }
  }
  // na ukos
  if (!except.includes(board[4]) && board[0] === board[4] && board[4] === board[8]) result.push({ winner: board[4], pos: [0, 4, 8] });
  if (!except.includes(board[4]) && board[2] === board[4] && board[4] === board[6]) result.push({ winner: board[4], pos: [2, 4, 6] });
  return result;
}

const check_end = () => {
  // win = find_win(main_board);
  if (win != null && win.winner != null) {
    game_state = `Wygrał ${win.winner}!`;
    end_game();
    return;
  }
  if (is_filled_up(main_board)) {
    game_state = "REMIS";
    end_game();
    return;
  }
}

const set_field = (index, val) => {
  main_board[index] = val;
  check_end();
}

const set_player = (val) => {
  player = val;
  turn = player;
  update_turn_state();
}

const update_turn_state = () => {
  game_state = `Tura: ${turn}`;
}

const switch_turn = () => {
  turn = (turn === 'X') ? 'O' : 'X';
  update_turn_state();
}

const is_field_empty = (arr, index = 0) => {
  return arr[index] === EMPTY;
}

const is_occupied = (arr, index = 0) => {
  return !is_field_empty(arr, index);
}

const on_field_click = (index) => {
  if (!is_game_running) return;
  if (is_occupied(main_board, index)) return;
  set_field(index, turn);
  if (!is_game_running) return;
  switch_turn();
}

const start_game = () => {
  is_game_running = true;
}

const end_game = () => {
  is_game_running = false;
}