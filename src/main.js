import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Scene
const scene = new THREE.Scene();

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

// Add light
// const light = new THREE.PointLight(0xffffff, 1);
// light.position.set(10, 10, 10);
// scene.add(light);
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
// scene.add(ambientLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

// Load GLB Model from public folder

const loader = new GLTFLoader();
let model;
loader.load(
    '/LightSwitch_Off_3.glb',
    (gltf) => {
        model = gltf.scene;

        // model.traverse((child) => {
        //     if (child.isMesh) {
        //         console.log('Mesh name:', child.name);
        //         console.log('Material:', child.material);
        //     }
        // });

        model.scale.set(10, 10, 10); // Adjust size as needed
        model.position.set(5, 5, 5); // Adjust position if needed
        model.rotation.y = Math.PI / -2;
        scene.add(model);
    }
);

// Add cube object

const geometry = new THREE.BoxGeometry(5, 5, 5);
const material = new THREE.MeshBasicMaterial({ color: 0x00fff0 });
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// Animate
function animate() {
    requestAnimationFrame(animate);
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    model.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();