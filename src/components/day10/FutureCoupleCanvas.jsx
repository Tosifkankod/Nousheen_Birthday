import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 3D Future Couple Canvas for Day 10 (Scene 5: A Little Glimpse of Our Future)
 * - Stylized modest young couple under moonlit sky
 * - Woman in modest flowing abaya and hijab silhouette
 * - Man in simple modest clothes
 * - They gently hold hands under the stars with soft wind physics and gentle camera orbit
 */
export default function FutureCoupleCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 520;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06050e, 0.05);

    const aspect = width / Math.max(height, 1);
    const computeCoupleZ = (asp) => {
      if (asp < 0.7) return 5.8;
      if (asp < 1.0) return 5.0;
      return 4.2;
    };

    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 50);
    camera.position.set(0, 1.45, computeCoupleZ(aspect));

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0x2d2538, 2.8);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0xe8dcb8, 2.6);
    moonLight.position.set(-2.5, 4.5, -2);
    scene.add(moonLight);

    const warmGroundGlow = new THREE.PointLight(0xfbe2a8, 1.8, 6);
    warmGroundGlow.position.set(0, 0.2, 0.8);
    scene.add(warmGroundGlow);

    // 3. Ground (Moonlit grassy meadow hill)
    const groundGeo = new THREE.CylinderGeometry(2.2, 2.4, 0.2, 48);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x110f18,
      roughness: 0.8,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.1;
    scene.add(ground);

    // Glowing rim around ground hill
    const ringGeo = new THREE.RingGeometry(2.21, 2.27, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xfbe2a8,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    const groundRing = new THREE.Mesh(ringGeo, ringMat);
    groundRing.rotation.x = Math.PI / 2;
    groundRing.position.y = 0.005;
    scene.add(groundRing);

    // Small glowing flowers / grass blades
    const grassCount = 90;
    const grassGeo = new THREE.BufferGeometry();
    const grassPos = new Float32Array(grassCount * 3);
    for (let i = 0; i < grassCount * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 1.5;
      grassPos[i] = Math.cos(angle) * radius;
      grassPos[i + 1] = Math.random() * 0.12;
      grassPos[i + 2] = Math.sin(angle) * radius;
    }
    grassGeo.setAttribute('position', new THREE.BufferAttribute(grassPos, 3));
    const grassMat = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.05,
      transparent: true,
      opacity: 0.75,
    });
    const grassPoints = new THREE.Points(grassGeo, grassMat);
    scene.add(grassPoints);

    // Starfield in background
    const starCount = 200;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 12;
      starPos[i + 1] = 0.8 + Math.random() * 4;
      starPos[i + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xfbe2a8,
      size: 0.04,
      transparent: true,
      opacity: 0.65,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 4. Stylized Couple Group
    const coupleGroup = new THREE.Group();
    scene.add(coupleGroup);

    // Shared materials
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xdfbca3, roughness: 0.45 });
    const manClothesMat = new THREE.MeshStandardMaterial({ color: 0x1b1725, roughness: 0.6 });
    const abayaMat = new THREE.MeshStandardMaterial({ color: 0x18141f, roughness: 0.5 });
    const hijabMat = new THREE.MeshStandardMaterial({ color: 0x2b2236, roughness: 0.5 });

    // --- MAN (Left side) ---
    const manGroup = new THREE.Group();
    manGroup.position.set(-0.28, 0, 0);
    coupleGroup.add(manGroup);

    // Legs
    const manLegs = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.9, 16), manClothesMat);
    manLegs.position.set(0, 0.45, 0);
    manGroup.add(manLegs);

    // Torso / Kurta/Shirt
    const manTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.65, 18), manClothesMat);
    manTorso.position.set(0, 1.15, 0);
    manGroup.add(manTorso);

    // Head & Hair
    const manHead = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 20), skinMat);
    manHead.position.set(0, 1.62, 0);
    manGroup.add(manHead);

    const manHair = new THREE.Mesh(new THREE.SphereGeometry(0.175, 16, 16), new THREE.MeshStandardMaterial({ color: 0x0c0910 }));
    manHair.position.set(0, 1.65, -0.02);
    manGroup.add(manHair);

    // Man's right arm (holding hand)
    const manRightArmGroup = new THREE.Group();
    manRightArmGroup.position.set(0.22, 1.35, 0);
    manGroup.add(manRightArmGroup);

    const manArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.55, 12), manClothesMat);
    manArm.position.set(0, -0.25, 0);
    manRightArmGroup.add(manArm);

    const manHand = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), skinMat);
    manHand.position.set(0, -0.52, 0.02);
    manRightArmGroup.add(manHand);

    // --- WOMAN / NOUSHEEN (Right side, with modest Abaya & Hijab) ---
    const womanGroup = new THREE.Group();
    womanGroup.position.set(0.28, 0, 0);
    coupleGroup.add(womanGroup);

    // Flowing Abaya (Cone + Cylinder)
    const abayaLower = new THREE.Mesh(new THREE.ConeGeometry(0.36, 1.15, 24), abayaMat);
    abayaLower.position.set(0, 0.58, 0);
    womanGroup.add(abayaLower);

    const abayaUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.5, 18), abayaMat);
    abayaUpper.position.set(0, 1.15, 0);
    womanGroup.add(abayaUpper);

    // Hijab & Face Silhouette
    const hijabBack = new THREE.Mesh(new THREE.SphereGeometry(0.175, 20, 20), hijabMat);
    hijabBack.position.set(0, 1.55, -0.02);
    womanGroup.add(hijabBack);

    const womanFace = new THREE.Mesh(new THREE.SphereGeometry(0.14, 20, 20), skinMat);
    womanFace.position.set(0, 1.54, 0.04);
    womanGroup.add(womanFace);

    const hijabDrape = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.25, 0.32, 18), hijabMat);
    hijabDrape.position.set(0, 1.38, 0);
    womanGroup.add(hijabDrape);

    // Woman's left arm (holding hand)
    const womanLeftArmGroup = new THREE.Group();
    womanLeftArmGroup.position.set(-0.2, 1.3, 0);
    womanGroup.add(womanLeftArmGroup);

    const womanArm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.52, 12), abayaMat);
    womanArm.position.set(0, -0.24, 0);
    womanLeftArmGroup.add(womanArm);

    const womanHand = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), skinMat);
    womanHand.position.set(0, -0.5, 0.02);
    womanLeftArmGroup.add(womanHand);

    // Holding Hands Shimmer Sparkle
    const handGlow = new THREE.PointLight(0xfbe2a8, 0.8, 2);
    handGlow.position.set(0, 0.82, 0.08);
    coupleGroup.add(handGlow);

    // 5. Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle breeze on woman's abaya and couple
      const breeze = Math.sin(elapsed * 2.0);
      abayaLower.rotation.z = Math.sin(elapsed * 2.2) * 0.03;
      abayaLower.scale.x = 1 + Math.sin(elapsed * 1.8) * 0.02;

      // Natural subtle breathing
      manTorso.scale.set(1 + breeze * 0.015, 1, 1 + breeze * 0.02);
      abayaUpper.scale.set(1 + breeze * 0.012, 1, 1 + breeze * 0.015);

      // Hands gently moving closer and holding together
      const handProg = Math.min(1, elapsed / 4.0);
      manRightArmGroup.rotation.z = THREE.MathUtils.lerp(0.05, -0.25, handProg);
      womanLeftArmGroup.rotation.z = THREE.MathUtils.lerp(-0.05, 0.25, handProg);

      // Slow cinematic camera orbit
      camera.position.x = Math.sin(elapsed * 0.15) * 1.2;
      camera.position.z = Math.cos(elapsed * 0.15) * 3.8 + 0.4;
      camera.lookAt(0, 1.2, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 640;
      const newH = container.clientHeight || 520;
      const newAspect = newW / Math.max(newH, 1);
      camera.aspect = newAspect;
      camera.updateProjectionMatrix();
      camera.position.z = computeCoupleZ(newAspect);
      renderer.setSize(newW, newH);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '320px',
        position: 'relative',
        touchAction: 'pan-y',
      }}
    />
  );
}
