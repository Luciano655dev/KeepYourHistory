"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ClosedBookScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000);
    camera.position.set(1, 3, 12);
    camera.lookAt(0, 0.08, 1.30);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xf8f0e6, 1.7));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(5, 6, 8);
    scene.add(keyLight);

    const warmLight = new THREE.DirectionalLight(0xe5bc8f, 1.05);
    warmLight.position.set(-5, 3, 6);
    scene.add(warmLight);

    const rimLight = new THREE.DirectionalLight(0xfffbf3, 0.9);
    rimLight.position.set(-2, 1, -6);
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
        color: 0x685543,
        transparent: true,
        opacity: 0.34,
        depthWrite: false,
      }),
    );

    const addOutline = (
      mesh: THREE.Object3D,
      geometry: THREE.BufferGeometry,
      threshold = 1,
      scale = 1.002,
    ) => {
      const outlineGeometry = registerGeometry(
        new THREE.EdgesGeometry(geometry, threshold),
      );
      const outline = new THREE.LineSegments(outlineGeometry, outlineMaterial);
      outline.renderOrder = 2;
      outline.scale.setScalar(scale);
      mesh.add(outline);
    };

    const coverFaceMaterial = registerMaterial(
      new THREE.MeshStandardMaterial({
        color: 0xc39059,
        roughness: 0.92,
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
        roughness: 1,
        flatShading: true,
      }),
    );

    const pageEdgeMaterial = registerMaterial(
      new THREE.MeshStandardMaterial({
        color: 0xe4d1b8,
        roughness: 1,
        flatShading: true,
      }),
    );

    const spineMaterial = registerMaterial(
      new THREE.MeshStandardMaterial({
        color: 0x996d45,
        roughness: 1,
        flatShading: true,
      }),
    );

    const detailMaterial = registerMaterial(
      new THREE.MeshStandardMaterial({
        color: 0xe8d6bb,
        roughness: 0.96,
        flatShading: true,
      }),
    );

    const emblemMaterial = registerMaterial(
      new THREE.MeshStandardMaterial({
        color: 0xf2e7d0,
        roughness: 0.88,
        flatShading: true,
      }),
    );

    const shadowMaterial = registerMaterial(
      new THREE.MeshBasicMaterial({
        color: 0xd0af87,
        transparent: true,
        opacity: 0.18,
      }),
    );

    const coverGeometry = registerGeometry(new THREE.BoxGeometry(3.45, 4.7, 0.24));
    const pageBlockGeometry = registerGeometry(new THREE.BoxGeometry(3.12, 4.34, 0.46));
    const spineGeometry = registerGeometry(new THREE.BoxGeometry(0.28, 4.62, 0.5));
    const spineRoundGeometry = registerGeometry(
      new THREE.CylinderGeometry(0.14, 0.14, 4.6, 6),
    );
    const titlePlateGeometry = registerGeometry(
      new THREE.BoxGeometry(1.18, 1.54, 0.04),
    );
    const bandGeometry = registerGeometry(new THREE.BoxGeometry(1.58, 0.22, 0.03));
    const emblemGeometry = registerGeometry(new THREE.OctahedronGeometry(0.22, 0));
    const shadowGeometry = registerGeometry(new THREE.CircleGeometry(3.1, 10));

    const coverMaterials = [
      coverEdgeMaterial,
      coverEdgeMaterial,
      coverEdgeMaterial,
      coverEdgeMaterial,
      coverFaceMaterial,
      coverEdgeMaterial,
    ];

    const pageMaterials = [
      pageEdgeMaterial,
      pageEdgeMaterial,
      pageEdgeMaterial,
      pageEdgeMaterial,
      pageFaceMaterial,
      pageEdgeMaterial,
    ];

    const hoverRig = new THREE.Group();
    hoverRig.position.set(-0.28, -0.02, 0);
    scene.add(hoverRig);

    const book = new THREE.Group();
    book.position.set(0, -0.2, 0.2);
    book.rotation.set(-0.12, -0.26, 0.03);
    book.scale.setScalar(1);
    hoverRig.add(book);

    const bottomCover = new THREE.Mesh(coverGeometry, coverMaterials);
    bottomCover.position.set(0, 0, -0.13);
    book.add(bottomCover);
    addOutline(bottomCover, coverGeometry);

    const pageBlock = new THREE.Mesh(pageBlockGeometry, pageMaterials);
    pageBlock.position.set(0.1, -0.02, 0.03);
    book.add(pageBlock);
    addOutline(pageBlock, pageBlockGeometry);

    const topCoverGroup = new THREE.Group();
    topCoverGroup.position.set(-1.44, 0, 0.19);
    topCoverGroup.rotation.y = -0.18;
    book.add(topCoverGroup);

    const topCover = new THREE.Mesh(coverGeometry, coverMaterials);
    topCover.position.set(1.44, 0, 0);
    topCoverGroup.add(topCover);
    addOutline(topCover, coverGeometry);

    const spine = new THREE.Mesh(spineGeometry, spineMaterial);
    spine.position.set(-1.44, 0, 0.02);
    book.add(spine);
    addOutline(spine, spineGeometry);


    const resize = () => {
      const { clientWidth, clientHeight } = container;
      if (clientWidth === 0 || clientHeight === 0) {
        return;
      }

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
      const elapsed = timer.getElapsed();

      hoverRig.position.x = -0.28 + Math.sin(elapsed * 0.38) * 0.05;
      hoverRig.position.y = -0.02 + Math.sin(elapsed * 0.8) * 0.1;
      book.rotation.x = -0.12 + Math.sin(elapsed * 0.72) * 0.03;
      book.rotation.y = -0.26 + Math.sin(elapsed * 0.56) * 0.08;
      book.rotation.z = 0.03 + Math.sin(elapsed * 0.64) * 0.02;
      topCoverGroup.rotation.y = -0.18 + Math.sin(elapsed * 0.95) * 0.035;

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
