const button = document.getElementById("load-3d-album");
let initialized = false;

button?.addEventListener("click", async () => {
  if (initialized) return;
  initialized = true;

  button.style.display = "none";

  // We voegen de container toe aan de sectie zelf, 
  // want een <ul> (footer) mag officieel alleen <li> bevatten.
  const parentSection = button.closest("section"); 
  const container = document.createElement("div");
  container.id = "album-3d-container";
  container.style.width = "100%";
  container.style.height = "400px"; // Iets hoger voor betere weergave
  container.style.margin = "2rem auto";
  parentSection.appendChild(container);

  // Scripts laden
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
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({
    alpha: true, // Zorgt voor transparante achtergrond
    antialias: true
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Belichting
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const dir = new THREE.DirectionalLight(0xffffff, 0.6);
  dir.position.set(3, 4, 5);
  scene.add(dir);

  const textureLoader = new THREE.TextureLoader();
  const coverTexture = textureLoader.load("./assets/spotify-achtergrond.png");

  // BoxGeometry(breedte, hoogte, dikte)
  const geometry = new THREE.BoxGeometry(1.5, 1.5, 0.1);

  // FIX: 'red' was niet gedefinieerd. We maken nu gewoon materials aan.
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const coverMat = new THREE.MeshStandardMaterial({ map: coverTexture });

  // Materials volgorde: [rechts, links, boven, onder, voorkant, achterkant]
  const materials = [
    whiteMat, // rechts
    whiteMat, // links
    whiteMat, // boven
    whiteMat, // onder
    coverMat, // voorkant
    coverMat  // achterkant
  ];

  const album = new THREE.Mesh(geometry, materials);
  scene.add(album);

  // OrbitControls (let op: THREE.OrbitControls hoofdlettergevoelig)
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 4;

  window.addEventListener("resize", () => {
    if (!container) return;
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