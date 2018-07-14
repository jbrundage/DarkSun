function show_login_form(){
    event.preventDefault();
    $('.modal').remove();
    $('body').append(login_form());
}
function login_form(){
    return `
    <div class="modal width-b2 height-b2">
        <form action="/submit_login" data-success="show_new_game_form" data-error="show_login_form">
            <input type="text" placeholder="username" name="username">
            <input type="password" placeholder="password" name="password">
            <button class="btn btn-primary" onclick="send_form(this)">login</button>
            <button class="btn btn-success" onclick="show_create_user_form()">sign up</button>
        </form>
    </div>
    `;
}
function show_create_user_form(){
    event.preventDefault();
    $('.modal').remove();
    $('body').append(create_user_form());
}
function create_user_form(){
    return `
    <div class="modal width-a3 height-a2">
        <form action="/create_user" data-success="show_new_game_form" data-error="show_login_form">
            <input type="text" placeholder="username" name="username">
            <input type="text" placeholder="email" name="email">
            <input type="password" placeholder="password" name="password">
            <input type="password" placeholder="password conf" name="password_confirmation">
            <button class="btn btn-success margin-0" style="width: 62%;" onclick="send_form(this)">create</button>
            <button class="btn btn-warning margin-0" style="width: 35%;float: left;" onclick="show_login_form()">cancel</button>
        </form>
    </div>
    `;
}
function show_edit_user_form(){
    event.preventDefault();
    $('.modal').remove();
    $('body').append(create_user_form());
}
function edit_user_form(){
    let $modal_form = $(`
    <div class="modal width-b2 height-b3">
        <form action="/update_user" data-success="show_edit_user_success" data-error="show_login_form">
            <input type="text" placeholder="username" name="username">
            <input type="text" placeholder="email" name="email">
            <input type="password" placeholder="password" name="password">
            <button class="btn btn-primary" onclick="send_form(this)">sign in</button>
        </form>
    </div>
    `);
    $modal_form.find('#username').val(g_username);
    $modal_form.find('#email').val(g_email);
    return $modal_form.wrap('<div></div>').parent().html();
}
function show_edit_user_success(){
    event.preventDefault();
    $('.modal').remove();
    $('body').append(`
    <div class="modal width-b3 height-b4">
        <h3>Successfully Updated</h3>
        <button class="btn btn-default" onclick="$(this).closest('.modal').remove();">OK</button>
    </div>
    `);
}

function show_new_game_form(){
    $('.modal').remove();
    $('body').append(`
    <div class="modal width-a1 height-b1">
        <h3>Game Save Selection...</h3>
        <div id="game_save_thumb_wrapper">
            ${
                g_session.saved_games_arr ? g_session.saved_games_arr.map((saved_game,idx)=>{
                    return game_save_thumb_html(saved_game.name,idx);
                }) : ''
            }
            <div class="game_save_thumb width-b1 height-a1">
                <h4>New Game</h4>
                <button class="btn btn-success" onclick="load_game(5)">Start</button>
            </div>
        </div>
    </div>
            `);
    function game_save_thumb_html(game_save_name,idx){
        return `
            <div class="game_save_thumb width-b1 height-a1">
                <h4>${game_save_name}</h4>
                <button class="btn btn-primary" onclick="load_game(${idx})">Start</button>
            </div>
        `
    }
}

function load_game(save_game_idx){
    console.info(`Clicked load_game(${save_game_idx}), but for now the 'load_game' function is hardcoded to display the default game state.`);
    $('.modal').remove();
    init_game();
    init_ship(
        g_session.saved_games_arr[save_game_idx].ship_json,
        g_session.saved_games_arr[save_game_idx].ship_texture
    );
}