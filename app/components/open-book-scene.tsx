"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type PageDirection = -1 | 1;

function getPagePoint(
  x: number,
  y: number,
  width: number,
  height: number,
  direction: PageDirection,
  edgeLift: number,
  centerBend: number,
  lateralPull = 0.12,
  spineDepth = 0.04,
) {
  const normalizedX = x / (width / 2);
  const normalizedY = y / (height / 2);
  const outerWeight = THREE.MathUtils.clamp(
    (normalizedX * direction + 1) / 2,
    0,
    1,
  );
  const spineWeight = 1 - outerWeight;
  const heightWeight = 1 - Math.abs(normalizedY);

  return new THREE.Vector3(
    x + direction * heightWeight * lateralPull,
    y,
    outerWeight * edgeLift + heightWeight * centerBend - spineWeight * spineDepth,
  );
}

function createPageSurface(
  width: number,
  height: number,
  direction: PageDirection,
  edgeLift: number,
  centerBend: number,
  xSegments = 9,
  ySegments = 6,
  lateralPull = 0.12,
  spineDepth = 0.04,
) {
  const geometry = new THREE.PlaneGeometry(width, height, xSegments, ySegments);
  const positions = geometry.attributes.position;

  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const y = positions.getY(index);
    const point = getPagePoint(
      x,
      y,
      width,
      height,
      direction,
      edgeLift,
      centerBend,
      lateralPull,
      spineDepth,
    );

    positions.setX(index, point.x);
    positions.setZ(index, point.z);
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function createPageOutlinePoints(
  width: number,
  height: number,
  direction: PageDirection,
  edgeLift: number,
  centerBend: number,
  xSegments = 6,
  ySegments = 5,
  lateralPull = 0.12,
  spineDepth = 0.04,
) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const points: THREE.Vector3[] = [];

  for (let xIndex = 0; xIndex <= xSegments; xIndex += 1) {
    const x = -halfWidth + (width / xSegments) * xIndex;
    points.push(
      getPagePoint(
        x,
        halfHeight,
        width,
        height,
        direction,
        edgeLift,
        centerBend,
        lateralPull,
        spineDepth,
      ),
    );
  }

  for (let yIndex = 1; yIndex <= ySegments; yIndex += 1) {
    const y = halfHeight - (height / ySegments) * yIndex;
    points.push(
      getPagePoint(
        halfWidth,
        y,
        width,
        height,
        direction,
        edgeLift,
        centerBend,
        lateralPull,
        spineDepth,
      ),
    );
  }

  for (let xIndex = xSegments - 1; xIndex >= 0; xIndex -= 1) {
    const x = -halfWidth + (width / xSegments) * xIndex;
    points.push(
      getPagePoint(
        x,
        -halfHeight,
        width,
        height,
        direction,
        edgeLift,
        centerBend,
        lateralPull,
        spineDepth,
      ),
    );
  }

  for (let yIndex = ySegments - 1; yIndex >= 1; yIndex -= 1) {
    const y = halfHeight - (height / ySegments) * yIndex;
    points.push(
      getPagePoint(
        -halfWidth,
        y,
        width,
        height,
        direction,
        edgeLift,
        centerBend,
        lateralPull,
        spineDepth,
      ),
    );
  }

  return points;
}

