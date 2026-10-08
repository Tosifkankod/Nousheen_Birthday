import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Atmospheric color schemes matching each song feeling
const THEMES = {
  gold: {
    bg: 0x050408,
    ambient: 0xdfb15b,
    pointLight: 0xffd27d,
    fogColor: 0x0b0812,
    particleColor: 0xf5d998,
    lightIntensity: 2.2,
  },
  blue: {
    bg: 0x02050e,
    ambient: 0x4876b5,
    pointLight: 0x6ca5f0,
    fogColor: 0x040816,
    particleColor: 0x9dc6ff,
    lightIntensity: 2.0,
  },
  sunset: {
    bg: 0x0d060c,
    ambient: 0xd9755b,
    pointLight: 0xf39c6b,
    fogColor: 0x140811,
    particleColor: 0xf8b195,
    lightIntensity: 2.3,
  },
  spotlight: {
    bg: 0x030205,
    ambient: 0x5a4870,
    pointLight: 0xd6c2ff,
    fogColor: 0x050308,
    particleColor: 0xdfd3f7,
    lightIntensity: 2.8,
  },
  morning: {
    bg: 0x06080d,
    ambient: 0xe0c88b,
    pointLight: 0xfff0b8,
    fogColor: 0x0a0d15,
    particleColor: 0xfffae0,
    lightIntensity: 2.4,
  },
  velvet: {
    bg: 0x020104,
    ambient: 0x933b62,
    pointLight: 0xe58ea8,
    fogColor: 0x040206,
    particleColor: 0xffd1dc,
    lightIntensity: 1.8,
  },
};

