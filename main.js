const MAX_HEIGHT = 2.4;
let newCube = (x, z) => {
    var geometry = new THREE.BoxGeometry(0.88, 3, 0.88);
    var material = new THREE.MeshLambertMaterial({ color: 0xdddddd, emissive: 0x030a0b, transparent: true, opacity: 0.8 });
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
        cube.height -= Math.abs((cube.height - cube.heightGoal)) * 0.01;
    } else {
        cube.height += Math.abs((cube.height - cube.heightGoal)) * 0.01;
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

document.addEventListener("DOMContentLoaded", function () {
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

    var directionalLight = new THREE.DirectionalLight(0xf0fff0, 0.725);
    directionalLight.position.x = 4
    directionalLight.position.y = 10
    directionalLight.position.z = 4
    directionalLight.position.normalize();
    scene.add(directionalLight);
    pointLight = new THREE.PointLight(0x000f4f, 1);
    scene.add(pointLight);


    window.grid = createGrid(20, 20);
    grid.cubes.forEach((c) => scene.add(c.mesh));

    camera.position.z = 5;

    var animate = function () {
        requestAnimationFrame(animate);

        grid.cubes.forEach(updateCube);

        renderer.render(scene, camera);
    };

    animate();

    var timeline = anime.timeline();
    timeline
        .add({
            targets: ".fade-in",
            opacity: 0,
            duration: 1000,
            easing: "easeOutExpo",
            delay: 1000
        })
        .add({
            targets: '#splash',
            marginLeft: "10%",
            width: 370,
            // delay: function (el, i) { return 1000 + (i * 100); },
            duration: 1200,
            height: 100
        })
        .add({
            targets: ".big",
            top: 0,
            scale: 0.5,
            translateX: '-30%',
            duration: 1000,
            padding: 0,
            offset: '-=1200'
        })
        .add({
            targets: "#content",
            translateY: 0,
            opacity: 1,
            duration: 1000,
            delay: 1000,
            offset: '-=600'
        })

});
