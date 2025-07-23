import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import {MeshStandardMaterial} from "three";

export function Sw(props) {
    const { nodes, materials } = useGLTF('/untitled.glb')
    return (
        <group {...props} dispose={null}>
            <ambientLight intensity={10} />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Beanie_Outfit_V01.geometry}
                material={new MeshStandardMaterial({color: '0xffffff', roughness: 1, metalness:0})}
                rotation={[Math.PI / 2, 0, 0]}
                position={[0, -10.7, 0]}
                scale={0.006}
            />
        </group>
    )
}

useGLTF.preload('/untitled.glb')
