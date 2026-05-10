"use client";

import { useEffect, useRef } from "react";
import { useFBX, useAnimations } from "@react-three/drei";
import * as THREE from "three";

export default function FbxCharacter({ url, visible = true }) {
  const group = useRef();
  const fbx = useFBX(url);
  const animations = fbx.animations || [];
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    fbx.traverse((child) => {
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
  }, [fbx]);

  useEffect(() => {
    if (names.length > 0) {
      const action = actions[names[0]];
      action.reset().fadeIn(0.3).play();

      return () => {
        action.fadeOut(0.3);
      };
    }
  }, [url, actions, names]);

  return <primitive ref={group} object={fbx} scale={0.01} visible={visible} />;
}
