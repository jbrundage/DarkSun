const express = require('express');
const bodyparser = require('body-parser');  // helps us receive POST data from page requests
const mongo = require('mongoose');  // enables access to the database
const schemas = require('./game_server/db.js');

let app = express();
let urlencodedparser = bodyparser.urlencoded({extended:false});
mongo.connect('mongodb://localhost/myfirst', function() { })
    .then(() => {
    })
    .catch(err => {
        console.error('Database connection error:', err.stack);
        process.exit(1);
    });
mongo.Promise = global.Promise;

let server = app.listen(80);
app.use('/src_client', express.static('src_client'));
app.use('/game_client', express.static('game_client'));
app.get('/', page_editor);
app.use('/game_client', express.static('game_client'));
app.post('/add_shipKind',urlencodedparser,function(request, response){
    new schemas.shipkind(request.body).save()
    .then(response.send)
    .catch(console.error);
});
app.post('/add_partKind',urlencodedparser,function(request, response){
    new schemas.partKind(request.body).save()
    .then(response.send)
    .catch(console.error);
});
app.post('/add_componentKind',urlencodedparser,function(request, response){
    new schemas.componentKind(request.body).save()
    .then(response.send)
    .catch(console.error);
});
function page_editor(request, response) {
    response.send(`
        <html>
            <head>
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
                <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
                <meta charset=utf-8>
                <style>
                    body { margin: 0; }
                    canvas { width: 100%; height: 100% }
                    input { margin: 3px; }
                </style>
            </head>
            <body>
                <script src="src_client/three.min.js" type="text/javascript"></script>
                <script src="src_client/editor.js" type="text/javascript"></script>

                <div id="mytopmenubox" style="position:absolute; top:0px; left: 0px; background-color:white; padding:15px;">
                    <div class="btn-group">
                        <div class="btn-group">
                            <button type="button" class="btn dropdown-toggle" data-toggle="dropdown">
                            Ships <span class="caret"></span></button>
                            <ul class="dropdown-menu" role="menu">
                                <!-- 
                                <li><a class="disabled" href="#">Ship 1</a></li>
                                <li><a href="#">Octagonal</a></li>
                                -->
                                <li><a href="#" onclick="addnewship()">Add New</a></li>
                            </ul>
                        </div>
                        <div class="btn-group">
                            <button type="button" class="btn dropdown-toggle" data-toggle="dropdown">
                            Parts <span class="caret"></span></button>
                            <ul class="dropdown-menu" role="menu">
                                <!-- 
                                <li><a href="#">Engine 1</a></li>
                                <li><a herf="#">Thruster 1</a></li>
                                <li><a herf="#">Capacitor 1</a></li>
                                -->
                                <li><a href="#" onclick="addnewpart()">Add New</a></li>
                            </ul>
                        </div>
                        <div class="btn-group">
                            <button type="button" class="btn dropdown-toggle" data-toggle="dropdown">
                            Components <span class="caret"></span></button>
                            <ul class="dropdown-menu" role="menu">
                                <!-- 
                                <li><a href="#">Fuel Injector 1</a></li>
                                <li><a href="#">Carborator</a></li>
                                -->
                                <li><a href="#" onclick="addcomponent()">Add New</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div id="shipeditbox" style="display:none; border-radius:10px; position: absolute; top: 200px; left: 20px; background-color:white; padding:5px;">
                    <form action="/add_shipKind">
                        <input type="text" name="model" placeholder="model file" id="ship_model"> <input type="button" value="load" onclick="loadshipmodel()"><br />
                        <input type="text" name="texture" placeholder="texture file" id="ship_texture"> <input type="button" value="load" onclick="loadshiptexture()"><br />
                        <input type="number" name="weight" placeholder="weight limit" id="ship_weight"> <input type="button" value="drift" onclick="startdrift()"><br />
                        <input type="number" name="power" placeholder="power limit" id="ship_power"> <input type="button" value="center" onclick="stopdrift()"><br />
                        <input type="button" value="add port location" onclick="startportplacement()"> <input type="button" value="Save" onclick="save_form(this)">
                    </form>
                </div>
                <div id="parteditbox" style="display:none; border-radius:10px; position: absolute; top: 200px; left: 20px; background-color:white; padding:5px;">
                    <form action="/add_partKind">
                        <input type="text" name="model" placeholder="model file" id="part_model"> <input type="button" value="load" onclick="loadshipmodel()"><br />
                        <input type="text" name="texture" placeholder="texture file" id="part_texture"> <input type="button" value="load" onclick="loadshiptexture()"><br />
                        <input type="number" name="weight" placeholder="weight limit" id="part_weight"> <input type="button" value="drift" onclick="startdrift()"><br />
                        <input type="number" name="power" placeholder="power limit" id="part_power"> <input type="button" value="center" onclick="stopdrift()"><br />
                        <input type="button" value="Save" onclick="save_form(this)">
                    </form>
                </div>
                <div id="componenteditbox" style="display:none; border-radius:10px; position: absolute; top: 200px; left: 20px; background-color:white; padding:5px;">
                    <form action="/add_componentKind">
                        <input type="text" name="model" placeholder="model file" id="component_model"> <input type="button" value="load" onclick="loadshipmodel()"><br />
                        <input type="text" name="texture" placeholder="texture file" id="component_texture"> <input type="button" value="load" onclick="loadshiptexture()"><br />
                        <input type="number" name="weight" placeholder="weight limit" id="component_weight"> <input type="button" value="drift" onclick="startdrift()"><br />
                        <input type="number" name="power" placeholder="power limit" id="component_power"> <input type="button" value="center" onclick="stopdrift()"><br />
                        <input type="button" value="Save" onclick="save_form(this)">
                    </form>
                </div>
                <div id="pointeditbox" style = "display:none; position:absolute; border-radius:10px; top:400px; left:20px; background-color:white; color:black; padding:5px;">
                    <span id="pointeditnote" style="color:black">Click near the ship to place a port location</span><br />
                    <form>
                        <input type="number" id="xcoord" name="xcoord" placeholder="x coordinate" onchange="updatexpos()"> <input type="button" value="Mirror X" onclick="mirrorx()"><br />
                        <input type="number" id="zcoord" name="zcoord" placeholder="z coordinate" onchange="updatezpos()"> <input type="button" value="Mirror Z"><br />
                        <input type="button" value="Save"> <input type="button" value="Done">
                    </form>
                </div>
            </body>
        </html>
    `);
}
