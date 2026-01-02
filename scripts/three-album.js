const button = document.getElementById("load-3d-album");

let initialized = false;

button?.addEventListener("click", async () => {
  if (initialized) return;
  initialized = true;

  button.style.display = "none";

  // Create container
  const footer = document.querySelector("footer");
  const container = document.createElement("div");
  container.id = "album-3d-container";
  container.style.width = "300px";
  container.style.height = "300px";
  container.style.margin = "2rem auto";
  footer.appendChild(container);

  // Load scripts dynamically
  await loadScript("https://unpkg.com/three@0.124.0/build/three.js");
  await loadScript("https://unpkg.com/three@0.124.0/examples/js/controls/OrbitControls.js");

  initThree(container);
});

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = url;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function initThree(container) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 2.2;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));

  const dir = new THREE.DirectionalLight(0xffffff, 0.6);
  dir.position.set(3, 4, 5);
  scene.add(dir);

  // Texture
  const textureLoader = new THREE.TextureLoader();
  const coverTexture = textureLoader.load(
    "./assets/spotify-achtergrond.png"
  );

  // Geometry
  const geometry = new THREE.BoxGeometry(1.2, 1.2, 0.08);

  const white = new THREE.MeshStandardMaterial({ color: 0xffffff });

  const materials = [
    white, // right
    white, // left
    white, // top
    white, // bottom
    new THREE.MeshStandardMaterial({ map: coverTexture }), // front
    new THREE.MeshStandardMaterial({ map: coverTexture })  // back
  ];

  const album = new THREE.Mesh(geometry, materials);
  scene.add(album);

  // Controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 10;

  // Resize handling
  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // Render loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}
