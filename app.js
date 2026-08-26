// ----------------------------------------------------
// WEB AUDIO SYNTHESIZER
// ----------------------------------------------------
let audioCtx = null;
let soundEnabled = true; // Enabled by default
let droneOsc = null;
let droneLfo = null;
let droneGain = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function startSpaceDrone() {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    // Create cosmic drone
    droneOsc = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    droneGain = audioCtx.createGain();
    
    // Low frequency detuned saw wave for drone base
    droneOsc.type = 'sawtooth';
    droneOsc.frequency.setValueAtTime(55, audioCtx.currentTime); // A1 note
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, audioCtx.currentTime);
    filter.Q.setValueAtTime(8, audioCtx.currentTime);
    
    // LFO to modulate filter frequency for "drifting nebulae" vibe
    droneLfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    droneLfo.type = 'sine';
    droneLfo.frequency.setValueAtTime(0.08, audioCtx.currentTime); // Very slow
    lfoGain.gain.setValueAtTime(40, audioCtx.currentTime);
    
    droneLfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    
    droneGain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    
    droneOsc.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(audioCtx.destination);
    
    droneOsc.start();
    droneLfo.start();
  } catch (e) {
    console.warn("Drone failed to start:", e);
  }
}

function stopSpaceDrone() {
  try {
    if (droneOsc) {
      droneOsc.stop();
      droneOsc.disconnect();
      droneOsc = null;
    }
    if (droneLfo) {
      droneLfo.stop();
      droneLfo.disconnect();
      droneLfo = null;
    }
  } catch(e) {}
}

function playClickSound(freq = 600, duration = 0.05) {
  if (!soundEnabled) return;
  try {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + duration);
    
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch(e) {}
}

function playSweepSound(isZoomIn = true) {
  if (!soundEnabled) return;
  try {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'triangle';
    const startFreq = isZoomIn ? 100 : 500;
    const endFreq = isZoomIn ? 600 : 80;
    const duration = 0.6;
    
    osc.frequency.setValueAtTime(startFreq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, audioCtx.currentTime + duration);
    
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch(e) {}
}

function playWhooshSound() {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    // 1.5 seconds whoosh white noise buffer
    const bufferSize = audioCtx.sampleRate * 1.5;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = buffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(3.0, audioCtx.currentTime);
    
    // Sweep bandpass center frequency up and down
    filter.frequency.setValueAtTime(100, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.6);
    filter.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 1.4);
    
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + 0.45); // whoosh peak
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.4);
    
    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    
    noiseNode.start();
  } catch(e) {
    console.warn("Whoosh audio synthesis error: ", e);
  }
}

function playScannerSound() {
  if (!soundEnabled) return;
  try {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(880, audioCtx.currentTime + 0.15);
    osc.frequency.linearRampToValueAtTime(440, audioCtx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch(e) {}
}

// ----------------------------------------------------
// 3D CANVAS UNIVERSE RENDER ENGINE
// ----------------------------------------------------
const canvas = document.getElementById('universeCanvas');
const ctx = canvas.getContext('2d');

let stars = [];
const numStars = 2600;
let warpActive = false;
let warpSpeed = 1.0;
let warpTarget = 1.0;

// Camera Coordinates / Angles
let camX = 0, camY = 0, camZ = 0;
const defaultCamZ = window.innerWidth < 768 ? 920 : 600;
let targetCamX = 0, targetCamY = 0, targetCamZ = defaultCamZ; // Normal orbiting distance

let yaw = 0, pitch = 0;
let targetYaw = 0, targetPitch = 0.1; // Slow pitch tilt initially
let autoRotationSpeed = 0.00045; // 70% reduction from 0.0015

let isDragging = false;
let startDragX = 0, startDragY = 0;
let lastDragX = 0, lastDragY = 0;
let dragVelocityX = 0, dragVelocityY = 0;

let zoomedPlanet = null; // Stored target reference to dive inside
let planets = [];

// Initialize space coordinates resize
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Twinkling Starfield initialization
function initStars() {
  stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: (Math.random() - 0.5) * 3000,
      y: (Math.random() - 0.5) * 3000,
      z: Math.random() * 2000,
      twinkleSpeed: 0.02 + Math.random() * 0.05,
      twinklePhase: Math.random() * Math.PI * 2,
      brightness: 0.2 + Math.random() * 0.8
    });
  }
}
initStars();

// Golden-cobalt spiral Star Lake zenith vortex ceiling
let starLake = [];
const numLakeStars = 520;
function initStarLake() {
  starLake = [];
  for (let i = 0; i < numLakeStars; i++) {
    const theta = (i / numLakeStars) * Math.PI * 40;
    const radius = 15 + (i / numLakeStars) * 750;
    starLake.push({
      angle: theta,
      radius: radius,
      y: -1200 + (Math.random() - 0.5) * 80,
      speed: 0.002 + Math.random() * 0.003,
      colorType: Math.random() > 0.4 ? 'gold' : 'cobalt',
      size: 0.7 + Math.random() * 1.4
    });
  }
}
initStarLake();

