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

        model.scale.set(5, 5, 5); // Adjust size as needed
        model.position.set(-10, 5, 0); // Adjust position if needed
        model.rotation.y = Math.PI / -2;
        scene.add(model);
    }
);

//ambient light
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1);
scene.add(ambientLight)

//Off switch object
const loader2 = new GLTFLoader();
let model2;
loader.load(
    '/LightSwitch_Off.glb',
    (gltf) => {
        model2 = gltf.scene;
        model2.scale.set(5, 5, 5); // Adjust size as needed
        model2.position.set(10, 5, 0); // Adjust position if needed
        model2.rotation.y = Math.PI / -2;
        scene.add(model2);
    }
);

const loader3 = new GLTFLoader();
let model3;
loader.load(
    '/LightSwitch_Off.glb',
    (gltf) => {
        model2 = gltf.scene;
        model2.scale.set(5, 5, 5); // Adjust size as needed
        model2.position.set(0, 0, 0); // Adjust position if needed
        model2.rotation.y = Math.PI / -2;
        scene.add(model2);
    }
);

const loader4 = new GLTFLoader();
let model4;
loader.load(
    '/LightSwitch_Off.glb',
    (gltf) => {
        model2 = gltf.scene;
        model2.scale.set(5, 5, 5); // Adjust size as needed
        model2.position.set(-27, -15, 0); // Adjust position if needed
        model2.rotation.y = Math.PI / -2;
        scene.add(model2);
    }
);

const loader5 = new GLTFLoader();
let model5;
loader.load(
    '/LightSwitch_Off.glb',
    (gltf) => {
        model2 = gltf.scene;
        model2.scale.set(5, 5, 5); // Adjust size as needed
        model2.position.set(-13, -15, 0); // Adjust position if needed
        model2.rotation.y = Math.PI / -2;
        scene.add(model2);
    }
);

const loader6 = new GLTFLoader();
let model6;
loader.load(
    '/LightSwitch_Off.glb',
    (gltf) => {
        model2 = gltf.scene;
        model2.scale.set(5, 5, 5); // Adjust size as needed
        model2.position.set(10, -15, 0); // Adjust position if needed
        model2.rotation.y = Math.PI / -2;
        scene.add(model2);
    }
);

const loader7 = new GLTFLoader();
let model7;
loader.load(
    '/LightSwitch_Off.glb',
    (gltf) => {
        model2 = gltf.scene;
        model2.scale.set(5, 5, 5); // Adjust size as needed
        model2.position.set(0, -15, 0); // Adjust position if needed
        model2.rotation.y = Math.PI / -2;
        scene.add(model2);
    }
);


const loader8 = new GLTFLoader();
let model8;
loader.load(
    '/LightSwitch_Off.glb',
    (gltf) => {
        model2 = gltf.scene;
        model2.scale.set(5, 5, 5); // Adjust size as needed
        model2.position.set(30, 20, 0); // Adjust position if needed
        model2.rotation.y = Math.PI / -2;
        scene.add(model2);
    }
);

const loader9 = new GLTFLoader();
let model9;
loader.load(
    '/LightSwitch_Off.glb',
    (gltf) => {
        model2 = gltf.scene;
        model2.scale.set(5, 5, 5); // Adjust size as needed
        model2.position.set(-30, 20, 0); // Adjust position if needed
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


const spotLight = new THREE.SpotLight(0xffffff, 3);
spotLight.angle = Math.PI / 6; // narrower beam
spotLight.penumbra = 0.4;      // softness on edges
spotLight.decay = 0;
spotLight.distance = 0;

const spotLightHelper = new THREE.SpotLightHelper( spotLight );
scene.add( spotLightHelper );


scene.add(spotLight);
scene.add(spotLight.target);   // required so it knows what to "point at"


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});



// Animate
function animate() {
  requestAnimationFrame(animate);

  // Convert mouse position to 3D
  const vector = new THREE.Vector3(mouse.x, mouse.y, 1);
  vector.unproject(camera);

  const dir = vector.sub(camera.position).normalize();
  const distance = 30;
  const pos = camera.position.clone().add(dir.multiplyScalar(distance));

  spotLight.position.copy(pos);
  spotLight.target.position.copy(pos.clone().add(dir));
  spotLight.target.updateMatrixWorld();
  spotLight.position.setZ(30)
  spotLightHelper.update(); // refresh helper too

  renderer.render(scene, camera);
}
animate();