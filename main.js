/**
 * SUGAR FIT - Diabetes Control & Body Detox Wooden Tumbler
 * Interactive Three.js 3D Engine & GSAP Scroll Experience
 * Features:
 * - Procedural Vijaysar Raw Heartwood PBR Textures (Diff, Bump, Endgrain)
 * - Embossed Coaster Badge: "DIABETES CONTROL GLASS - SUGAR FIT 100% NATURAL"
 * - 4-Stage Scroll-Driven Storytelling (Hero -> Water Fill -> Hima Kalpana Infusion -> Morning Pour)
 * - Free 3D Inspection Mode (OrbitControls)
 * - Web Audio Ambient Sound Generator
 */

// Global State
const state = {
  stage: 1,
  inspectMode: false,
  soundEnabled: false,
  waterLevel: 0.1, // 0 to 1
  infusionProgress: 0.0, // 0 (clear) to 1 (deep amber brown)
  isPouringToGlass: false,
  quantity: 1,
  pricePerItem: 699,
};

// Scene, Camera, Renderer
let scene, camera, renderer, controls;
let tumblerGroup, coasterGroup, liquidMesh, pouringGlassGroup, streamMesh, glassLiquidMesh;
let waterParticles, infusionParticles;
let ambientLight, dirLight, rimLight, warmPointLight;
let clock;

// Constants (Image-matched warm golden teak & herbal amber)
const WOOD_BASE_COLOR = 0xB8732A;
const CLEAR_WATER_COLOR = new THREE.Color(0xd6f0ff);
const INFUSED_AMBER_COLOR = new THREE.Color(0xC87A28); // Authentic Vijaysar Hima Kalpana Amber

// Initialize Three.js scene
function initThree() {
  const container = document.getElementById('webgl-container');
  if (!container) return;

  clock = new THREE.Clock();

  // Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xF7F2EA, 0.015);

  // Camera
  const fov = window.innerWidth < 768 ? 45 : 38;
  camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.5, 9.5);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Controls (for inspection mode)
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxDistance = 14;
  controls.minDistance = 4;
  controls.maxPolarAngle = Math.PI / 2 + 0.2;
  controls.enabled = false;

  // Setup Lights
  setupLighting();

  // Build 3D Models
  buildSceneObjects();

  // Window Resize
  window.addEventListener('resize', onWindowResize, false);

  // Setup Scroll & Animation
  setupGSAPTimeline();

  // Start Animation Loop
  animate();
}

// Lighting Setup
function setupLighting() {
  // Ambient Light
  ambientLight = new THREE.AmbientLight(0xfff8f0, 0.75);
  scene.add(ambientLight);

  // Directional Sun Light (Warm morning glow)
  dirLight = new THREE.DirectionalLight(0xfffaed, 1.2);
  dirLight.position.set(6, 10, 8);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 25;
  dirLight.shadow.camera.left = -6;
  dirLight.shadow.camera.right = 6;
  dirLight.shadow.camera.top = 6;
  dirLight.shadow.camera.bottom = -6;
  dirLight.shadow.bias = -0.0005;
  scene.add(dirLight);

  // Rim Light for edge definition of wood & glass
  rimLight = new THREE.DirectionalLight(0xcde6d6, 0.6);
  rimLight.position.set(-6, 4, -6);
  scene.add(rimLight);

  // Warm Amber point light near tumbler base for glow
  warmPointLight = new THREE.PointLight(0xd4a373, 0.8, 10);
  warmPointLight.position.set(2, 0, 3);
  scene.add(warmPointLight);

  // Ground Contact Shadow Plane
  const groundGeo = new THREE.PlaneGeometry(30, 30);
  const shadowCanvas = createShadowTexture();
  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  const groundMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.35,
    depthWrite: false
  });
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -2.8;
  scene.add(groundMesh);
}

// Create Soft Contact Shadow Texture
function createShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
  gradient.addColorStop(0, 'rgba(27, 67, 50, 0.8)');
  gradient.addColorStop(0.3, 'rgba(92, 56, 24, 0.4)');
  gradient.addColorStop(0.7, 'rgba(212, 163, 115, 0.15)');
  gradient.addColorStop(1, 'rgba(251, 248, 241, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  return canvas;
}

// Procedural Vijaysar Wood Textures
function generateWoodTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Base authentic rich teak / Vijaysar heartwood gradient (matched to product photo)
  const baseGrad = ctx.createLinearGradient(0, 0, 1024, 0);
  baseGrad.addColorStop(0, '#94541C');
  baseGrad.addColorStop(0.2, '#B8732A');
  baseGrad.addColorStop(0.45, '#7C3E14');
  baseGrad.addColorStop(0.7, '#C48438');
  baseGrad.addColorStop(0.85, '#D89748');
  baseGrad.addColorStop(1, '#94541C');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Longitudinal wood grain fibers
  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * 1024;
    const width = 1 + Math.random() * 4;
    ctx.fillStyle = Math.random() > 0.5 ? '#4A230B' : '#E5A556';
    ctx.fillRect(x, 0, width, 1024);
  }

  // Wavy growth tree grain bands
  ctx.globalAlpha = 0.22;
  ctx.lineWidth = 3;
  for (let y = 0; y < 1024; y += 18) {
    ctx.beginPath();
    ctx.strokeStyle = y % 36 === 0 ? '#4F250C' : '#C1833F';
    ctx.moveTo(0, y);
    for (let x = 0; x < 1024; x += 40) {
      const wave = Math.sin((x / 1024) * Math.PI * 4 + y * 0.05) * 12;
      ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }

  // Micro wood pores (natural untreated medicinal wood has visible open pores)
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#301506';
  for (let p = 0; p < 2500; p++) {
    const px = Math.random() * 1024;
    const py = Math.random() * 1024;
    ctx.fillRect(px, py, 1.2, 3.5);
  }

  ctx.globalAlpha = 1.0;
  return new THREE.CanvasTexture(canvas);
}