// Planet configuration coordinates
function initPlanets() {
  planets = [
    {
      index: 0,
      name: "OmniProcure",
      id: "omniprocure",
      orbitRadius: 280,
      orbitSpeed: 0.0018, // 70% reduction from 0.006
      angle: 0.0,
      size: 16,
      color: "#ff7f50", // Coral orange
      type: "gas" // renders orange ring
    },
    {
      index: 1,
      name: "VibeSafe",
      id: "vibesafe",
      orbitRadius: 420,
      orbitSpeed: 0.0012, // 70% reduction from 0.004
      angle: 1.2,
      size: 14,
      color: "#00f0ff", // Neon Cyan
      type: "shield" // renders cyber grid lines
    },
    {
      index: 2,
      name: "Tracer-Cloud",
      id: "tracer",
      orbitRadius: 560,
      orbitSpeed: 0.0009, // 70% reduction from 0.003
      angle: 2.5,
      size: 18,
      color: "#ff00ff", // Magenta
      type: "cloud" // twin cloud binary sphere
    },
    {
      index: 3,
      name: "BGE Reranker",
      id: "projects",
      orbitRadius: 700,
      orbitSpeed: 0.00066, // 70% reduction from 0.0022
      angle: 3.8,
      size: 15,
      color: "#ffd700", // Gold
      type: "binary" // double binary asteroids
    },
    {
      index: 4,
      name: "TinyFish Core",
      id: "tinyfish",
      orbitRadius: 840,
      orbitSpeed: 0.00048, // 70% reduction from 0.0016
      angle: 4.8,
      size: 20,
      color: "#ff3e3e", // Scarlet/gold core
      type: "star-badge" // Shows holographic phase 2 details
    },
    {
      index: 5,
      name: "Skills Crystal",
      id: "skills",
      orbitRadius: 960,
      orbitSpeed: 0.00036, // 70% reduction from 0.0012
      angle: 5.8,
      size: 14,
      color: "#39ff14", // Bright green
      type: "crystal" // refracting octahedron spinning
    }
  ];
}
initPlanets();

// Helper to project 3D relative to camera coordinates
function project3D(x, y, z) {
  // Apply environment rotation (Pitch and Yaw)
  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);
  
  // Rotate around Y-axis (Yaw)
  let rx1 = x * cosY - z * sinY;
  let rz1 = x * sinY + z * cosY;
  
  // Rotate around X-axis (Pitch)
  let ry2 = y * cosP - rz1 * sinP;
  let rz2 = y * sinP + rz1 * cosP;
  
  // Translate space coordinates relative to camera zoom depths
  const cx = rx1 - camX;
  const cy = ry2 - camY;
  const cz = rz2 - camZ;
  
  const fov = 500;
  const scale = fov / (fov + cz);
  
  return {
    x: canvas.width / 2 + cx * scale,
    y: canvas.height / 2 + cy * scale,
    scale: scale,
    zDepth: cz
  };
}

