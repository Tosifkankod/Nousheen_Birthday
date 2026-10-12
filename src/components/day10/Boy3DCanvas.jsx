import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Interactive 3D Boy Scene built with Three.js
 * - Real 3D geometry with stylized silhouette and breathing animation
 * - Interactive raycasted hotspots: head, heart, hands, whole body, space beside
 * - Companion silhouette appears beside him
 * - Touch & mouse orbit controls for 360 inspection
 * - Persistent WebGL context (initialized once with refs for state)
 */
export default function Boy3DCanvas({
  activeHotspot,
  discoveredHotspots = [],
  onSelectHotspot,
}) {
  const containerRef = useRef(null);

  // Keep references to dynamic props so the WebGL scene doesn't unmount and rebuild
  const activeHotspotRef = useRef(activeHotspot);
  const discoveredHotspotsRef = useRef(discoveredHotspots);
  const onSelectHotspotRef = useRef(onSelectHotspot);

  useEffect(() => {
    activeHotspotRef.current = activeHotspot;
  }, [activeHotspot]);

  useEffect(() => {
    discoveredHotspotsRef.current = discoveredHotspots;
  }, [discoveredHotspots]);

  useEffect(() => {
    onSelectHotspotRef.current = onSelectHotspot;
  }, [onSelectHotspot]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Guaranteed fallback dimensions
    const width = container.clientWidth || 640;
    const height = container.clientHeight || 520;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06050a, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / Math.max(height, 1), 0.1, 50);
    camera.position.set(0, 1.4, 4.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x352b45, 2.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff2d6, 3.2);
    keyLight.position.set(2.8, 4.5, 3.2);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xe8c37d, 3.0);
    rimLight.position.set(-3.2, 3.5, -2.5);
    scene.add(rimLight);

    const frontFill = new THREE.DirectionalLight(0xd9b38c, 1.5);
    frontFill.position.set(0, 2.5, 3.8);
    scene.add(frontFill);

    const bottomGlow = new THREE.PointLight(0xe8c37d, 2.0, 5);
    bottomGlow.position.set(0, 0.15, 0);
    scene.add(bottomGlow);

    // Dynamic Heart Light
    const heartPointLight = new THREE.PointLight(0xff3366, 0, 4);
    heartPointLight.position.set(0.08, 1.45, 0.22);
    scene.add(heartPointLight);

    // 3. Environment: Circular Pedestal & Reflective Rings
    const pedGeo = new THREE.CylinderGeometry(1.45, 1.55, 0.14, 48);
    const pedMat = new THREE.MeshStandardMaterial({
      color: 0x14101d,
      roughness: 0.25,
      metalness: 0.75,
    });
    const pedestal = new THREE.Mesh(pedGeo, pedMat);
    pedestal.position.y = -0.07;
    scene.add(pedestal);

    // Glowing rim ring around pedestal
    const ringGeo = new THREE.RingGeometry(1.46, 1.52, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xfbe2a8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const rimRing = new THREE.Mesh(ringGeo, ringMat);
    rimRing.rotation.x = Math.PI / 2;
    rimRing.position.y = 0.01;
    scene.add(rimRing);

    // Starry dust particles in air
    const starsCount = 260;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 8.5;
      starPositions[i + 1] = Math.random() * 4.5;
      starPositions[i + 2] = (Math.random() - 0.5) * 8.5;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xfbe2a8,
      size: 0.045,
      transparent: true,
      opacity: 0.7,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 4. Stylized 3D Boy Mesh Construction
    const boyGroup = new THREE.Group();
    scene.add(boyGroup);

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xe8ba9f,
      roughness: 0.4,
      metalness: 0.05,
    });
    const darkClothMat = new THREE.MeshStandardMaterial({
      color: 0x161320,
      roughness: 0.55,
      metalness: 0.15,
    });
    const jacketMat = new THREE.MeshStandardMaterial({
      color: 0x221a30,
      roughness: 0.4,
      metalness: 0.25,
    });
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x0c0912,
      roughness: 0.65,
      metalness: 0.1,
    });
    const shoesMat = new THREE.MeshStandardMaterial({
      color: 0x0a0810,
      roughness: 0.2,
      metalness: 0.4,
    });

    // Shoes
    const shoeLeft = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.11, 0.34), shoesMat);
    shoeLeft.position.set(-0.17, 0.055, 0.04);
    boyGroup.add(shoeLeft);

    const shoeRight = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.11, 0.34), shoesMat);
    shoeRight.position.set(0.17, 0.055, 0.04);
    boyGroup.add(shoeRight);

    // Legs / Trousers
    const legGeo = new THREE.CylinderGeometry(0.095, 0.085, 0.88, 16);
    const leftLeg = new THREE.Mesh(legGeo, darkClothMat);
    leftLeg.position.set(-0.17, 0.53, 0);
    boyGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, darkClothMat);
    rightLeg.position.set(0.17, 0.53, 0);
    boyGroup.add(rightLeg);

    // Pelvis
    const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.23, 0.22, 16), darkClothMat);
    pelvis.position.set(0, 1.0, 0);
    boyGroup.add(pelvis);

    // Torso / Jacket (Chest)
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 1.28, 0);
    boyGroup.add(torsoGroup);

    const torsoMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.62, 20), jacketMat);
    torsoGroup.add(torsoMesh);

    // Luminous Heart Mesh inside chest
    const heartMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.085, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xff3366, transparent: true, opacity: 0 })
    );
    heartMesh.position.set(0.08, 0.14, 0.16);
    torsoGroup.add(heartMesh);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.58, 14);

    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.36, 0.24, 0);
    torsoGroup.add(leftArmGroup);

    const leftArm = new THREE.Mesh(armGeo, jacketMat);
    leftArm.position.y = -0.24;
    leftArmGroup.add(leftArm);

    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), skinMat);
    leftHand.position.set(0, -0.56, 0.02);
    leftArmGroup.add(leftHand);

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.36, 0.24, 0);
    torsoGroup.add(rightArmGroup);

    const rightArm = new THREE.Mesh(armGeo, jacketMat);
    rightArm.position.y = -0.24;
    rightArmGroup.add(rightArm);

    const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), skinMat);
    rightHand.position.set(0, -0.56, 0.02);
    rightArmGroup.add(rightHand);

    // Neck & Head
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.15, 16), skinMat);
    neck.position.set(0, 1.66, 0);
    boyGroup.add(neck);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.86, 0);
    boyGroup.add(headGroup);

    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.19, 24, 24), skinMat);
    headGroup.add(headMesh);

    // Styled Hair
    const hairMesh = new THREE.Mesh(new THREE.SphereGeometry(0.205, 20, 20), hairMat);
    hairMesh.position.set(0, 0.05, -0.02);
    hairMesh.scale.set(1.02, 1.06, 1.08);
    headGroup.add(hairMesh);

    // Halo ring for Head Hotspot
    const headHalo = new THREE.Mesh(
      new THREE.TorusGeometry(0.32, 0.015, 16, 48),
      new THREE.MeshBasicMaterial({ color: 0xfbe2a8, transparent: true, opacity: 0 })
    );
    headHalo.rotation.x = Math.PI / 2;
    headHalo.position.y = 0.26;
    headGroup.add(headHalo);

    // Whole Body Aura Cylinder
    const auraMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.8, 2.2, 32, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0xe8c37d,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      })
    );
    auraMesh.position.y = 1.08;
    boyGroup.add(auraMesh);

    // 5. Nousheen's Companion Ethereal Silhouette (Hotspot E / Beside Him)
    const companionGroup = new THREE.Group();
    companionGroup.position.set(0.66, 0, 0);
    scene.add(companionGroup);

    const companionMat = new THREE.MeshBasicMaterial({
      color: 0xfbe2a8,
      transparent: true,
      opacity: 0,
    });

    const compDress = new THREE.Mesh(new THREE.ConeGeometry(0.34, 1.18, 24), companionMat);
    compDress.position.y = 0.67;
    companionGroup.add(compDress);

    const compTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.22, 0.46, 16), companionMat);
    compTorso.position.y = 1.28;
    companionGroup.add(compTorso);

    const compHead = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 20), companionMat);
    compHead.position.y = 1.66;
    companionGroup.add(compHead);

    // 6. Interactive Raycasting Trigger Volumes
    const triggerMat = new THREE.MeshBasicMaterial({ visible: false });

    const triggers = {
      head: new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 12), triggerMat),
      heart: new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), triggerMat),
      hands: new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 12), triggerMat),
      body: new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.4, 12), triggerMat),
      beside: new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 12), triggerMat),
    };

    triggers.head.position.set(0, 1.86, 0);
    triggers.head.name = 'head';

    triggers.heart.position.set(0.08, 1.42, 0.2);
    triggers.heart.name = 'heart';

    triggers.hands.position.set(0.36, 0.78, 0.05);
    triggers.hands.name = 'hands';

    triggers.body.position.set(0, 1.15, 0);
    triggers.body.name = 'body';

    triggers.beside.position.set(0.68, 1.25, 0);
    triggers.beside.name = 'beside';

    Object.values(triggers).forEach((t) => scene.add(t));

    // 7. Touch & Mouse Orbit Controls
    let isDragging = false;
    let prevMouseX = 0;
    const rotSpeed = 0.007;
    let targetRotY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || prevMouseX;
      const deltaX = clientX - prevMouseX;
      prevMouseX = clientX;
      targetRotY += deltaX * rotSpeed;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    // Click / Tap Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || 0;
      const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY) || 0;

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Object.values(triggers));

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.name && onSelectHotspotRef.current) {
          onSelectHotspotRef.current(hit.name);
        }
      }
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('click', onClick);

    // 8. Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera orbit around boy
      boyGroup.rotation.y += (targetRotY - boyGroup.rotation.y) * 0.08;
      companionGroup.rotation.y = boyGroup.rotation.y;

      // Natural Breathing Animation
      const breath = Math.sin(elapsed * 2.2);
      torsoGroup.scale.set(1 + breath * 0.02, 1 + breath * 0.015, 1 + breath * 0.025);
      headGroup.rotation.y = Math.sin(elapsed * 0.8) * 0.06;
      headGroup.rotation.x = Math.sin(elapsed * 1.2) * 0.02;

      // Orbiting particles
      starField.rotation.y = elapsed * 0.025;

      const currentActive = activeHotspotRef.current;
      const currentDiscovered = discoveredHotspotsRef.current || [];

      // Heart Hotspot Luminous Pulse
      if (currentActive === 'heart') {
        const pulse = (Math.sin(elapsed * 8) + 1) / 2;
        heartPointLight.intensity = 2.0 + pulse * 3.0;
        heartMesh.material.opacity = 0.6 + pulse * 0.4;
        heartMesh.scale.setScalar(1 + pulse * 0.4);
      } else {
        heartPointLight.intensity = Math.max(0, heartPointLight.intensity - 0.06);
        heartMesh.material.opacity = Math.max(0, heartMesh.material.opacity - 0.06);
      }

      // Head Hotspot Glow
      if (currentActive === 'head') {
        headHalo.material.opacity = Math.min(0.85, headHalo.material.opacity + 0.05);
        headHalo.rotation.z = elapsed * 1.6;
      } else {
        headHalo.material.opacity = Math.max(0, headHalo.material.opacity - 0.04);
      }

      // Body Hotspot Aura
      if (currentActive === 'body') {
        auraMesh.material.opacity = Math.min(0.35, auraMesh.material.opacity + 0.04);
        auraMesh.rotation.y = -elapsed * 0.8;
      } else {
        auraMesh.material.opacity = Math.max(0, auraMesh.material.opacity - 0.03);
      }

      // Beside Hotspot: Reveal Ethereal Companion
      if (currentActive === 'beside' || currentDiscovered.includes('beside')) {
        companionMat.opacity = Math.min(0.75, companionMat.opacity + 0.03);
        companionGroup.position.y = Math.sin(elapsed * 1.6) * 0.03;
      }

      // Final Completion Gesture: Hand over heart
      const allFiveDone = currentDiscovered.length === 5;
      if (allFiveDone) {
        rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, -0.65, 0.04);
        rightArmGroup.rotation.x = THREE.MathUtils.lerp(rightArmGroup.rotation.x, 0.95, 0.04);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 640;
      const newH = container.clientHeight || 520;
      camera.aspect = newW / Math.max(newH, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('click', onClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []); // Initialize WebGL once for silky smooth 60fps

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '440px',
        position: 'relative',
        touchAction: 'none',
        cursor: 'grab',
      }}
    />
  );
}
