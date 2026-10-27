import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  RotateCcw,
  Sparkles,
  Camera,
  Layers,
  Sun,
  Eye,
  EyeOff,
  Video,
  Check,
} from 'lucide-react';

export type ProductType3D = 'skincare_bottle' | 'earbuds_case' | 'smart_tumbler';
export type MaterialFinish = 'luxury_gold' | 'stealth_matte' | 'pearl_white';

interface ThreeProductStudioProps {
  onGenerateVideoFrom3D: (prompt: string, productName: string) => void;
}

export const ThreeProductStudio: React.FC<ThreeProductStudioProps> = ({
  onGenerateVideoFrom3D,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Studio Interactive State
  const [selectedProduct, setSelectedProduct] = useState<ProductType3D>('skincare_bottle');
  const [selectedFinish, setSelectedFinish] = useState<MaterialFinish>('luxury_gold');
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [cameraPreset, setCameraPreset] = useState<'hero' | 'front' | 'macro' | 'top'>('hero');

  // Mutable refs for Three.js render loop without triggering React re-renders
  const stateRef = useRef({
    selectedProduct,
    selectedFinish,
    isAutoRotating,
    cameraPreset,
  });

  useEffect(() => {
    stateRef.current = {
      selectedProduct,
      selectedFinish,
      isAutoRotating,
      cameraPreset,
    };
  }, [selectedProduct, selectedFinish, isAutoRotating, cameraPreset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL safely
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene & Renderer setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0e1a);
    scene.fog = new THREE.FogExp2(0x0c0e1a, 0.08);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 1.8, 3.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2. Studio Environment Reflection (PMREMGenerator + RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. Balanced Studio Lighting Rig
    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 12;
    keyLight.shadow.camera.left = -2;
    keyLight.shadow.camera.right = 2;
    keyLight.shadow.camera.top = 2;
    keyLight.shadow.camera.bottom = -2;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    // Cool Fill Light (Hemisphere)
    const hemiLight = new THREE.HemisphereLight(0x7986cb, 0x1a1c2e, 1.2);
    hemiLight.position.set(0, 6, 0);
    scene.add(hemiLight);

    // Rim / Back Accent Light
    const rimLight = new THREE.DirectionalLight(0xff7722, 1.8);
    rimLight.position.set(-3, 2, -3);
    scene.add(rimLight);

    // Soft Studio Ground Floor & Radial Contact Shadow Plane
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x101324,
      roughness: 0.85,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = !isSoftwareGl;
    floor.position.y = 0;
    scene.add(floor);

    // Radial contact shadow texture
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d')!;
    const gradient = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = gradient;
    sCtx.fillRect(0, 0, 256, 256);
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);

    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 2.4),
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        depthWrite: false,
        opacity: 0.7,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.005;
    scene.add(shadowPlane);

    // 4. Product Group Container
    const productRoot = new THREE.Group();
    scene.add(productRoot);

    // Shared procedural textures
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 512;
    labelCanvas.height = 256;
    const lCtx = labelCanvas.getContext('2d')!;
    lCtx.fillStyle = '#ffffff';
    lCtx.fillRect(0, 0, 512, 256);
    lCtx.fillStyle = '#111425';
    lCtx.font = 'bold 32px sans-serif';
    lCtx.textAlign = 'center';
    lCtx.fillText('CREOVO BOTANICALS', 256, 80);
    lCtx.font = '20px sans-serif';
    lCtx.fillText('RADIANCE BOOST SERUM', 256, 120);
    lCtx.font = '14px sans-serif';
    lCtx.fillStyle = '#666';
    lCtx.fillText('30ml · 1.0 fl oz · Organic Bakuchiol', 256, 160);
    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    labelTexture.colorSpace = THREE.SRGBColorSpace;

    // Helper: Build Procedural 3D Products
    function rebuildProduct(type: ProductType3D, finish: MaterialFinish) {
      // Clear previous parts
      while (productRoot.children.length > 0) {
        const obj = productRoot.children[0] as THREE.Mesh;
        if (obj.geometry) obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else if (obj.material) {
          obj.material.dispose();
        }
        productRoot.remove(obj);
      }

      // Finish Color Scheme Variables
      let primaryColor = 0xffffff;
      let accentMetal = 0xd4af37; // Gold
      let roughness = 0.15;
      let metalness = 0.1;

      if (finish === 'luxury_gold') {
        accentMetal = 0xe5b244;
        primaryColor = 0xf5f3ee;
      } else if (finish === 'stealth_matte') {
        accentMetal = 0x444b58;
        primaryColor = 0x1c1e28;
        roughness = 0.7;
        metalness = 0.4;
      } else if (finish === 'pearl_white') {
        accentMetal = 0xc0c8d8;
        primaryColor = 0xfafcff;
        roughness = 0.25;
      }

      if (type === 'skincare_bottle') {
        // --- 8-PART COMPOSITE PROCEDURAL LUXURY SERUM BOTTLE ---
        // Part 1: Glass Outer Bottle
        const bottleGeo = new THREE.CylinderGeometry(0.5, 0.52, 1.3, 36);
        const bottleMat = new THREE.MeshPhysicalMaterial({
          color: finish === 'luxury_gold' ? 0xfff0dd : primaryColor,
          roughness: 0.1,
          metalness: 0.05,
          transmission: 0.9,
          transparent: true,
          opacity: 0.85,
          ior: 1.52,
          thickness: 0.6,
        });
        const bottle = new THREE.Mesh(bottleGeo, bottleMat);
        bottle.position.y = 0.65;
        bottle.castShadow = true;
        bottle.receiveShadow = true;
        productRoot.add(bottle);

        // Part 2: Inner Serum Liquid Core
        const liquidGeo = new THREE.CylinderGeometry(0.42, 0.44, 1.1, 32);
        const liquidMat = new THREE.MeshStandardMaterial({
          color: finish === 'stealth_matte' ? 0x334466 : 0xebb542,
          roughness: 0.2,
          metalness: 0.1,
        });
        const liquid = new THREE.Mesh(liquidGeo, liquidMat);
        liquid.position.y = 0.6;
        productRoot.add(liquid);

        // Part 3: Bottle Shoulder Bevel
        const shoulderGeo = new THREE.CylinderGeometry(0.3, 0.5, 0.2, 32);
        const shoulder = new THREE.Mesh(shoulderGeo, bottleMat);
        shoulder.position.y = 1.35;
        productRoot.add(shoulder);

        // Part 4: Gold Metallic Threaded Neck Ring
        const ringGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.15, 32);
        const ringMat = new THREE.MeshStandardMaterial({
          color: accentMetal,
          roughness: 0.2,
          metalness: 0.95,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.y = 1.5;
        ring.castShadow = true;
        productRoot.add(ring);

        // Part 5: Matte Cap Collar
        const capGeo = new THREE.CylinderGeometry(0.27, 0.27, 0.35, 32);
        const capMat = new THREE.MeshStandardMaterial({
          color: finish === 'stealth_matte' ? 0x11131c : 0xffffff,
          roughness: 0.3,
          metalness: 0.2,
        });
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.y = 1.72;
        cap.castShadow = true;
        productRoot.add(cap);

        // Part 6: Rubber Dropper Bulb
        const bulbGeo = new THREE.SphereGeometry(0.24, 24, 24);
        bulbGeo.scale(1, 1.3, 1);
        const bulbMat = new THREE.MeshStandardMaterial({
          color: finish === 'stealth_matte' ? 0x08090e : 0x222430,
          roughness: 0.85,
          metalness: 0.05,
        });
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.y = 2.05;
        bulb.castShadow = true;
        productRoot.add(bulb);

        // Part 7: Minimalist Travertine Front Label
        const labelGeo = new THREE.CylinderGeometry(0.505, 0.525, 0.8, 32, 1, true, -Math.PI / 3, (Math.PI * 2) / 3);
        const labelMat = new THREE.MeshStandardMaterial({
          map: labelTexture,
          roughness: 0.8,
          metalness: 0.0,
        });
        const labelMesh = new THREE.Mesh(labelGeo, labelMat);
        labelMesh.position.y = 0.65;
        productRoot.add(labelMesh);

        // Part 8: Internal Glass Pipette Rod
        const rodGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.3, 16);
        const rodMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.1,
          metalness: 0.1,
          transparent: true,
          opacity: 0.6,
        });
        const rod = new THREE.Mesh(rodGeo, rodMat);
        rod.position.y = 0.95;
        productRoot.add(rod);
      } else if (type === 'earbuds_case') {
        // --- 7-PART HIGH-TECH WIRELESS EARBUDS CASE ---
        // Part 1: Case Bottom Pod Base
        const caseBaseGeo = new THREE.CylinderGeometry(0.7, 0.65, 0.5, 36);
        caseBaseGeo.scale(1.2, 1, 0.8);
        const caseMat = new THREE.MeshStandardMaterial({
          color: finish === 'stealth_matte' ? 0x141622 : primaryColor,
          roughness,
          metalness,
        });
        const caseBase = new THREE.Mesh(caseBaseGeo, caseMat);
        caseBase.position.y = 0.35;
        caseBase.castShadow = true;
        productRoot.add(caseBase);

        // Part 2: Open Lid Swung Open
        const lidGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.4, 36);
        lidGeo.scale(1.2, 1, 0.8);
        const lid = new THREE.Mesh(lidGeo, caseMat);
        lid.position.set(0, 0.8, -0.4);
        lid.rotation.x = -Math.PI / 3;
        lid.castShadow = true;
        productRoot.add(lid);

        // Part 3: Inner Matte Compartment
        const innerGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.1, 32);
        innerGeo.scale(1.15, 1, 0.75);
        const innerMat = new THREE.MeshStandardMaterial({
          color: 0x0a0c16,
          roughness: 0.9,
          metalness: 0.2,
        });
        const inner = new THREE.Mesh(innerGeo, innerMat);
        inner.position.y = 0.58;
        productRoot.add(inner);

        // Part 4: Left Earbud Stem & Head
        const earbudMat = new THREE.MeshStandardMaterial({
          color: finish === 'luxury_gold' ? 0x222433 : primaryColor,
          roughness: 0.2,
          metalness: 0.5,
        });
        const budLeft = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.4, 16, 16), earbudMat);
        budLeft.position.set(-0.3, 0.75, 0);
        budLeft.rotation.z = 0.15;
        budLeft.castShadow = true;
        productRoot.add(budLeft);

        // Part 5: Right Earbud Stem & Head
        const budRight = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.4, 16, 16), earbudMat);
        budRight.position.set(0.3, 0.75, 0);
        budRight.rotation.z = -0.15;
        budRight.castShadow = true;
        productRoot.add(budRight);

        // Part 6: Metallic Charging Contacts & Trim Accent
        const trimGeo = new THREE.TorusGeometry(0.68, 0.02, 16, 36);
        trimGeo.scale(1.2, 0.8, 1);
        const trimMat = new THREE.MeshStandardMaterial({
          color: accentMetal,
          metalness: 0.95,
          roughness: 0.1,
        });
        const trim = new THREE.Mesh(trimGeo, trimMat);
        trim.position.y = 0.6;
        trim.rotation.x = Math.PI / 2;
        productRoot.add(trim);

        // Part 7: Glowing LED Status Light Strip
        const ledGeo = new THREE.BoxGeometry(0.2, 0.04, 0.05);
        const ledMat = new THREE.MeshBasicMaterial({
          color: finish === 'luxury_gold' ? 0xff9900 : 0x00e5ff,
        });
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(0, 0.4, 0.55);
        productRoot.add(led);
      } else {
        // --- 6-PART SMART HYDRATION TUMBLER ---
        // Part 1: Main Double-Wall Steel Body
        const tumblerGeo = new THREE.CylinderGeometry(0.48, 0.42, 2.0, 36);
        const tumblerMat = new THREE.MeshStandardMaterial({
          color: finish === 'stealth_matte' ? 0x181a26 : primaryColor,
          roughness: 0.4,
          metalness: 0.6,
        });
        const tumbler = new THREE.Mesh(tumblerGeo, tumblerMat);
        tumbler.position.y = 1.0;
        tumbler.castShadow = true;
        tumbler.receiveShadow = true;
        productRoot.add(tumbler);

        // Part 2: Textured Silicone Middle Grip
        const gripGeo = new THREE.CylinderGeometry(0.49, 0.47, 0.8, 32);
        const gripMat = new THREE.MeshStandardMaterial({
          color: finish === 'luxury_gold' ? 0x24283b : 0x0e101c,
          roughness: 0.95,
          metalness: 0.05,
        });
        const grip = new THREE.Mesh(gripGeo, gripMat);
        grip.position.y = 0.95;
        productRoot.add(grip);

        // Part 3: Beveled Screw Cap Collar
        const capGeo = new THREE.CylinderGeometry(0.44, 0.48, 0.35, 32);
        const capMat = new THREE.MeshStandardMaterial({
          color: accentMetal,
          roughness: 0.2,
          metalness: 0.9,
        });
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.y = 2.15;
        cap.castShadow = true;
        productRoot.add(cap);

        // Part 4: Heavy-Duty Carry Loop Handle
        const handleGeo = new THREE.TorusGeometry(0.22, 0.05, 16, 24);
        const handle = new THREE.Mesh(handleGeo, capMat);
        handle.position.set(0, 2.45, 0);
        handle.rotation.y = Math.PI / 4;
        productRoot.add(handle);

        // Part 5: Digital Temp LED Display Ring on Cap
        const dialGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 24);
        const dialMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
        const dial = new THREE.Mesh(dialGeo, dialMat);
        dial.position.set(0, 2.32, 0);
        productRoot.add(dial);

        // Part 6: Laser-Etched Logo Badge
        const badgeGeo = new THREE.PlaneGeometry(0.25, 0.4);
        const badgeMat = new THREE.MeshStandardMaterial({
          color: accentMetal,
          roughness: 0.3,
          metalness: 0.8,
        });
        const badge = new THREE.Mesh(badgeGeo, badgeMat);
        badge.position.set(0, 1.5, 0.49);
        productRoot.add(badge);
      }
    }

    // Build initial product
    rebuildProduct(selectedProduct, selectedFinish);

    // Mouse / Pointer Interaction for Free Orbiting
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotX = 0;
    let rotY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      rotY += deltaX * 0.008;
      rotX += deltaY * 0.005;
      rotX = Math.max(-0.4, Math.min(0.6, rotX));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Camera target positions for presets
    const targetCamPos = new THREE.Vector3(0, 1.8, 3.8);
    const targetCamLook = new THREE.Vector3(0, 1.0, 0);

    // Animation Loop with Exponential Damping
    let frameId = 0;
    let lastTime = performance.now();

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const currentState = stateRef.current;

      // Update Camera Targets based on preset
      if (currentState.cameraPreset === 'hero') {
        targetCamPos.set(0, 1.7, 3.6);
        targetCamLook.set(0, 0.9, 0);
      } else if (currentState.cameraPreset === 'front') {
        targetCamPos.set(0, 1.2, 3.2);
        targetCamLook.set(0, 1.0, 0);
      } else if (currentState.cameraPreset === 'macro') {
        targetCamPos.set(0, 1.6, 1.8);
        targetCamLook.set(0, 1.5, 0);
      } else if (currentState.cameraPreset === 'top') {
        targetCamPos.set(0, 3.6, 1.8);
        targetCamLook.set(0, 0.8, 0);
      }

      // Smooth Camera Damping
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPos.x, 3.5, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPos.y, 3.5, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPos.z, 3.5, dt);
      camera.lookAt(targetCamLook);

      // Auto Rotation when not dragging
      if (currentState.isAutoRotating && !isDragging) {
        rotY += dt * 0.45;
      }

      // Smooth product rotation
      productRoot.rotation.y = THREE.MathUtils.damp(productRoot.rotation.y, rotY, 8.0, dt);
      productRoot.rotation.x = THREE.MathUtils.damp(productRoot.rotation.x, rotX, 8.0, dt);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Watch for product/finish updates to rebuild 3D model
    const watcher = () => {
      rebuildProduct(stateRef.current.selectedProduct, stateRef.current.selectedFinish);
    };
    (container as any).__rebuild = watcher;

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Trigger 3D mesh rebuild when product or finish state changes
  useEffect(() => {
    if (mountRef.current && (mountRef.current as any).__rebuild) {
      (mountRef.current as any).__rebuild();
    }
  }, [selectedProduct, selectedFinish]);

  const handleLaunchVideoGen = () => {
    let prompt = '';
    let name = '';
    if (selectedProduct === 'skincare_bottle') {
      name = 'سيروم نضارة البشرة العضوي';
      prompt =
        'High quality vertical 9:16 authentic TikTok UGC video ad. An elegant creator holds and applies luxury radiance serum from a glass dropper bottle, glowing radiant skin in morning daylight, showing the amber droplet, ecstatic expression, high conversion product ad style.';
    } else if (selectedProduct === 'earbuds_case') {
      name = 'سماعات بلوتوث ذكية مع شاحن LED';
      prompt =
        'High quality vertical 9:16 tech UGC review video. Modern content creator unboxes wireless earbuds with glowing LED case, tests active noise cancellation in a cozy studio setting, nodding happily to high fidelity bass, commercial TikTok ad.';
    } else {
      name = 'زجاجة ترطيب ذكية عازلة للحرارة';
      prompt =
        'High quality vertical 9:16 fitness UGC video ad. Athletic creator drinks from an insulated matte black smart hydration bottle at the gym, checking digital temperature display on the cap, energetic and motivational product testimonial.';
    }

    onGenerateVideoFrom3D(prompt, name);
  };

  return (
    <div className="relative w-full h-[620px] rounded-3xl overflow-hidden bg-[#0a0c16] border border-indigo-500/20 shadow-2xl">
      {/* 3D Canvas Isolated Ref Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header Badge & Spec (Quiet, unboxed) */}
      <div className="absolute top-4 right-4 z-10 text-right pointer-events-none">
        <div className="inline-flex items-center gap-2 bg-[#121528]/80 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-bold text-white shadow-lg">
          <Sparkles className="h-3.5 w-3.5 text-orange-400" />
          <span>استوديو Creovo الافتراضي ثلاثي الأبعاد (Three.js 3D Studio)</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          اسحب بالماوس لتدوير المنتج بزاوية 360 درجة، وتحكم في الإضاءة والخامات
        </p>
      </div>

      {/* Unified Bottom Control Dock (<= 15% Viewport footprint, zero occlusion) */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-3xl transition-transform duration-300 ${
          isControlsCollapsed ? 'translate-y-[82%]' : 'translate-y-0'
        }`}
      >
        {/* Collapse / Expand Toggle Button */}
        <div className="flex justify-center mb-1">
          <button
            onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161a33] border border-white/15 text-[11px] font-bold text-slate-300 hover:text-white transition-all shadow-md cursor-pointer"
          >
            {isControlsCollapsed ? (
              <>
                <Eye className="h-3 w-3 text-indigo-400" />
                <span>إظهار لوحة تحكم الاستوديو</span>
              </>
            ) : (
              <>
                <EyeOff className="h-3 w-3 text-slate-400" />
                <span>إخفاء اللوحة (وضع السينما)</span>
              </>
            )}
          </button>
        </div>

        {/* Dock Surface */}
        <div className="rounded-2xl bg-[#14172c] border border-white/15 p-4 shadow-2xl text-right">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Products Selector */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1">المنتج:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'skincare_bottle', label: 'سيروم عناية' },
                  { id: 'earbuds_case', label: 'سماعات ذكية' },
                  { id: 'smart_tumbler', label: 'زجاجة رياضية' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p.id as ProductType3D)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedProduct === p.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white/5 text-slate-300 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Material Finish */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1">الخامة والإضاءة:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'luxury_gold', label: 'ذهبي فاخر' },
                  { id: 'stealth_matte', label: 'أسود مطفي' },
                  { id: 'pearl_white', label: 'لؤلؤي نقي' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFinish(f.id as MaterialFinish)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedFinish === f.id
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-white/5 text-slate-300 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Camera Presets & Auto Rotate */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1">زاوية الكاميرا:</span>
              <div className="flex items-center gap-1">
                {[
                  { id: 'hero', label: '45° Hero' },
                  { id: 'front', label: 'أمامية' },
                  { id: 'macro', label: 'Macro' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCameraPreset(c.id as any)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      cameraPreset === c.id
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
                <button
                  onClick={() => setIsAutoRotating(!isAutoRotating)}
                  title="دوران تلقائي"
                  className={`p-1.5 rounded-lg text-xs border ${
                    isAutoRotating
                      ? 'border-indigo-500 text-indigo-300 bg-indigo-500/20'
                      : 'border-white/10 text-slate-400'
                  }`}
                >
                  <RotateCcw className={`h-3.5 w-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Direct Action: Generate Real Video from 3D Model */}
            <div className="pt-2 sm:pt-0 sm:border-r sm:border-white/10 sm:pr-4">
              <button
                onClick={handleLaunchVideoGen}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-xs font-extrabold text-slate-950 shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Video className="h-4 w-4" />
                <span>توليد فيديو إعلاني حقيقي بالـ AI</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
