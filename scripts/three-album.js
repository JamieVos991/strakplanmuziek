const button = document.getElementById("load-3d-album");

let initialized = false;

button?.addEventListener("click", async () => {
  if (initialized) return;
  initialized = true;

  button.style.display = "none";

  const footer = document.querySelector("section:nth-of-type(6)");
  const container = document.createElement("div");
  container.id = "album-3d-container";
  container.style.width = "300px";
  container.style.height = "300px";
  container.style.margin = "2rem auto";
  footer.appendChild(container);

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

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));

  const dir = new THREE.DirectionalLight(0xffffff, 0.6);
  dir.position.set(3, 4, 5);
  scene.add(dir);

  const textureLoader = new THREE.TextureLoader();
  const coverTexture = textureLoader.load(
    "./assets/spotify-achtergrond.png"
  );

  const geometry = new THREE.BoxGeometry(1.2, 1.2, 0.08);

  const white = new THREE.MeshStandardMaterial({ color: 0xffffff });

  const materials = [
    white, 
    white, 
    white, 
    white, 
    new THREE.MeshStandardMaterial({ map: coverTexture }), 
    new THREE.MeshStandardMaterial({ map: coverTexture })  
  ];

  const album = new THREE.Mesh(geometry, materials);
  scene.add(album);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 8;

  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}
