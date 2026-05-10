"use client";

import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

export default function GltfCharacter({ actionKey = "idle", visible = true }) {
  const group = useRef();
  const { scene, animations } = useGLTF(
    "https://threejs.org/examples/models/gltf/Xbot.glb"
  );
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = new THREE.MeshStandardMaterial({
          color: "#aaaaaa",
          roughness: 0.4,
          metalness: 0.6,
        });
      }
    });
  }, [scene]);

  useEffect(() => {
    if (actions && actions[actionKey]) {
      const action = actions[actionKey];
      action.reset().fadeIn(0.3).play();

      return () => {
        action.fadeOut(0.3);
      };
    }
  }, [actionKey, actions]);

  return <primitive ref={group} object={scene} visible={visible} />;
}

useGLTF.preload("https://threejs.org/examples/models/gltf/Xbot.glb");