// Procedural Endgrain Wood Texture (for base & rim)
function generateEndgrainTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#7a3e1d';
  ctx.fillRect(0, 0, 512, 512);

  // Concentric tree rings
  ctx.translate(256, 256);
  for (let r = 10; r < 250; r += 4 + Math.random() * 3) {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.strokeStyle = r % 16 === 0 ? '#47220e' : '#945b2f';
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.35;
    ctx.stroke();
  }

  // Medullary wood rays (radial lines from center)
  ctx.globalAlpha = 0.2;
  ctx.strokeStyle = '#381a0b';
  for (let a = 0; a < Math.PI * 2; a += 0.08) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * 250, Math.sin(a) * 250);
    ctx.stroke();
  }

  ctx.globalAlpha = 1.0;
  return new THREE.CanvasTexture(canvas);
}

// Procedural Bump Map for Raw Wood Feel
function generateWoodBumpMap() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 512);

  // Fiber noise
  for (let x = 0; x < 512; x += 2) {
    const shade = 120 + Math.floor(Math.random() * 30);
    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.fillRect(x, 0, 1.5, 512);
  }

  return new THREE.CanvasTexture(canvas);
}

// Procedural Green Badge Decal for Coaster & Tumbler Body
// Features exact text and tree from official product:
// "DIABETES CONTROL GLASS - SUGAR FIT - मधुमेह नियंत्रित गिलास - 100% NATURAL"
function generateCoasterBadgeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Transparent outer background
  ctx.clearRect(0, 0, 1024, 1024);

  const center = 512;
  const radius = 430;

  // Deep Herbal Forest Green Circular Disc (#0F2E1E)
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#0F2E1E';
  ctx.fill();

  // Outer Vibrant Yellow/Gold Border (#EAB308)
  ctx.beginPath();
  ctx.arc(center, center, radius - 14, 0, Math.PI * 2);
  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = 18;
  ctx.stroke();

  // Inner Gold Thin Ring
  ctx.beginPath();
  ctx.arc(center, center, radius - 48, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Top Curved Text: "DIABETES CONTROL GLASS"
  drawCurvedText(
    ctx,
    'DIABETES CONTROL GLASS',
    center,
    center,
    radius - 92,
    Math.PI * 1.5,
    'bold 42px "Cinzel", "Playfair Display", serif',
    '#FFFFFF'
  );

  // Bottom Curved Text: "100% NATURAL"
  drawCurvedText(
    ctx,
    '★ 100% NATURAL ★',
    center,
    center,
    radius - 92,
    Math.PI * 0.5,
    'bold 38px "Plus Jakarta Sans", sans-serif',
    '#FACC15',
    true
  );

  // Center Brand: "SUGAR"
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 50px "Cinzel", "Playfair Display", serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('SUGAR', center, center - 135);

  // Center Brand: "FIT"
  ctx.font = 'bold 74px "Cinzel", "Playfair Display", serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('FIT', center, center - 72);

  // Yellow Pill Banner: "मधुमेह नियंत्रित गिलास"
  const bannerW = 440;
  const bannerH = 56;
  const bannerX = center - bannerW / 2;
  const bannerY = center - 20;

  ctx.fillStyle = '#FACC15';
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 28);
  } else {
    ctx.rect(bannerX, bannerY, bannerW, bannerH);
  }
  ctx.fill();
  ctx.strokeStyle = '#CA8A04';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Hindi text inside pill
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('मधुमेह नियंत्रित गिलास', center, bannerY + bannerH / 2 + 2);

  // Center Tree Illustration (Green tree from official logo)
  drawBadgeTree(ctx, center, center + 125);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  return tex;
}

