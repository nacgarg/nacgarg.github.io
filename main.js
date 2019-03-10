const MAX_HEIGHT = 2.4;
const CUBE_SPEED = 0.0015;
const CAM_MOVE = 1;

let newCube = (x, z) => {
    var geometry = new THREE.BoxGeometry(0.88, 3, 0.88);
    var material = new THREE.MeshLambertMaterial({ color: 0xdddddd, emissive: 0x030a0b, transparent: true, opacity: 1 });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = x;
    mesh.position.z = z;
    mesh.position.y = -4;
    let goal = Math.random() * MAX_HEIGHT;
    let height = Math.random() * MAX_HEIGHT;
    return { direction: goal > height ? "up" : "down", heightGoal: goal, height: height, mesh: mesh };
}

let updateCube = (cube) => {
    if (cube.direction == "up" && cube.height >= cube.heightGoal - 0.02) {
        cube.heightGoal = Math.random() * cube.height;
        // new goal is lower
        cube.direction = "down";
    }
    if (cube.direction == "down" && cube.height <= cube.heightGoal + 0.02) {
        cube.heightGoal = Math.random() * (MAX_HEIGHT - cube.height) + cube.height;
        // new goal is higher
        cube.direction = "up";
    }
    if (cube.direction == "down") {
        cube.height -= Math.abs((cube.height - cube.heightGoal)) * CUBE_SPEED;
    } else {
        cube.height += Math.abs((cube.height - cube.heightGoal)) * CUBE_SPEED;
    }
    cube.mesh.position.y = cube.height - 4;
}

let createGrid = (width, height) => {
    let grid = {};
    grid.cubes = [];

    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            grid.cubes.push(newCube(i - width / 2, j - height / 2));
        }
    }
    return grid;
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

    window.aspect = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
    window.camera.left = - d * aspect;
    window.camera.right = d * aspect;
    window.camera.top = d;
    window.camera.bottom = -d;
    window.camera.updateProjectionMatrix();
}

document.onmousemove = handleMouseMove;
function handleMouseMove(e) {
    var x_ = (e.clientX/window.innerWidth - 0.5)*2*CAM_MOVE;
    var y_ = (e.clientY/window.innerHeight - 0.5)*2*CAM_MOVE;
    window.camera.position.set(5+x_, 5+y_, 5)
    camera.lookAt(0, 0, 0); // or the origin
}

// var possible = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM"
var possible = "NachiketGrg"
function next_rando(el, desired) {
    // find first index that is incorrect
    if (el.innerText == desired) {
        return
    }

    var index = -1;
    for (var i = 0; i < desired.length; i++) {
        if (!el.innerText[i]) {
            el.innerText+=" "
        }
        if (el.innerText[i] != desired[i]) {
            index = i
            break;
        }
    }
    if (index == -1) {
        return;
    }
    var chosen = desired[index] == " " ? " " : possible[(possible.indexOf(el.innerText[index]) + 1) % possible.length]
    var txt = el.innerText;
    txt = txt.substr(0, index) + chosen + txt.substr(index+1); ;
    el.innerText = txt;
    requestAnimationFrame(()=>{next_rando(el, desired)});
}

function randomize(el) {
    var actualText = el.innerText;
    el.innerText = actualText.split("").map(a => { return possible.replace(" ", "")[Math.floor(Math.random()*possible.replace(" ", "").length)]}).join("");
    setTimeout(()=>{next_rando(el, actualText)}, 1);
}

document.addEventListener("DOMContentLoaded", function () {
    // var elems = document.querySelectorAll('.parallax');
    // var instances = M.Parallax.init(elems);

    var elems = document.querySelectorAll('.tooltipped');
    var instances = M.Tooltip.init(elems);
    
    var rando = document.querySelectorAll('.randomize');
    rando.forEach(e => randomize(e));
    var scene = new THREE.Scene();
    window.d = 2.1;
    window.aspect = window.innerWidth / window.innerHeight;
    window.camera = new THREE.OrthographicCamera(- d * aspect, d * aspect, d, - d, 1, 1000);
    camera.position.set(5, 5, 5); // all components equal
    camera.lookAt(0, 0, 0); // or the origin

    window.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("bg") });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var light = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light);

    var directionalLight = new THREE.DirectionalLight(0xf0fff0, 0.705);
    directionalLight.position.x = 4
    directionalLight.position.y = 10
    directionalLight.position.z = 4
    directionalLight.position.normalize();
    scene.add(directionalLight);
    var blue = new THREE.PointLight(0x000f4f, 1);
    blue.position.x = 10
    scene.add(blue);
    orange = new THREE.PointLight(0x0fff00, 1);
    orange.position.x = 30
    orange.position.y = -10
    orange.position.z = -5
    scene.add(orange);


    window.grid = createGrid(20, 20);
    grid.cubes.forEach((c) => scene.add(c.mesh));

    // camera.position.z = 5;

    var animate = function () {
        requestAnimationFrame(animate);

        grid.cubes.forEach(updateCube);
        renderer.render(scene, camera);
    };

    animate();

});
