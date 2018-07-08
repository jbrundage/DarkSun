const express = require('express');
const bodyparser = require('body-parser');
const mongo = require('mongoose');

const auth_db = require('./src_server/auth_db');
const game_db = require('./game_server/db');
const auth_helper = require('./src_server/auth_helper');

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

app.post('/start_game',urlencodedparser,function(request, response){
    auth_helper.check_session_state(request.body.session_key,function(user_session_doc){
        console.log("session_key is valid:");
        console.info(`user_session_doc`,user_session_doc);
    });
});
app.post('/create_user',urlencodedparser,function(request, response){
    console.info(`request.body`,request.body);
    let obj = JSON.parse(JSON.stringify(request.body));
    new auth_db.users(obj).save()
    .then((resp) => {response.send(resp);})
    .catch((resp) => {response.send(resp);});
});
app.post('/submit_login',urlencodedparser,function(request, response){
    auth_db.users.find({
        username: request.body.username,
        password: request.body.password
    })
    .then((resp) => {
        if(resp.length === 1){
            const session_key = auth_helper.generate_key();
            const session_doc = {
                username: request.body.username,
                key: session_key,
                json: `{}`
            };
            console.info(`auth_db.sessions`,auth_db.sessions);
            new auth_db.sessions(session_doc).save().then(console.log).catch(e=>console.log(e))
            response.send(session_doc);
        } else {
            response.send("bad login");
        }
    })
    .catch((resp) => {response.send(resp);});
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
                <script src="src_client/main.js"></script>
                <script src="src_client/gui.js"></script>
                <script src="src_client/tools.js"></script>
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
