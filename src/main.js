import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DragControls } from 'three/addons/controls/DragControls.js';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { TextureLoader } from 'three';



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

/* orbit controls disabled
const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false;
controls.enableDamping = true; // for smooth motion
controls.dampingFactor = 0.05;
controls.enablePan = true; // allow camera panning
controls.minDistance = 10; // prevent zooming too close
controls.maxDistance = 200; // prevent zooming too far*/

const size = 50;
const divisions = 50;

const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

const textureLoader = new TextureLoader();

//draggable objects
const objects = [];
const helpers = [];

//hashmap that maps from mesh(obj) to its physics body
const meshToBody = new Map();

//------------------SETUP------------------------- Z

//------------------Physics-------------------------

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // Earth gravity


//------------------Physics-------------------------


//------------------Audio-------------------------
const listener = new THREE.AudioListener();
camera.add(listener);

// Load a sound and set it up
const clickSound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();

audioLoader.load('/sounds/lightswitchToggle.mp3', function(buffer) {
    clickSound.setBuffer(buffer);
    clickSound.setVolume(2); // Adjust volume if needed

});

    //------------------Audio-------------------------

//------------------Lights-------------------------

// Ambient light (low glow) #ffffff
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);

const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0);
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 5);
scene.add(hemisphereLight);
scene.add(hemisphereLightHelper);

// pointlight following cursors
const mouseCords = new THREE.Vector2()
window.addEventListener('mousemove', (event) => {
    //weird math stuff
    mouseCords.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseCords.y = -(event.clientY / window.innerHeight) * 2 + 1;

})
const spotLight = new THREE.SpotLight(0xffffff, 700);
spotLight.angle = Math.PI / 10; // narrower beam
spotLight.penumbra = 0.4; // softness on edges
spotLight.decay = 1.8;
spotLight.distance = 500;


scene.add(spotLight);
scene.add(spotLight.target); // required so it knows what to "point at"


const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)


scene.add(spotLight);
scene.add(spotLight.target); // required so it knows what to "point at"

//------------------Lights-------------------------

//------------------Objects-------------------------

//SCENE BACKGROUND
const bgTexture = new THREE.TextureLoader().load('space.jpg');
const texturedPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(250, 250),
    new THREE.MeshStandardMaterial({ map: bgTexture })
);
texturedPlane.position.set(25, 10, -0.25); // push it behind the scene -- previous position (0, 0, -40)
scene.add(texturedPlane);

//On Switch 
const loader = new GLTFLoader();
let lightswitch;
loader.load(
    '/LightSwitch_On.glb',
    (gltf) => {
        lightswitch = gltf.scene;

        lightswitch.scale.set(1.5, 1.5, 1.5);
        lightswitch.position.set(25, 10, 0);
        lightswitch.rotation.y = Math.PI / -2;
        
        lightswitch.traverse((child) => {
          if (child.isMesh) {
              child.userData.name = 'lightSwitch';
          }
        });
        scene.add(lightswitch);
    }
);


// Load OFF model
let lightswitchOff;
loader.load(
    '/LightSwitch_Off.glb',
    (gltf) => {
        lightswitchOff = gltf.scene;
        lightswitchOff.scale.set(1.5, 1.5, 1.5);
        lightswitchOff.position.set(25, 10, 0);
        lightswitchOff.rotation.y = Math.PI / -2;
        lightswitchOff.visible = false; // Start invisible
        scene.add(lightswitchOff);
    }
);

//Table Object
let table, tableBody;
const tablePhysMat = new CANNON.Material();
loader.load(
    '/Centered_Table.glb',
    (gltf) => {
        table = gltf.scene;
        table.scale.set(10, 10, 10);
        table.position.set(0, -3, 23);
        table.visible = true;
        scene.add(table);
        // objects.push(table);


        // === Physics body ===
        const tableShape = new CANNON.Box(new CANNON.Vec3(5, 0.25, 5)); // approx. size
        tableBody = new CANNON.Body({
            mass: 0, // static
            position: new CANNON.Vec3(0, -3.18, 23), // match table position
            shape: tableShape,
            material: tablePhysMat
        });
        world.addBody(tableBody);
    }

);


