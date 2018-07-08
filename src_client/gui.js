function login_form(){
    return `
    <div class="modal modal-b-b">
        <form action="/submit_login">
            <input type="text" placeholder="username" id="username">
            <input type="password" placeholder="password" id="password">
            <button class="btn btn-primary" onclick="send_form(this)">login</button>
            <button class="btn btn-success" onclick="$(this).closest('.modal').remove();$('body').append(create_user_form());">sign up</button>
        </form>
    </div>
    `;
}
function create_user_form(){
    return `
    <div class="modal modal-b-b">
        <form action="/create_user">
            <input type="text" placeholder="username" id="username">
            <input type="text" placeholder="email" id="email">
            <input type="password" placeholder="password" id="password">
            <input type="password" placeholder="password conf" id="password_confirmation">
            <button class="btn btn-primary" style="width: 50%;" onclick="send_form(this)">create</button>
            <button class="btn btn-warning" style="width: 50%;float: right;" onclick="send_form(this)">cancel</button>
        </form>
    </div>
    `;
}
function edit_user_form(){
    let $modal_form = $(`
    <div class="modal modal-b-b">
        <form action="/update_user">
            <input type="text" placeholder="username" id="username">
            <input type="text" placeholder="email" id="email">
            <input type="password" placeholder="password" id="password">
            <button class="btn btn-primary" onclick="send_form(this)">sign in</button>
        </form>
    </div>
    `);
    $modal_form.find('#username').val(g_username);
    $modal_form.find('#email').val(g_email);
    return $modal_form.wrap('<div></div>').parent().html();
}