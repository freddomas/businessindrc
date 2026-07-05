"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function CommandScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05080d, 0.045);

    const camera = new THREE.PerspectiveCamera(38, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 1.15, 7.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x8bc6ff, 0.85));
    const keyLight = new THREE.PointLight(0x29e0c6, 3.8, 16);
    keyLight.position.set(-3.8, 4.5, 5);
    scene.add(keyLight);

    const group = new THREE.Group();
    scene.add(group);

    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x10242d,
      emissive: 0x0a4d52,
      metalness: 0.85,
      roughness: 0.24
    });
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0xc99748,
      emissive: 0x2b1a05,
      metalness: 0.72,
      roughness: 0.2
    });

    const ringGeometry = new THREE.TorusGeometry(1.25, 0.018, 12, 96);
    for (let index = 0; index < 5; index += 1) {
      const ring = new THREE.Mesh(ringGeometry, index % 2 === 0 ? ringMaterial : accentMaterial);
      ring.rotation.x = Math.PI / 2.8 + index * 0.28;
      ring.rotation.y = index * 0.62;
      ring.position.z = -index * 0.32;
      ring.scale.setScalar(1 + index * 0.28);
      group.add(ring);
    }

    const pointGeometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    for (let index = 0; index < 150; index += 1) {
      const angle = index * 0.72;
      const radius = 0.65 + (index % 13) * 0.12;
      positions.push(Math.cos(angle) * radius, ((index % 17) - 8) * 0.075, Math.sin(angle) * radius - 1.8);
    }
    pointGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const points = new THREE.Points(
      pointGeometry,
      new THREE.PointsMaterial({ color: 0x5fffe2, size: 0.026, transparent: true, opacity: 0.82 })
    );
    group.add(points);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xd7a954, transparent: true, opacity: 0.52 });
    for (let lane = 0; lane < 6; lane += 1) {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-2.9 + lane * 0.18, -1.35 + lane * 0.05, 0.6),
        new THREE.Vector3(-0.55 + lane * 0.2, -0.35 + lane * 0.04, -0.95),
        new THREE.Vector3(2.55 - lane * 0.08, 0.55 - lane * 0.02, -2.9)
      ]);
      group.add(new THREE.Line(geometry, lineMaterial));
    }

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let animationFrame: number | null = null;

    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.55;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.45;
    };

    const resize = () => {
      if (!mount.clientWidth || !mount.clientHeight) {
        return;
      }
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.render(scene, camera);
    };

    const animate = () => {
      frame += 0.01;
      group.rotation.y += (pointerX - group.rotation.y) * 0.035;
      group.rotation.x += (-pointerY - group.rotation.x) * 0.03;
      points.rotation.y = frame * 0.22;
      group.position.y = Math.sin(frame * 0.8) * 0.06;
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };

    mount.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", resize);
    renderer.render(scene, camera);

    if (!prefersReducedMotion) {
      animationFrame = window.requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
      mount.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
      ringGeometry.dispose();
      pointGeometry.dispose();
      ringMaterial.dispose();
      accentMaterial.dispose();
      lineMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="command-scene" ref={mountRef} aria-hidden="true" />;
}
