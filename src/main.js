import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


// Scene
const scene = new THREE.Scene();
// scene.background = new THREE.Color().setHex(0xADD8E6);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 30;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000);

//Add light
// const sunLight = new THREE.DirectionalLight(0xffffff, 2); // Intensity = 2 is good starting point
// sunLight.position.set(10, 10, 10); // Sun coming from top-right-front
// scene.add(sunLight);

// Optional: helper to see where light is pointing
// const sunHelper = new THREE.DirectionalLightHelper(sunLight, 5);
// scene.add(sunHelper);

// const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Lower intensity, just soft fill
// scene.add(ambientLight);

// const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.6);
// scene.add(hemiLight);

// const sun = new THREE.DirectionalLight(0xffffff, 2);
// sun.position.set(1, 5, 5);
// scene.add(sun);

// const ambient = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambient);

// const sky = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.6);
// scene.add(sky);



// const light = new THREE.PointLight(0xffffff, 5);
// light.position.set(5, 5, 5);
// scene.add(light);
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

// const ambientLight = new THREE.AmbientLight(0xffffff, 2);
// scene.add(ambientLight);

// Load GLB Model from public folder

//On Switch 
const loader = new GLTFLoader();
let model;
loader.load(
    '/LightSwitch_On.glb',
    (gltf) => {
        model = gltf.scene;

        // model.traverse((child) => {
        //     if (child.isMesh) {
        //         console.log('Mesh name:', child.name);
        //         console.log('Material:', child.material);
        //     }
        // });

        model.scale.set(10, 10, 10); // Adjust size as needed
        model.position.set(-10, 5, 5); // Adjust position if needed
        model.rotation.y = Math.PI / -2;
        scene.add(model);
    }
);

//Off switch object
const loader2 = new GLTFLoader();
let model2;
loader.load(
    '/LightSwitch_Off.glb',
    (gltf) => {
        model2 = gltf.scene;
        model2.scale.set(10, 10, 10); // Adjust size as needed
        model2.position.set(10, 5, 5); // Adjust position if needed
        model2.rotation.y = Math.PI / -2;
        scene.add(model2);
    }
);
// Add cube object

const geometry = new THREE.BoxGeometry(5, 5, 5);
const material = new THREE.MeshBasicMaterial({ color: 0x00fff0 });
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

//Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Optional: smooth easing
controls.dampingFactor = 0.05;
controls.target.set(0, 0, 0); // Where camera orbits around

const spotlight = new THREE.SpotLight(0xffffff, 10, 100, Math.PI / 8, 0.3, 1);
spotlight.castShadow = true;
spotlight.penumbra = 0.8;
spotlight.angle = Math.PI / 4;
scene.add(spotlight);
scene.add(spotlight.target);


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update spotlight position based on mouse (convert to 3D space)
    spotlight.position.set(mouse.x * 20, mouse.y * 10, 20);
    spotlight.target.position.set(mouse.x * 20, mouse.y * 10, 0);
});


// Animate
function animate() {
    requestAnimationFrame(animate);
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    // model.rotation.y += 0.01;
    raycaster.setFromCamera(mouse, camera);

    // Intersect with a flat plane at z = 0
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const point = new THREE.Vector3();
    raycaster.ray.intersectPlane(planeZ, point);

    // Move the spotlight to that 3D point
    spotlight.position.set(point.x, point.y, 20); // z = 20 = above scene
    spotlight.target.position.set(point.x, point.y, 8);
    spotlight.target.updateMatrixWorld();
    //


    controls.update();
    renderer.render(scene, camera);
}
animate();