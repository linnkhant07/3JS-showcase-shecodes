import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

//------------------SETUP-------------------------
// Scene setup
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
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000); // full darkness

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // for smooth motion
controls.dampingFactor = 0.05;
controls.enablePan = true;     // allow camera panning
controls.minDistance = 10;     // prevent zooming too close
controls.maxDistance = 200;    // prevent zooming too far

const size = 50;
const divisions = 50;

const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );


//------------------SETUP-------------------------

//------------------Audio-------------------------
const listener = new THREE.AudioListener();
camera.add(listener);

// Load a sound and set it up
const clickSound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();

audioLoader.load('/sounds/lightswitchToggle.mp3', function(buffer) {
    clickSound.setBuffer(buffer);
    clickSound.setVolume(2); // Adjust volume if needed

    console.log(audioLoader)
    console.log("1")
});

console.log(audioLoader)
//------------------Audio-------------------------

//------------------Lights-------------------------

// Ambient light (low glow) #ffffff
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);

const hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0 );
const hemisphereLightHelper = new THREE.HemisphereLightHelper( hemisphereLight, 5 );
scene.add( hemisphereLight );
scene.add( hemisphereLightHelper );

//------------------Lights-------------------------

//------------------Objects-------------------------

//SCENE BACKGROUND
const bgTexture = new THREE.TextureLoader().load('space.jpg');
const texturedPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(250, 250),
  new THREE.MeshStandardMaterial({ map: bgTexture })
);
texturedPlane.position.set(0, 0, -40); // push it behind the scene
scene.add(texturedPlane);

//On Switch 
const loader = new GLTFLoader();
let lightswitch;
loader.load(
    '/LightSwitch_On.glb',
    (gltf) => {
        lightswitch = gltf.scene;

        lightswitch.scale.set(3,3,3); 
        lightswitch.position.set(30, 20, -15); 
        lightswitch.rotation.y = Math.PI / -2;
        scene.add(lightswitch);
    }
);

// Load OFF model
let lightswitchOff;
loader.load(
  '/LightSwitch_Off.glb',
  (gltf) => {
    lightswitchOff = gltf.scene;
    lightswitchOff.scale.set(3,3,3);
    lightswitchOff.position.set(30, 20, -15);
    lightswitchOff.rotation.y = Math.PI / -2;
    lightswitchOff.visible = false; // Start invisible
    scene.add(lightswitchOff);
  }
);

//Table Object
let table;
loader.load(
  '/wooden_table_viejdi1_high.glb',
  (gltf) => {
    table = gltf.scene;
    table.scale.set(10,10,10);
    table.position.set(0, -10, 20);
    table.visible = true; 
    scene.add(table);
  }
);
// Sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 32, 16),
  new THREE.MeshStandardMaterial({ color: 0xffff00, wireframe: false })
);
sphere.position.set(0,0,0)
scene.add(sphere);

// Sphere2
const sphere2 = new THREE.Mesh(
  new THREE.SphereGeometry(5, 32, 16),
  new THREE.MeshStandardMaterial({ color: 0xffff00, wireframe: false })
);
sphere2.position.set(20,0,0)
scene.add(sphere2);

//block
const boxTexture = new THREE.TextureLoader().load('lightswitch.webp')
const box = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial(({map: boxTexture}))
)
box.position.set(0, 20, -10)
//scene.add(box)

//------------------Objects-------------------------

//------------------Features-------------------------

// ambient light SWITCH ON / OFF 
const raycaster = new THREE.Raycaster(); //Raycasting is used for mouse picking
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {

  // calculate pointer position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(mouse, camera);

  // check if the picking ray is over the lightswitch
  const intersects = raycaster.intersectObject(lightswitch);
  if (intersects.length > 0) {
    ambientLight.intensity = ambientLight.intensity === 0 ? 1 : 0;
    hemisphereLight.intensity = hemisphereLight.intensity === 0 ? 1 : 0;

    // Toggle switch models
    if (lightswitch.visible) {
      lightswitch.visible = false;
      lightswitchOff.visible = true;
    } else {
      lightswitch.visible = true;
      lightswitchOff.visible = false;
    }

    // if (action) {
    //   action.reset();
    //   action.play();
    // }

    // Play the click sound
    if (clickSound.buffer) {
      if (clickSound.isPlaying) clickSound.stop();
      clickSound.play();
    }
  }
});

//------------------Features-------------------------

//-------temp
// pointlight following cursors
const mouseCords = new THREE.Vector2()
window.addEventListener('mousemove', (event)=>{
  //weird math stuff
  mouseCords.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseCords.y = - (event.clientY / window.innerHeight) * 2 + 1;

})
const spotLight = new THREE.SpotLight(0xffffff, 800);
spotLight.angle = Math.PI / 8; // narrower beam
spotLight.penumbra = 0.4;      // softness on edges
spotLight.decay = 1.8;
spotLight.distance = 500;


scene.add(spotLight);
scene.add(spotLight.target);   // required so it knows what to "point at"


const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)


scene.add(spotLight);
scene.add(spotLight.target);   // required so it knows what to "point at"

//-----temp

// Animate
function animate() {
  requestAnimationFrame(animate);

  // === Spotlight follows cursor ===
  const vector = new THREE.Vector3(mouseCords.x, mouseCords.y, 0.5); // NDC with z = 0.5 for depth
  vector.unproject(camera); // convert to world coords

  const dir = vector.sub(camera.position).normalize(); // direction from camera
  const distance = 5; // how far in front of camera ( i put 1 but that gave weird focused light)
  const pos = camera.position.clone().add(dir.multiplyScalar(distance)); // new light position

  spotLight.position.copy(pos); // move spotlight
  spotLight.target.position.copy(pos.clone().add(dir)); // point it forward

  spotLightHelper.update(); // refresh helper too
  controls.update();
  renderer.render(scene, camera);
}

animate();


//to add stars
function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24)
  const material = new THREE.MeshStandardMaterial({color: 0xffffff})
  const star = new THREE.Mesh(geometry, material)

  const [x, y, z] = Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(100))
  star.position.set(x,y,z)
  scene.add(star)
}

Array(200).fill().forEach(addStar)