let pen, penBody;
loader.load(
  '/pen.glb',
  (gltf) => {
      pen = gltf.scene;
      pen.scale.set(0.1, 0.1, 0.1);
      pen.position.set(0, 4, 25);
      pen.visible = true;

      // === Physics body ===
      const radiusTop = 0.1;
      const radiusBottom = 0.1;
      const height = 0.9;
      const numSegments = 8;

      const penShape = new CANNON.Cylinder(radiusTop, radiusBottom, height, numSegments);

      const penPhysMat = new CANNON.Material()
      const tablePenContactMat = new CANNON.ContactMaterial(
        tablePhysMat,
        penPhysMat,
        {restitution: 0.25}
      )

      world.addContactMaterial(tablePenContactMat)

      penBody = new CANNON.Body({
          mass: 1, 
          position: new CANNON.Vec3(0, 4, 25),
          material: penPhysMat
          // DO NOT set shape directly here
      });

      // 🛠 Rotate the shape by 90 degrees when adding
      const shapeRotation = new CANNON.Quaternion();
      shapeRotation.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI / 2);

      penBody.addShape(penShape, new CANNON.Vec3(0, 0, 0), shapeRotation);

      scene.add(pen);
      world.addBody(penBody);

      objects.push(pen); // still add to DragControls array
      meshToBody.set(pen, penBody); // <-- map the mesh to its body
  }
);

let venus, venusBody;
loader.load(
  '/venus.glb',
  (gltf) => {
      venus = gltf.scene;
      venus.scale.set(0.01, 0.01, 0.01);
      venus.position.set(0, 6, 20);
      venus.visible = true;
      const texture = textureLoader.load('/textures/venus_surface.jpeg'); // Adjust path

      venus.traverse((child) => {
        if (child.isMesh) {
          child.material.map = texture;
          child.material.needsUpdate = true;
        }
      });

      scene.add(venus);
      // === Physics body for venus ===
      const venusShape = new CANNON.Sphere(1); // assume radius 0.5 for example

      const venusPhysMat = new CANNON.Material()
      venusBody = new CANNON.Body({
          mass: 0.9, 
          position: new CANNON.Vec3(0, 6, 20),
          material: venusPhysMat
      });


      venusBody.addShape(venusShape);
      world.addBody(venusBody);
      objects.push(venus);
      meshToBody.set(venus, venusBody);

      // Check if tableBody is already loaded
      //create boucning stuff
      const tableVenusContactMat = new CANNON.ContactMaterial(
        tablePhysMat,
        venusPhysMat,
        {restitution: 0.7}
      )

      world.addContactMaterial(tableVenusContactMat)

      // === Create helper AFTER venusBody is created ===
      const venusHelper = new THREE.Mesh(
        new THREE.SphereGeometry(1, 16, 16), // same radius as venusShape
        new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
      );
      venusHelper.position.copy(venusBody.position);

      helpers.push({ helper: venusHelper, body: venusBody });
      scene.add(venusHelper);
  }
);


//button to click shoot stars
const shootStarPanel = new THREE.Mesh(
  new THREE.BoxGeometry(10, 6, 0), // width, height, depth
  new THREE.MeshBasicMaterial({ color: 0x00ffff }) // cyan glowing panel
);
shootStarPanel.position.set(-20, 10, 0); // place it near your wall (adjust if needed)
shootStarPanel.userData.name = "shootStarPanel"
scene.add(shootStarPanel);


//------------------Objects-------------------------


//------------------Drag-and-Drop Controls-------------------------

const dragControls = new DragControls( objects, camera, renderer.domElement );
dragControls.transformGroup = true;

// add event listener to highlight dragged objects
let isDragging;
let draggedObject = null;

const previousPositions = new Map(); // key: mesh, value: Vector3
const previousTimes = new Map();     // mesh -> timestamp

dragControls.addEventListener('dragstart', function (event) {
  const mesh = event.object;
  isDragging = true;
  draggedObject = event.object;

  previousPositions.set(mesh, mesh.position.clone());
  previousTimes.set(mesh, performance.now()); // store high-resolution time
});

