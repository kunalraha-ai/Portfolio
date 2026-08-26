"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function RealmCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const group = new THREE.Group();
    group.rotation.set(-0.1, 0, 0.2);
    scene.add(group);

    const metalAmber = new THREE.MeshStandardMaterial({
      color: "#c69a5b",
      metalness: 0.9,
      roughness: 0.35,
    });
    const metalSilver = new THREE.MeshStandardMaterial({
      color: "#7c7468",
      metalness: 0.85,
      roughness: 0.42,
    });
    const metalInner = new THREE.MeshStandardMaterial({
      color: "#b7874e",
      metalness: 0.88,
      roughness: 0.38,
    });

    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(2.28, 0.028, 16, 160), metalAmber);
    const middleRing = new THREE.Mesh(new THREE.TorusGeometry(1.98, 0.018, 12, 144), metalSilver);
    middleRing.rotation.set(0.32, 0.08, 0.65);
    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.018, 12, 144), metalInner);
    innerRing.rotation.set(0.16, -0.15, -0.45);
    group.add(outerRing, middleRing, innerRing);

    const spokeGeometry = new THREE.BoxGeometry(0.018, 4.52, 0.018);
    const spokeMaterial = new THREE.MeshStandardMaterial({
      color: "#5f5a52",
      metalness: 0.82,
      roughness: 0.48,
    });
    const spokeRotations = [-1.72, -0.86, 0, 0.86, 1.72];
    for (const rotation of spokeRotations) {
      const spoke = new THREE.Mesh(spokeGeometry, spokeMaterial);
      spoke.rotation.z = rotation;
      spoke.position.z = -0.02;
      group.add(spoke);
    }

    const positions = new Float32Array(120 * 3);
    for (let index = 0; index < 120; index += 1) {
      const angle = index * 2.399963;
      const radius = 1.9 + ((index * 37) % 100) / 36;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = Math.sin(angle) * radius * 0.76;
      positions[index * 3 + 2] = -1.2 + ((index * 17) % 80) / 28;
    }

    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const dustMaterial = new THREE.PointsMaterial({
      color: "#c69a5b",
      size: 0.018,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    });
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);

    scene.add(new THREE.AmbientLight("#9aa8ad", 0.7));
    const keyLight = new THREE.DirectionalLight("#d4a86b", 2.4);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight("#496b78", 11, 8);
    fillLight.position.set(-3, -1, 2);
    scene.add(fillLight);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    let active = true;
    let animationFrame = 0;
    let previousTime = performance.now();
    const pointer = new THREE.Vector2();

    const render = () => {
      renderer.render(scene, camera);
    };

    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      if (!clientWidth || !clientHeight) return;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      render();
    };

    const animate = (time: number) => {
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      if (active && !reducedMotion) {
        group.rotation.z += delta * 0.055;
        group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, pointer.y * 0.08 - 0.1, 0.025);
        group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, pointer.x * 0.12, 0.025);
        innerRing.rotation.z -= delta * 0.12;
        dust.rotation.z -= delta * 0.015;
        render();
      }

      animationFrame = window.requestAnimationFrame(animate);
    };

    const updatePointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    };

    const updateMotion = () => {
      reducedMotion = motionQuery.matches;
      render();
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active) previousTime = performance.now();
      },
      { threshold: 0.02 },
    );

    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    canvas.addEventListener("pointermove", updatePointer, { passive: true });
    motionQuery.addEventListener("change", updateMotion);
    resize();
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener("pointermove", updatePointer);
      motionQuery.removeEventListener("change", updateMotion);
      outerRing.geometry.dispose();
      middleRing.geometry.dispose();
      innerRing.geometry.dispose();
      spokeGeometry.dispose();
      dustGeometry.dispose();
      metalAmber.dispose();
      metalSilver.dispose();
      metalInner.dispose();
      spokeMaterial.dispose();
      dustMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="realm-canvas" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
