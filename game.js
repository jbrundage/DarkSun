const express = require('express');
const bodyparser = require('body-parser');
const mongo = require('mongoose');

const schemas = require('./src_server/db');
const dev_tools = require('./src_server/tools');
const game_config = require('./game_server/config');

let app = express();
app.listen(80);
app.get('/', landing_page);
app.use('/src', express.static('src')); /* for abstract css/js/img */
app.use('/game', express.static('game')); /* for game-specific css/js/img */

let urlencodedparser = bodyparser.urlencoded({extended:false});
mongo.connect(`mongodb://localhost/${game_config.db_name}`, function(){}).then(() => {})
    .catch(err => {
        console.error(err.stack);
        process.exit(1);
    });
mongo.Promise = global.Promise;

app.post('/view_users',urlencodedparser,function(request, response){
    schemas.users.find()
    .then((resp) => {response.send(resp);})
    .catch((resp) => {response.send(resp);});
});
app.post('/create_user',urlencodedparser,function(request, response){
    console.info(`request.body`,request.body);
    let obj = JSON.parse(JSON.stringify(request.body));
    console.info(`obj`,obj);
    new schemas.users(request.body).save()
    .then((resp) => {response.send(resp);})
    .catch((resp) => {response.send(resp);});
});
app.post('/submit_login',urlencodedparser,function(request, response){
    schemas.users.find({
        username: request.body.username,
        password: request.body.password
    })
    .then((resp) => {
        if(resp.length === 1){
            const sha = crypto.createHash('sha256');
            sha.update(Math.random().toString());
            const session_key = sha.digest('hex');
            new schemas.users(request.body).save()
        } else {
            //bad login attempt
        }
        response.send(resp);
    })
    .catch((resp) => {response.send(resp);});
});
let api_test_arr = [
    ['/view_users', ''],
    ['/create_user', 'username=test123&password=test456'],
    ['/submit_login', 'username=test123&password=test456'],
    ['/submit_login', 'username=test123&password=the_wrong_password'],
    ['/update_user', '_id=asdf'],
];
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
                <link rel="stylesheet" type="text/css" href="src/style.css"></link>
                <script src="src/gui.js"></script>
                <script src="src/tools.js"></script>
            </head>
            <body>
                <div id="game">${dev_tools.api_test_form(api_test_arr)}</div>
            </body>
        </html>
    `);
}