export function OpenBookScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(27, 1, 0.1, 100);
    camera.position.set(0, 2.3, 16.2);
    camera.lookAt(0, -0.12, 0.18);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xf9f2e9, 1.8));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(7, 9, 7);
    scene.add(keyLight);

    const warmLight = new THREE.DirectionalLight(0xe7bd8a, 1.1);
    warmLight.position.set(-8, 4, 5);
    scene.add(warmLight);

    const rimLight = new THREE.DirectionalLight(0xfffbf3, 0.75);
    rimLight.position.set(2, 1, -7);
    scene.add(rimLight);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    const registerGeometry = <T extends THREE.BufferGeometry>(geometry: T) => {
      geometries.push(geometry);
      return geometry;
    };

    const registerMaterial = <T extends THREE.Material>(material: T) => {
      materials.push(material);
      return material;
    };

    const outlineMaterial = registerMaterial(
      new THREE.LineBasicMaterial({
        color: 0x6f675e,
        transparent: true,
        opacity: 0.24,
        depthWrite: false,
      }),
    );

    const addOutline = (
      mesh: THREE.Object3D,
      geometry: THREE.BufferGeometry,
      scale = 1.002,
    ) => {
      const outlineGeometry = registerGeometry(
        new THREE.EdgesGeometry(geometry, 1),
      );

      const outline = new THREE.LineSegments(outlineGeometry, outlineMaterial);
      outline.renderOrder = 2;
      outline.scale.setScalar(scale);
      mesh.add(outline);
    };

    const addLoopOutline = (
      mesh: THREE.Object3D,
      points: THREE.Vector3[],
      scale = 1.001,
    ) => {
      const outlineGeometry = registerGeometry(
        new THREE.BufferGeometry().setFromPoints(points),
      );
      const outline = new THREE.LineLoop(outlineGeometry, outlineMaterial);
      outline.renderOrder = 2;
      outline.scale.setScalar(scale);
      mesh.add(outline);
    };

    const coverFaceMaterial = registerMaterial(
      new THREE.MeshStandardMaterial({
        color: 0xc39059,
        roughness: 0.94,
        flatShading: true,
      }),
    );

    const coverEdgeMaterial = registerMaterial(
      new THREE.MeshStandardMaterial({
        color: 0x8d613a,
        roughness: 0.98,
        flatShading: true,
      }),
    );

    const pageFaceMaterial = registerMaterial(
      new THREE.MeshStandardMaterial({
        color: 0xfff7ea,
        roughness: 0.96,
        flatShading: false,
        side: THREE.DoubleSide,
      }),
    );

    const pageEdgeMaterial = registerMaterial(
      new THREE.MeshStandardMaterial({
        color: 0xe5d2bb,
        roughness: 1,
        flatShading: true,
      }),
    );

    const pageAccentMaterial = registerMaterial(
      new THREE.MeshStandardMaterial({
        color: 0xd9c0a3,
        roughness: 1,
        flatShading: true,
      }),
    );

    const spineMaterial = registerMaterial(
      new THREE.MeshStandardMaterial({
        color: 0x9d7046,
        roughness: 1,
        flatShading: true,
      }),
    );

    const creaseMaterial = registerMaterial(
      new THREE.MeshBasicMaterial({
        color: 0xb98c61,
        transparent: true,
        opacity: 0.26,
        side: THREE.DoubleSide,
      }),
    );

    const coverGeometry = registerGeometry(new THREE.BoxGeometry(4.48, 5.78, 0.22));
    const pageBlockGeometry = registerGeometry(
      new THREE.BoxGeometry(4.12, 5.4, 0.42),
    );
    const foreEdgeGeometry = registerGeometry(
      new THREE.BoxGeometry(0.1, 5.5, 0.43),
    );
    const spineGeometry = registerGeometry(new THREE.BoxGeometry(0.34, 5.72, 0.32));
    const spineRoundGeometry = registerGeometry(
      new THREE.CylinderGeometry(0.17, 0.17, 5.64, 6),
    );
    const gutterGeometry = registerGeometry(new THREE.PlaneGeometry(0.28, 5.1));
    const pageWidth = 4.02;
    const pageHeight = 5.22;
    const pageHalfWidth = pageWidth / 2;
    const pageHalfHeight = pageHeight / 2;
    const hingeOffset = 0.05;
    const coverMaterials = [
      coverEdgeMaterial,
      coverEdgeMaterial,
      coverEdgeMaterial,
      coverEdgeMaterial,
      coverFaceMaterial,
      coverEdgeMaterial,
    ];

    const pageBlockMaterials = [
      pageEdgeMaterial,
      pageEdgeMaterial,
      pageEdgeMaterial,
      pageEdgeMaterial,
      pageFaceMaterial,
      pageEdgeMaterial,
    ];

    const book = new THREE.Group();
    book.position.set(0, 0, 1);
    book.rotation.set(-1, 0, 0);
    scene.add(book);

    const cameraBaseX = 0;
    const cameraLookAtX = -0.35;
    const cameraBaseZ = 15;
    const bookBaseScale = 0.7;

    const leftHalf = new THREE.Group();
    const rightHalf = new THREE.Group();
    leftHalf.rotation.y = 10;
    rightHalf.rotation.y = -0.84;
    book.add(leftHalf);
    book.add(rightHalf);

    const leftCover = new THREE.Mesh(coverGeometry, coverMaterials);
    leftCover.position.set(-2.24, 0, -0.05);
    leftHalf.add(leftCover);

    const rightCover = new THREE.Mesh(coverGeometry, coverMaterials);
    rightCover.position.set(2.24, 0, -0.05);
    rightHalf.add(rightCover);

    const leftPages = new THREE.Mesh(pageBlockGeometry, pageBlockMaterials);
    leftPages.position.set(-2.02, 0, 0.15);
    leftHalf.add(leftPages);
    addOutline(leftPages, pageBlockGeometry);

    const rightPages = new THREE.Mesh(pageBlockGeometry, pageBlockMaterials);
    rightPages.position.set(2.02, 0, 0.15);
    rightHalf.add(rightPages);
    addOutline(rightPages, pageBlockGeometry);

    const leftForeEdge = new THREE.Mesh(foreEdgeGeometry, pageAccentMaterial);
    leftForeEdge.position.set(-4.12, 0, 0.15);
    leftHalf.add(leftForeEdge);

    const rightForeEdge = new THREE.Mesh(foreEdgeGeometry, pageAccentMaterial);
    rightForeEdge.position.set(4.12, 0, 0.15);
    rightHalf.add(rightForeEdge);

    const layeredPages: Array<{
      direction: PageDirection;
      mesh: THREE.Mesh;
      baseRotationZ: number;
      swayAmplitude: number;
      swayFrequency: number;
      swayPhase: number;
      anchorDepthOffset: number;
      sharedAnchor: THREE.Vector3;
      scaledSpineBottomLocal: THREE.Vector3;
    }> = [];
    const pageRotationAxis = new THREE.Vector3(0, 0, 1);

    const addVisibleSheets = (
      half: THREE.Group,
      direction: PageDirection,
    ) => {
      const spineX = direction === -1 ? pageHalfWidth : -pageHalfWidth;
      const configs = [
        {
          scale: 1,
          x: pageHalfWidth * 1 - hingeOffset,
          z: 0.456,
          rz: 0.032,
          swayAmplitude: 0.013,
          swayFrequency: 0.74,
          swayPhase: 0,
          anchorDepthOffset: 0,
          edgeLift: 0.18,
          centerBend: 0.075,
          lateralPull: 0.088,
          spineDepth: 0.036,
          color: 0xfff9ef,
          roughness: 0.95,
        },
        {
          scale: 0.978,
          x: pageHalfWidth * 0.978 - hingeOffset,
          z: 0.488,
          rz: 0.086,
          swayAmplitude: 0.017,
          swayFrequency: 0.97,
          swayPhase: 0.6,
          anchorDepthOffset: 0.008,
          edgeLift: 0.22,
          centerBend: 0.093,
          lateralPull: 0.102,
          spineDepth: 0.038,
          color: 0xfcf4e5,
          roughness: 0.96,
        },
        {
          scale: 0.948,
          x: pageHalfWidth * 0.948 - hingeOffset,
          z: 0.518,
          rz: 0.138,
          swayAmplitude: 0.021,
          swayFrequency: 1.18,
          swayPhase: 1.2,
          anchorDepthOffset: 0.016,
          edgeLift: 0.26,
          centerBend: 0.113,
          lateralPull: 0.115,
          spineDepth: 0.041,
          color: 0xfaefd9,
          roughness: 0.97,
        },
        {
          scale: 0.915,
          x: pageHalfWidth * 0.915 - hingeOffset,
          z: 0.546,
          rz: 0.194,
          swayAmplitude: 0.025,
          swayFrequency: 1.42,
          swayPhase: 1.74,
          anchorDepthOffset: 0.024,
          edgeLift: 0.3,
          centerBend: 0.128,
          lateralPull: 0.126,
          spineDepth: 0.044,
          color: 0xf7e9d1,
          roughness: 0.98,
        },
      ];

      const firstConfig = configs[0];
      const firstSpineBottomLocal = getPagePoint(
        spineX,
        -pageHalfHeight,
        pageWidth,
        pageHeight,
        direction,
        firstConfig.edgeLift,
        firstConfig.centerBend,
        firstConfig.lateralPull,
        firstConfig.spineDepth,
      );
      const firstRotationZ = direction * firstConfig.rz;
      const sharedAnchor = new THREE.Vector3(
        direction * firstConfig.x,
        0,
        firstConfig.z,
      ).add(
        firstSpineBottomLocal
          .clone()
          .multiplyScalar(firstConfig.scale)
          .applyAxisAngle(pageRotationAxis, firstRotationZ),
      );

      for (const [index, config] of configs.entries()) {
        const sheetGeometry = registerGeometry(
          createPageSurface(
            pageWidth,
            pageHeight,
            direction,
            config.edgeLift,
            config.centerBend,
            9,
            6,
            config.lateralPull,
            config.spineDepth,
          ),
        );
        const sheetOutlinePoints = createPageOutlinePoints(
          pageWidth,
          pageHeight,
          direction,
          config.edgeLift,
          config.centerBend,
          6,
          5,
          config.lateralPull,
          config.spineDepth,
        );
        const sheetMaterial = registerMaterial(
          new THREE.MeshStandardMaterial({
            color: config.color,
            roughness: config.roughness,
            metalness: 0.01,
            flatShading: false,
            side: THREE.DoubleSide,
          }),
        );
        const sheet = new THREE.Mesh(sheetGeometry, sheetMaterial);
        const rotationZ = direction * config.rz;
        const spineBottomLocal = getPagePoint(
          spineX,
          -pageHalfHeight,
          pageWidth,
          pageHeight,
          direction,
          config.edgeLift,
          config.centerBend,
          config.lateralPull,
          config.spineDepth,
        );
        const scaledSpineBottomLocal = spineBottomLocal
          .clone()
          .multiplyScalar(config.scale);
        const centerFromAnchor = scaledSpineBottomLocal
          .clone()
          .applyAxisAngle(pageRotationAxis, rotationZ);
        const centerPosition = sharedAnchor
          .clone()
          .setZ(sharedAnchor.z + config.anchorDepthOffset)
          .sub(centerFromAnchor);

        sheet.position.copy(centerPosition);
        sheet.rotation.z = rotationZ;
        sheet.scale.setScalar(config.scale);
        sheet.renderOrder = 6 + index;
        half.add(sheet);
        addLoopOutline(sheet, sheetOutlinePoints, 1.001);
        layeredPages.push({
          direction,
          mesh: sheet,
          baseRotationZ: rotationZ,
          swayAmplitude: config.swayAmplitude,
          swayFrequency: config.swayFrequency,
          swayPhase: config.swayPhase,
          anchorDepthOffset: config.anchorDepthOffset,
          sharedAnchor: sharedAnchor.clone(),
          scaledSpineBottomLocal,
        });
      }
    };

    addVisibleSheets(leftHalf, -1);
    addVisibleSheets(rightHalf, 1);

    const spine = new THREE.Mesh(spineGeometry, spineMaterial);
    spine.position.set(0, 0, -0.08);
    book.add(spine);

    const spineRound = new THREE.Mesh(spineRoundGeometry, spineMaterial);
    spineRound.rotation.z = Math.PI / 2;
    spineRound.position.set(0, 0.02, 0);
    book.add(spineRound);

    const gutter = new THREE.Mesh(gutterGeometry, creaseMaterial);
    gutter.position.set(0, 0.03, 0.34);
    book.add(gutter);

    let canRender = false;
    const resize = () => {
      const { clientWidth, clientHeight } = container;
      if (clientWidth === 0 || clientHeight === 0) {
        canRender = false;
        return;
      }

      canRender = true;
      const area = clientWidth * clientHeight;
      const adaptivePixelRatio =
        area > 420_000 ? 1 : Math.min(window.devicePixelRatio, 1.25);
      renderer.setPixelRatio(adaptivePixelRatio);

      book.position.x = -0.08;
      book.scale.setScalar(bookBaseScale);
      camera.position.set(cameraBaseX, 2.3, cameraBaseZ);
      camera.lookAt(cameraLookAtX, -0.12, 0.18);

      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight, false);
    };

    resize();

    const timer = new THREE.Timer();
    timer.connect(document);
    timer.reset();

    let animationFrame = 0;
    const animate = (timestamp?: number) => {
      timer.update(timestamp);
      if (!canRender) {
        animationFrame = window.requestAnimationFrame(animate);
        return;
      }

      const elapsed = timer.getElapsed();

      book.position.y = -0.42 + Math.sin(elapsed * 0.48) * 0.045;
      book.rotation.z = Math.sin(elapsed * 0.34) * 0.012;
      book.rotation.y = Math.sin(elapsed * 0.26) * 0.015;
      leftHalf.rotation.y = 0.86 + Math.sin(elapsed * 0.58) * 0.018;
      rightHalf.rotation.y = -0.84 - Math.sin(elapsed * 0.58) * 0.015;

      const pageLift = (Math.sin(elapsed * 0.9) + 1) * 0.5;
      const anchorLiftZ = pageLift * 0.0065;

      for (const layer of layeredPages) {
        const pageSway = Math.sin(
          elapsed * layer.swayFrequency + layer.swayPhase,
        );
        const pageFlutter = Math.sin(
          elapsed * (layer.swayFrequency * 1.9) + layer.swayPhase * 1.6,
        );
        const layerRotationZ =
          layer.baseRotationZ +
          layer.direction *
            (pageSway * layer.swayAmplitude +
              pageFlutter * layer.swayAmplitude * 0.2);
        const centerFromAnchor = layer.scaledSpineBottomLocal
          .clone()
          .applyAxisAngle(pageRotationAxis, layerRotationZ);
        const centerPosition = layer.sharedAnchor
          .clone()
          .setZ(layer.sharedAnchor.z + layer.anchorDepthOffset + anchorLiftZ)
          .sub(centerFromAnchor);

        layer.mesh.rotation.z = layerRotationZ;
        layer.mesh.position.copy(centerPosition);
      }

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };

    animate();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      timer.dispose();
      renderer.dispose();
      scene.clear();

      for (const geometry of geometries) {
        geometry.dispose();
      }

      for (const material of materials) {
        material.dispose();
      }

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" aria-hidden="true" />;
}
