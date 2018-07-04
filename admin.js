const express = require('express');
const bodyparser = require('body-parser');
const mongo = require('mongoose');
const schemas = require('./db.js');

let app = express();
app.listen(80);
app.get('/', landing_page);
app.use('/img', express.static('img'));
app.use('/src', express.static('src'));

let urlencodedparser = bodyparser.urlencoded({extended:false});
mongo.connect('mongodb://localhost/myfirst', function(){}).then(() => {})
    .catch(err => {
        console.error('App starting error:', err.stack);
        process.exit(1);
    });
mongo.Promise = global.Promise;

Object.keys(schemas.json).forEach((collection_name)=>{
    app.get('/view_'+collection_name,function(request, response){
        if(request.body["_id"]){
            schemas[collection_name].find({ _id: request.body["_id"] })
            .then(function(founditems) {
                response.send(founditems);
            }).catch(console.error);
        }
    });
    app.get('/all_'+collection_name,function(request, response){
        schemas[collection_name].find()
        .then(response.send)
        .catch(console.error);
    });
    app.post('/update_'+collection_name,urlencodedparser,function(request, response){
        if(request.body["_id"]){
            schemas[collection_name].update({ _id: request.body["_id"] }, request.body, options, callback)
            .catch(console.error);
        }
    });
    app.post('/remove_'+collection_name,urlencodedparser,function(request, response){
        if(request.body["_id"]){
            schemas[collection_name].find({ _id: request.body["_id"] }).remove()
            .catch(console.error);
        }
    });
    app.post('/add_'+collection_name,urlencodedparser,function(request, response){
        let inp_obj = {};
        Object.keys(request.body).forEach(function(param_name){
            inp_obj[param_name] = request.body[param_name];
        })
        new schemas[collection_name](inp_obj).save();
    });
})

function landing_page(request, response) {
  response.send(`
    <html>
        <head>
            <title>Dark Sun</title>
            
            <script src='https://code.jquery.com/jquery-3.2.1.min.js'></script>
            <link rel="stylesheet" href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'></link>
            <link rel="stylesheet" href='https://maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css'></link>
            <script src='https://maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js'></script>
            <link rel="stylesheet" href="src/style_abstract.css"></link>
            <script src="src/gui_abstract.js"></script>

            <script>
                window.mongo_json_str = '${JSON.stringify(schemas.json)}';
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
}
