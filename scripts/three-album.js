// Voeg dit toe in je HTML: <script type="module" src="./scripts/three-album.js"></script>

// Maak container in footer
const footer = document.querySelector("footer");
const container = document.createElement("div");
container.id = "album-3d-container";
container.style.width = "100%";
container.style.height = "100%";
footer.appendChild(container);

// Dynamisch Three.js en OrbitControls laden via CDN
function loadScript(url) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = url;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

(async function initThree() {
  // Load Three.js en OrbitControls
  await loadScript("https://unpkg.com/three@0.124.0/build/three.js");
  await loadScript("https://unpkg.com/three@0.124.0/examples/js/controls/OrbitControls.js");

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 2;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  const textureLoader = new THREE.TextureLoader();
  const texture = new THREE.TextureLoader().load("/strakplanmuziek/assets/spotify-achtergrond.png");

  const geometry = new THREE.BoxGeometry(1.2, 1.2, .08);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const albumMesh = new THREE.Mesh(geometry, material);
  scene.add(albumMesh);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.0;

  // Responsiveness
  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // Animatie loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
})();
