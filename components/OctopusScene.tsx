"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const nodes = [
  { x: -2.8, y: 0.9, z: 0, label: "Kolwezi" },
  { x: -1.3, y: -0.7, z: 0, label: "Fungurume" },
  { x: 0.1, y: 0.5, z: 0, label: "Likasi" },
  { x: 1.5, y: -0.2, z: 0, label: "Lubumbashi" },
  { x: 2.7, y: 0.8, z: 0, label: "Kasumbalesa" }
];

export function OctopusScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.15, 7.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const copper = new THREE.Color("#c79d5d");
    const teal = new THREE.Color("#68d8c2");
    const graphite = new THREE.Color("#142032");

    const plane = new THREE.Mesh(
      new THREE.CircleGeometry(3.25, 96),
      new THREE.MeshBasicMaterial({
        color: graphite,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide
      })
    );
    plane.scale.y = 0.55;
    group.add(plane);

    const ringMaterial = new THREE.LineBasicMaterial({ color: copper, transparent: true, opacity: 0.48 });
    for (const radius of [1.2, 2.05, 2.85]) {
      const curve = new THREE.EllipseCurve(0, 0, radius, radius * 0.55);
      const points = curve.getPoints(120).map((point) => new THREE.Vector3(point.x, point.y, 0.02));
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), ringMaterial));
    }

    const center = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 32, 32),
      new THREE.MeshBasicMaterial({ color: copper })
    );
    center.position.z = 0.05;
    group.add(center);

    const pulse = new THREE.Mesh(
      new THREE.RingGeometry(0.24, 0.3, 48),
      new THREE.MeshBasicMaterial({ color: teal, transparent: true, opacity: 0.55, side: THREE.DoubleSide })
    );
    pulse.position.z = 0.06;
    group.add(pulse);

    const pointMaterial = new THREE.MeshBasicMaterial({ color: "#f4d38a" });
    const lineMaterial = new THREE.LineBasicMaterial({ color: teal, transparent: true, opacity: 0.42 });
    nodes.forEach((node) => {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.08, 24, 24), pointMaterial);
      dot.position.set(node.x, node.y, 0.08);
      group.add(dot);

      const points = [new THREE.Vector3(0, 0, 0.04), new THREE.Vector3(node.x, node.y, 0.04)];
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMaterial));
    });

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(280, rect.width);
      const height = Math.max(260, rect.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    let frame = 0;
    let animationId = 0;
    const render = () => {
      frame += 1;
      if (!prefersReducedMotion) {
        group.rotation.z = Math.sin(frame / 220) * 0.035;
        pulse.scale.setScalar(1 + Math.sin(frame / 34) * 0.12);
        pulse.material.opacity = 0.35 + Math.sin(frame / 28) * 0.16;
      }
      renderer.render(scene, camera);
      animationId = window.requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationId);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      scene.clear();
    };
  }, []);

  return (
    <div className="octopus-scene" ref={mountRef}>
      <div className="scene-labels" aria-hidden="true">
        {nodes.map((node) => (
          <span key={node.label}>{node.label}</span>
        ))}
      </div>
    </div>
  );
}