// Draw the green leafy tree emblem from official Sugar Fit logo
function drawBadgeTree(ctx, cx, cy) {
  // Tree trunk
  ctx.fillStyle = '#78350F';
  ctx.beginPath();
  ctx.moveTo(cx - 7, cy + 50);
  ctx.lineTo(cx - 4, cy + 10);
  ctx.lineTo(cx + 4, cy + 10);
  ctx.lineTo(cx + 7, cy + 50);
  ctx.closePath();
  ctx.fill();

  // Foliage clusters
  ctx.fillStyle = '#15803D';
  ctx.beginPath();
  ctx.arc(cx, cy - 8, 36, 0, Math.PI * 2);
  ctx.arc(cx - 26, cy + 4, 30, 0, Math.PI * 2);
  ctx.arc(cx + 26, cy + 4, 30, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#22C55E';
  ctx.beginPath();
  ctx.arc(cx - 10, cy - 6, 24, 0, Math.PI * 2);
  ctx.arc(cx + 10, cy - 6, 24, 0, Math.PI * 2);
  ctx.arc(cx, cy + 6, 20, 0, Math.PI * 2);
  ctx.fill();
}

// Helper to draw text along a circular curve
function drawCurvedText(ctx, text, centerX, centerY, radius, centerAngle, font, color, isBottom = false) {
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const chars = text.split('');
  const totalAngle = (text.length * 28) / radius; // Angular spread
  let startAngle = isBottom ? centerAngle + totalAngle / 2 : centerAngle - totalAngle / 2;

  chars.forEach((char) => {
    ctx.save();
    const currentAngle = startAngle;
    const x = centerX + radius * Math.cos(currentAngle);
    const y = centerY + radius * Math.sin(currentAngle);

    ctx.translate(x, y);
    ctx.rotate(currentAngle + (isBottom ? -Math.PI / 2 : Math.PI / 2));
    ctx.fillText(char, 0, 0);
    ctx.restore();

    startAngle += isBottom ? -28 / radius : 28 / radius;
  });

  ctx.restore();
}

// Helper to draw Ayurvedic leaf icon in badge
function drawAyurvedicLeaf(ctx, cx, cy, size, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - size);
  ctx.quadraticCurveTo(cx + size * 0.8, cy, cx, cy + size * 0.9);
  ctx.quadraticCurveTo(cx - size * 0.8, cy, cx, cy - size);
  ctx.fill();

  // Leaf vein
  ctx.strokeStyle = '#0F291E';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy - size + 10);
  ctx.lineTo(cx, cy + size * 0.7);
  ctx.stroke();
  ctx.restore();
}

