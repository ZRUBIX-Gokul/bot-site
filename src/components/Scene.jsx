"use client";

import React, { Suspense } from "react";
import { Environment, ContactShadows, useFBX } from "@react-three/drei";
import GltfCharacter from "./GltfCharacter";
import FbxCharacter from "./FbxCharacter";

export default function Scene({ action, characterRef }) {
  return (
    <>
      <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_08_1k.hdr" />

      <ambientLight intensity={0.5} color="#4466ff" />
      
      {/* Front Main Light */}
      <directionalLight position={[2, 5, 5]} intensity={2.5} color="#ffffff" castShadow />
      
      {/* Left Pink Fill Light */}
      <pointLight position={[-5, 2, -2]} intensity={5} color="#ff88cc" />
      
      {/* Right Cyan Backlight */}
      <pointLight position={[5, 2, -5]} intensity={5} color="#88bbff" />

      <group ref={characterRef} position={[-2.0, -1.0, 0]} rotation={[0, 1.5, 0]}>
        {action.type === "fbx" ? (
          <FbxCharacter url={action.value} />
        ) : (
          <GltfCharacter actionKey={action.type === "gltf" ? action.value : "idle"} />
        )}
      </group>

      <ContactShadows scale={10} blur={2.5} far={3} opacity={0.7} position={[0, -0.99, 0]} />

      <gridHelper args={[50, 50, "#ff88cc", "#223355"]} position={[0, -0.99, 0]} />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.0, 0]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#050510" roughness={0.4} metalness={0.8} />
      </mesh>

      <fog attach="fog" args={["#050505", 5, 20]} />
    </>
  );
}

if (typeof window !== "undefined") {
  useFBX.preload("/Praying.fbx");
  useFBX.preload("/ShakingHands.fbx");
}
