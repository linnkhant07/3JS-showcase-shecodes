import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
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


//------------------SETUP-------------------------

//------------------Lights-------------------------

// Ambient light (low glow)
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);

//------------------Lights-------------------------

//------------------Objects-------------------------

//SCENE BACKGROUND
const bgTexture = new THREE.TextureLoader().load('space.jpg');
const texturedPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(250, 250),
  new THREE.MeshStandardMaterial({ map: bgTexture })
);
texturedPlane.position.set(0, 0, -30); // push it behind the scene
scene.add(texturedPlane);

// Sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 32, 16),
  new THREE.MeshStandardMaterial({ color: 0xffff00, wireframe: false })
);
sphere.position.set(0,0,-30)
scene.add(sphere);

// Sphere2
const sphere2 = new THREE.Mesh(
  new THREE.SphereGeometry(5, 32, 16),
  new THREE.MeshStandardMaterial({ color: 0xffff00, wireframe: false })
);
sphere2.position.set(20,0,-30)
scene.add(sphere2);

//block
const boxTexture = new THREE.TextureLoader().load('lightswitch.webp')
const box = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial(({map: boxTexture}))
)
box.position.set(0, 20, 0)
scene.add(box)

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
  const intersects = raycaster.intersectObject(box);
  if (intersects.length > 0) {
    ambientLight.intensity = ambientLight.intensity === 0 ? 1 : 0;
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

const spotLight = new THREE.SpotLight(0xffffff, 150);
spotLight.angle = Math.PI / 10; // narrower beam
spotLight.penumbra = 0.4;      // softness on edges
spotLight.decay = 1.5;
spotLight.distance = 0;

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)


scene.add(spotLight);
scene.add(spotLight.target);   // required so it knows what to "point at"

//-----temp

// Animate
function animate() {
  requestAnimationFrame(animate);

  // === Spotlight follows cursor ===
  const vector = new THREE.Vector3(mouseCords.x, mouseCords.y, 0.8); // NDC with z = 0.5 for depth
  vector.unproject(camera); // convert to world coords

  const dir = vector.sub(camera.position).normalize(); // direction from camera
  const distance = 30; // how far in front of camera
  const pos = camera.position.clone().add(dir.multiplyScalar(distance)); // new light position

  spotLight.position.copy(pos); // move spotlight
  spotLight.target.position.copy(pos.clone().add(dir)); // point it forward

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