// Build 3D Objects: Tumbler, Coaster, Liquid, Particles & Pouring Glass
function buildSceneObjects() {
  const woodTexture = generateWoodTexture();
  const endgrainTexture = generateEndgrainTexture();
  const bumpMap = generateWoodBumpMap();

  // Natural untreated raw wood material (matte, fibrous, zero varnish)
  const woodMaterial = new THREE.MeshStandardMaterial({
    map: woodTexture,
    bumpMap: bumpMap,
    bumpScale: 0.04,
    roughness: 0.82, // Unpolished natural heartwood
    metalness: 0.04,
    color: 0xffffff,
  });

  // Endgrain wood material for rim & top
  const endgrainMaterial = new THREE.MeshStandardMaterial({
    map: endgrainTexture,
    bumpMap: bumpMap,
    bumpScale: 0.03,
    roughness: 0.84,
    metalness: 0.02,
  });

  // Load real photo texture of the glass & authentic badge
  const texLoader = new THREE.TextureLoader();
  texLoader.load('images/real-wood-texture.jpg', function(tex) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 1);
    woodMaterial.map = tex;
    woodMaterial.needsUpdate = true;
  });

  // 1. VIJAYSAR WOODEN TUMBLER
  tumblerGroup = new THREE.Group();

  // Authentic lathe profile from actual product photography:
  // Flared foot base (r~1.50), waist (r~1.40), shoulder (r~1.52), top chamfer lip (r~1.32)
  const points = [];
  points.push(new THREE.Vector2(0.0, -2.4));
  points.push(new THREE.Vector2(1.50, -2.4)); // Flared bottom foot
  points.push(new THREE.Vector2(1.54, -2.22));
  points.push(new THREE.Vector2(1.35, -1.95)); // Inward curve above foot
  points.push(new THREE.Vector2(1.40, -1.65)); // Body starts
  points.push(new THREE.Vector2(1.42, -0.6));
  points.push(new THREE.Vector2(1.44, 0.4));
  points.push(new THREE.Vector2(1.47, 1.5));
  points.push(new THREE.Vector2(1.52, 2.30)); // Top shoulder
  points.push(new THREE.Vector2(1.32, 2.62)); // Distinct top chamfered taper lip (from real photo)
  // Inner hollow cavity for holding water
  points.push(new THREE.Vector2(1.18, 2.58)); // Inner rim
  points.push(new THREE.Vector2(1.18, 1.5));
  points.push(new THREE.Vector2(1.14, -0.2));
  points.push(new THREE.Vector2(1.10, -1.65));
  points.push(new THREE.Vector2(0.0, -1.65)); // Inner bottom

  const tumblerGeo = new THREE.LatheGeometry(points, 48);
  const tumblerMesh = new THREE.Mesh(tumblerGeo, woodMaterial);
  tumblerMesh.castShadow = true;
  tumblerMesh.receiveShadow = true;
  tumblerGroup.add(tumblerMesh);

  // Lathe-turned decorative ring grooves matching the product photo:
  // 2 upper grooves near rim, 1 lower groove above base
  const ringGeo = new THREE.TorusGeometry(1.45, 0.022, 12, 48);
  const ringMesh1 = new THREE.Mesh(ringGeo, endgrainMaterial);
  ringMesh1.rotation.x = Math.PI / 2;
  ringMesh1.position.y = 1.95;
  tumblerGroup.add(ringMesh1);

  const ringMesh2 = ringMesh1.clone();
  ringMesh2.position.y = 1.78;
  tumblerGroup.add(ringMesh2);

  const ringMesh3 = ringMesh1.clone();
  ringMesh3.position.y = -1.62;
  tumblerGroup.add(ringMesh3);

  // Official Green Badge Decal on Front of Tumbler Body
  const badgeTexture = generateCoasterBadgeTexture();
  const bodyBadgeGeo = new THREE.CylinderGeometry(1.46, 1.45, 1.65, 32, 1, true, -Math.PI * 0.18, Math.PI * 0.36);
  const bodyBadgeMat = new THREE.MeshBasicMaterial({
    map: badgeTexture,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const bodyBadgeMesh = new THREE.Mesh(bodyBadgeGeo, bodyBadgeMat);
  bodyBadgeMesh.position.y = 0.15;
  bodyBadgeMesh.rotation.y = Math.PI; // Position facing forward
  tumblerGroup.add(bodyBadgeMesh);

  texLoader.load('images/real-badge-crop.png', function(tex) {
    bodyBadgeMat.map = tex;
    bodyBadgeMat.needsUpdate = true;
  });

  // 2. LIQUID INSIDE TUMBLER
  // Cylinder that fits inside the inner cavity
  const liquidGeo = new THREE.CylinderGeometry(1.28, 1.15, 3.8, 32);
  const liquidMaterial = new THREE.MeshPhysicalMaterial({
    color: CLEAR_WATER_COLOR,
    transmission: 0.88,
    opacity: 0.85,
    transparent: true,
    roughness: 0.05,
    ior: 1.333, // Water index of refraction
    reflectivity: 0.5,
    clearcoat: 0.8,
    clearcoatRoughness: 0.05,
  });
  liquidMesh = new THREE.Mesh(liquidGeo, liquidMaterial);
  liquidMesh.position.y = 0.1;
  liquidMesh.scale.set(0.98, state.waterLevel, 0.98);
  tumblerGroup.add(liquidMesh);

  // Meniscus top cap for water surface
  const meniscusGeo = new THREE.CircleGeometry(1.26, 32);
  const meniscusMat = new THREE.MeshStandardMaterial({
    color: CLEAR_WATER_COLOR,
    roughness: 0.1,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85,
  });
  const meniscusMesh = new THREE.Mesh(meniscusGeo, meniscusMat);
  meniscusMesh.rotation.x = -Math.PI / 2;
  meniscusMesh.position.y = 1.9;
  meniscusMesh.visible = false;
  liquidMesh.add(meniscusMesh);

  // 3. MATCHING WOODEN COASTER / LID
  coasterGroup = new THREE.Group();

  // Coaster main turned wooden disc
  const coasterPoints = [
    new THREE.Vector2(0.0, -0.25),
    new THREE.Vector2(1.72, -0.25),
    new THREE.Vector2(1.80, -0.15),
    new THREE.Vector2(1.82, 0.15),
    new THREE.Vector2(1.75, 0.25),
    new THREE.Vector2(0.0, 0.25),
  ];
  const coasterGeo = new THREE.LatheGeometry(coasterPoints, 48);
  const coasterBaseMesh = new THREE.Mesh(coasterGeo, woodMaterial);
  coasterBaseMesh.castShadow = true;
  coasterBaseMesh.receiveShadow = true;
  coasterGroup.add(coasterBaseMesh);

  // Bottom recessed centering flange so lid fits cleanly on tumbler rim
  const flangeGeo = new THREE.CylinderGeometry(1.32, 1.32, 0.2, 32);
  const flangeMesh = new THREE.Mesh(flangeGeo, endgrainMaterial);
  flangeMesh.position.y = -0.25;
  coasterGroup.add(flangeMesh);

  // Recessed circular top green badge: "DIABETES CONTROL GLASS - SUGAR FIT 100% NATURAL"
  const badgeGeo = new THREE.CircleGeometry(1.58, 48);
  const badgeMat = new THREE.MeshStandardMaterial({
    map: badgeTexture,
    roughness: 0.45,
    metalness: 0.25,
    bumpMap: badgeTexture,
    bumpScale: 0.02,
  });
  const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
  badgeMesh.rotation.x = -Math.PI / 2;
  badgeMesh.position.y = 0.26;
  coasterGroup.add(badgeMesh);

  texLoader.load('images/real-badge-crop.png', function(tex) {
    badgeMat.map = tex;
    badgeMat.needsUpdate = true;
  });

  const isDesktop = window.innerWidth >= 1024;
  const initialX = isDesktop ? 2.3 : 0;

  // Position coaster hovering slightly above tumbler (Hero anti-gravity floating stage)
  coasterGroup.position.set(initialX, 3.4, 0);
  scene.add(coasterGroup);

  // Add Tumbler Group to scene
  tumblerGroup.position.set(initialX, -0.3, 0);
  scene.add(tumblerGroup);

  // 4. WATER PARTICLES FOR POURING (Stage 2)
  buildWaterPourParticles();

  // 5. HERBAL INFUSION DIFFUSION PARTICLES (Stage 3 Hima Kalpana)
  buildInfusionParticles();

  // 6. ADJACENT BOROSILICATE CLEAR GLASS FOR STAGE 4 (Morning Pour)
  buildPouringGlass();
}

// Stage 2: Water droplets pouring from above
function buildWaterPourParticles() {
  const particleCount = 75;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const speeds = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 0.35; // x
    positions[i * 3 + 1] = 2.5 + Math.random() * 4.0;    // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.35; // z
    speeds[i] = 0.12 + Math.random() * 0.1;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.userData = { speeds: speeds, initialY: 6.5 };

  // Water drop canvas texture
  const dropCanvas = document.createElement('canvas');
  dropCanvas.width = 64;
  dropCanvas.height = 64;
  const dCtx = dropCanvas.getContext('2d');
  const dGrad = dCtx.createRadialGradient(32, 32, 2, 32, 32, 30);
  dGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  dGrad.addColorStop(0.4, 'rgba(180, 225, 255, 0.7)');
  dGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  dCtx.fillStyle = dGrad;
  dCtx.beginPath();
  dCtx.arc(32, 32, 30, 0, Math.PI * 2);
  dCtx.fill();

  const dropTex = new THREE.CanvasTexture(dropCanvas);

  const material = new THREE.PointsMaterial({
    color: 0xe0f2fe,
    size: 0.18,
    map: dropTex,
    transparent: true,
    opacity: 0.0, // Hidden until Stage 2
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  waterParticles = new THREE.Points(geometry, material);
  waterParticles.position.set(0, 0.5, 0);
  scene.add(waterParticles);
}

// Stage 3: Cold Infusion (Hima Kalpana) Herbal Essence Particles
function buildInfusionParticles() {
  const count = 60;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.2 + Math.random() * 0.9;
    pos[i * 3 + 0] = Math.cos(angle) * radius;
    pos[i * 3 + 1] = -1.2 + Math.random() * 2.5;
    pos[i * 3 + 2] = Math.sin(angle) * radius;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

  const mat = new THREE.PointsMaterial({
    color: 0xd4a373,
    size: 0.12,
    transparent: true,
    opacity: 0.0, // Fade in during Stage 3
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  infusionParticles = new THREE.Points(geo, mat);
  tumblerGroup.add(infusionParticles);
}

// Stage 4: Adjacent Clear Borosilicate Glass & Pouring Stream
function buildPouringGlass() {
  pouringGlassGroup = new THREE.Group();

  // Clear drinking glass profile
  const glassPoints = [
    new THREE.Vector2(0.0, -2.4),
    new THREE.Vector2(1.15, -2.4),
    new THREE.Vector2(1.22, -2.3),
    new THREE.Vector2(1.28, 0.0),
    new THREE.Vector2(1.36, 1.8),
    new THREE.Vector2(1.32, 1.85), // Lip
    new THREE.Vector2(1.26, 1.8),
    new THREE.Vector2(1.18, 0.0),
    new THREE.Vector2(1.08, -2.15),
    new THREE.Vector2(0.0, -2.15),
  ];
  const glassGeo = new THREE.LatheGeometry(glassPoints, 32);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.96,
    opacity: 0.35,
    transparent: true,
    roughness: 0.04,
    ior: 1.5,
    reflectivity: 0.7,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    side: THREE.DoubleSide,
  });
  const glassMesh = new THREE.Mesh(glassGeo, glassMat);
  glassMesh.castShadow = true;
  pouringGlassGroup.add(glassMesh);

  // Infused liquid rising inside the clear glass
  const innerLiquidGeo = new THREE.CylinderGeometry(1.22, 1.05, 3.4, 32);
  const innerLiquidMat = new THREE.MeshPhysicalMaterial({
    color: INFUSED_AMBER_COLOR,
    transmission: 0.65,
    opacity: 0.92,
    transparent: true,
    roughness: 0.1,
    ior: 1.34,
  });
  glassLiquidMesh = new THREE.Mesh(innerLiquidGeo, innerLiquidMat);
  glassLiquidMesh.position.y = -0.2;
  glassLiquidMesh.scale.set(0.96, 0.02, 0.96); // Starts empty
  pouringGlassGroup.add(glassLiquidMesh);

  // Position glass to the right side, initially hidden/offstage
  pouringGlassGroup.position.set(3.2, -0.4, 0.5);
  pouringGlassGroup.scale.set(0.01, 0.01, 0.01); // Hidden until stage 4
  scene.add(pouringGlassGroup);

  // Curved water pouring stream mesh between tumbler lip and glass
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.8, 1.6, 0.0),
    new THREE.Vector3(1.6, 1.3, 0.1),
    new THREE.Vector3(2.2, 0.4, 0.15),
    new THREE.Vector3(2.4, -0.6, 0.2),
  ]);
  const streamGeo = new THREE.TubeGeometry(curve, 20, 0.07, 8, false);
  const streamMat = new THREE.MeshPhysicalMaterial({
    color: INFUSED_AMBER_COLOR,
    transmission: 0.7,
    roughness: 0.05,
    transparent: true,
    opacity: 0.0,
    ior: 1.33,
  });
  streamMesh = new THREE.Mesh(streamGeo, streamMat);
  scene.add(streamMesh);
}

