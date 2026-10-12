import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * CityMap3D - A cinematic Three.js interactive 3D visualization
 * representing the distance and connection between Mumbai and Hyderabad.
 *
 * Props:
 * - activeCity: 'none' | 'mumbai' | 'hyderabad' | 'connection' | 'cosmos'
 * - onSelectCity: (cityId) => void
 */
export default function CityMap3D({ activeCity = 'overview', onSelectCity }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return; // WebGL not available
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 450;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06060e, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0x2a2840, 1.2);
    scene.add(ambientLight);

    // =========================================================================
    // 1. STARRY NIGHT & DUST PARTICLES
    // =========================================================================
    const starCount = 380;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starOpacities = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 26;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;
      starOpacities[i] = Math.random() * 0.8 + 0.2;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0xfbe2a8,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // =========================================================================
    // 2. STYLIZED GEOGRAPHICAL TOPOGRAPHY / GRID PARTICLES (INDIA OUTLINE INSPIRATION)
    // =========================================================================
    const gridCount = 220;
    const gridGeo = new THREE.BufferGeometry();
    const gridPositions = new Float32Array(gridCount * 3);
    const gridColors = new Float32Array(gridCount * 3);

    const cTeal = new THREE.Color(0x355e75);
    const cAmber = new THREE.Color(0x735732);

    for (let i = 0; i < gridCount; i++) {
      // Clustered roughly in an Indian subcontinent triangular curvature
      const t = i / gridCount;
      const angle = t * Math.PI * 2;
      const radius = 2.4 + (Math.sin(angle * 3) * 0.6) + ((Math.random() - 0.5) * 0.8);
      const x = Math.cos(angle) * (radius * 1.1) + ((Math.random() - 0.5) * 0.4);
      const y = Math.sin(angle) * (radius * 0.9) - 0.3 + ((Math.random() - 0.5) * 0.4);
      const z = -0.5 + ((Math.random() - 0.5) * 0.3);

      gridPositions[i * 3] = x;
      gridPositions[i * 3 + 1] = y;
      gridPositions[i * 3 + 2] = z;

      const col = Math.random() > 0.5 ? cTeal : cAmber;
      gridColors[i * 3] = col.r;
      gridColors[i * 3 + 1] = col.g;
      gridColors[i * 3 + 2] = col.b;
    }
    gridGeo.setAttribute('position', new THREE.BufferAttribute(gridPositions, 3));
    gridGeo.setAttribute('color', new THREE.BufferAttribute(gridColors, 3));

    const gridMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
    });
    const gridPoints = new THREE.Points(gridGeo, gridMat);
    scene.add(gridPoints);

    // =========================================================================
    // 3. CITY 1: MUMBAI (WEST COAST COORDINATE: X = -1.6, Y = 0.3, Z = 0)
    // =========================================================================
    const mumbaiPos = new THREE.Vector3(-1.65, 0.25, 0.1);
    const hyderabadPos = new THREE.Vector3(1.45, -0.35, 0.1);

    // Mumbai Core Light & Mesh
    const mumbaiGroup = new THREE.Group();
    mumbaiGroup.position.copy(mumbaiPos);

    const mumbaiCoreGeo = new THREE.SphereGeometry(0.12, 24, 24);
    const mumbaiCoreMat = new THREE.MeshBasicMaterial({ color: 0xffe29a });
    const mumbaiCore = new THREE.Mesh(mumbaiCoreGeo, mumbaiCoreMat);
    mumbaiGroup.add(mumbaiCore);

    // Mumbai Halo
    const haloGeo = new THREE.RingGeometry(0.16, 0.24, 32);
    const mumbaiHaloMat = new THREE.MeshBasicMaterial({
      color: 0xffca68,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    });
    const mumbaiHalo = new THREE.Mesh(haloGeo, mumbaiHaloMat);
    mumbaiGroup.add(mumbaiHalo);

    const mumbaiLight = new THREE.PointLight(0xffca68, 2.5, 4);
    mumbaiGroup.add(mumbaiLight);
    scene.add(mumbaiGroup);

    // =========================================================================
    // 4. CITY 2: HYDERABAD (DECCAN COORDINATE: X = 1.45, Y = -0.35, Z = 0)
    // =========================================================================
    const hyderabadGroup = new THREE.Group();
    hyderabadGroup.position.copy(hyderabadPos);

    const hydCoreGeo = new THREE.SphereGeometry(0.12, 24, 24);
    const hydCoreMat = new THREE.MeshBasicMaterial({ color: 0xffb5c5 });
    const hydCore = new THREE.Mesh(hydCoreGeo, hydCoreMat);
    hyderabadGroup.add(hydCore);

    const hydHaloMat = new THREE.MeshBasicMaterial({
      color: 0xf48fb1,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    });
    const hydHalo = new THREE.Mesh(haloGeo, hydHaloMat);
    hyderabadGroup.add(hydHalo);

    const hydLight = new THREE.PointLight(0xf48fb1, 2.5, 4);
    hyderabadGroup.add(hydLight);
    scene.add(hyderabadGroup);

    // =========================================================================
    // 5. GOLDEN LIGHT CONNECTION CURVE (ARCING BETWEEN MUMBAI AND HYDERABAD)
    // =========================================================================
    const midPoint = new THREE.Vector3().addVectors(mumbaiPos, hyderabadPos).multiplyScalar(0.5);
    midPoint.y += 0.8; // Graceful arch upward
    midPoint.z += 0.5; // Subtle forward arch

    const curve = new THREE.QuadraticBezierCurve3(mumbaiPos, midPoint, hyderabadPos);
    const curvePoints = curve.getPoints(64);
    const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffdf88,
      transparent: true,
      opacity: 0.45,
      linewidth: 2,
    });
    const connectionLine = new THREE.Line(lineGeo, lineMat);
    scene.add(connectionLine);

    // Animated Photons / Light Pulses travelling along the curve
    const pulseCount = 12;
    const pulseGeo = new THREE.BufferGeometry();
    const pulsePositions = new Float32Array(pulseCount * 3);
    pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));

    const pulseMat = new THREE.PointsMaterial({
      size: 0.16,
      color: 0xfffae0,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    const pulsePoints = new THREE.Points(pulseGeo, pulseMat);
    scene.add(pulsePoints);

    const pulseOffsets = Array.from({ length: pulseCount }, (_, i) => i / pulseCount);

    // =========================================================================
    // 6. RAYCASTING INTERACTIVITY (CLICKING / TAPPING CITIES)
    // =========================================================================
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
      const intersects = raycaster.intersectObjects([mumbaiCore, hydCore]);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit === mumbaiCore && onSelectCity) {
          onSelectCity('mumbai');
        } else if (hit === hydCore && onSelectCity) {
          onSelectCity('hyderabad');
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // =========================================================================
    // 7. CAMERA TARGETING & SMOOTH TRANSITION
    // =========================================================================
    const targetCamPos = new THREE.Vector3(0, 0, 7.5);
    const targetLookAt = new THREE.Vector3(0, 0, 0);
    const currentLookAt = new THREE.Vector3(0, 0, 0);

    const updateCameraTargets = (mode) => {
      if (mode === 'mumbai') {
        targetCamPos.set(-1.65, 0.25, 4.2);
        targetLookAt.set(-1.65, 0.25, 0);
      } else if (mode === 'hyderabad') {
        targetCamPos.set(1.45, -0.35, 4.2);
        targetLookAt.set(1.45, -0.35, 0);
      } else if (mode === 'connection') {
        targetCamPos.set(0, 0.1, 6.8);
        targetLookAt.set(0, 0.1, 0);
      } else if (mode === 'cosmos') {
        targetCamPos.set(0, 0, 11.5);
        targetLookAt.set(0, 0, 0);
      } else {
        // Overview
        targetCamPos.set(0, 0, 7.5);
        targetLookAt.set(0, 0, 0);
      }
    };

    updateCameraTargets(activeCity);

    // =========================================================================
    // 8. ANIMATION LOOP
    // =========================================================================
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow majestic rotation of distant starfield
      starPoints.rotation.y = elapsedTime * 0.015;
      gridPoints.rotation.z = Math.sin(elapsedTime * 0.2) * 0.02;

      // Pulse halos
      const haloScale = 1 + Math.sin(elapsedTime * 3) * 0.15;
      mumbaiHalo.scale.set(haloScale, haloScale, 1);
      hydHalo.scale.set(haloScale, haloScale, 1);

      // Trail brightness modulation depending on activeCity mode
      if (activeCity === 'connection' || activeCity === 'cosmos') {
        lineMat.opacity = 0.85 + Math.sin(elapsedTime * 4) * 0.15;
        pulseMat.size = 0.22;
      } else {
        lineMat.opacity = 0.45;
        pulseMat.size = 0.16;
      }

      // Move photons along bezier curve
      const posAttr = pulseGeo.attributes.position;
      for (let i = 0; i < pulseCount; i++) {
        pulseOffsets[i] = (pulseOffsets[i] + 0.005) % 1;
        const pt = curve.getPoint(pulseOffsets[i]);
        posAttr.setXYZ(i, pt.x, pt.y, pt.z);
      }
      posAttr.needsUpdate = true;

      // Smooth camera lerp
      camera.position.lerp(targetCamPos, 0.05);
      currentLookAt.lerp(targetLookAt, 0.05);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
    };

    animate();

    // =========================================================================
    // 9. WINDOW RESIZE HANDLER
    // =========================================================================
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starGeo.dispose();
      starMat.dispose();
      gridGeo.dispose();
      gridMat.dispose();
      mumbaiCoreGeo.dispose();
      mumbaiCoreMat.dispose();
      haloGeo.dispose();
      mumbaiHaloMat.dispose();
      hydCoreGeo.dispose();
      hydCoreMat.dispose();
      hydHaloMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      pulseGeo.dispose();
      pulseMat.dispose();
    };
  }, [activeCity, onSelectCity]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        touchAction: 'none',
        cursor: 'grab',
      }}
    />
  );
}