// ----------------------------------------------------
// SHAPES GRAPHICS RENDER PIPELINES
// ----------------------------------------------------
function drawAtmosphericGlow(px, py, radius, color) {
  const glowGrad = ctx.createRadialGradient(px, py, radius * 0.8, px, py, radius * 1.5);
  glowGrad.addColorStop(0, color + "33"); // 20% opacity hex extension
  glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(px, py, radius * 1.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawGasPlanet(px, py, radius, color, time, sunX, sunY) {
  drawAtmosphericGlow(px, py, radius, color);
  
  const lightAngle = Math.atan2(py - sunY, px - sunX);
  const highlightX = px - Math.cos(lightAngle) * radius * 0.35;
  const highlightY = py - Math.sin(lightAngle) * radius * 0.35;
  
  const grad = ctx.createRadialGradient(highlightX, highlightY, radius * 0.05, px, py, radius);
  grad.addColorStop(0, "#ffe0cc");
  grad.addColorStop(0.5, color);
  grad.addColorStop(1, "#1c0a02"); // shadow side
  
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(px, py, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Gas stripes (curved)
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = radius * 0.12;
  ctx.beginPath();
  ctx.arc(px, py, radius * 0.8, Math.PI * 0.1, Math.PI * 0.9);
  ctx.stroke();
  
  // Custom texture: microchip circuit traces
  ctx.save();
  ctx.beginPath();
  ctx.arc(px, py, radius, 0, Math.PI * 2);
  ctx.clip();
  
  ctx.strokeStyle = "rgba(0, 255, 255, 0.4)";
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.moveTo(px - radius, py + radius * 0.2);
  ctx.lineTo(px - radius * 0.2, py + radius * 0.2);
  ctx.lineTo(px + radius * 0.2, py - radius * 0.3);
  ctx.lineTo(px + radius, py - radius * 0.3);
  ctx.stroke();
  
  ctx.fillStyle = "rgba(0, 255, 255, 0.7)";
  ctx.beginPath();
  ctx.arc(px - radius * 0.2, py + radius * 0.2, 1.8, 0, Math.PI * 2);
  ctx.arc(px + radius * 0.2, py - radius * 0.3, 1.8, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
  
  // Outer flat space rings
  ctx.strokeStyle = "rgba(255, 127, 80, 0.35)";
  ctx.lineWidth = radius * 0.15;
  ctx.save();
  ctx.translate(px, py);
  ctx.scale(2.2, 0.4);
  ctx.rotate(0.12);
  ctx.beginPath();
  ctx.arc(0, 0, radius * 1.3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawShieldPlanet(px, py, radius, color, time, sunX, sunY) {
  drawAtmosphericGlow(px, py, radius, color);
  
  const lightAngle = Math.atan2(py - sunY, px - sunX);
  const highlightX = px - Math.cos(lightAngle) * radius * 0.35;
  const highlightY = py - Math.sin(lightAngle) * radius * 0.35;
  
  const grad = ctx.createRadialGradient(highlightX, highlightY, radius * 0.05, px, py, radius);
  grad.addColorStop(0, "#e0ffff");
  grad.addColorStop(0.5, color);
  grad.addColorStop(1, "#011a26");
  
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(px, py, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Shield rings grid lines overlay
  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(time * 0.15);
  for (let a = 0; a < Math.PI; a += Math.PI / 4) {
    ctx.strokeStyle = "rgba(0, 240, 255, 0.12)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.scale(1.0, Math.sin(a) || 0.1);
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
  
  // Custom texture: glowing lock shield centered
  ctx.save();
  ctx.beginPath();
  ctx.arc(px, py, radius, 0, Math.PI * 2);
  ctx.clip();
  
  ctx.strokeStyle = "rgba(0, 240, 255, 0.55)";
  ctx.lineWidth = 1.2;
  // Lock body rectangle
  ctx.strokeRect(px - radius * 0.25, py - radius * 0.05, radius * 0.5, radius * 0.4);
  // Shackle arch
  ctx.beginPath();
  ctx.arc(px, py - radius * 0.05, radius * 0.16, Math.PI, 0);
  ctx.stroke();
  
  ctx.restore();
}

function drawCloudPlanet(px, py, radius, color, time, sunX, sunY) {
  drawAtmosphericGlow(px, py, radius, color);
  
  const lightAngle = Math.atan2(py - sunY, px - sunX);
  const highlightX = px - Math.cos(lightAngle) * radius * 0.35;
  const highlightY = py - Math.sin(lightAngle) * radius * 0.35;
  
  const grad = ctx.createRadialGradient(highlightX, highlightY, radius * 0.05, px, py, radius);
  grad.addColorStop(0, "#ffccff");
  grad.addColorStop(0.5, color);
  grad.addColorStop(1, "#200020");
  
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(px, py, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Custom texture: sliding horizontal storm wave bands
  ctx.save();
  ctx.beginPath();
  ctx.arc(px, py, radius, 0, Math.PI * 2);
  ctx.clip();
  
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = radius * 0.18;
  const shift = (time * radius * 0.4) % (radius * 2);
  
  ctx.beginPath();
  // Band 1
  ctx.moveTo(px - radius, py - radius * 0.3);
  ctx.lineTo(px + radius, py - radius * 0.3);
  // Band 2
  ctx.moveTo(px - radius, py + radius * 0.25);
  ctx.lineTo(px + radius, py + radius * 0.25);
  ctx.stroke();
  
  ctx.restore();
}

function drawBinaryAsteroids(px, py, radius, color, time, sunX, sunY) {
  // Two asteroids revolving around px, py with directional shading
  const rotDist = radius * 1.5;
  const aX = px + Math.cos(time * 1.0) * rotDist;
  const aY = py + Math.sin(time * 1.0) * rotDist * 0.5;
  const bX = px - Math.cos(time * 1.0) * rotDist;
  const bY = py - Math.sin(time * 1.0) * rotDist * 0.5;
  
  // Draw primary asteroid A
  drawAtmosphericGlow(aX, aY, radius * 0.75, color);
  const lAngleA = Math.atan2(aY - sunY, aX - sunX);
  const hXA = aX - Math.cos(lAngleA) * radius * 0.7 * 0.35;
  const hYA = aY - Math.sin(lAngleA) * radius * 0.7 * 0.35;
  const gradA = ctx.createRadialGradient(hXA, hYA, radius * 0.7 * 0.05, aX, aY, radius * 0.7);
  gradA.addColorStop(0, "#fffae6");
  gradA.addColorStop(0.5, color);
  gradA.addColorStop(1, "#1c1600");
  ctx.fillStyle = gradA;
  ctx.beginPath();
  ctx.arc(aX, aY, radius * 0.7, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw satellite asteroid B
  drawAtmosphericGlow(bX, bY, radius * 0.55, color);
  const lAngleB = Math.atan2(bY - sunY, bX - sunX);
  const hXB = bX - Math.cos(lAngleB) * radius * 0.5 * 0.35;
  const hYB = bY - Math.sin(lAngleB) * radius * 0.5 * 0.35;
  const gradB = ctx.createRadialGradient(hXB, hYB, radius * 0.5 * 0.05, bX, bY, radius * 0.5);
  gradB.addColorStop(0, "#ffe066");
  gradB.addColorStop(0.5, color);
  gradB.addColorStop(1, "#100d00");
  ctx.fillStyle = gradB;
  ctx.beginPath();
  ctx.arc(bX, bY, radius * 0.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawCrystalPlanet(px, py, radius, color, time, sunX, sunY) {
  drawAtmosphericGlow(px, py, radius, color);
  
  ctx.strokeStyle = "rgba(57, 255, 20, 0.75)";
  ctx.lineWidth = 1.2;
  
  const vertices = [];
  const rot = time * 0.3;
  const rawVertices = [
    {x: 0, y: -radius * 1.4, z: 0},
    {x: 0, y: radius * 1.4, z: 0},
    {x: -radius, y: 0, z: -radius},
    {x: radius, y: 0, z: -radius},
    {x: radius, y: 0, z: radius},
    {x: -radius, y: 0, z: radius}
  ];
  
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);
  
  rawVertices.forEach(v => {
    vertices.push({
      x: px + (v.x * cos - v.z * sin),
      y: py + v.y,
      z: v.x * sin + v.z * cos
    });
  });
  
  function drawLine(i, j) {
    ctx.beginPath();
    ctx.moveTo(vertices[i].x, vertices[i].y);
    ctx.lineTo(vertices[j].x, vertices[j].y);
    ctx.stroke();
  }
  
  // Top cone
  drawLine(0, 2); drawLine(0, 3); drawLine(0, 4); drawLine(0, 5);
  // Bottom cone
  drawLine(1, 2); drawLine(1, 3); drawLine(1, 4); drawLine(1, 5);
  // Middle ring
  drawLine(2, 3); drawLine(3, 4); drawLine(4, 5); drawLine(5, 2);
  
  // Shaded fill to give a dynamic refracting volumetric crystal shape
  ctx.fillStyle = "rgba(57, 255, 20, 0.08)";
  ctx.beginPath();
  ctx.moveTo(vertices[0].x, vertices[0].y);
  ctx.lineTo(vertices[2].x, vertices[2].y);
  ctx.lineTo(vertices[3].x, vertices[3].y);
  ctx.closePath();
  ctx.fill();
  
  ctx.fillStyle = "rgba(57, 255, 20, 0.03)";
  ctx.beginPath();
  ctx.moveTo(vertices[0].x, vertices[0].y);
  ctx.lineTo(vertices[3].x, vertices[3].y);
  ctx.lineTo(vertices[4].x, vertices[4].y);
  ctx.closePath();
  ctx.fill();
}

function drawStarBadge(px, py, radius, color, time, sunX, sunY) {
  drawAtmosphericGlow(px, py, radius, color);
  
  const lightAngle = Math.atan2(py - sunY, px - sunX);
  const highlightX = px - Math.cos(lightAngle) * radius * 0.35;
  const highlightY = py - Math.sin(lightAngle) * radius * 0.35;
  
  const grad = ctx.createRadialGradient(highlightX, highlightY, radius * 0.05, px, py, radius);
  grad.addColorStop(0, "#ffcccc");
  grad.addColorStop(0.5, color);
  grad.addColorStop(1, "#3c0909");
  
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(px, py, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Orbiting ring flare
  ctx.strokeStyle = "rgba(255, 62, 62, 0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(px, py, radius * 1.35 + Math.sin(time*2)*3, 0, Math.PI*2);
  ctx.stroke();
}

// ----------------------------------------------------
// ST Stellar System rendering loop
// ----------------------------------------------------
let lastTime = 0;
let timeSec = 0;
let hoverPlanet = null;

function renderUniverse(timestamp) {
  const dt = timestamp - lastTime;
  lastTime = timestamp;
  timeSec += 0.012;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Interpolate camera coordinates - slower spring damping
  camX += (targetCamX - camX) * 0.05;
  camY += (targetCamY - camY) * 0.05;
  camZ += (targetCamZ - camZ) * 0.05;
  
  // Apply auto-orbit yaw if not dragging and not zoomed in
  if (!isDragging && !zoomedPlanet) {
    targetYaw += autoRotationSpeed;
  }
  
  // Apply inertia to drag values with smooth damping (0.98)
  if (!isDragging) {
    targetYaw += dragVelocityX;
    targetPitch += dragVelocityY;
    dragVelocityX *= 0.98;
    dragVelocityY *= 0.98;
  }
  
  yaw += (targetYaw - yaw) * 0.045;
  pitch += (targetPitch - pitch) * 0.045;
  
  // Keep pitch constrained so space system doesn't fully invert
  pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, pitch));
  
  // Interpolate Warp Speed visuals
  warpSpeed += (warpTarget - warpSpeed) * 0.05;
  
  // Write telemetries to HUD coordinate box
  document.getElementById('coordYaw').innerText = `${((yaw * 180) / Math.PI % 360).toFixed(2)}°`;
  document.getElementById('coordPitch').innerText = `${((pitch * 180) / Math.PI).toFixed(2)}°`;
  
  // --- 0. RENDER STAR LAKE ZENITH VORTEX (Ceiling Swirl) ---
  starLake.forEach(s => {
    s.angle += s.speed;
    
    const sx = s.radius * Math.cos(s.angle);
    const sz = s.radius * Math.sin(s.angle);
    const sy = s.y;
    
    const proj = project3D(sx, sy, sz);
    if (proj.scale > 0 && proj.x >= 0 && proj.x <= canvas.width && proj.y >= 0 && proj.y <= canvas.height) {
      // Glow alpha based on depth projection
      const zFade = Math.min(1.0, 1.0 - (proj.zDepth / 2000.0));
      const alpha = Math.max(0.1, Math.min(1.0, proj.scale * 1.5)) * zFade * 0.75;
      
      const color = s.colorType === 'gold'
        ? `rgba(255, 215, 0, ${alpha})`
        : `rgba(0, 160, 255, ${alpha})`;
        
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, s.size * proj.scale * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // --- 1. DRAW TWINKLING STARS & CONSTELLATIONS ---
  // A. Draw Constellation lines between star clusters (O(N) optimized checklist)
  const maxLineDistance = 250;
  ctx.lineWidth = 0.5;
  const subsetSize = Math.min(stars.length, 180);
  
  for (let i = 0; i < subsetSize; i++) {
    const starA = stars[i];
    const projA = project3D(starA.x, starA.y, starA.z);
    
    if (projA.scale <= 0 || projA.x < 0 || projA.x > canvas.width || projA.y < 0 || projA.y > canvas.height) continue;
    
    for (let j = i + 1; j <= i + 6 && j < stars.length; j++) {
      const starB = stars[j];
      const dx = starA.x - starB.x;
      const dy = starA.y - starB.y;
      const dz = starA.z - starB.z;
      const dist3D = Math.hypot(dx, dy, dz);
      
      if (dist3D < maxLineDistance) {
        const projB = project3D(starB.x, starB.y, starB.z);
        
        if (projB.scale > 0 && projB.x >= 0 && projB.x <= canvas.width && projB.y >= 0 && projB.y <= canvas.height) {
          const distanceFade = 1.0 - (dist3D / maxLineDistance);
          const zFade = Math.min(1.0, 1.0 - (starA.z / 2000.0));
          const lineAlpha = distanceFade * zFade * 0.07 * (warpActive ? 0.15 : 1.0);
          
          ctx.strokeStyle = `rgba(0, 240, 255, ${lineAlpha})`;
          ctx.beginPath();
          ctx.moveTo(projA.x, projA.y);
          ctx.lineTo(projB.x, projB.y);
          ctx.stroke();
        }
      }
    }
  }

  // B. Draw Stars
  stars.forEach(star => {
    // Warp stretches stars into radial vectors from center
    if (warpSpeed > 1.2) {
      star.z -= 18 * warpSpeed; // zoom forward
    } else {
      star.z -= 0.5; // slow drift
    }
    
    // Star wrap logic
    if (star.z < 0) {
      star.z = 2000;
      star.x = (Math.random() - 0.5) * 3000;
      star.y = (Math.random() - 0.5) * 3000;
    }
    
    // Project star to 2D
    const proj = project3D(star.x, star.y, star.z);
    
    if (proj.scale > 0 && proj.x >= 0 && proj.x <= canvas.width && proj.y >= 0 && proj.y <= canvas.height) {
      const twinkle = Math.sin(timeSec * star.twinkleSpeed + star.twinklePhase) * 0.35 + 0.65;
      const size = Math.max(0.5, 2 * proj.scale * star.brightness);
      const alpha = Math.max(0.1, Math.min(1, (1 - star.z / 2000) * star.brightness * twinkle));
      
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      
      if (warpSpeed > 1.5) {
        // Draw stretched travel lines
        const lineLen = 1.0 + (warpSpeed - 1) * 3.5;
        const dx = proj.x - canvas.width / 2;
        const dy = proj.y - canvas.height / 2;
        const dist = Math.hypot(dx, dy) || 1;
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
        ctx.lineWidth = size * 0.7;
        ctx.beginPath();
        ctx.moveTo(proj.x, proj.y);
        ctx.lineTo(proj.x + (dx / dist) * lineLen * 20, proj.y + (dy / dist) * lineLen * 20);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
  
  // --- 2. DRAW SOLAR SYSTEM ORBITS & PLANETS ---
  const renderList = [];
  
  // Draw Sun at 0, 0, 0
  const sunProj = project3D(0, 0, 0);
  renderList.push({
    isSun: true,
    proj: sunProj,
    zDepth: sunProj.zDepth
  });
  
  planets.forEach(p => {
    // If not zoomed to this planet, it orbits
    if (zoomedPlanet !== p) {
      p.angle += p.orbitSpeed;
    }
    
    // Scale orbits dynamically according to viewport size
    const scaleFactor = Math.max(0.42, Math.min(1.0, window.innerWidth / 1200));
    const tilt = 15 * Math.PI / 180;
    const px = p.orbitRadius * scaleFactor * Math.cos(p.angle);
    const pz = p.orbitRadius * scaleFactor * Math.sin(p.angle) * Math.cos(tilt);
    const py = p.orbitRadius * scaleFactor * Math.sin(p.angle) * Math.sin(tilt);
    
    const proj = project3D(px, py, pz);
    
    renderList.push({
      isPlanet: true,
      planet: p,
      proj: proj,
      zDepth: proj.zDepth
    });
  });
  
  // Sort from back to front
  renderList.sort((a, b) => b.zDepth - a.zDepth);
  
  let currentHover = null;
  
  renderList.forEach(item => {
    if (item.isSun) {
      // Draw Central Sun AI Glow Star Core
      const proj = item.proj;
      if (proj.scale > 0) {
        const radius = 30 * proj.scale;
        const grad = ctx.createRadialGradient(proj.x, proj.y, 2, proj.x, proj.y, radius * 2.2);
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.3, "#00f0ff");
        grad.addColorStop(0.6, "rgba(0, 80, 255, 0.2)");
        grad.addColorStop(1, "rgba(4, 6, 10, 0)");
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, radius * 2.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Label
        ctx.fillStyle = "rgba(0, 240, 255, 0.6)";
        ctx.font = "9px 'Share Tech Mono'";
        ctx.textAlign = "center";
        ctx.fillText("AI_CORE_01", proj.x, proj.y + radius * 2.8);
      }
    }
    
    if (item.isPlanet) {
      const p = item.planet;
      const proj = item.proj;
      
      if (proj.scale > 0) {
        const radius = p.size * proj.scale;
        
        // Check hover detection boundaries
        const dist = Math.hypot(mouseX - proj.x, mouseY - proj.y);
        const isHovered = dist < Math.max(20, radius * 1.5) && !warpActive;
        
        if (isHovered) {
          currentHover = p;
        }
        
        // Draw Planet depending on type (passing sun coordinates for shading)
        switch (p.type) {
          case "gas":
            drawGasPlanet(proj.x, proj.y, radius, p.color, timeSec, sunProj.x, sunProj.y);
            break;
          case "shield":
            drawShieldPlanet(proj.x, proj.y, radius, p.color, timeSec, sunProj.x, sunProj.y);
            break;
          case "cloud":
            drawCloudPlanet(proj.x, proj.y, radius, p.color, timeSec, sunProj.x, sunProj.y);
            break;
          case "binary":
            drawBinaryAsteroids(proj.x, proj.y, radius, p.color, timeSec, sunProj.x, sunProj.y);
            break;
          case "star-badge":
            drawStarBadge(proj.x, proj.y, radius, p.color, timeSec, sunProj.x, sunProj.y);
            break;
          case "crystal":
            drawCrystalPlanet(proj.x, proj.y, radius, p.color, timeSec, sunProj.x, sunProj.y);
            break;
        }
        
        // Draw telemetry hud text on hovering planets
        if (isHovered || zoomedPlanet === p) {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1;
          
          // Draw tracking crosshair frame
          ctx.strokeRect(proj.x - radius * 1.3, proj.y - radius * 1.3, radius * 2.6, radius * 2.6);
          
          // Technical labels details
          ctx.fillStyle = "#fff";
          ctx.font = "10px 'Share Tech Mono'";
          ctx.textAlign = "left";
          ctx.fillText(p.name.toUpperCase(), proj.x + radius * 1.5, proj.y - 4);
          
          ctx.fillStyle = p.color;
          ctx.font = "8px 'Share Tech Mono'";
          ctx.fillText(`DIST: ${p.orbitRadius}AU`, proj.x + radius * 1.5, proj.y + 6);
          ctx.fillText(`COORD: ${proj.x.toFixed(0)},${proj.y.toFixed(0)}`, proj.x + radius * 1.5, proj.y + 16);
          
          // Cinematic sub-structures and micro-detail callouts reveal
          if (zoomedPlanet === p && warpSpeed < 1.5) {
            ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
            ctx.lineWidth = 1;
            
            // Upper branch detail line
            ctx.beginPath();
            ctx.moveTo(proj.x + radius * 0.5, proj.y - radius * 0.8);
            ctx.lineTo(proj.x + radius * 1.6, proj.y - radius * 1.8);
            ctx.lineTo(proj.x + radius * 3.2, proj.y - radius * 1.8);
            ctx.stroke();
            
            ctx.fillStyle = "rgba(0, 240, 255, 0.8)";
            ctx.font = "8px 'Share Tech Mono'";
            ctx.fillText("CORE_STATUS // NOMINAL", proj.x + radius * 1.7, proj.y - radius * 2.0);
            
            // Lower branch detail line
            ctx.beginPath();
            ctx.moveTo(proj.x + radius * 0.5, proj.y + radius * 0.8);
            ctx.lineTo(proj.x + radius * 1.6, proj.y + radius * 1.8);
            ctx.lineTo(proj.x + radius * 3.2, proj.y + radius * 1.8);
            ctx.stroke();
            
            ctx.fillStyle = p.color;
            ctx.fillText("DATA_LINK // ACTIVE", proj.x + radius * 1.7, proj.y + radius * 1.6);
          }
        } else {
          // Standard title label below planet
          ctx.fillStyle = "rgba(255,255,255,0.4)";
          ctx.font = "9px 'Share Tech Mono'";
          ctx.textAlign = "center";
          ctx.fillText(p.name, proj.x, proj.y + radius + 15);
        }
      }
    }
  });
  
  // Set cursor based on hovering
  hoverPlanet = currentHover;
  if (hoverPlanet) {
    canvas.style.cursor = 'pointer';
  } else {
    canvas.style.cursor = isDragging ? 'grabbing' : 'grab';
  }
  
  requestAnimationFrame(renderUniverse);
}

requestAnimationFrame(renderUniverse);

// ----------------------------------------------------
// INTERACTIVE CAMERA DIVES & ACTIONS
// ----------------------------------------------------
const escOrbitBtn = document.getElementById('escOrbitBtn');
const hudOverlayContainer = document.getElementById('hudOverlayContainer');
const hudCloseBtn = document.getElementById('hudCloseBtn');

function diveIntoPlanet(planet) {
  zoomedPlanet = planet;
  playWhooshSound();
  
  // Trigger Time Warp speed particles and CSS blur distortion
  document.body.classList.add('warp-active');
  warpTarget = 24.0;
  
  // Set active class on corresponding space dock item
  document.querySelectorAll('.space-dock .dock-item').forEach(item => {
    if (item.getAttribute('data-planet-id') === planet.id) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // Freeze auto-rotation, update yaw and pitch to center-left space coordinates
  targetPitch = 0.0;
  
  // Calculate relative orbital coordinates with scaling factor
  const scaleFactor = Math.max(0.42, Math.min(1.0, window.innerWidth / 1200));
  const tilt = 15 * Math.PI / 180;
  const px = planet.orbitRadius * scaleFactor * Math.cos(planet.angle);
  const pz = planet.orbitRadius * scaleFactor * Math.sin(planet.angle) * Math.cos(tilt);
  const py = planet.orbitRadius * scaleFactor * Math.sin(planet.angle) * Math.sin(tilt);
  
  // Align yaw so camera points directly towards target planet
  targetYaw = -planet.angle + Math.PI / 2;
  
  // Zoom camera zDepth near the planet, panning offset based on mobile vs desktop layout
  const isMobile = window.innerWidth < 768;
  const targetCamXOffset = isMobile ? px : px - 80;
  const targetCamYOffset = isMobile ? py - 45 : py; // push planet up on mobile to leave space for sheet
  const targetCamZOffset = isMobile ? pz - 200 : pz - 160;
  
  gsap.to(window, {
    duration: 1.1,
    onStart: () => {
      gsap.to(window, {
        duration: 0.9,
        onUpdate: () => {
          camX = targetCamXOffset;
          camY = targetCamYOffset;
          camZ = targetCamZOffset;
        }
      });
    }
  });
  
  // Configure coordinates target indicators
  document.getElementById('coordTarget').innerText = planet.name.toUpperCase();
  document.getElementById('coordSysRef').innerText = `ZOOMED_IN // ${planet.id.toUpperCase()}`;
  document.getElementById('coordSysRef').className = "coord-val text-orange";
  
  // Fade instruction box out
  document.getElementById('hudInstructions').classList.add('hidden');
  
  // Reveal return to orbit ESC control button
  escOrbitBtn.classList.add('active');
  
  // Pop the corresponding HUD container layout and end warp after 1.1s
  setTimeout(() => {
    document.body.classList.remove('warp-active');
    warpTarget = 1.0;
    
    document.querySelectorAll('.hud-sheet').forEach(sheet => {
      sheet.classList.remove('active');
    });
    
    const targetSheet = document.getElementById(`hud-${planet.id}`);
    if (targetSheet) {
      targetSheet.classList.add('active');
    }
    
    hudOverlayContainer.classList.add('active');
    
    // Confetti pop on TinyFish star badge selection
    if (planet.id === "tinyfish") {
      triggerCelebrationConfetti();
    }
  }, 1100);
}

function returnToOrbit() {
  if (!zoomedPlanet) return;
  
  playSweepSound(false);
  zoomedPlanet = null;
  
  // Reset camera target panning positions to original values
  gsap.to(window, {
    duration: 0.8,
    onUpdate: () => {
      camX = 0;
      camY = 0;
      const defCamZ = window.innerWidth < 768 ? 920 : 600;
      camZ = defCamZ;
      targetCamX = 0;
      targetCamY = 0;
      targetCamZ = defCamZ;
    }
  });
  
  targetPitch = 0.15;
  
  document.getElementById('coordTarget').innerText = "ORBIT_FREE";
  document.getElementById('coordSysRef').innerText = "GRID_NOMINAL";
  document.getElementById('coordSysRef').className = "coord-val text-green";
  
  // Reveal instruction box
  document.getElementById('hudInstructions').classList.remove('hidden');
  
  // Collapse HUD sheets
  hudOverlayContainer.classList.remove('active');
  escOrbitBtn.classList.remove('active');
  
  // Deactivate active states in bottom dock
  document.querySelectorAll('.space-dock .dock-item').forEach(item => {
    item.classList.remove('active');
  });
}

escOrbitBtn.addEventListener('click', returnToOrbit);
hudCloseBtn.addEventListener('click', returnToOrbit);

// Global Esc key check
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    returnToOrbit();
  }
});

// ----------------------------------------------------
// STARFIELD VOID WARP SPEED
// ----------------------------------------------------
function triggerVoidWarp() {
  if (warpActive || zoomedPlanet) return;
  warpActive = true;
  
  playSweepSound(true);
  
  // Trigger stretched warp lines acceleration speed
  gsap.to(window, {
    duration: 0.8,
    onUpdate: () => {
      warpTarget = 18.0; // accelerate speed
    },
    onComplete: () => {
      // Rotate space coordinates randomly for dramatic reset
      targetYaw = Math.random() * Math.PI * 2;
      targetPitch = (Math.random() - 0.5) * Math.PI * 0.3;
      
      // Decelerate back to normal drift speed
      gsap.to(window, {
        duration: 1.0,
        onUpdate: () => {
          warpTarget = 1.0;
        },
        onComplete: () => {
          warpActive = false;
        }
      });
    }
  });
}

// ----------------------------------------------------
// EVENTS & MOUSE DRAGGING PHYSICS
// ----------------------------------------------------
let mouseX = 0, mouseY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

canvas.addEventListener('mousedown', (e) => {
  if (zoomedPlanet || warpActive) return;
  isDragging = true;
  startDragX = e.clientX;
  startDragY = e.clientY;
  lastDragX = e.clientX;
  lastDragY = e.clientY;
  dragVelocityX = 0;
  dragVelocityY = 0;
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  
  const currentX = e.clientX;
  const currentY = e.clientY;
  
  const dx = currentX - lastDragX;
  const dy = currentY - lastDragY;
  
  // Drag sensitivity modifiers
  const dragSens = 0.003;
  targetYaw += dx * dragSens;
  targetPitch -= dy * dragSens;
  
  // Calculate speed velocity momentum
  dragVelocityX = dx * dragSens * 0.5;
  dragVelocityY = -dy * dragSens * 0.5;
  
  lastDragX = currentX;
  lastDragY = currentY;
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

// Touch Dragging Events support
canvas.addEventListener('touchstart', (e) => {
  if (zoomedPlanet || warpActive || e.touches.length === 0) return;
  isDragging = true;
  startDragX = e.touches[0].clientX;
  startDragY = e.touches[0].clientY;
  lastDragX = e.touches[0].clientX;
  lastDragY = e.touches[0].clientY;
  dragVelocityX = 0;
  dragVelocityY = 0;
});

window.addEventListener('touchmove', (e) => {
  if (!isDragging || e.touches.length === 0) return;
  
  const currentX = e.touches[0].clientX;
  const currentY = e.touches[0].clientY;
  
  const dx = currentX - lastDragX;
  const dy = currentY - lastDragY;
  
  const dragSens = 0.005;
  targetYaw += dx * dragSens;
  targetPitch -= dy * dragSens;
  
  dragVelocityX = dx * dragSens * 0.5;
  dragVelocityY = -dy * dragSens * 0.5;
  
  lastDragX = currentX;
  lastDragY = currentY;
});

window.addEventListener('touchend', () => {
  isDragging = false;
});

// Click triggers target planet zoom or double-click warp check
let lastClickTime = 0;
canvas.addEventListener('click', (e) => {
  const currentTime = Date.now();
  const timeDiff = currentTime - lastClickTime;
  lastClickTime = currentTime;
  
  if (timeDiff < 260) {
    // Double click void space triggers Warp Speed
    triggerVoidWarp();
    return;
  }
  
  if (hoverPlanet) {
    diveIntoPlanet(hoverPlanet);
  }
});

// Camera Z scroll zoom translation
window.addEventListener('wheel', (e) => {
  if (zoomedPlanet || warpActive) return;
  targetCamZ = Math.max(200, Math.min(1000, targetCamZ + e.deltaY * 0.8));
});

// ----------------------------------------------------
// INTERACTIVE HUD OVERLAY ACTIONS (TABS & SCANS)
// ----------------------------------------------------
// Config tab buttons inside sheets
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const parentSheet = btn.closest('.hud-sheet');
    const tabName = btn.getAttribute('data-tab');
    
    playClickSound(500, 0.04);
    
    parentSheet.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    parentSheet.querySelectorAll('.sheet-tab-content').forEach(c => c.classList.remove('active'));
    
    btn.classList.add('active');
    const targetContent = document.getElementById(tabName);
    if (targetContent) {
      targetContent.classList.add('active');
    }
  });
});

// Sound Toggle Controls
const soundToggleBtn = document.getElementById('soundToggleBtn');

if (soundEnabled) {
  soundToggleBtn.classList.add('active-sound');
} else {
  soundToggleBtn.classList.add('mute');
}

soundToggleBtn.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  
  if (soundEnabled) {
    soundToggleBtn.classList.add('active-sound');
    soundToggleBtn.classList.remove('mute');
    startSpaceDrone();
    playClickSound(700, 0.08);
  } else {
    soundToggleBtn.classList.remove('active-sound');
    soundToggleBtn.classList.add('mute');
    stopSpaceDrone();
  }
});

// Auto-resume and start drone on first recruiter gesture (click/tap)
function handleFirstGesture() {
  if (soundEnabled) {
    try {
      initAudio();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      startSpaceDrone();
      playClickSound(500, 0.1);
    } catch(e) {}
  }
  window.removeEventListener('click', handleFirstGesture);
  window.removeEventListener('touchstart', handleFirstGesture);
  window.removeEventListener('keydown', handleFirstGesture);
}
window.addEventListener('click', handleFirstGesture);
window.addEventListener('touchstart', handleFirstGesture);
window.addEventListener('keydown', handleFirstGesture);

// VibeSafe AST Security scanner trigger logs simulation
const runSimulationBtn = document.getElementById('runSimulationBtn');
const simulationOutput = document.getElementById('simulationOutput');

runSimulationBtn.addEventListener('click', () => {
  playScannerSound();
  
  simulationOutput.innerHTML = `<span class="text-orange">SCANNING CODE SHELL ATTACHMENT...</span>`;
  runSimulationBtn.disabled = true;
  
  const logs = [
    "[INFO] Initializing AST parser engines...",
    "[WARN] RegEx pattern matched: command inject signature detected.",
    "[CRITICAL] Detected insecure block: os.system shell invocation.",
    "[STATUS] Intercepting command pipeline...",
    "<span class='text-green'>[SECURE] Command blocked successfully! Terminal sandbox integrity: 100% NOMINAL.</span>"
  ];
  
  logs.forEach((log, idx) => {
    setTimeout(() => {
      if (idx === logs.length - 1) {
        playClickSound(600, 0.2);
        runSimulationBtn.disabled = false;
      } else {
        playClickSound(400, 0.04);
      }
      simulationOutput.innerHTML += `<br>${log}`;
      simulationOutput.scrollTop = simulationOutput.scrollHeight;
    }, (idx + 1) * 800);
  });
});

// Celebration confetti triggers
function triggerCelebrationConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#00f0ff', '#ff00ff', '#ffd700', '#39ff14', '#ffffff']
  });
}

// BIND BOTTOM PLANET NAVIGATION DOCK INTERACTIONS
document.querySelectorAll('.space-dock .dock-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    const planetId = item.getAttribute('data-planet-id');
    const planet = planets.find(p => p.id === planetId);
    
    if (planet) {
      playClickSound(650, 0.05);
      if (zoomedPlanet === planet) {
        returnToOrbit();
      } else {
        diveIntoPlanet(planet);
      }
    }
  });
});