dragControls.addEventListener('dragend', function (event) {
  const mesh = event.object;
  const body = meshToBody.get(mesh);

  if (body) {
      const previousPosition = previousPositions.get(mesh);
      const previousTime = previousTimes.get(mesh);

      if (previousPosition && previousTime) {
          const deltaPosition = new THREE.Vector3().subVectors(mesh.position, previousPosition);
          const deltaTime = (performance.now() - previousTime) / 1000; // convert ms → seconds

          if (deltaTime > 0) {
              const velocity = deltaPosition.clone().divideScalar(deltaTime);

              const velocityScale = 1.5; // tweak this for realism 
              body.position.copy(mesh.position)
              body.velocity.set(
                  velocity.x * velocityScale,
                  velocity.y * velocityScale * 0.3,
                  velocity.z * velocityScale
              );
          } else {
              body.velocity.set(0, -5, 0);
          }
      } else {
          body.velocity.set(0, -5, 0);
      }
  }

  isDragging = false;
  draggedObject = null;
});



//------------------Drag-and-Drop Controls-------------------------

//------------------Interact-------------------------

// ambient light SWITCH ON / OFF 
const raycaster = new THREE.Raycaster(); //Raycasting is used for mouse picking
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    const clickableObjects = [lightswitch, shootStarPanel]; // list of clickable things

    // calculate pointer position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // update the picking ray with the camera and pointer position
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickableObjects);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
  
      if (clickedObject.userData.name === 'shootStarPanel') {
        spawnShootingStars();
        console.log(shootingStars)

      } else if (clickedObject.userData.name === 'lightSwitch') {
        console.log("inside intersects, ", intersects[0].object)
        // toggle lights
        ambientLight.intensity = ambientLight.intensity === 0 ? 1 : 0;
        hemisphereLight.intensity = hemisphereLight.intensity === 0 ? 1 : 0;
        spotLight.intensity = hemisphereLight.intensity === 0 ? 1 : 0;

        if (lightswitch.visible) {
            lightswitch.visible = false;
            lightswitchOff.visible = true;
        } else {
            lightswitch.visible = true;
            lightswitchOff.visible = false;
        }

        if (clickSound.buffer) {
            if (clickSound.isPlaying) clickSound.stop();
            clickSound.play();
        }
      }
    }

});

//------------------Interact-------------------------

//------------------Shooting Stars Function-------------------------

const shootingStars = []; // store all active stars
function spawnShootingStars() {
  for (let i = 0; i < 50; i++) {
      const star = new THREE.Mesh(
          new THREE.SphereGeometry(0.2, 8, 8),
          new THREE.MeshBasicMaterial({ color:  new THREE.Color().setHSL(Math.random(), 1, 0.8) })
      );

      // Random X/Y near center, Z behind scene
      star.position.set(
          (Math.random() - 0.5) * 40, // x: [-20, 20]
          (Math.random() - 0.5) * 20, // y: [-10, 10]
          -40 + Math.random() * 20   // z: [-40, -20]
      );

      // Random velocity mostly in +Z
      star.userData.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * .1, // x drift
          (Math.random() - 0.5) * .1, // y drift
          0.3 + Math.random() * 0.3   // strong +z
      );

      scene.add(star);
      shootingStars.push(star);
  }
}




//------------------Shooting Stars Function-------------------------


// Animate
function animate() {
  requestAnimationFrame(animate);

  // === Spotlight follows cursor: start ===
  const vector = new THREE.Vector3(mouseCords.x, mouseCords.y, 0.5); // NDC with z = 0.5 for depth
  vector.unproject(camera); // convert to world coords

  const dir = vector.sub(camera.position).normalize(); // direction from camera
  const distance = 0.1; // how far in front of camera
  const pos = camera.position.clone().add(dir.multiplyScalar(distance)); // new light position

  spotLight.position.copy(pos); // move spotlight
  spotLight.target.position.copy(pos.clone().add(dir)); // point it forward
  spotLightHelper.update(); // refresh helper too
  // === Spotlight follows cursor: end ===

  // === Physics step ===
  world.step(1 / 60); // physics simulation step

  // === Drag and drop physics syncing ===
  for (let mesh of objects) {
    const body = meshToBody.get(mesh);
    if (body && mesh !== draggedObject) {
        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);
    }
  }

  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const star = shootingStars[i];

    // move
    star.position.add(star.userData.velocity);

    // remove if it went too far
    if (star.position.z > 50) {
        scene.remove(star);
        shootingStars.splice(i, 1);
    }
}

  // === (Optional) Update helpers if you have them ===
  for (let { helper, body } of helpers) {
      helper.position.copy(body.position);
      helper.quaternion.copy(body.quaternion);
  }

  // === Render scene ===
  renderer.render(scene, camera);
}


animate();