// Window Resize Handler
function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.fov = window.innerWidth < 768 ? 48 : 38;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

// GSAP ScrollTrigger 4-Stage Timeline Setup
function setupGSAPTimeline() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not loaded yet.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const isDesktop = window.innerWidth >= 1024;
  const heroX = isDesktop ? 2.3 : 0.0;
  const stage3X = isDesktop ? -2.2 : 0.0;
  const stage4TumblerX = isDesktop ? 1.0 : -0.7;
  const stage4GlassX = isDesktop ? 3.0 : 1.3;

  // Set water particles x position matching heroX
  if (waterParticles) {
    waterParticles.position.x = heroX;
  }

  // Master Scroll Timeline spanning the main landing sections
  const mainTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#scroll-experience-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      onUpdate: (self) => {
        updateActiveStageUI(self.progress);
      },
    },
  });

  // Stage 1 -> Stage 2: Lift coaster, introduce water pouring particles, fill tumbler
  mainTimeline
    // Coaster lifts off and moves to side
    .to(coasterGroup.position, { y: 4.8, x: heroX + 1.4, z: 0.5, ease: 'power2.inOut', duration: 2 }, 0)
    .to(coasterGroup.rotation, { z: 0.35, x: 0.2, ease: 'power2.inOut', duration: 2 }, 0)
    // Tumbler stays in pouring position
    .to(tumblerGroup.position, { x: heroX, y: -0.5, duration: 2 }, 0)
    .to(tumblerGroup.rotation, { y: 0.5, x: 0.08, duration: 2 }, 0)
    // Water particles become active
    .to(waterParticles.material, { opacity: 0.85, duration: 0.8 }, 0.8)
    // Liquid level rises from 0.1 to 0.88
    .to(liquidMesh.scale, { y: 0.88, duration: 1.8, ease: 'power1.out' }, 1.2)
    .to(waterParticles.material, { opacity: 0.0, duration: 0.6 }, 2.6);

  // Stage 2 -> Stage 3: Hima Kalpana Cold Infusion (Night-to-Day transition, color turning amber)
  mainTimeline
    // Coaster hovers back on top
    .to(coasterGroup.position, { x: stage3X, y: 3.1, z: 0, duration: 2, ease: 'power2.inOut' }, 3.0)
    .to(coasterGroup.rotation, { x: 0, y: 0, z: 0, duration: 2 }, 3.0)
    .to(tumblerGroup.position, { x: stage3X, y: -0.3, z: 0, duration: 2 }, 3.0)
    .to(tumblerGroup.rotation, { y: Math.PI, duration: 2.5, ease: 'none' }, 3.0)
    // Fade in botanical infusion diffusion particles
    .to(infusionParticles.material, { opacity: 0.9, duration: 1.2 }, 3.2)
    // Color transition of liquid from clear cyan to rich Vijaysar herbal amber
    .to(liquidMesh.material.color, {
      r: INFUSED_AMBER_COLOR.r,
      g: INFUSED_AMBER_COLOR.g,
      b: INFUSED_AMBER_COLOR.b,
      duration: 2.2,
      ease: 'power2.inOut',
    }, 3.4)
    // Simulated night-to-day background transition
    .to('#sky-backdrop', {
      backgroundColor: '#07150E',
      filter: 'brightness(0.85)',
      duration: 1.2,
      onStart: () => {
        document.getElementById('sky-backdrop')?.classList.add('night-mode');
        document.body.classList.add('night-theme');
      },
      onReverseComplete: () => {
        document.getElementById('sky-backdrop')?.classList.remove('night-mode');
        document.body.classList.remove('night-theme');
      }
    }, 3.0)
    .to('#sky-backdrop', {
      backgroundColor: '#FBF8F1',
      filter: 'brightness(1.0)',
      duration: 1.4,
      onStart: () => {
        document.getElementById('sky-backdrop')?.classList.remove('night-mode');
        document.body.classList.remove('night-theme');
      }
    }, 4.4)
    .to(infusionParticles.material, { opacity: 0.2, duration: 0.8 }, 4.6);

  // Stage 3 -> Stage 4: 360° inspection & morning tilt pour into clear glass
  mainTimeline
    // Tumbler full 360 rotation to showcase wood grain & coaster badge
    .to(tumblerGroup.rotation, { y: Math.PI * 2 + 0.3, duration: 2.0, ease: 'power1.inOut' }, 5.2)
    .to(coasterGroup.position, { x: stage4TumblerX - 1.8, y: 2.2, z: 1.2, duration: 1.8 }, 5.4)
    .to(coasterGroup.rotation, { x: 0.4, y: 0.3, z: -0.2, duration: 1.8 }, 5.4)
    // Clear glass scales in
    .to(pouringGlassGroup.scale, { x: 1, y: 1, z: 1, duration: 1.4, ease: 'back.out(1.5)' }, 5.5)
    .to(pouringGlassGroup.position, { x: stage4GlassX, y: -0.5, z: 0.2, duration: 1.4 }, 5.5)
    // Tumbler tilts towards clear glass
    .to(tumblerGroup.position, { x: stage4TumblerX, y: 0.8, z: 0, duration: 1.4 }, 6.2)
    .to(tumblerGroup.rotation, { z: -0.85, x: 0.2, duration: 1.4, ease: 'power2.inOut' }, 6.2)
    // Stream position matches tumbler and glass
    .to(streamMesh.position, { x: stage4TumblerX, y: 0, z: 0, duration: 0.1 }, 6.7)
    // Stream appears
    .to(streamMesh.material, { opacity: 0.88, duration: 0.4 }, 6.8)
    // Liquid in tumbler decreases while glass fills
    .to(liquidMesh.scale, { y: 0.25, duration: 1.6 }, 7.0)
    .to(glassLiquidMesh.scale, { y: 0.85, duration: 1.6, ease: 'power1.out' }, 7.0)
    // Stream fades out after fill
    .to(streamMesh.material, { opacity: 0.0, duration: 0.4 }, 8.4)
    // Tumbler settles into finished display pose
    .to(tumblerGroup.rotation, { z: -0.15, y: Math.PI * 2.2, duration: 1.2 }, 8.5)
    .to(tumblerGroup.position, { x: stage4TumblerX - 0.5, y: -0.3, duration: 1.2 }, 8.5);
}

