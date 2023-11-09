const EMPTY = " ";
const SIZE = 3;
const CAPACITY = 9;
const SYMBOLS = ['X', 'O']

let turn = null;
let player = null;
let is_game_running = false;
let board = [EMPTY, EMPTY, EMPTY,
  EMPTY, EMPTY, EMPTY,
  EMPTY, EMPTY, EMPTY];
let game_state = "";
let win = null;

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Bot {
  perform(playboard) {
    throw "Bot nie posiada tej funkcji!";
  }
}

class EasyBot extends Bot {
  constructor(symbol) {
    super();
    this.symbol = symbol;
  }
  perform(playboard) {
    if (turn != this.symbol) return;
    while (true) {
      if (!is_game_running) break;
      let losowe_pole = randomInt(0, CAPACITY - 1);
      if (is_filled_up(board)) throw "Wszystko jest zajęte";
      if (is_occupied(losowe_pole)) continue;
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
  constructor(symbol) {
    super();
    this.symbol = symbol;
  }  
  perform(playboard) {
    this.org_board = Array.from(playboard)
    // nie wykonuje ruchu jezeli nie jego kolej
    if (turn != this.symbol) return;
    if (is_filled_up(board)) throw "Wszystko jest zajęte";
    // przewidywanie
    for (let i = 0; i < CAPACITY; i += 1) {
      this.board = Array.from(this.org_board);
      if (this.board[i] != " ") continue;
      console.log("Moge wykonac ruch na " + i);
      this.board[i] = this.symbol;
      let predicted_win = find_win(this.board);
      if (predicted_win.winner == null) continue;
      console.log("Wygra ktoś na polu " + i + " stawiam..");
      set_field(i, this.symbol);
      switch_turn();
      update_board_view();
      update_turn_state();
      update_game_state_view();
      return;
    }
    // losowe
    console.log("Losuje nie wygram zadnym ruchem")
    while (true) {
      if (!is_game_running) break;
      let losowe_pole = randomInt(0, CAPACITY - 1);
      if (is_filled_up(board)) throw "Wszystko jest zajęte";
      if (is_occupied(losowe_pole)) continue;
      set_field(losowe_pole, this.symbol);
      switch_turn();
      update_board_view();
      update_turn_state();
      update_game_state_view();
      break;
    }
  }
}

const clear_board = (board) => {
  for (let i = 0; i < CAPACITY; i += 1) board[i] = EMPTY;
}

const is_filled_up = (board) => {
  for (let i = 0; i < CAPACITY; i += 1) {
    if (is_field_empty(i)) {
      return false;
    }
  }
  return true;
}

const find_win = (board, except = [EMPTY]) => {
  // wiersze
  for (let row = 0; row < SIZE; row += 1) {
    let offset = row * 3;
    let first = board[offset];
    if (except.includes(first)) break;
    let indxs = [offset];
    for (let col = 1; col < SIZE; col += 1) {
      if (board[offset + col] !== first) break;
      indxs.push(offset + col);
    }
    if (indxs.length === 3) return { winner: first, pos: indxs };
  }
  // kolumny
  for (let col = 0; col < SIZE; col += 1) {
    let first = board[col];
    if (except.includes(first)) break;
    let indxs = [col];
    for (let row = 1; row < SIZE; row += 1) {
      if (board[col + (row * 3)] !== first) break;
      indxs.push(col + (row * 3))
    }
    if (indxs.length === 3) return { winner: first, pos: indxs };
  }
  // na ukos
  if (!except.includes(board[4]) && board[0] === board[4] && board[4] == board[8]) return { winner: board[4], pos: [0, 4, 8] };
  if (!except.includes(board[4]) && board[2] === board[4] && board[4] == board[6]) return { winner: board[4], pos: [2, 4, 6] };
  return { winner: null, pos: [] };
}

const check_end = () => {
  win = find_win(board);
  if (win.winner != null) {
    game_state = `Wygrał ${win.winner}!`;
    end_game();
    return;
  }
  if (is_filled_up(board)) {
    game_state = "REMIS";
    end_game();
    return;
  }
}

const set_field = (index, val) => {
  board[index] = val;
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

const is_field_empty = (index) => {
  return board[index] === EMPTY;
}

const is_occupied = (index) => {
  return !is_field_empty(index);
}

const on_field_click = (index) => {
  if (!is_game_running) return;
  if (is_occupied(index)) return;
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