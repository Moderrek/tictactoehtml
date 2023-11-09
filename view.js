const fields = document.querySelectorAll(".pole");
const state = document.querySelector("#wynik");
const start_menu = document.querySelector("#guziki");
const btn_choose_x = document.querySelector('#guzik1');
const btn_choose_o = document.querySelector('#guzik2');

const update_game_state_view = () => {
    state.innerHTML = game_state;
}

const hide_start = () => {
    start_menu.classList.add("hidden");
}

const show_start = () => {
    start_menu.classList.remove("hidden");
}

// Wybranie gracza
btn_choose_x.addEventListener('click', () => {
    if (is_game_running) return;
    after_choose('X')
});
btn_choose_o.addEventListener('click', () => {
    if (is_game_running) return;
    after_choose('O')
});

const after_choose = (player) => {
    set_player(player);
    hide_start();
    start_game();
    update_game_state_view();
}

// Klikanie na planszy
fields.forEach((field, index) => {
    field.addEventListener('click', () => {
        on_field_click(index);
        update_board_view();
        update_game_state_view();
        // gra sie zakonczyla
        if (!is_game_running) {
            update_game_state_view();
            setTimeout(() => {
                prestart_game();
            }, 3_000);
        }
    });
});

// Aktualizowanie widoku planszy
const update_board_view = () => {
    let winnable_pos = [];
    if (win != null) {
        winnable_pos = win.pos;
    }
    console.log(winnable_pos);
    fields.forEach((field, index) => {
        field.innerHTML = board[index];
        field.disabled = is_occupied(index);
        if (winnable_pos.includes(index)) {
            field.classList.add("win");
        } else {
            field.classList.remove("win");
        }
    });
}

const prestart_game = () => {
    // end_game();
    game_state = "Wybierz gracza:"
    update_game_state_view();
    clear_board(board);
    update_board_view();
    show_start();
}