export default function Day8MusicWorldCanvas({
  activeSongIndex = 0,
  songs = [],
  onSelectSong,
  isFinalMoment = false,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050408, 0.035);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 8.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 3. Lighting System
    const ambientLight = new THREE.AmbientLight(0x221c2d, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0xffd27d, 2.2, 25);
    mainLight.position.set(0, 4, 4);
    scene.add(mainLight);

    const moonLight = new THREE.DirectionalLight(0xa5c4f2, 1.0);
    moonLight.position.set(-8, 6, -6);
    scene.add(moonLight);

    const spotLight = new THREE.SpotLight(0xffffff, 0, 15, Math.PI / 6, 0.4, 1);
    spotLight.position.set(0, 5, 2);
    scene.add(spotLight);
    spotLight.target.position.set(0, 0, 0);
    scene.add(spotLight.target);

    // 4. Background Starfield
    const starCount = 650;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const baseStarColor = new THREE.Color(0xf6f1ea);
    const blueStarColor = new THREE.Color(0x9fc3f8);
    const goldStarColor = new THREE.Color(0xf9dc9a);

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      starPositions[idx] = (Math.random() - 0.5) * 50;
      starPositions[idx + 1] = (Math.random() - 0.5) * 40;
      starPositions[idx + 2] = -10 - Math.random() * 30;

      const cType = Math.random();
      const col = cType > 0.7 ? goldStarColor : cType > 0.4 ? blueStarColor : baseStarColor;
      starColors[idx] = col.r;
      starColors[idx + 1] = col.g;
      starColors[idx + 2] = col.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 5. Giant Glowing 3D Moon in Background
    const moonGroup = new THREE.Group();
    moonGroup.position.set(-4.5, 3.2, -12);

    const moonGeo = new THREE.SphereGeometry(2.4, 32, 32);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ee,
      emissive: 0x8294a6,
      emissiveIntensity: 0.35,
      roughness: 0.8,
      metalness: 0.1,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonGroup.add(moonMesh);

    // Moon Glow Halo
    const haloGeo = new THREE.SphereGeometry(2.65, 24, 24);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xa8c4f0,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    moonGroup.add(haloMesh);
    scene.add(moonGroup);

    // 6. Floating Cosmic Dust Particles
    const dustCount = 180;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPositions[i] = (Math.random() - 0.5) * 16;
      dustPositions[i + 1] = (Math.random() - 0.5) * 12;
      dustPositions[i + 2] = (Math.random() - 0.5) * 10;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xf5d998,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // 7. Interactive 3D Dream Objects (Each represents one song)
    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);

    const songObjects = [];

    // Helper functions to build 3D items:
    const createVinylMesh = () => {
      const g = new THREE.Group();
      // Outer black vinyl disc
      const discGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.04, 48);
      const discMat = new THREE.MeshStandardMaterial({
        color: 0x111113,
        roughness: 0.35,
        metalness: 0.7,
      });
      const disc = new THREE.Mesh(discGeo, discMat);
      disc.rotation.x = Math.PI / 2;
      g.add(disc);

      // Grooves ring
      const ringGeo = new THREE.RingGeometry(0.5, 1.1, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x24242c,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.z = 0.022;
      g.add(ring);

      // Center gold label
      const labelGeo = new THREE.CircleGeometry(0.42, 32);
      const labelMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        emissive: 0x996515,
        emissiveIntensity: 0.4,
        roughness: 0.4,
      });
      const label = new THREE.Mesh(labelGeo, labelMat);
      label.position.z = 0.024;
      g.add(label);

      // Center spindle hole
      const holeGeo = new THREE.CircleGeometry(0.08, 16);
      const holeMat = new THREE.MeshBasicMaterial({ color: 0x050408 });
      const hole = new THREE.Mesh(holeGeo, holeMat);
      hole.position.z = 0.026;
      g.add(hole);

      return g;
    };

    const createCassetteMesh = () => {
      const g = new THREE.Group();
      // Cassette body
      const bodyGeo = new THREE.BoxGeometry(1.6, 1.0, 0.16);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x1a2130,
        roughness: 0.4,
        metalness: 0.5,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      g.add(body);

      // Label window
      const winGeo = new THREE.BoxGeometry(1.1, 0.5, 0.17);
      const winMat = new THREE.MeshStandardMaterial({
        color: 0x6ca5f0,
        emissive: 0x274e82,
        emissiveIntensity: 0.4,
        roughness: 0.2,
      });
      const win = new THREE.Mesh(winGeo, winMat);
      g.add(win);

      // Tape spools
      [-0.3, 0.3].forEach((x) => {
        const spoolGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.18, 16);
        const spoolMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const spool = new THREE.Mesh(spoolGeo, spoolMat);
        spool.rotation.x = Math.PI / 2;
        spool.position.x = x;
        g.add(spool);
      });

      return g;
    };

    const createStarDiamondMesh = () => {
      const g = new THREE.Group();
      const icosaGeo = new THREE.IcosahedronGeometry(0.9, 0);
      const icosaMat = new THREE.MeshStandardMaterial({
        color: 0xf39c6b,
        emissive: 0xd9755b,
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.8,
        wireframe: false,
      });
      const icosa = new THREE.Mesh(icosaGeo, icosaMat);
      g.add(icosa);

      // Wireframe overlay for crystal sparkles
      const wireGeo = new THREE.IcosahedronGeometry(0.92, 0);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xffe6c2,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
      });
      const wire = new THREE.Mesh(wireGeo, wireMat);
      g.add(wire);

      return g;
    };

    const createFrameMesh = () => {
      const g = new THREE.Group();
      // Vintage frame border
      const frameGeo = new THREE.BoxGeometry(1.3, 1.6, 0.1);
      const frameMat = new THREE.MeshStandardMaterial({
        color: 0x7c6693,
        emissive: 0x3d2757,
        emissiveIntensity: 0.3,
        roughness: 0.5,
        metalness: 0.6,
      });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      g.add(frame);

      // Photo glass
      const glassGeo = new THREE.PlaneGeometry(1.05, 1.35);
      const glassMat = new THREE.MeshStandardMaterial({
        color: 0xf5edf9,
        emissive: 0x9e88b8,
        emissiveIntensity: 0.4,
        roughness: 0.1,
        metalness: 0.9,
      });
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.position.z = 0.052;
      g.add(glass);

      return g;
    };

    const createMiniMoonMesh = () => {
      const g = new THREE.Group();
      const orbGeo = new THREE.SphereGeometry(0.8, 32, 32);
      const orbMat = new THREE.MeshStandardMaterial({
        color: 0xfff3cf,
        emissive: 0xdfb15b,
        emissiveIntensity: 0.65,
        roughness: 0.3,
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      g.add(orb);

      // Planetary ring
      const ringGeo = new THREE.RingGeometry(1.05, 1.45, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffe699,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.6;
      g.add(ring);

      return g;
    };

    const createHeartLightMesh = () => {
      const g = new THREE.Group();
      // Parametric Heart Shape
      const shape = new THREE.Shape();
      const x = 0, y = 0;
      shape.moveTo(x + 0.25, y + 0.25);
      shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
      shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
      shape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 1.0);
      shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
      shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
      shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

      const extrudeSettings = {
        depth: 0.3,
        bevelEnabled: true,
        bevelSegments: 6,
        steps: 2,
        bevelSize: 0.08,
        bevelThickness: 0.08,
      };

      const heartGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      heartGeo.center();

      const heartMat = new THREE.MeshStandardMaterial({
        color: 0xf58da6,
        emissive: 0xc93b67,
        emissiveIntensity: 0.85,
        roughness: 0.2,
        metalness: 0.4,
      });
      const heart = new THREE.Mesh(heartGeo, heartMat);
      heart.rotation.z = Math.PI;
      heart.scale.set(1.1, 1.1, 1.1);
      g.add(heart);

      return g;
    };

    const builders = [
      createVinylMesh,
      createCassetteMesh,
      createStarDiamondMesh,
      createFrameMesh,
      createMiniMoonMesh,
      createHeartLightMesh,
    ];

    const total = songs.length || 6;
    const radius = 3.8;

    songs.forEach((song, idx) => {
      const angle = (idx / total) * Math.PI * 2;
      const builder = builders[idx % builders.length];
      const meshGroup = builder();

      // Calculate initial orbital position
      const posX = Math.sin(angle) * radius;
      const posY = Math.cos(angle) * 0.9;
      const posZ = Math.cos(angle) * (radius * 0.65) - 0.5;

      meshGroup.position.set(posX, posY, posZ);
      meshGroup.userData = {
        songIndex: idx,
        basePos: new THREE.Vector3(posX, posY, posZ),
        baseAngle: angle,
        floatSeed: Math.random() * 10,
      };

      objectsGroup.add(meshGroup);
      songObjects.push(meshGroup);
    });

    // 8. Raycasting & Touch / Click Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const clientX = event.clientX || (event.touches && event.touches[0]?.clientX);
      const clientY = event.clientY || (event.touches && event.touches[0]?.clientY);

      if (clientX === undefined || clientY === undefined) return;

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(objectsGroup.children, true);

      if (intersects.length > 0) {
        // Find top group with userData
        let curr = intersects[0].object;
        while (curr && curr.parent && curr.parent !== objectsGroup) {
          curr = curr.parent;
        }
        if (curr && curr.userData && curr.userData.songIndex !== undefined) {
          if (onSelectSong) {
            onSelectSong(curr.userData.songIndex);
          }
        }
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);

    // 9. Resize handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 10. Animation Loop
    let clock = new THREE.Clock();
    const targetCameraPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Subtle slow background drift
      starField.rotation.y = elapsed * 0.015;
      moonGroup.rotation.y = elapsed * 0.02;

      // Dust float
      const positions = dustParticles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(elapsed + positions[i]) * 0.002;
      }
      dustParticles.geometry.attributes.position.needsUpdate = true;

      // Theme transitions & Dynamic Lighting
      const activeSong = songs[activeSongIndex] || songs[0];
      const themeKey = activeSong?.theme || 'gold';
      const activeTheme = THEMES[themeKey] || THEMES.gold;

      scene.fog.color.lerp(new THREE.Color(activeTheme.fogColor), 0.04);
      mainLight.color.lerp(new THREE.Color(activeTheme.pointLight), 0.04);
      mainLight.intensity = THREE.MathUtils.lerp(mainLight.intensity, activeTheme.lightIntensity, 0.04);
      ambientLight.color.lerp(new THREE.Color(activeTheme.ambient), 0.04);
      dustMat.color.lerp(new THREE.Color(activeTheme.particleColor), 0.04);

      // Object Animations & Layout
      songObjects.forEach((obj, idx) => {
        const u = obj.userData;
        const isSelected = idx === activeSongIndex;

        if (isFinalMoment) {
          // If in "One Song" moment, disperse all except final song
          if (idx === songs.length - 1) {
            // Bring final object dead center and rotate majestically
            obj.position.lerp(new THREE.Vector3(0, 0, 2.2), 0.05);
            obj.scale.lerp(new THREE.Vector3(1.35, 1.35, 1.35), 0.05);
            obj.rotation.y += 0.02;
            obj.rotation.z = Math.sin(elapsed * 1.5) * 0.08;
          } else {
            // Float others far away
            obj.position.lerp(new THREE.Vector3(u.basePos.x * 3, u.basePos.y * 3, -15), 0.04);
            obj.scale.lerp(new THREE.Vector3(0.001, 0.001, 0.001), 0.04);
          }
        } else if (isSelected) {
          // Bring selected object in front of camera
          const targetX = 0;
          const targetY = 0.15;
          const targetZ = 3.6;
          obj.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.06);
          obj.scale.lerp(new THREE.Vector3(1.15, 1.15, 1.15), 0.06);

          // Dedicated rotations per object type
          obj.rotation.y += 0.015;
          obj.rotation.x = Math.sin(elapsed * 1.2 + u.floatSeed) * 0.1;
        } else {
          // Orbit gently in background
          const floatY = u.basePos.y + Math.sin(elapsed * 1.4 + u.floatSeed) * 0.25;
          const targetPos = new THREE.Vector3(u.basePos.x, floatY, u.basePos.z);
          obj.position.lerp(targetPos, 0.05);
          obj.scale.lerp(new THREE.Vector3(0.75, 0.75, 0.75), 0.05);

          obj.rotation.y += 0.008;
          obj.rotation.x = Math.sin(elapsed + u.floatSeed) * 0.15;
        }
      });

      // Camera motion & LookAt
      if (isFinalMoment) {
        targetCameraPos.set(0, 0, 6.8);
        targetLookAt.set(0, 0, 2);
      } else {
        const isMobile = width < 640;
        targetCameraPos.set(0, 0.4, isMobile ? 8.2 : 7.2);
        targetLookAt.set(0, 0, 0);
      }

      camera.position.lerp(targetCameraPos, 0.04);
      camera.lookAt(targetLookAt);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeSongIndex, songs, onSelectSong, isFinalMoment]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'auto',
      }}
    />
  );
}
