function show_shell(page_id) {
    switch(page_id) {
        case "login":
        case "new_user":
        case "edit_user":
        case "info_screens":
            show_shell_as_overlay(page_id);
            break;
        case "logged_out":
        case "game_grid_2d":
        case "game_grid_3d":
            show_shell_as_background(page_id);
            break;
    }

    function show_shell_as_background(page_id){
        $("#game").html("");
        $("body").css({background: ""});
        switch(page_id) {
            case "logged_out":
                $("body").css({
                    background: `url(media/space-background.jpg)`
                })
                break;
            case "game_grid_2d":
            case "game_grid_3d":
                break;
        }
    }
    function show_shell_as_overlay(page_id){
        let w, h, $overlay;
        $(".overlay").remove();
        switch(page_id) {
            case "login":
                w = 300;
                h = 280;
                $overlay = $(`
                    <div class="overlay" style="width:${w}px;height:${h}px;">
                        <div class="form-group">
                            <input type="email" class="form-control" id="email" placeholder="Email or Username">
                        </div>
                        <div class="form-group">
                            <input type="password" class="form-control" id="password" placeholder="Password">
                        </div>
                        <button type="button" class="btn btn-dark" onclick="submit_overlay_form('login')" style="width: 62%;margin-left: 18%">Submit</button>
                        <button type="button" class="btn btn-link" onclick="click_forgot_password()" style="width: 62%;margin-left: 18%" id="forgot_password">Forgot Password?</button>
                        <br/>
                        <br/>
                        <button type="button" class="btn btn-primary" onclick="show_shell('new_user')" style="width: 100%;">SIGN UP - its free!</button>
                    </div>
                `)
                break;
            case "new_user":
                w = 300;
                h = 283;
                $overlay = $(`
                    <div class="overlay" style="width:${w}px;height:${h}px;">
                        <div class="form-group">
                            <input type="email" class="form-control" id="email" placeholder="Email or Username">
                        </div>
                        <div class="form-group">
                            <input type="password" class="form-control" id="password" placeholder="Password">
                        </div>
                        <div class="form-group">
                            <input type="password" class="form-control" id="confirm_password" placeholder="Confirm Password">
                        </div>
                        <button type="button" class="btn btn-dark" onclick="submit_overlay_form('new_user')" style="width: 62%;margin-left: 18%">SIGN UP</button>
                        <br/>
                        <br/>
                        <span>Already have an account?</span><button type="button" class="btn btn-link" onclick="show_shell('login')">Sign In</button>
                    </div>
                `)
                break;
            case "edit_user":
                w = 300;
                h = 300;
                $overlay = $(`
                    <div class="overlay" style="width:${w}px;height:${h}px;">
                        <input id="username" type="text" placeholder="email or username"></input>
                        <input id="email" type="text" placeholder="email or username"></input>
                        <input id="password" type="text" placeholder="password"></input>
                        <input id="password_conf" type="text" placeholder="confirm password"></input>
                        <button id="create_user" class="btn btn-primary" onclick="click_create_user()">create_user</button>
                        <hr/>
                        <button id="signin" class="btn btn-primary" onclick="click_signin()">signin</button>
                        <button id="signup" class="btn btn-primary" onclick="click_signup()">signup</button>
                    </div>
                `)
                break;
        }
        $("body").append($overlay);
        setTimeout(function(){
            $overlay.css({
                "top": (window.innerHeight/2) - h/2 + "px",
                "left": (window.innerWidth/2) - w/2 + "px"
            })
        },200);
    }
}