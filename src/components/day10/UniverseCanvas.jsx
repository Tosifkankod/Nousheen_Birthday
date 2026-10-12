import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Procedural Star Texture Generator
 * Creates an authentic celestial star with a diamond-bright core,
 * soft exponential falloff, and delicate 4-point diffraction rays.
 */
function createStarTexture(colorHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const cx = 64;
  const cy = 64;

  // 1. Sharp diamond pinpoint core + rapid radiant falloff
  const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 32);
  radGrad.addColorStop(0.0, '#ffffff');
  radGrad.addColorStop(0.12, 'rgba(255, 255, 255, 0.98)');
  radGrad.addColorStop(0.28, colorHex);
  radGrad.addColorStop(0.65, 'rgba(232, 195, 125, 0.18)');
  radGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 32, 0, Math.PI * 2);
  ctx.fill();

  // 2. 4-point slender diffraction spikes (horizontal & vertical)
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  // Horizontal slender spike
  const hGrad = ctx.createLinearGradient(12, cy, 116, cy);
  hGrad.addColorStop(0, 'rgba(0,0,0,0)');
  hGrad.addColorStop(0.35, 'rgba(255,248,225,0.4)');
  hGrad.addColorStop(0.5, '#ffffff');
  hGrad.addColorStop(0.65, 'rgba(255,248,225,0.4)');
  hGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = hGrad;
  ctx.beginPath();
  ctx.moveTo(12, cy);
  ctx.lineTo(cx, cy - 2.0);
  ctx.lineTo(116, cy);
  ctx.lineTo(cx, cy + 2.0);
  ctx.closePath();
  ctx.fill();

  // Vertical slender spike
  const vGrad = ctx.createLinearGradient(cx, 12, cx, 116);
  vGrad.addColorStop(0, 'rgba(0,0,0,0)');
  vGrad.addColorStop(0.35, 'rgba(255,248,225,0.4)');
  vGrad.addColorStop(0.5, '#ffffff');
  vGrad.addColorStop(0.65, 'rgba(255,248,225,0.4)');
  vGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = vGrad;
  ctx.beginPath();
  ctx.moveTo(cx, 12);
  ctx.lineTo(cx - 2.0, cy);
  ctx.lineTo(cx, 116);
  ctx.lineTo(cx + 2.0, cy);
  ctx.closePath();
  ctx.fill();

  // 45-degree micro-diagonal sparkles
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.PI / 4);
  const diagGrad = ctx.createLinearGradient(-16, 0, 16, 0);
  diagGrad.addColorStop(0, 'rgba(0,0,0,0)');
  diagGrad.addColorStop(0.5, 'rgba(255,255,255,0.65)');
  diagGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = diagGrad;
  ctx.fillRect(-16, -1, 32, 2);
  ctx.fillRect(-1, -16, 2, 32);
  ctx.restore();

  // Pinpoint pure white center
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, 2.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Soft Ambient Halo Texture for organic celestial bloom
 */
function createHaloTexture(colorHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const cx = 64;
  const cy = 64;

  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 48);
  grad.addColorStop(0.0, 'rgba(255, 255, 255, 0.65)');
  grad.addColorStop(0.2, colorHex);
  grad.addColorStop(0.5, 'rgba(201, 169, 110, 0.12)');
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Faint Cosmic Nebula Cloud Texture
 */
