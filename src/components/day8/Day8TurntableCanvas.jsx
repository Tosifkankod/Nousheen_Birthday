import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Day8TurntableCanvas({ isPlaying = false }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId;
    let width = container.clientWidth || 800;
    let height = container.clientHeight || 450;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 6.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // 2. Ambient & Warm Lights
    const ambientLight = new THREE.AmbientLight(0x2a1a10, 1.6);
    scene.add(ambientLight);

    const centerGlow = new THREE.PointLight(0xffb74d, 3.2, 14);
    centerGlow.position.set(0, 1.8, 0.5);
    scene.add(centerGlow);

    const rimLight = new THREE.DirectionalLight(0xffe0b2, 1.4);
    rimLight.position.set(-3, 4, 3);
    scene.add(rimLight);

    const blueBackLight = new THREE.PointLight(0x4a72a8, 1.2, 12);
    blueBackLight.position.set(2, 2, -3);
    scene.add(blueBackLight);

    // 3. Floating Turntable Group
    const turntableGroup = new THREE.Group();
    scene.add(turntableGroup);

    // Turntable Platter Base (Warm Bronze / Gold Ring)
    const baseGeo = new THREE.CylinderGeometry(2.1, 2.2, 0.18, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x241710,
      roughness: 0.35,
      metalness: 0.85,
      emissive: 0x3d210f,
      emissiveIntensity: 0.3,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.1;
    turntableGroup.add(baseMesh);

    // Outer Gold Rim
    const rimGeo = new THREE.TorusGeometry(2.12, 0.04, 16, 64);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xffcc66,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0x996600,
      emissiveIntensity: 0.4,
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = -0.01;
    turntableGroup.add(rimMesh);

    // Center Vinyl Disc
    const vinylGroup = new THREE.Group();
    const vinylGeo = new THREE.CylinderGeometry(1.85, 1.85, 0.04, 64);
    const vinylMat = new THREE.MeshStandardMaterial({
      color: 0x0c0b0f,
      roughness: 0.3,
      metalness: 0.7,
    });
    const vinylMesh = new THREE.Mesh(vinylGeo, vinylMat);
    vinylGroup.add(vinylMesh);

    // Grooves Rings
    const ringGeo = new THREE.RingGeometry(0.75, 1.75, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x1a1820,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.022;
    vinylGroup.add(ringMesh);

    // Center Golden Label
    const labelGeo = new THREE.CircleGeometry(0.55, 32);
    const labelMat = new THREE.MeshStandardMaterial({
      color: 0xdf9b3a,
      emissive: 0x8a4b08,
      emissiveIntensity: 0.5,
      roughness: 0.3,
    });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.rotation.x = -Math.PI / 2;
    labelMesh.position.y = 0.024;
    vinylGroup.add(labelMesh);

    // Center Spindle
    const spindleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.25, 16);
    const spindleMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.1,
    });
    const spindle = new THREE.Mesh(spindleGeo, spindleMat);
    spindle.position.y = 0.1;
    vinylGroup.add(spindle);

    turntableGroup.add(vinylGroup);

    // Tonearm Assembly
    const armGroup = new THREE.Group();
    armGroup.position.set(1.9, 0.15, 1.4);

    const pivotGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.28, 16);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd175,
      metalness: 0.85,
      roughness: 0.25,
    });
    const pivot = new THREE.Mesh(pivotGeo, goldMat);
    armGroup.add(pivot);

    const rodGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.8, 12);
    const rod = new THREE.Mesh(rodGeo, goldMat);
    rod.rotation.z = Math.PI / 2;
    rod.rotation.y = -Math.PI / 4.8;
    rod.position.set(-0.7, 0.12, -0.6);
    armGroup.add(rod);

    const headGeo = new THREE.BoxGeometry(0.12, 0.08, 0.2);
    const head = new THREE.Mesh(headGeo, baseMat);
    head.position.set(-1.35, 0.06, -1.2);
    armGroup.add(head);

    turntableGroup.add(armGroup);

    // 4. Orbiting Glowing Relics (Moon, Cassette, Polaroid, Stars, Mini Vinyls)
    const relicsGroup = new THREE.Group();
    scene.add(relicsGroup);

    // A. Crescent Moon
    const moonGroup = new THREE.Group();
    const moonGeo = new THREE.TorusGeometry(0.38, 0.1, 16, 32, Math.PI * 1.3);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xffe89e,
      emissive: 0xdf9a28,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonGroup.add(moonMesh);
    relicsGroup.add(moonGroup);

    // B. Floating Cassette
    const cassetteGroup = new THREE.Group();
    const cassBodyGeo = new THREE.BoxGeometry(0.7, 0.44, 0.08);
    const cassBodyMat = new THREE.MeshStandardMaterial({
      color: 0x2b1c12,
      emissive: 0x8a5220,
      emissiveIntensity: 0.4,
      metalness: 0.6,
      roughness: 0.3,
    });
    const cassMesh = new THREE.Mesh(cassBodyGeo, cassBodyMat);
    cassetteGroup.add(cassMesh);
    relicsGroup.add(cassetteGroup);

    // C. Glowing Polaroid Frame
    const frameGroup = new THREE.Group();
    const frameGeo = new THREE.BoxGeometry(0.55, 0.68, 0.04);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xfff2df,
      emissive: 0xffd27d,
      emissiveIntensity: 0.35,
      roughness: 0.4,
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameGroup.add(frameMesh);
    relicsGroup.add(frameGroup);

    // D. Mini Vinyls (2 floating around)
    const miniVinyl1 = vinylGroup.clone();
    miniVinyl1.scale.set(0.3, 0.3, 0.3);
    relicsGroup.add(miniVinyl1);

    const miniVinyl2 = vinylGroup.clone();
    miniVinyl2.scale.set(0.24, 0.24, 0.24);
    relicsGroup.add(miniVinyl2);

    // E. Golden Star Gem
    const starGeo = new THREE.IcosahedronGeometry(0.22, 0);
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xffeaad,
      emissive: 0xffc44d,
      emissiveIntensity: 1.2,
      roughness: 0.1,
    });
    const starMesh = new THREE.Mesh(starGeo, starMat);
    relicsGroup.add(starMesh);

    // 5. Floating Golden Dust & Sparkles
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 6;
      particlePositions[i + 1] = 0.2 + Math.random() * 3.0;
      particlePositions[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffdf88,
      size: 0.06,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Mouse Parallax
    let targetRotY = 0;
    let targetRotX = 0;
    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotY = nx * 0.15;
      targetRotX = ny * 0.1;
    };
    window.addEventListener('pointermove', handlePointerMove);

    // 7. Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 800;
      height = container.clientHeight || 450;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Vinyl spin (faster if playing, gentle slow drift if idle)
      const spinSpeed = isPlaying ? 0.03 : 0.008;
      vinylGroup.rotation.y += spinSpeed;

      // Parallax smooth interpolation
      turntableGroup.rotation.y = THREE.MathUtils.lerp(turntableGroup.rotation.y, targetRotY, 0.05);
      turntableGroup.rotation.x = THREE.MathUtils.lerp(turntableGroup.rotation.x, targetRotX - 0.1, 0.05);

      // Orbiting Relics Motion (floating around the turntable in an enchanted aura)
      // Crescent Moon
      moonGroup.position.set(
        Math.sin(elapsed * 0.7) * 1.5,
        1.1 + Math.sin(elapsed * 1.2) * 0.15,
        Math.cos(elapsed * 0.7) * 1.2
      );
      moonGroup.rotation.z = Math.sin(elapsed * 0.8) * 0.3;
      moonGroup.rotation.y = elapsed * 0.5;

      // Cassette
      cassetteGroup.position.set(
        Math.sin(elapsed * 0.6 + 2.0) * 1.8,
        1.25 + Math.sin(elapsed * 1.0 + 1.0) * 0.18,
        Math.cos(elapsed * 0.6 + 2.0) * 1.3
      );
      cassetteGroup.rotation.y = elapsed * 0.6;
      cassetteGroup.rotation.x = Math.sin(elapsed * 0.9) * 0.2;

      // Polaroid
      frameGroup.position.set(
        Math.sin(elapsed * 0.5 + 4.0) * 1.7,
        1.3 + Math.sin(elapsed * 0.9 + 2.0) * 0.2,
        Math.cos(elapsed * 0.5 + 4.0) * 1.4
      );
      frameGroup.rotation.y = elapsed * 0.4;
      frameGroup.rotation.z = Math.sin(elapsed * 0.7) * 0.2;

      // Mini vinyl 1 & 2
      miniVinyl1.position.set(-2.2, 0.8 + Math.sin(elapsed * 1.4) * 0.15, -0.4);
      miniVinyl1.rotation.y += 0.02;
      miniVinyl1.rotation.x = Math.PI / 3;

      miniVinyl2.position.set(2.1, 0.9 + Math.sin(elapsed * 1.2 + 1) * 0.12, -0.6);
      miniVinyl2.rotation.y += 0.025;
      miniVinyl2.rotation.x = Math.PI / 3.5;

      // Star Gem
      starMesh.position.set(
        Math.sin(elapsed * 0.8 + 1.0) * 1.9,
        1.5 + Math.sin(elapsed * 1.5) * 0.25,
        Math.cos(elapsed * 0.8 + 1.0) * 1.5
      );
      starMesh.rotation.y += 0.04;
      starMesh.rotation.x += 0.02;

      // Particles float
      const pArr = particles.geometry.attributes.position.array;
      for (let i = 1; i < pArr.length; i += 3) {
        pArr[i] += Math.sin(elapsed * 1.2 + pArr[i]) * 0.002;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Center light breathing glow
      centerGlow.intensity = 2.8 + Math.sin(elapsed * 2.5) * 0.6;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isPlaying]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        pointerEvents: 'none',
      }}
    />
  );
}
