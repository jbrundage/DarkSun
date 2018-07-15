const express = require('express');
const bodyparser = require('body-parser');
const mongo = require('mongoose');

const auth_db = require('./src_server/auth_db');
const game_db = require('./game_server/db');
const auth_helper = require('./src_server/auth_helper');
const game_helper = require('./game_server/game_helper');

const dev_tools = require('./src_server/tools');
const game_config = require('./game_server/config');

let app = express();
app.listen(80);
app.get('/', landing_page);
app.use('/src_client', express.static('src_client')); /* for abstract css/js/img */
app.use('/game_client', express.static('game_client')); /* for game-specific css/js/img */

let urlencodedparser = bodyparser.urlencoded({extended:false});
mongo.connect(`mongodb://localhost/${game_config.db}`, function(){}).then(() => {})
    .catch(err => {
        console.error(err.stack);
        process.exit(1);
    });
mongo.Promise = global.Promise;

app.post('/create_user',urlencodedparser,function(request, response){
    let obj = JSON.parse(JSON.stringify(request.body));
    new auth_db.users(obj).save()
    .then(resp => {
        auth_helper.get_user_session(request.body.username, request.body.password, function(user_session_doc){
            user_session_doc.json = JSON.stringify({
                saved_games_arr: [
                    game_helper.get_new_game_json()
                ]
            })
            response.send(user_session_doc);
        });
    })
    .catch(resp => console.error(resp))
});
app.post('/update_user',urlencodedparser,function(request, response){
    auth_helper.session_handshake(request.body.session_key,function(user_session_doc){
        console.info(`user_session_doc`,user_session_doc);
        if(user_session_doc){
            console.info('This is where the update user logic will go...');
        }
        response.send(user_session_doc);
    });
});
app.post('/submit_login',urlencodedparser,function(request, response){
    auth_helper.get_user_session(request.body.username, request.body.password, function(user_session_doc){
        if(typeof user_session_doc.error === "undefined"){
            user_session_doc.json = JSON.stringify({
                saved_games_arr: [
                    game_helper.get_new_game_json()
                ]
            })
        }
        response.send(user_session_doc);
    });
});
function landing_page(request, response) {
    console.info(`request`,request);
    response.send(`
        <html>
            <head>
                <title>${game_config.name}</title>
                <script src='https://code.jquery.com/jquery-3.2.1.min.js'></script>
                <link rel="stylesheet" href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'></link>
                
                <link rel="stylesheet" href='https://maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css'></link>
                <script src='https://maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js'></script>
                
                <link rel="stylesheet" type="text/css" href="src_client/style.css"></link>
                <script src="src_client/three.min.js"></script>
                <script src="src_client/game_renderer.js"></script>
                
                <script src="src_client/main.js"></script>
                <script src="src_client/gui.js"></script>
                <script src="src_client/tools.js"></script>
                <script src="src_client/utility.js"></script>
            </head>
            <body>
            <div id="login_background" style="height: 500px; width: 500px;">
            </div>
            <script>
                $(function(){
                    $('body').append(login_form());
                })
            </script>
            </body>
        </html>
    `);
}
