function init_game() {
    window.g_scene = new THREE.Scene();
    window.g_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    g_camera.position.y = 20;
    g_camera.rotation.x = -1.570796; // position camera over world origin, looking down
    window.g_raycaster = new THREE.Raycaster();
    window.g_mousevector = new THREE.Vector2();
    window.g_model = null;
    window.g_portlocationplotterstatus = 0;
    window.g_portslist = [];

    // Generate the renderer
    window.g_renderer = new THREE.WebGLRenderer();
    g_renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(g_renderer.domElement);

    // Add a bit of light
    window.g_ambientLight = new THREE.AmbientLight(0x111111);
    g_scene.add(g_ambientLight);

    window.g_light = new THREE.PointLight(0xFFFFDD);
    g_light.position.set(-15, 10, 15);
    g_scene.add(g_light);

    // Set up a texture to use
    window.g_texmgr = new THREE.TextureLoader(); // manages loading textures
    window.g_loader = new THREE.JSONLoader(); // manages loading models (from JSON files)
    window.g_emptymaterial = new THREE.MeshBasicMaterial({}); // 'Texture' used for models before they are given a texture

    // We want to allow the loaded object to drift around, if the user wants to see that.  These variables will control that
    window.g_driftstate = 0;
    window.g_driftx = driftz = driftrotx = driftroty = driftrotz = 0.0;

    // Set up a cursor ball to show in the 3D world
    window.g_mousepoint = new THREE.Mesh(new THREE.SphereGeometry(0.25), new THREE.MeshBasicMaterial({
        color: 0xc0c000,
        transparent: true,
        opacity: 0.5
    }));
    g_scene.add(g_mousepoint);

    // Set up the pick plane, to allow us to select locations in 3D (across the flat 2D map)
    window.g_pickplane = new THREE.Mesh(new THREE.PlaneGeometry(250, 250), new THREE.MeshBasicMaterial({
        color: 0xf0f000,
        transparent: true,
        opacity: 0.0
    }));
    g_pickplane.rotation.x = -1.5;
    g_scene.add(g_pickplane);
}
function init_ship(ship_json, ship_texture){
    console.info(`arguments`,arguments);
    loadshipmodel_json(ship_json);
    loadshiptexture(ship_texture);
}

function loadshipmodel_json(json_obj) {
    let geometry = g_loader.parse(json_obj).geometry;
    g_model = new THREE.Mesh(geometry, g_emptymaterial);
    g_model.renderOrder = 2;
    g_model.material.depthText = false;
    g_scene.add(g_model);
}

function loadshiptexture(texture_url) {
    g_model.material = new THREE.MeshBasicMaterial({
        map: g_texmgr.load(texture_url)
    });
}