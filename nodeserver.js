const express = require('express');
const bodyparser = require('body-parser');  // helps us receive POST data from page requests
const mongo = require('mongoose');  // enables access to the database
const schemas = require('./BuildSchemas.js');
// const http = require('http-server');

let app = express();
let urlencodedparser = bodyparser.urlencoded({extended:false});
mongo.connect('mongodb://localhost/myfirst', function() { })
    .then(() => {
    })
    .catch(err => {
        console.error('App starting error:', err.stack);
        process.exit(1);
    });
mongo.Promise = global.Promise;

let server = app.listen(80);
app.use('/media', express.static('media'));
app.use('/src', express.static('src')); // this is primarily for client-side javascript and CSS files
app.get('/', welcomepage);
app.post('/register', urlencodedparser, registerpage);
app.get('/listusers', displayusers);

Object.keys(schemas.json).forEach((collection_name)=>{
    app.get('/view_'+collection_name,function(request, response){
        schemas[collection_name].find()
        .then(function(founditems) {
            response.send(founditems);
        }).catch(console.error);
    });
    app.post('/add_'+collection_name,urlencodedparser,function(request, response){
        let inp_obj = {};
        Object.keys(request.body).forEach(function(param_name){
            inp_obj[param_name] = request.body[param_name];
        })
        new schemas[collection_name](inp_obj).save();
    });
})

function displayusers(request, response) {
    schemas.registeredUserModel.find()
        .then(function(founditems) {
            let output = '';
            for(var i=0; i<founditems.length; i++) {
                output += founditems[i] +'<br />';
            }
            response.send(output);
        });
}

function registerpage(request, response) {
    var builduser = new schemas.registeredUserModel({
        username: request.body.username,
        email: request.body.email,
        password: request.body.pass
    }).save();
    
    response.send('Your response has been received.<br />'+
        request.body.username +'<br />'+
        request.body.email +'<br />'+
        request.body.pass);
}

function welcomepage(request, response) {
    let _json = {};
    Object.keys(schemas.json).forEach(function(name,i){
        _json[name] = {};
        Object.keys(schemas.json[name]).forEach(function(paramName,i2){
            _json[name][paramName] = JSON.parse(JSON.stringify(schemas.json[name][paramName]));
            _json[name][paramName].type = schemas.json[name][paramName].type === String ? "string" : "";
            _json[name][paramName].type = schemas.json[name][paramName].type === Number ? "number" : _json[name][paramName].type;
        });
    });
  response.send(`
    <html>
        <head>
            <title>Dark Sun</title>
            
            <script src='https://code.jquery.com/jquery-3.2.1.min.js'></script>
            <link rel="stylesheet" href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'></link>
            <link rel="stylesheet" href='https://maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css'></link>
            <script src='https://maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js'></script>
            <link rel="stylesheet" href="http://localhost:8080/index.css"></link>
            <script src="http://localhost:8080/index.js"></script>

            <script>
                window.mongo_json_str = '${JSON.stringify(_json)}';
                window.mongo_json = {};
                try{mongo_json = JSON.parse(mongo_json_str)}catch(e){console.error(e)}

                $(function(){
                    show_collection("${Object.keys(schemas.json)[0]}");
                })
            </script>
        </head>
        <body>
            <div id="topnav">
                <h1>DARK SUN</h1>
                <div class="spacer"></div>
                ${Object.keys(schemas.json).map((n,i)=>{
                    return `<button type="button" id="${n}_btn" class="btn btn-secondary" onclick="show_collection('${n}')">${n}</button>`
                }).join('')}
            </div>
            <div id="game"></div>
        </body>
    </html>
`);
//   response.send(`
//     <html>
//       <head>
//         <script src="src/jquery.js" type="text/javascript"></script>
//         <script src="src/three.min.js" type="text/javascript"></script>
//       </head>
//       <body style="background-color:#202020; color:#FFFFFF; background-image:url(media/space-background.jpg);">
//         <center><div style="padding:30px 30px 30px 30px; display:inline-block; background-color:#606060; color:#000000; font:50px roboto, bold, sans-serif; margin:5px;">DARK SUN</div></center>
//         <div style="display:inline-block; background-color:#202040; font-size:20px; margin:5px; padding:10px;">
//           Defeat enemies<br />
//           Salvage parts from wreckage<br />
//           Apply to upgrade your own ship
//         </div>
//         <div style="display:inline-block; float:right; background-color:#202040; font-size:20px; margin:5px; padding:10px;">
//           Sign up today - its free!<br />
//           <form method="POST" action="/register">
//             User Name: <input type="text" name="username" /><br />
//             Email: <input type="text" name="email" /><br />
//             Password: <input type="text" name="pass" /><br />
//             <input type="submit" value="Submit" />
//           </form> 
//         </div>
//         <br />
//         <div style="background-color:#202040; font-size:20px; margin:5px; padding:10px;">
//           Dark Sun is a space-based action RPG, reminiscent of Diablo II and Battleships Forever.  Rather than receiving working weapons from defeating your 
//           enemies, you will (most often) find wreckage with a few components of any part in working order.  Combine working parts from multiple enemies and 
//           you will have a working piece to your ship. As you collect more components, that part can be upgraded to perform better.<br />
//           <br />
//           Ships are composed of a branching system of parts, each with their own purpose, and own hulls.  Care must be taken in the design of your ship to 
//           ensure important parts are protected, and defensive parts are used to their fullest effect.
//         </div>
//       </body>
//     </html>`);
}


/*
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    let fullrequest = url.parse(req.url);
    let filename = fullrequest.pathname;
    if(filename=="/") filename='/index.js';
    let extension = path.extname(filename);
    // use url.parse(req.url).search for anything after the ? in the url address
    res.write('Hello world!<br />');
    res.write('Your file target is '+ filename +', the extension is '+ extension);
    res.end();
}).listen(80);
*/

// REST model - nothing but set & get operations

/*
function weightedrandom(countslist) {
    // countslist - array of each possible value
    
    let sum = 0;
    for(let i=0; i<countslist.length; i++) {
        sum += countslist[i];
    }
    let target = Math.floor(Math.random()*sum);
    for(let i=0; i<countslist.length; i++) {
        if(countslist[i]>target) {
            return i;
        }
        target += countslist;
    }
    return counstlist[countslist.length-1];
}
*/


