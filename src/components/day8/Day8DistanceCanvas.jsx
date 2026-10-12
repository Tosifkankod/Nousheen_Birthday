import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Day8DistanceCanvas({
  distanceStage = 0, // 0 to 5 (0: infinity, 1: far, 2: closer, 3: almost, 4: one day, 5: together)
  isMeeting = false,
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
    scene.fog = new THREE.FogExp2(0x040308, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 9);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambient = new THREE.AmbientLight(0x221a30, 1.4);
    scene.add(ambient);

    const keyLight = new THREE.PointLight(0xffdfa8, 2.5, 30);
    keyLight.position.set(0, 4, 5);
    scene.add(keyLight);

    const moonLight = new THREE.DirectionalLight(0x8cb8ff, 1.2);
    moonLight.position.set(-5, 8, -4);
    scene.add(moonLight);

    // 3. Cosmic Starfield
    const starCount = 800;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starCols = new Float32Array(starCount * 3);

    const c1 = new THREE.Color(0xf6f1ea);
    const c2 = new THREE.Color(0xf5cf82);
    const c3 = new THREE.Color(0xa3c7f7);

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      starPos[idx] = (Math.random() - 0.5) * 60;
      starPos[idx + 1] = (Math.random() - 0.5) * 50;
      starPos[idx + 2] = -5 - Math.random() * 40;

      const r = Math.random();
      const col = r > 0.6 ? c2 : r > 0.3 ? c3 : c1;
      starCols[idx] = col.r;
      starCols[idx + 1] = col.g;
      starCols[idx + 2] = col.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starCols, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 4. Two Celestial Light Points ("Tosif" & "Nousheen")
    const distanceGroup = new THREE.Group();
    scene.add(distanceGroup);

    // Tosif Light Orb (Warm Gold)
    const tosifGroup = new THREE.Group();
    const tosifGeo = new THREE.SphereGeometry(0.38, 32, 32);
    const tosifMat = new THREE.MeshStandardMaterial({
      color: 0xffd57e,
      emissive: 0xdf9c2c,
      emissiveIntensity: 1.8,
      roughness: 0.1,
    });
    const tosifMesh = new THREE.Mesh(tosifGeo, tosifMat);
    tosifGroup.add(tosifMesh);

    const tosifHaloGeo = new THREE.SphereGeometry(0.65, 16, 16);
    const tosifHaloMat = new THREE.MeshBasicMaterial({
      color: 0xffe19c,
      transparent: true,
      opacity: 0.25,
      side: THREE.BackSide,
    });
    const tosifHalo = new THREE.Mesh(tosifHaloGeo, tosifHaloMat);
    tosifGroup.add(tosifHalo);
    distanceGroup.add(tosifGroup);

    // Nousheen Light Orb (Soft Rose Pearl)
    const nousheenGroup = new THREE.Group();
    const nousheenGeo = new THREE.SphereGeometry(0.38, 32, 32);
    const nousheenMat = new THREE.MeshStandardMaterial({
      color: 0xffb8c6,
      emissive: 0xd94b68,
      emissiveIntensity: 1.8,
      roughness: 0.1,
    });
    const nousheenMesh = new THREE.Mesh(nousheenGeo, nousheenMat);
    nousheenGroup.add(nousheenMesh);

    const nousheenHaloGeo = new THREE.SphereGeometry(0.65, 16, 16);
    const nousheenHaloMat = new THREE.MeshBasicMaterial({
      color: 0xffc4d0,
      transparent: true,
      opacity: 0.25,
      side: THREE.BackSide,
    });
    const nousheenHalo = new THREE.Mesh(nousheenHaloGeo, nousheenHaloMat);
    nousheenGroup.add(nousheenHalo);
    distanceGroup.add(nousheenGroup);

    // Glowing Connecting Thread
    const linePointsCount = 60;
    const linePositions = new Float32Array(linePointsCount * 3);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xf9d89c,
      transparent: true,
      opacity: 0.75,
      linewidth: 2,
    });
    const connectionLine = new THREE.Line(lineGeo, lineMat);
    distanceGroup.add(connectionLine);

    // 5. Final Meeting 3D World (Terrace & Hugging Silhouettes)
    const meetingGroup = new THREE.Group();
    meetingGroup.position.set(0, -0.6, 0);
    meetingGroup.visible = false;
    scene.add(meetingGroup);

    // Gentle moonlit ground / grass mound
    const groundGeo = new THREE.CylinderGeometry(5.5, 6.5, 1.2, 48);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x090a14,
      roughness: 0.9,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.6;
    meetingGroup.add(ground);

    // Soft moon above terrace
    const moonGeo = new THREE.SphereGeometry(1.8, 32, 32);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xf6f1ea,
      emissive: 0xb5cdfa,
      emissiveIntensity: 0.45,
      roughness: 0.4,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.position.set(3.2, 4.5, -8);
    meetingGroup.add(moonMesh);

    // Wholesome Stylized Silhouette 3D Figures
    // Boy Figure (Tosif)
    const boyGroup = new THREE.Group();
    boyGroup.position.set(-2.0, 0, 0);

    // Boy Head
    const boyHeadGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const silhouetteMat = new THREE.MeshStandardMaterial({
      color: 0x121422,
      roughness: 0.7,
      metalness: 0.2,
    });
    const boyHead = new THREE.Mesh(boyHeadGeo, silhouetteMat);
    boyHead.position.y = 1.62;
    boyGroup.add(boyHead);

    // Boy Body / Jacket
    const boyBodyGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.75, 16);
    const boyBody = new THREE.Mesh(boyBodyGeo, silhouetteMat);
    boyBody.position.y = 1.15;
    boyGroup.add(boyBody);

    // Boy Legs
    [-0.09, 0.09].forEach((x) => {
      const legGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.8, 12);
      const leg = new THREE.Mesh(legGeo, silhouetteMat);
      leg.position.set(x, 0.4, 0);
      boyGroup.add(leg);
    });

    // Boy Arm (reaching forward for gentle hug)
    const boyArmGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.65, 12);
    const boyArm = new THREE.Mesh(boyArmGeo, silhouetteMat);
    boyArm.position.set(0.16, 1.25, 0.15);
    boyArm.rotation.z = -Math.PI / 4;
    boyArm.rotation.y = Math.PI / 6;
    boyGroup.add(boyArm);

    meetingGroup.add(boyGroup);

    // Girl Figure (Nousheen - modest, graceful silhouette with shawl / dupatta drape)
    const girlGroup = new THREE.Group();
    girlGroup.position.set(2.0, 0, 0);

    // Girl Head
    const girlHeadGeo = new THREE.SphereGeometry(0.17, 16, 16);
    const girlHead = new THREE.Mesh(girlHeadGeo, silhouetteMat);
    girlHead.position.y = 1.54;
    girlGroup.add(girlHead);

    // Girl Modest Dress / Kurti Silhouette
    const girlDressGeo = new THREE.ConeGeometry(0.38, 1.05, 24);
    const girlDress = new THREE.Mesh(girlDressGeo, silhouetteMat);
    girlDress.position.y = 0.82;
    girlGroup.add(girlDress);

    // Girl Upper Torso / Shawl drape
    const girlTorsoGeo = new THREE.CylinderGeometry(0.16, 0.2, 0.45, 16);
    const girlTorso = new THREE.Mesh(girlTorsoGeo, silhouetteMat);
    girlTorso.position.y = 1.22;
    girlGroup.add(girlTorso);

    // Girl Arm (embracing gently)
    const girlArmGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.6, 12);
    const girlArm = new THREE.Mesh(girlArmGeo, silhouetteMat);
    girlArm.position.set(-0.15, 1.22, 0.15);
    girlArm.rotation.z = Math.PI / 4;
    girlArm.rotation.y = -Math.PI / 6;
    girlGroup.add(girlArm);

    meetingGroup.add(girlGroup);

    // Floating Fireflies / Stardust around meeting
    const fireflyCount = 45;
    const fireflyGeo = new THREE.BufferGeometry();
    const fireflyPos = new Float32Array(fireflyCount * 3);
    for (let i = 0; i < fireflyCount * 3; i += 3) {
      fireflyPos[i] = (Math.random() - 0.5) * 6;
      fireflyPos[i + 1] = 0.2 + Math.random() * 2.5;
      fireflyPos[i + 2] = (Math.random() - 0.5) * 5;
    }
    fireflyGeo.setAttribute('position', new THREE.BufferAttribute(fireflyPos, 3));
    const fireflyMat = new THREE.PointsMaterial({
      color: 0xffe89c,
      size: 0.09,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const fireflies = new THREE.Points(fireflyGeo, fireflyMat);
    meetingGroup.add(fireflies);

    // 6. Resize listener
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 7. Render Loop
    let clock = new THREE.Clock();

    // Distance mapping (stage 0 -> spread wide 5.5 units, stage 5 -> 0 units together)
    const distanceSpreadMap = [5.5, 4.2, 2.8, 1.5, 0.6, 0.08];

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Star drift
      starField.rotation.y = elapsed * 0.01;

      if (!isMeeting) {
        // --- DISTANCE ORBS MODE ---
        distanceGroup.visible = true;
        meetingGroup.visible = false;

        const targetDist = distanceSpreadMap[Math.min(distanceStage, distanceSpreadMap.length - 1)];

        // Left orb (Tosif)
        const targetTosifX = -targetDist;
        const tosifFloatY = Math.sin(elapsed * 1.5) * 0.15;
        tosifGroup.position.lerp(new THREE.Vector3(targetTosifX, tosifFloatY, 0), 0.05);

        // Right orb (Nousheen)
        const targetNousheenX = targetDist;
        const nousheenFloatY = Math.sin(elapsed * 1.5 + 1.2) * 0.15;
        nousheenGroup.position.lerp(new THREE.Vector3(targetNousheenX, nousheenFloatY, 0), 0.05);

        // Update connecting glowing spline
        const p1 = tosifGroup.position;
        const p2 = nousheenGroup.position;
        const curve = new THREE.QuadraticBezierCurve3(
          p1,
          new THREE.Vector3(0, Math.sin(elapsed * 2) * 0.4 - 0.2, 0.5),
          p2
        );
        const curvePoints = curve.getPoints(linePointsCount - 1);
        const posAttr = connectionLine.geometry.attributes.position;
        for (let i = 0; i < curvePoints.length; i++) {
          posAttr.setXYZ(i, curvePoints[i].x, curvePoints[i].y, curvePoints[i].z);
        }
        posAttr.needsUpdate = true;

        // Camera positioning for distance view
        camera.position.lerp(new THREE.Vector3(0, 0.3, width < 640 ? 8.5 : 7.5), 0.05);
        camera.lookAt(0, 0, 0);
      } else {
        // --- FINAL MEETING & WHOLESOME HUG MODE ---
        distanceGroup.visible = false;
        meetingGroup.visible = true;

        // Boy and girl smoothly step together to meet in gentle hug
        // Boy walks to -0.16, Girl walks to +0.16
        boyGroup.position.x = THREE.MathUtils.lerp(boyGroup.position.x, -0.18, 0.035);
        girlGroup.position.x = THREE.MathUtils.lerp(girlGroup.position.x, 0.18, 0.035);

        // Gentle breathing and tender sway
        const sway = Math.sin(elapsed * 0.9) * 0.02;
        boyGroup.rotation.z = sway;
        girlGroup.rotation.z = -sway;

        // Firefly floating motion
        const ffPos = fireflies.geometry.attributes.position.array;
        for (let i = 1; i < ffPos.length; i += 3) {
          ffPos[i] += Math.sin(elapsed * 1.2 + ffPos[i]) * 0.003;
        }
        fireflies.geometry.attributes.position.needsUpdate = true;

        // Cinematic gentle camera rotation around the meeting
        const camX = Math.sin(elapsed * 0.15) * 1.2;
        const camZ = 5.2 + Math.cos(elapsed * 0.15) * 0.6;
        camera.position.lerp(new THREE.Vector3(camX, 1.0, camZ), 0.04);
        camera.lookAt(0, 0.8, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [distanceStage, isMeeting]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    />
  );
}
