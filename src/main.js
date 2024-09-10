import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import spiralFragmentShader from "./shaders/coffeeSmoke/fragment.glsl";
import spiralVertexShader from "./shaders/coffeeSmoke/vertex.glsl";
import "./style.css";

// GESTION DE LA SCENE THREE.JS

/**
 * Base
 */
// Debug

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf6faf9);

// Loaders
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();

const texture1 = textureLoader.load("/textures/test1.png");
const texture2 = textureLoader.load("/textures/test2.png");

// Chargement des textures
const images = [
  {
    texture: textureLoader.load("/textures/test1.png"),
    position: { x: 0, y: 0 },
  },
  {
    texture: textureLoader.load("/textures/test2.png"),
    position: { x: 1, y: 0 },
  },
  {
    texture: textureLoader.load("/textures/test3.png"),
    position: { x: -1, y: 0 },
  },
  {
    texture: textureLoader.load("/textures/test4.png"),
    position: { x: 0, y: 1 },
  },
  {
    texture: textureLoader.load("/textures/test5.png"),
    position: { x: 0, y: -1 },
  },
  {
    texture: textureLoader.load("/textures/test6.png"),
    position: { x: 1, y: 1 },
  },
  {
    texture: textureLoader.load("/textures/test7.png"),
    position: { x: 1, y: -1 },
  },
  {
    texture: textureLoader.load("/textures/test8.png"),
    position: { x: -1, y: 1 },
  },
  {
    texture: textureLoader.load("/textures/test9.png"),
    position: { x: -1, y: -1 },
  },
  {
    texture: textureLoader.load("/textures/test10.png"),
    position: { x: 2, y: 0 },
  },
  {
    texture: textureLoader.load("/textures/test11.png"),
    position: { x: -2, y: 0 },
  },
  {
    texture: textureLoader.load("/textures/test12.png"),
    position: { x: 0, y: 2 },
  },
  {
    texture: textureLoader.load("/textures/test13.png"),
    position: { x: 0, y: -2 },
  },
  {
    texture: textureLoader.load("/textures/test14.png"),
    position: { x: 2, y: 2 },
  },
  {
    texture: textureLoader.load("/textures/test15.png"),
    position: { x: 2, y: -2 },
  },
  {
    texture: textureLoader.load("/textures/test16.png"),
    position: { x: -2, y: 2 },
  },
  {
    texture: textureLoader.load("/textures/test17.png"),
    position: { x: -2, y: -2 },
  },
  {
    texture: textureLoader.load("/textures/test18.png"),
    position: { x: 1, y: 2 },
  },
  {
    texture: textureLoader.load("/textures/test19.png"),
    position: { x: 1, y: -2 },
  },
  {
    texture: textureLoader.load("/textures/test20.png"),
    position: { x: -1, y: 2 },
  },
];

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  25,
  sizes.width / sizes.height,
  0.1,
  20
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 10;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Post-processing
 */
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const afterimagePass = new AfterimagePass();
const outputPass = new OutputPass();

composer.addPass(renderPass);
composer.addPass(afterimagePass);
composer.addPass(outputPass);

// Activate/Deactivate post-processing
let postProcessingActive = true;
const onOffButton = document.getElementById("bloom");

onOffButton.addEventListener("click", () => {
  postProcessingActive = !postProcessingActive;

  if (postProcessingActive) {
    onOffButton.innerText = "Effect ON";
    onOffButton.style.opacity = 1;
  } else {
    onOffButton.innerText = "Effect OFF";
    onOffButton.style.opacity = 0.5;
  }
});

/**
 * Geometry et Material
 */
// Geometry (utilisé par tous les planes)
const planeGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);

// Material de base
const baseMaterial = new THREE.ShaderMaterial({
  // depthWrite: false,
  // wireframe: true,
  side: THREE.DoubleSide,
  transparent: true,
  vertexShader: spiralVertexShader,
  fragmentShader: spiralFragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uTexture: { value: null }, // on changera ça pour chaque plane
  },
});

/**
 * Création des planes
 */
const planes = [];

for (let i = 0; i < images.length; i++) {
  // Clone le material de base pour chaque plane
  const planeMaterial = baseMaterial.clone();
  planeMaterial.uniforms.uTexture.value = images[i].texture; // Associe la texture

  // Crée le mesh pour chaque plane
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  // Positionne les planes en ligne (ou en grille, selon tes préférences)
  plane.position.x = images[i].position.x * 1.05;
  plane.position.y = images[i].position.y * 1.05;

  // Ajoute le plane à la scène et au tableau
  scene.add(plane);
  planes.push(plane);
}

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Met à jour l'uniforme du temps pour chaque plane
  planes.forEach((plane) => {
    plane.material.uniforms.uTime.value = elapsedTime;
  });

  // Render
  renderer.render(scene, camera);

  // Post-processing
  if (postProcessingActive) {
    composer.render();
  }

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
