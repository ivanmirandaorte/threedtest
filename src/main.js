import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "lil-gui";
import earth from "/model/earth.glb";

const container = document.querySelector("#threejs-container");

/**
 * Scene
 */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
if (container) {
  container.appendChild(renderer.domElement);
}
renderer.setClearColor(0xffffff, 0);

/**
 * Lights
 */
const light = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(light);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(-1, 0, 1);
spotLight.target.position.set(0, 0, 0);
scene.add(spotLight);

/**
 * Controls
 */
const settings = {
  useOrbitControls: true,
  enableZoom: true,
};

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// controls.enableZoom = false;
controls.enabled = settings.useOrbitControls;

/**
 * Object
 */
let earthMesh;
const loader = new GLTFLoader();
loader.load(
  earth,
  (gltf) => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        earthMesh = child;
      }
    });
    scene.add(gltf.scene);
  },

  undefined,
  (error) => {
    console.error(error);
  }
);

/**
 * Debug
 */
const stats = new Stats();
document.body.appendChild(stats.dom);

const gui = new dat.GUI();
// Light Folder
const data = {
  color: light.color.getHex(),
  mapsEnabled: true,
};

const lightFolder = gui.addFolder("THREE.Light");
lightFolder.addColor(data, "color").onChange(() => {
  light.color.setHex(Number(data.color.toString().replace("#", "0x")));
});

lightFolder.add(light, "intensity", 0, Math.PI * 2, 0.01);

// Directional Light Folder
const directionalLightFolder = gui.addFolder("THREE.DirectionalLight");
directionalLightFolder.add(light.position, "x", -100, 100, 0.1);
directionalLightFolder.add(light.position, "y", -100, 100, 0.1);
directionalLightFolder.add(light.position, "z", -100, 100, 0.1);

// Controls
gui
  .add(settings, "useOrbitControls")
  .name("Use Orbit Controls")
  .onChange((value) => {
    controls.enabled = value;
  });
gui
  .add(settings, "enableZoom")
  .name("Enable Orbit Zoom")
  .onChange((value) => {
    controls.enableZoom = value;
  });

/**
 * Camera position
 */
camera.position.set(0, 0, 200);
camera.lookAt(scene.position);

/**
 * Resizing
 */
window.addEventListener("resize", () => {
  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight;

  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(innerWidth, innerHeight);
});

/**
 * Rendering the scene
 */
function animate() {
  requestAnimationFrame(animate);

  //object rotation
  if (earthMesh) {
    earthMesh.rotation.z += 0.005;
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();