// Update Active Stage Pills & Status based on scroll progress
function updateActiveStageUI(progress) {
  let activeStage = 1;
  if (progress > 0.72) {
    activeStage = 4;
  } else if (progress > 0.42) {
    activeStage = 3;
  } else if (progress > 0.15) {
    activeStage = 2;
  }

  if (state.stage !== activeStage) {
    state.stage = activeStage;
    document.querySelectorAll('.stage-pill').forEach((pill) => {
      const stageNum = parseInt(pill.getAttribute('data-stage'));
      if (stageNum === activeStage) {
        pill.classList.add('bg-emerald-900', 'text-amber-200', 'border-amber-400');
        pill.classList.remove('bg-white/80', 'text-stone-700', 'border-stone-300');
      } else {
        pill.classList.remove('bg-emerald-900', 'text-amber-200', 'border-amber-400');
        pill.classList.add('bg-white/80', 'text-stone-700', 'border-stone-300');
      }
    });

    // Update Stage Live Tooltip
    const tooltip = document.getElementById('stage-tooltip-text');
    if (tooltip) {
      const texts = [
        'Stage 1: Pure Vijaysar Tumbler & Anti-Gravity Coaster',
        'Stage 2: Coaster Lifts & Fresh Water Pouring',
        'Stage 3: Overnight Hima Kalpana (Amber Extraction)',
        'Stage 4: 360° Wood Grain & Morning Pour into Glass',
      ];
      tooltip.innerText = texts[activeStage - 1];
    }
  }
}

