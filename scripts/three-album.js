document.addEventListener("DOMContentLoaded", () => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  });
  
const footer = document.querySelector("footer");
const container = document.createElement("div");
container.id = "album-3d-container";
container.style.width = "100%";
container.style.height = "100%";
container.style.position = "relative";
footer.appendChild(container);

// Helper om scripts te laden
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
  await loadScript("https://unpkg.com/three@0.124.0/build/three.js");
  await loadScript("https://unpkg.com/three@0.124.0/examples/js/controls/OrbitControls.js");

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.z = 2;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);

  // Licht
  scene.add(new THREE.AmbientLight(0xffffff, 1));

  // Texture
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("assets/spotify-achtergrond.png", () => {
    renderOnce();
  });

  // Materialen
  const white = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const cover = new THREE.MeshBasicMaterial({ map: texture });

  const materials = [
    white, // right
    white, // left
    white, // top
    white, // bottom
    cover, // front
    cover  // back
  ];

  // Geometry
  const geometry = new THREE.BoxGeometry(1, 1, 0.07);
  const album = new THREE.Mesh(geometry, materials);
  scene.add(album);

  // Controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = false;

  // ===== PERFORMANCE SAFE AUTO ROTATION =====
  let isVisible = false;
  let lastTime = 0;
  const FPS = 30;
  const frameInterval = 1000 / FPS;

  function animate(time) {
    if (!isVisible) return;

    if (time - lastTime >= frameInterval) {
      lastTime = time;

      album.rotation.y += 0.01; // rustige draai
      renderer.render(scene, camera);
    }

    requestAnimationFrame(animate);
  }

  // Observe visibility
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible) requestAnimationFrame(animate);
    });
  });

  observer.observe(container);

  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderOnce();
  });

  function renderOnce() {
    renderer.render(scene, camera);
  }

  renderOnce();
})();
