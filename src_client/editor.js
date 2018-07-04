var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 20;
camera.rotation.x = -1.570796; // position camera over world origin, looking down
var raycaster = new THREE.Raycaster();
var mousevector = new THREE.Vector2();
var model = null;
var portlocationplotterstatus = 0;
var portslist = [];

// Generate the renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a bit of light
var ambientLight = new THREE.AmbientLight(0x111111);
scene.add(ambientLight);

var light = new THREE.PointLight(0xFFFFDD);
light.position.set(-15, 10, 15);
scene.add(light);

// Set up a texture to use
var texmgr = new THREE.TextureLoader(); // manages loading textures
var loader = new THREE.JSONLoader(); // manages loading models (from JSON files)
var emptymaterial = new THREE.MeshBasicMaterial({}); // 'Texture' used for models before they are given a texture

// We want to allow the loaded object to drift around, if the user wants to see that.  These variables will control that
var driftstate = 0;
var driftx = driftz = driftrotx = driftroty = driftrotz = 0.0;

// Set up a cursor ball to show in the 3D world
var mousepoint = new THREE.Mesh(new THREE.SphereGeometry(0.25), new THREE.MeshBasicMaterial({
    color: 0xc0c000,
    transparent: true,
    opacity: 0.5
}));
scene.add(mousepoint);

// Set up the pick plane, to allow us to select locations in 3D (across the flat 2D map)
var pickplane = new THREE.Mesh(new THREE.PlaneGeometry(250, 250), new THREE.MeshBasicMaterial({
    color: 0xf0f000,
    transparent: true,
    opacity: 0.0
}));
pickplane.rotation.x = -1.5;
scene.add(pickplane);
window.addEventListener("mousemove", (myevent) => {
    var newcoords = convertcoords(myevent.clientX, myevent.clientY);
    mousepoint.position.x = newcoords.x;
    mousepoint.position.y = newcoords.y;
    mousepoint.position.z = newcoords.z;
});
window.addEventListener("click", (myevent) => {
    if (portlocationplotterstatus == 1) {
        // We need to ignore the first click received with this status enabled. Otherwise this will place a new port location
        // where the user clicked the button at.
        portlocationplotterstatus = 2;
        return;
    }
    if (portlocationplotterstatus == 2) {
        portlocationplotterstatus = 0;
        var build = new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshBasicMaterial({
            color: 0x0000c0
        }));
        build.position.x = mousepoint.position.x;
        build.position.z = mousepoint.position.z;
        $("#xcoord").val(mousepoint.position.x);
        $("#zcoord").val(mousepoint.position.z);
        scene.add(build);
        portslist.push({
            xpos: mousepoint.position.x,
            zpos: mousepoint.position.z,
            model: build
        });
        $("#pointeditnote").hide();
    }
});
animate();

function animate() {
    requestAnimationFrame(animate);
    if (driftstate == 1 && model != null) {
        model.position.x += driftx;
        model.position.z += driftz
        model.rotateX(driftrotx);
        model.rotateY(driftroty);
        model.rotateZ(driftrotz);
    }
    renderer.render(scene, camera);
}

function convertcoords(mousex, mousey) {
    // returns an object with x,y,z properties, or null if nothing was clicked
    mousevector.set((mousex / renderer.domElement.width) * 2 - 1, -(mousey / renderer.domElement.height) * 2 + 1);
    raycaster.setFromCamera(mousevector, camera);
    var intersectsList = raycaster.intersectObjects([pickplane]); // This normally accepts a list of objects that can be 'clicked' on.
    if (intersectsList.length > 0) {
        return {
            x: intersectsList[0].point.x,
            y: intersectsList[0].point.y,
            z: intersectsList[0].point.z
        };
    }
    return null;
}

function addnewship() {
    $("#shipeditbox").show();
}
function addnewpart() {
    $("#parteditbox").show();
}
function addnewcomponent() {
    $("#componenteditbox").show();
}
function save_form(elm){
    let form = $(elm).closest('form');
    let form_action = form.attr('action');
    $.ajax({
        url: form_action,
        type: "post",
        data: form.serialize(),
        success: function(resp){
            console.log(resp);
        },
        error: function(resp){
            console.error(resp);
        },
    })
}
function loadshipmodel() {
    //console.log("Ready to load "+ $("#ship_model").val());
    var result = loader.load($("#ship_model").val(), (geometry, materials) => {
        model = new THREE.Mesh(geometry, emptymaterial);
        model.renderOrder = 2;
        model.material.depthText = false;
        scene.add(model);
    });
}
function loadshipmodel_json(json_obj) {
    let geometry = loader.parse(json_obj).geometry;
    model = new THREE.Mesh(geometry, emptymaterial);
    model.renderOrder = 2;
    model.material.depthText = false;
    scene.add(model);
}

function loadshiptexture() {
    if (model === null) {
        console.log('Cannot load texture onto empty model');
        return;
    }
    model.material = new THREE.MeshBasicMaterial({
        map: texmgr.load($("#ship_texture").val())
    });
}

function startdrift() {
    driftstate = 1;
    driftx = (Math.random() * 0.07) - 0.035;
    driftz = (Math.random() * 0.07) - 0.035;
    driftrotx = (Math.random() * 0.02) - 0.01;
    driftroty = (Math.random() * 0.02) - 0.01;
    driftrotz = (Math.random() * 0.02) - 0.01;
}

function stopdrift() {
    driftstate = 0;
    if (model) {
        model.position.x = model.position.y = model.position.z = 0;
        model.rotation.x = model.rotation.y = model.rotation.z = 0;
    }
}

function startportplacement() {
    // Sets things up so the user can place a port on the screen
    $("#pointeditbox").show();
    $("#pointeditnote").show();
    portlocationplotterstatus = 1;
}

function mirrorx() {
    // Takes the last-placed port location and generates a copy of it on the other side
    if (portslist.length <= 0) {
        // Can't duplicate nothing
        return;
    }
    var build = new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshBasicMaterial({
        color: 0x000c0
    }));
    build.position.x = -portslist[portslist.length - 1].model.position.x;
    build.position.z = portslist[portslist.length - 1].model.position.z;
    scene.add(build);
    portslist.push({
        xpos: build.position.x,
        zpos: build.position.z,
        model: build
    });
}

function mirrorz() {
    // Takes the last-placed port location and generates a copy of it on the other side
    if (portslist.length <= 0) {
        // Can't duplicate nothing
        return;
    }
    var build = new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshBasicMaterial({
        color: 0x000c0
    }));
    build.position.x = portslist[portslist.length - 1].model.position.x;
    build.position.z = -portslist[portslist.length - 1].model.position.z;
    scene.add(build);
    portslist.push({
        xpos: build.position.x,
        zpos: build.position.z,
        model: build
    });
}

function updatexpos() {
    // User trigger for when the user updates the X position of a port location
    if (portslist.length <= 0) {
        // We have none... can't update anything
        return;
    }
    portslist[portslist.length - 1].xpos = $("#xcoord").val();
    portslist[portslist.length - 1].model.position.x = $("#xcoord").val();
}

function updatezpos() {
    // User trigger for when the user updates the Z position of a port location
    if (portslist.length <= 0) {
        // No port locations exist yet
        return;
    }
    portslist[portslist.length - 1].zpos = $("#zcoord").val();
    portslist[portslist.length - 1].model.position.z = $("#zcoord").val();
}