// Jump directly to a stage when clicked
window.jumpToStage = function (stageNumber) {
  const container = document.getElementById('scroll-experience-container');
  if (!container) return;

  const height = container.scrollHeight - window.innerHeight;
  const targets = [0.02, 0.28, 0.58, 0.92];
  const targetScroll = container.offsetTop + height * targets[stageNumber - 1];

  window.scrollTo({
    top: targetScroll,
    behavior: 'smooth',
  });
};

// Toggle Free 3D Inspection Mode
window.toggleInspectMode = function () {
  state.inspectMode = !state.inspectMode;
  const webglEl = document.getElementById('webgl-container');
  const btn = document.getElementById('inspect-toggle-btn');
  const overlay = document.getElementById('inspect-notice');

  if (state.inspectMode) {
    controls.enabled = true;
    webglEl.classList.add('interactive-mode');
    if (btn) {
      btn.innerHTML = `<i data-lucide="x" class="w-4 h-4 inline-block mr-1"></i> Exit 3D Inspect`;
      btn.classList.add('bg-amber-600', 'text-white');
      btn.classList.remove('bg-white/90', 'text-emerald-950');
    }
    if (overlay) overlay.classList.remove('hidden');
    // Soft camera readjust
    gsap.to(camera.position, { x: 0, y: 1.8, z: 8.5, duration: 1.0 });
    controls.target.set(0, 0, 0);
  } else {
    controls.enabled = false;
    webglEl.classList.remove('interactive-mode');
    if (btn) {
      btn.innerHTML = `<i data-lucide="rotate-3d" class="w-4 h-4 inline-block mr-1"></i> Inspect 360°`;
      btn.classList.remove('bg-amber-600', 'text-white');
      btn.classList.add('bg-white/90', 'text-emerald-950');
    }
    if (overlay) overlay.classList.add('hidden');
    // Refresh ScrollTrigger to restore scroll camera
    ScrollTrigger.refresh();
  }

  if (window.lucide) lucide.createIcons();
};

// Ambient Sound Synthesizer via Web Audio API (0 external MP3 files needed)
let audioCtx, noiseNode, filterNode, gainNode;
window.toggleAmbientSound = function () {
  const btn = document.getElementById('sound-toggle-btn');
  if (!state.soundEnabled) {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        // Generate soothing trickle/water noise buffer
        const bufferSize = audioCtx.sampleRate * 2;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99 * b0 + white * 0.05;
          b1 = 0.95 * b1 + white * 0.05;
          b2 = 0.85 * b2 + white * 0.05;
          output[i] = (b0 + b1 + b2) * 0.18;
        }

        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        filterNode = audioCtx.createBiquadFilter();
        filterNode.type = 'lowpass';
        filterNode.frequency.value = 850;

        gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.35, audioCtx.currentTime + 1.5);

        whiteNoise.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        whiteNoise.start(0);
      } else if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      state.soundEnabled = true;
      if (btn) {
        btn.innerHTML = `<i data-lucide="volume-2" class="w-4 h-4 text-emerald-800"></i>`;
        btn.classList.add('bg-emerald-100', 'border-emerald-500');
      }
    } catch (e) {
      console.warn('AudioContext autoplay restricted:', e);
    }
  } else {
    if (audioCtx && audioCtx.state === 'running') {
      audioCtx.suspend();
    }
    state.soundEnabled = false;
    if (btn) {
      btn.innerHTML = `<i data-lucide="volume-x" class="w-4 h-4 text-stone-500"></i>`;
      btn.classList.remove('bg-emerald-100', 'border-emerald-500');
    }
  }
  if (window.lucide) lucide.createIcons();
};