function createNebulaTexture(colorHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const cx = 64;
  const cy = 64;

  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
  grad.addColorStop(0.0, colorHex);
  grad.addColorStop(0.4, 'rgba(20, 14, 35, 0.12)');
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

/**
 * 3D Universe Canvas for Day 10 (Scene 3: Real 3D Celestial Stars & Scene 4: Two Lights)
 * - Authentic 3D starfield with layered depth & subtle parallax
 * - Six distinct luminous celestial stars (no flat circles or bullseyes)
 * - Delicate 4-point glints, organic twinkle, floating micro-stardust
 * - Tap burst animation on click
 * - Preserves Scene 4 drag-to-merge interaction and transitions
 */
export default function UniverseCanvas({
  stars = [],
  discoveredStars = [],
  onSelectStar,
  isScene4 = false,
  onLightsMerged,
  lightsProgress = 0,
  onDragProgress,
}) {
  const containerRef = useRef(null);

  // Dynamic state refs for 60fps WebGL rendering without component re-mounting
  const starsRef = useRef(stars);
  const discoveredRef = useRef(discoveredStars);
  const onSelectStarRef = useRef(onSelectStar);
  const isScene4Ref = useRef(isScene4);
  const onLightsMergedRef = useRef(onLightsMerged);
  const lightsProgressRef = useRef(lightsProgress);
  const onDragProgressRef = useRef(onDragProgress);

  useEffect(() => { starsRef.current = stars; }, [stars]);
  useEffect(() => { discoveredRef.current = discoveredStars; }, [discoveredStars]);
  useEffect(() => { onSelectStarRef.current = onSelectStar; }, [onSelectStar]);
  useEffect(() => { isScene4Ref.current = isScene4; }, [isScene4]);
  useEffect(() => { onLightsMergedRef.current = onLightsMerged; }, [onLightsMerged]);
  useEffect(() => { lightsProgressRef.current = lightsProgress; }, [lightsProgress]);
  useEffect(() => { onDragProgressRef.current = onDragProgress; }, [onDragProgress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 520;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040308, 0.04);

    const aspect = width / Math.max(height, 1);
    const computeBaseZ = (asp) => {
      if (asp < 0.6) return 10.5;
      if (asp < 0.8) return 9.5;
      if (asp < 1.0) return 8.6;
      if (asp < 1.25) return 7.8;
      return 7.2;
    };

    let baseCameraZ = computeBaseZ(aspect);
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    camera.position.set(0, 0, baseCameraZ);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 2. Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0x1a1626, 2.0);
    scene.add(ambientLight);

    // 3. Faint Distant Cosmic Nebula Clouds
    const nebulaColors = ['#1d1430', '#2a1a24', '#261e14', '#151b2a'];
    nebulaColors.forEach((col, idx) => {
      const nebTex = createNebulaTexture(col);
      const nebMat = new THREE.SpriteMaterial({
        map: nebTex,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.18,
      });
      const nebSprite = new THREE.Sprite(nebMat);
      nebSprite.position.set((idx - 1.5) * 4.5, (idx % 2 === 0 ? 1 : -1) * 2.2, -8 - idx * 2);
      nebSprite.scale.set(10, 8, 1);
      scene.add(nebSprite);
    });

    // 5. Multi-Layer Background Starfield (Deep 3D space)
    // Layer A: Deep Far Stars (800 count)
    const farCount = 800;
    const farGeo = new THREE.BufferGeometry();
    const farPos = new Float32Array(farCount * 3);
    for (let i = 0; i < farCount * 3; i += 3) {
      farPos[i] = (Math.random() - 0.5) * 32;
      farPos[i + 1] = (Math.random() - 0.5) * 22;
      farPos[i + 2] = -5 - Math.random() * 20;
    }
    farGeo.setAttribute('position', new THREE.BufferAttribute(farPos, 3));
    const farMat = new THREE.PointsMaterial({
      color: 0xfbe2a8,
      size: 0.035,
      transparent: true,
      opacity: 0.65,
    });
    const farField = new THREE.Points(farGeo, farMat);
    scene.add(farField);

    // Layer B: Midground Twinkling Stars (300 count)
    const midCount = 300;
    const midGeo = new THREE.BufferGeometry();
    const midPos = new Float32Array(midCount * 3);
    for (let i = 0; i < midCount * 3; i += 3) {
      midPos[i] = (Math.random() - 0.5) * 18;
      midPos[i + 1] = (Math.random() - 0.5) * 14;
      midPos[i + 2] = (Math.random() - 0.5) * 8;
    }
    midGeo.setAttribute('position', new THREE.BufferAttribute(midPos, 3));
    const midMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
    });
    const midField = new THREE.Points(midGeo, midMat);
    scene.add(midField);

    // Layer C: Gentle Floating Stardust (100 count)
    const dustCount = 100;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 12;
      dustPos[i + 1] = (Math.random() - 0.5) * 9;
      dustPos[i + 2] = Math.random() * 4 - 1;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xf7d399,
      size: 0.065,
      transparent: true,
      opacity: 0.6,
    });
    const dustField = new THREE.Points(dustGeo, dustMat);
    scene.add(dustField);

    // 6. The Six Luminous Celestial Stars
    const starObjects = [];
    const starTriggerMeshes = [];

    stars.forEach((s, idx) => {
      const starGroup = new THREE.Group();
      starGroup.position.set(s.coords.x, s.coords.y, s.coords.z);
      scene.add(starGroup);

      // Star Texture and Halo
      const starTex = createStarTexture(s.color || '#fbe2a8');
      const haloTex = createHaloTexture(s.color || '#fbe2a8');

      // A) Main Luminous Star Core Sprite (4-point diffraction spike)
      const coreMat = new THREE.SpriteMaterial({
        map: starTex,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.95,
      });
      const coreSprite = new THREE.Sprite(coreMat);
      const baseScale = 0.44 + (idx % 3) * 0.05;
      coreSprite.scale.set(baseScale, baseScale, 1);
      starGroup.add(coreSprite);

      // B) Soft Outer Ethereal Bloom Halo
      const haloMat = new THREE.SpriteMaterial({
        map: haloTex,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.38,
      });
      const haloSprite = new THREE.Sprite(haloMat);
      haloSprite.scale.set(baseScale * 1.35, baseScale * 1.35, 1);
      starGroup.add(haloSprite);

      // C) Tiny Orbiting Micro-Stardust
      const microCount = 8;
      const microGeo = new THREE.BufferGeometry();
      const microPos = new Float32Array(microCount * 3);
      for (let m = 0; m < microCount * 3; m += 3) {
        const ang = Math.random() * Math.PI * 2;
        const rad = 0.22 + Math.random() * 0.18;
        microPos[m] = Math.cos(ang) * rad;
        microPos[m + 1] = (Math.random() - 0.5) * 0.12;
        microPos[m + 2] = Math.sin(ang) * rad;
      }
      microGeo.setAttribute('position', new THREE.BufferAttribute(microPos, 3));
      const microMat = new THREE.PointsMaterial({
        color: s.color || '#fbe2a8',
        size: 0.035,
        transparent: true,
        opacity: 0.75,
      });
      const microPoints = new THREE.Points(microGeo, microMat);
      starGroup.add(microPoints);

      // D) Tasteful Discovered Diamond Pip
      const pipGeo = new THREE.BufferGeometry();
      pipGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0.38, 0]), 3));
      const pipMat = new THREE.PointsMaterial({
        color: 0xfbe2a8,
        size: 0.08,
        transparent: true,
        opacity: 0,
      });
      const pip = new THREE.Points(pipGeo, pipMat);
      starGroup.add(pip);

      // E) Generous Invisible Raycaster Trigger
      const triggerGeo = new THREE.SphereGeometry(0.55, 12, 12);
      const triggerMat = new THREE.MeshBasicMaterial({ visible: false });
      const trigger = new THREE.Mesh(triggerGeo, triggerMat);
      trigger.position.copy(starGroup.position);
      trigger.name = `star_${s.id}`;
      trigger.userData = { starId: s.id, index: idx };
      scene.add(trigger);

      starObjects.push({
        group: starGroup,
        core: coreSprite,
        halo: haloSprite,
        micro: microPoints,
        pip: pip,
        starId: s.id,
        baseScale: baseScale,
        basePos: { ...s.coords },
        burst: 0, // Tap light burst animation progress (0 = none)
        isHovered: false,
      });
      starTriggerMeshes.push(trigger);
    });

    // 7. Scene 4: Two Lights Setup (Tosif & Nousheen)
    const twoLightsGroup = new THREE.Group();
    twoLightsGroup.visible = false;
    scene.add(twoLightsGroup);

    // Light 1: Tosif (Left)
    const lightTosifMat = new THREE.SpriteMaterial({
      map: createStarTexture('#90caf9'),
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.95,
    });
    const lightTosif = new THREE.Sprite(lightTosifMat);
    lightTosif.position.set(-2.8, 0, 0);
    lightTosif.scale.set(1.4, 1.4, 1);
    twoLightsGroup.add(lightTosif);

    // Light 2: Nousheen (Right, Draggable)
    const lightNousheenMat = new THREE.SpriteMaterial({
      map: createStarTexture('#f48fb1'),
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.95,
    });
    const lightNousheen = new THREE.Sprite(lightNousheenMat);
    lightNousheen.position.set(2.8, 0, 0);
    lightNousheen.scale.set(1.4, 1.4, 1);
    twoLightsGroup.add(lightNousheen);

    // Golden Connecting Thread
    const threadMat = new THREE.LineBasicMaterial({
      color: 0xfbe2a8,
      transparent: true,
      opacity: 0.8,
      linewidth: 2,
    });
    const threadGeo = new THREE.BufferGeometry().setFromPoints([lightTosif.position, lightNousheen.position]);
    const threadLine = new THREE.Line(threadGeo, threadMat);
    twoLightsGroup.add(threadLine);

    // 8. Interaction Handling (Parallax, Hover, Click, Drag)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDraggingLight = false;
    let targetCameraX = 0;
    let targetCameraY = 0;
    let targetCameraZ = 7.2;

    const getPointerPos = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || (e.changedTouches && e.changedTouches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || (e.changedTouches && e.changedTouches[0].clientY) || 0;
      return {
        x: ((clientX - rect.left) / rect.width) * 2 - 1,
        y: -(((clientY - rect.top) / rect.height) * 2 - 1),
      };
    };

    const onPointerMove = (e) => {
      const p = getPointerPos(e);
      mouse.x = p.x;
      mouse.y = p.y;

      // Parallax target
      targetCameraX = p.x * 0.6;
      targetCameraY = p.y * 0.45;

      // Hover check for stars
      if (!isScene4Ref.current) {
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(starTriggerMeshes);
        starObjects.forEach((so) => {
          so.isHovered = hits.length > 0 && hits[0].object.userData.starId === so.starId;
        });
      }

      // Dragging in Scene 4
      if (isScene4Ref.current && isDraggingLight) {
        const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        raycaster.setFromCamera(mouse, camera);
        const intersectPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(planeZ, intersectPoint);

        if (intersectPoint) {
          const clampedX = Math.max(-2.8, Math.min(2.8, intersectPoint.x));
          lightNousheen.position.x = clampedX;
          lightNousheen.position.y = intersectPoint.y * 0.25;

          const dist = Math.abs(lightNousheen.position.x - lightTosif.position.x);
          const totalDist = 5.6;
          const progress = Math.max(0, Math.min(1, 1 - dist / totalDist));

          if (onDragProgressRef.current) {
            onDragProgressRef.current(progress);
          }

          if (dist < 0.6) {
            isDraggingLight = false;
            lightNousheen.position.x = -2.8;
            if (onLightsMergedRef.current) {
              onLightsMergedRef.current();
            }
          }
        }
      }
    };

    const onPointerDown = (e) => {
      const p = getPointerPos(e);
      mouse.x = p.x;
      mouse.y = p.y;
      raycaster.setFromCamera(mouse, camera);

      if (isScene4Ref.current) {
        const hits = raycaster.intersectObject(lightNousheen);
        if (hits.length > 0) {
          isDraggingLight = true;
        }
      }
    };

    const onPointerUp = () => {
      isDraggingLight = false;
    };

    const onClick = (e) => {
      if (isScene4Ref.current) return;

      const p = getPointerPos(e);
      mouse.x = p.x;
      mouse.y = p.y;
      raycaster.setFromCamera(mouse, camera);

      const hits = raycaster.intersectObjects(starTriggerMeshes);
      if (hits.length > 0) {
        const starId = hits[0].object.userData.starId;
        const matched = starObjects.find((so) => so.starId === starId);
        if (matched) {
          // Trigger light burst animation
          matched.burst = 1.0;
        }

        setTimeout(() => {
          if (onSelectStarRef.current) {
            onSelectStarRef.current(starId);
          }
        }, 120);
      }
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('click', onClick);

    // 9. Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Slow organic starfield drift
      farField.rotation.y = elapsed * 0.008;
      midField.rotation.y = elapsed * 0.015;
      dustField.rotation.y = -elapsed * 0.012;

      // Parallax camera lerp
      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetCameraY - camera.position.y) * 0.04;
      camera.position.z += (targetCameraZ - camera.position.z) * 0.04;
      camera.lookAt(0, 0, 0);

      // Handle Scene 4 vs Scene 3
      if (isScene4Ref.current) {
        twoLightsGroup.visible = true;
        starObjects.forEach((so) => { so.group.visible = false; });

        threadLine.geometry.setFromPoints([lightTosif.position, lightNousheen.position]);

        const pulse = 1 + Math.sin(elapsed * 5) * 0.08;
        lightTosif.scale.set(1.4 * pulse, 1.4 * pulse, 1);
        lightNousheen.scale.set(1.4 * pulse, 1.4 * pulse, 1);

        targetCameraZ = baseCameraZ * 0.86;
      } else {
        twoLightsGroup.visible = false;
        targetCameraZ = baseCameraZ;

        const currentDiscovered = discoveredRef.current || [];

        // Animate the 6 Celestial Stars
        starObjects.forEach((so, idx) => {
          so.group.visible = true;
          const isDiscovered = currentDiscovered.includes(so.starId);

          // Subtle organic float (imperceptible, graceful)
          const floatY = Math.sin(elapsed * 1.2 + idx * 1.5) * 0.04;
          const floatX = Math.cos(elapsed * 0.9 + idx * 1.2) * 0.03;
          so.group.position.x = so.basePos.x + floatX;
          so.group.position.y = so.basePos.y + floatY;

          // Organic twinkle pulse
          const twinkleFreq = isDiscovered ? 2.0 : 3.2;
          const twinkle = Math.sin(elapsed * twinkleFreq + idx * 2.1);
          const pulseScale = 1.0 + twinkle * 0.08;

          // Hover expansion
          const hoverBoost = so.isHovered ? 1.25 : 1.0;

          // Tap light burst decay
          if (so.burst > 0) {
            so.burst = Math.max(0, so.burst - 0.04);
          }
          const burstScale = 1.0 + so.burst * 0.6;

          const finalScale = so.baseScale * pulseScale * hoverBoost * burstScale;
          so.core.scale.set(finalScale, finalScale, 1);
          so.halo.scale.set(finalScale * 1.35, finalScale * 1.35, 1);

          // Luminous halo opacity
          so.halo.material.opacity = (0.32 + twinkle * 0.1 + (so.isHovered ? 0.2 : 0) + so.burst * 0.35);

          // Orbiting micro-stardust rotate slowly
          so.micro.rotation.y = elapsed * 0.8 + idx;
          so.micro.rotation.x = Math.sin(elapsed * 0.5) * 0.2;

          // Tasteful discovered indicator (subtle diamond pip glow)
          if (isDiscovered) {
            so.pip.material.opacity = 0.85 + Math.sin(elapsed * 3) * 0.15;
          } else {
            so.pip.material.opacity = 0;
          }
        });
      }

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
      renderer.setSize(newW, newH);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      baseCameraZ = computeBaseZ(newAspect);
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
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '320px',
        position: 'relative',
        touchAction: isScene4 ? 'none' : 'pan-y',
        cursor: isScene4 ? 'grab' : 'pointer',
      }}
    />
  );
}
