const express = require('express');
const bodyparser = require('body-parser');  // helps us receive POST data from page requests
const mongo = require('mongoose');  // enables access to the database
const schemas = require('./BuildSchemas.js');

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
const mySchema = mongo.Schema;
ObjectId = mySchema.ObjectId;

//buildSchemas();


let server = app.listen(81);
app.use('/media', express.static('media'));
app.use('/src', express.static('src')); // this is primarily for client-side javascript and CSS files
app.get('/', welcomepage);
app.post('/register', urlencodedparser, registerpage);
app.get('/listusers', displayusers);

function displayusers(request, response) {
    registeredUserModel.find()
        .then(function(founditems) {
            let output = '';
            for(var i=0; i<founditems.length; i++) {
                output += founditems[i] +'<br />';
            }
            response.send(output);
        });
}

function registerpage(request, response) {
    var builduser = new registeredUserModel(
        {username: request.body.username,
         email: request.body.email,
         password: request.body.pass}).save();
    
    response.send('Your response has been received.<br />'+
        request.body.username +'<br />'+
        request.body.email +'<br />'+
        request.body.pass);
}

function welcomepage(request, response) {
  response.send(`
    <html>
      <head>
        <script src="src/jquery.js" type="text/javascript"></script>
        <script src="src/three.min.js" type="text/javascript"></script>
      </head>
      <body style="background-color:#202020; color:#FFFFFF; background-image:url(media/space-background.jpg);">
        <center><div style="padding:30px 30px 30px 30px; display:inline-block; background-color:#606060; color:#000000; font:50px roboto, bold, sans-serif; margin:5px;">DARK SUN</div></center>
        <div style="display:inline-block; background-color:#202040; font-size:20px; margin:5px; padding:10px;">
          Defeat enemies<br />
          Salvage parts from wreckage<br />
          Apply to upgrade your own ship
        </div>
        <div style="display:inline-block; float:right; background-color:#202040; font-size:20px; margin:5px; padding:10px;">
          Sign up today - its free!<br />
          <form method="POST" action="/register">
            User Name: <input type="text" name="username" /><br />
            Email: <input type="text" name="email" /><br />
            Password: <input type="text" name="pass" /><br />
            <input type="submit" value="Submit" />
          </form> 
        </div>
        <br />
        <div style="background-color:#202040; font-size:20px; margin:5px; padding:10px;">
          Dark Sun is a space-based action RPG, reminiscent of Diablo II and Battleships Forever.  Rather than receiving working weapons from defeating your 
          enemies, you will (most often) find wreckage with a few components of any part in working order.  Combine working parts from multiple enemies and 
          you will have a working piece to your ship. As you collect more components, that part can be upgraded to perform better.<br />
          <br />
          Ships are composed of a branching system of parts, each with their own purpose, and own hulls.  Care must be taken in the design of your ship to 
          ensure important parts are protected, and defensive parts are used to their fullest effect.
        </div>
      </body>
    </html>`);
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


