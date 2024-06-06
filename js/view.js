const fields = document.querySelectorAll(".field");
const state = document.querySelector("#state");
const start_menu = document.querySelector("#buttons");
const btn_choose_x = document.querySelector('#button-x');
const btn_choose_o = document.querySelector('#button-o');

const update_game_state_view = () => {
    state.innerHTML = game_state;
}

const hide_start = () => {
    start_menu.classList.add("hidden");
}

const show_start = () => {
    start_menu.classList.remove("hidden");
}

// Choose player
btn_choose_x.addEventListener('click', () => {
    if (is_game_running) return;
    after_choose('X')
});
btn_choose_o.addEventListener('click', () => {
    if (is_game_running) return;
    after_choose('O')
});

const after_choose = (player) => {
    console.log(`Player: ${player}`)
    set_player(player);
    let bot_symbol = next_turn();
    bot = new HardBot(bot_symbol);
    console.log(`Bot: ${bot_symbol}`);
    switch_turn();
    console.log(`${turn} starts`);
    hide_start();
    start_game();
    perform_bot();
    update_board_view();
    update_game_state_view();
}

// Clicking fields on the board
fields.forEach((field, index) => {
    field.addEventListener('click', () => {
        on_field_click(index);
        update_board_view();
        update_game_state_view();
        // Game is over
        if (!is_game_running) {
            update_game_state_view();
            setTimeout(() => {
                prestart_game();
            }, 3_000);
        }
    });
});

// Update board view
const update_board_view = () => {
    let winnable_pos = [];
    if (win != null) {
        winnable_pos = win.pos;
    }
    console.log(winnable_pos);
    fields.forEach((field, index) => {
        field.innerHTML = main_board[index];
        field.disabled = is_occupied(main_board, index);
        if (winnable_pos.includes(index)) {
            field.classList.add("win");
        } else {
            field.classList.remove("win");
        }
    });
}

const prestart_game = () => {
    // end_game();
    game_state = "Choose player to start the game";
    update_game_state_view();
    clear_board(main_board);
    update_board_view();
    show_start();
}
