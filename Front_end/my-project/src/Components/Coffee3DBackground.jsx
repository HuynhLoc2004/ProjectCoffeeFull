import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Coffee3DBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // --- Scene, Camera, Renderer Setup ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap DPR to 1.5 for performance
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = false; // Disable shadows for massive performance boost
    container.appendChild(renderer.domElement);

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0x2f1b10, 2.0); // Warm ambient
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffe6cc, 4.0); // Warm key light
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const goldFillLight = new THREE.PointLight(0xd4a373, 5.0, 20); // Golden highlight
    goldFillLight.position.set(-6, -4, 2);
    scene.add(goldFillLight);

    const rimLight = new THREE.PointLight(0xffffff, 3.0, 15); // Rim highlight
    rimLight.position.set(0, 5, -3);
    scene.add(rimLight);

    // --- Materials and Textures ---
    // Programmatic soft circular texture for steam particles
    const createCircleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, "rgba(235, 220, 205, 0.5)");
        gradient.addColorStop(0.2, "rgba(235, 220, 205, 0.25)");
        gradient.addColorStop(0.5, "rgba(235, 220, 205, 0.08)");
        gradient.addColorStop(1, "rgba(235, 220, 205, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const steamTexture = createCircleTexture();

    const beanMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d2112, // Rich dark roasted coffee bean brown
      roughness: 0.32,
      metalness: 0.06,
    });

    const leafMaterial = new THREE.MeshStandardMaterial({
      color: 0x4f7039, // Green tea/coffee leaf
      roughness: 0.45,
      metalness: 0.03,
      side: THREE.DoubleSide,
    });

    // --- Geometries ---
    // Procedural coffee bean
    const beanGroupGeom = new THREE.Group();
    const halfSphereGeom1 = new THREE.SphereGeometry(0.35, 16, 16);
    halfSphereGeom1.scale(1.4, 0.9, 0.65); // Elongated & squashed
    const halfSphereGeom2 = halfSphereGeom1.clone();

    const meshL = new THREE.Mesh(halfSphereGeom1, beanMaterial);
    meshL.position.set(-0.05, 0, 0);
    meshL.rotation.y = 0.12;

    const meshR = new THREE.Mesh(halfSphereGeom2, beanMaterial);
    meshR.position.set(0.05, 0, 0);
    meshR.rotation.y = -0.12;

    // Crease line in the middle
    const creaseGeom = new THREE.BoxGeometry(0.85, 0.03, 0.08);
    const creaseMat = new THREE.MeshBasicMaterial({ color: 0x180a04 });
    const creaseMesh = new THREE.Mesh(creaseGeom, creaseMat);
    creaseMesh.position.set(0, 0.02, 0.22);

    beanGroupGeom.add(meshL);
    beanGroupGeom.add(meshR);
    beanGroupGeom.add(creaseMesh);

    // Procedural leaf
    const leafGeom = new THREE.SphereGeometry(0.32, 12, 12);
    leafGeom.scale(1.7, 0.08, 0.65); // Flat and leaf-shaped
    const leafMeshProto = new THREE.Mesh(leafGeom, leafMaterial);

    // --- Populate Objects ---
    const items = [];
    const itemCount = 16; // Capped for performance

    for (let i = 0; i < itemCount; i++) {
      // 70% beans, 30% leaves
      const isBean = Math.random() > 0.3;
      const obj = isBean ? beanGroupGeom.clone() : leafMeshProto.clone();

      // Random scale
      const scale = 0.7 + Math.random() * 0.9;
      obj.scale.set(scale, scale, scale);

      // Random position
      // Spread wider on x & y, scatter depth in z
      obj.position.x = (Math.random() - 0.5) * 16;
      obj.position.y = (Math.random() - 0.5) * 10;
      obj.position.z = -6 + Math.random() * 8; // Depth layers

      // Speed parameters
      const speedX = (Math.random() - 0.5) * 0.003;
      const speedY = (Math.random() - 0.5) * 0.003;
      const rotX = (Math.random() - 0.5) * 0.01;
      const rotY = (Math.random() - 0.5) * 0.01;
      const rotZ = (Math.random() - 0.5) * 0.005;

      // Amplitude for floating wave
      const floatAmp = 0.1 + Math.random() * 0.3;
      const floatFreq = 0.5 + Math.random() * 1.5;
      const floatOffset = Math.random() * Math.PI * 2;

      scene.add(obj);

      items.push({
        mesh: obj,
        speedX,
        speedY,
        rotX,
        rotY,
        rotZ,
        floatAmp,
        floatFreq,
        floatOffset,
        initialY: obj.position.y,
        initialX: obj.position.x,
        z: obj.position.z,
      });
    }

    // --- Steam Particles ---
    const steamCount = 35; // Soft steam particles
    const steamGeometry = new THREE.BufferGeometry();
    const steamPositions = new Float32Array(steamCount * 3);
    const steamSpeeds = [];
    const steamOffsets = [];

    for (let i = 0; i < steamCount; i++) {
      // Start in a wide range at the bottom
      const x = (Math.random() - 0.5) * 12;
      const y = -6 + Math.random() * 12; // Scattered vertically
      const z = -2 + Math.random() * 4;

      steamPositions[i * 3] = x;
      steamPositions[i * 3 + 1] = y;
      steamPositions[i * 3 + 2] = z;

      steamSpeeds.push(0.01 + Math.random() * 0.015); // Rising speed
      steamOffsets.push(Math.random() * Math.PI * 2); // Sine wave offset
    }

    steamGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(steamPositions, 3)
    );

    const steamMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.5,
      map: steamTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.15,
    });

    const steamParticles = new THREE.Points(steamGeometry, steamMat);
    scene.add(steamParticles);

    // --- Mouse & Scroll Tracking ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const scroll = { y: 0, targetY: 0 };

    const handleMouseMove = (e) => {
      // Normalize mouse coordinates (-1 to 1)
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scroll.targetY = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // --- Window Resize ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    let resizeTimeout;
    const throttledResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 150);
    };
    window.addEventListener("resize", throttledResize, { passive: true });

    // --- Animation Loop with Performance Guards ---
    let isActive = true;
    const clock = new THREE.Clock();
    let animationFrameId;
    let animationTimeoutId;

    // Intersection Observer to stop rendering when scrolled out of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isActive = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Document Visibility API
    const handleVisibilityChange = () => {
      isActive = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const animate = () => {
      if (!isActive) {
        animationTimeoutId = window.setTimeout(() => {
          animationFrameId = requestAnimationFrame(animate);
        }, 250);
        return;
      }

      const elapsedTime = clock.getElapsedTime();

      // Lerp mouse and scroll values for ultra-smooth inertia
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      scroll.y += (scroll.targetY - scroll.y) * 0.08;

      // Parallax camera effect
      // Mouse tilts slightly, scroll moves camera down
      camera.position.x = mouse.x * 1.5;
      camera.position.y = mouse.y * 1.2 - (scroll.y * 0.005);
      camera.lookAt(0, - (scroll.y * 0.005), 0);

      // Animate Coffee Beans and Leaves
      items.forEach((item) => {
        // Continuous slow rotation
        item.mesh.rotation.x += item.rotX;
        item.mesh.rotation.y += item.rotY;
        item.mesh.rotation.z += item.rotZ;

        // Floating movement (sine wave)
        const floatOffset =
          Math.sin(elapsedTime * item.floatFreq + item.floatOffset) *
          item.floatAmp;
        item.mesh.position.y = item.initialY + floatOffset;

        // Slow horizontal drifting
        item.mesh.position.x += item.speedX;
        if (Math.abs(item.mesh.position.x - item.initialX) > 1.5) {
          item.speedX *= -1; // Reverse drift direction
        }

        // React to mouse: push objects away slightly based on mouse coordinates
        // Calculate interactive distance
        const dx = item.mesh.position.x - camera.position.x;
        const dy = item.mesh.position.y - camera.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 4) {
          const force = (4 - dist) * 0.01;
          item.mesh.position.x += dx * force;
          item.mesh.position.y += dy * force;
        }
      });

      // Animate Steam Particles
      const positions = steamGeometry.attributes.position.array;
      for (let i = 0; i < steamCount; i++) {
        // Update Y position (rise)
        positions[i * 3 + 1] += steamSpeeds[i];
        
        // Sway sideways (X position) using sine wave
        const sway = Math.sin(elapsedTime * 1.5 + steamOffsets[i]) * 0.015;
        positions[i * 3] += sway;

        // Reset particle if it goes too high
        if (positions[i * 3 + 1] > 6) {
          positions[i * 3 + 1] = -6; // Reset to bottom
          positions[i * 3] = (Math.random() - 0.5) * 12; // Randomize X
        }
      }
      steamGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // --- Cleanup ---
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      clearTimeout(animationTimeoutId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", throttledResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);

      // Recursive cleanup of Three.js objects to prevent memory leaks
      items.forEach((item) => {
        scene.remove(item.mesh);
        item.mesh.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      });

      scene.remove(steamParticles);
      steamGeometry.dispose();
      steamMat.dispose();
      steamTexture.dispose();
      beanGroupGeom.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          child.material.dispose();
        }
      });
      leafMeshProto.geometry.dispose();
      leafMeshProto.material.dispose();

      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default Coffee3DBackground;