// Render / Animation Loop
function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();

  // Floating idle motion for tumbler & coaster when not inspecting
  if (!state.inspectMode && tumblerGroup && coasterGroup) {
    const idleSway = Math.sin(elapsedTime * 1.5) * 0.08;
    const idleTilt = Math.cos(elapsedTime * 1.2) * 0.02;

    // Soft anti-gravity floating
    if (state.stage === 1) {
      const isDesktop = window.innerWidth >= 1024;
      const baseX = isDesktop ? 2.3 : 0.0;
      coasterGroup.position.x = baseX;
      coasterGroup.position.y = 3.3 + Math.sin(elapsedTime * 2.0) * 0.12;
      coasterGroup.rotation.y = elapsedTime * 0.15;
      tumblerGroup.position.x = baseX;
      tumblerGroup.position.y = -0.3 + idleSway * 0.5;
      tumblerGroup.rotation.y = elapsedTime * 0.1;
      tumblerGroup.rotation.z = idleTilt;
    }
  }

  // Animate Water Droplet Particles during Stage 2
  if (waterParticles && waterParticles.material.opacity > 0.05) {
    const pos = waterParticles.geometry.attributes.position.array;
    const speeds = waterParticles.geometry.userData.speeds;
    const count = pos.length / 3;

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= speeds[i];
      if (pos[i * 3 + 1] < 0.2) {
        pos[i * 3 + 1] = 4.5 + Math.random() * 1.5;
      }
    }
    waterParticles.geometry.attributes.position.needsUpdate = true;
  }

  // Animate Infusion Diffusion Particles inside water during Stage 3
  if (infusionParticles && infusionParticles.material.opacity > 0.05) {
    const pos = infusionParticles.geometry.attributes.position.array;
    const count = pos.length / 3;

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += 0.008;
      // Wavy swirl
      pos[i * 3 + 0] += Math.sin(elapsedTime * 2 + i) * 0.003;
      pos[i * 3 + 2] += Math.cos(elapsedTime * 2 + i) * 0.003;

      if (pos[i * 3 + 1] > 1.8) {
        pos[i * 3 + 1] = -1.2;
      }
    }
    infusionParticles.geometry.attributes.position.needsUpdate = true;
  }

  // Update OrbitControls
  if (controls && controls.enabled) {
    controls.update();
  }

  renderer.render(scene, camera);
}

// Quantity Counter & Dynamic WhatsApp Message Generator
window.changeQuantity = function (delta) {
  let qty = state.quantity + delta;
  if (qty < 1) qty = 1;
  if (qty > 10) qty = 10;
  state.quantity = qty;

  const qtyEl = document.getElementById('order-qty');
  const priceEl = document.getElementById('order-total-price');
  const savingsEl = document.getElementById('order-savings');
  const waBtn = document.getElementById('dynamic-wa-order-btn');

  let price = 699;
  let regular = 1399;
  if (qty === 2) {
    price = 1299; // Save ₹100 extra
    regular = 2798;
  } else if (qty >= 3) {
    price = qty * 600; // Bulk discount ₹600/pc
    regular = qty * 1399;
  } else {
    price = qty * 699;
    regular = qty * 1399;
  }

  if (qtyEl) qtyEl.innerText = qty;
  if (priceEl) priceEl.innerText = `₹${price.toLocaleString('en-IN')}`;
  if (savingsEl) savingsEl.innerText = `You Save ₹${(regular - price).toLocaleString('en-IN')}!`;

  // Update WhatsApp link with details
  const message = encodeURIComponent(
    `Hi, I want to order the Sugar Fit Vijaysar Wooden Tumbler.\n\n` +
    `• Quantity: ${qty} Pc(s)\n` +
    `• Total Special Price: ₹${price}\n` +
    `• Free Wooden Coaster Included\n\n` +
    `Please confirm my delivery address and payment method.`
  );
  const waLink = `https://wa.me/917017905125?text=${message}`;

  if (waBtn) {
    waBtn.href = waLink;
  }
};

// FAQ Accordion Handler
window.toggleAccordion = function (element) {
  const item = element.closest('.accordion-item');
  const isActive = item.classList.contains('active');

  // Close other open accordions
  document.querySelectorAll('.accordion-item').forEach((acc) => {
    acc.classList.remove('active');
  });

  if (!isActive) {
    item.classList.add('active');
  }
};

// Quick Order Modal
window.openOrderModal = function (packType = 1) {
  const modal = document.getElementById('order-modal');
  if (modal) {
    modal.classList.remove('hidden');
    window.changeQuantity(packType - state.quantity);
  }
};

window.closeOrderModal = function () {
  const modal = document.getElementById('order-modal');
  if (modal) modal.classList.add('hidden');
};

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  initThree();

  if (window.lucide) {
    lucide.createIcons();
  }

  // Smooth scroll links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
});
