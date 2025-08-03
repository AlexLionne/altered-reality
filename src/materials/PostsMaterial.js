import React from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

const PostsMaterialModel = ({ imageUrl }) => {
    const texture = useLoader(THREE.TextureLoader, imageUrl);

    return (
        <mesh>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
    );
};

export default PostsMaterialModel;