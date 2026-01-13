const button = document.getElementById("load-3d-album");
let initialized = false;

button?.addEventListener("click", async () => {
  if (initialized) return;
  initialized = true;

  button.style.display = "none";

  const parentSection = button.closest("section"); 
  const container = document.createElement("div");
  container.id = "album-3d-container";
  container.style.cssText = "width: 100%; height: 400px; margin: auto; position: relative; display: flex; align-items: center; justify-content: center;";
  parentSection.appendChild(container);

  // Maak en toon de spinner
  const spinner = document.createElement("article");
  spinner.className = "three-loader";
  container.appendChild(spinner);

  try {
    // Scripts laden
    await loadScript("https://unpkg.com/three@0.124.0/build/three.js");
    await loadScript("https://unpkg.com/three@0.124.0/examples/js/controls/OrbitControls.js");

    initThree(container, spinner); // Geef spinner mee om te verwijderen
  } catch (error) {
    console.error("Laden van 3D model mislukt:", error);
    spinner.remove();
    button.style.display = "block";
    initialized = false;
  }
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

function initThree(container, spinner) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  
  // Belichting
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const dir = new THREE.DirectionalLight(0xffffff, 0.6);
  dir.position.set(3, 4, 5);
  scene.add(dir);

  const textureLoader = new THREE.TextureLoader();
  
  // Texture laden met callback om spinner te verwijderen
  textureLoader.load("./assets/spotify-achtergrond.png", (coverTexture) => {
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 0.1);
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const coverMat = new THREE.MeshStandardMaterial({ map: coverTexture });

    const materials = [whiteMat, whiteMat, whiteMat, whiteMat, coverMat, coverMat];
    const album = new THREE.Mesh(geometry, materials);
    scene.add(album);

    // Verwijder de spinner nu alles geladen is
    if (spinner) spinner.remove();
    container.appendChild(renderer.domElement);
  });

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 4;

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}