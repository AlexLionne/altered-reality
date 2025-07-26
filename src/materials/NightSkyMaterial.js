import { ShaderMaterial } from "three";
import * as THREE from "three";

export default class extends ShaderMaterial {
    constructor() {
        super({
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new THREE.Vector2() }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform vec2 uResolution;
                varying vec2 vUv;

                float rand(vec2 co){
                    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
                }

                void main() {
                    vec2 uv = vUv;
                    float stars = 0.0;

                    for (int i = 0; i < 100; i++) {
                        vec2 seed = vec2(float(i) * 0.01, float(i) * 0.013);
                        vec2 pos = fract(seed + uTime * 0.01);
                        float d = distance(uv, pos);
                        stars += smoothstep(0.01, 0.001, d);
                    }

                    vec3 col = mix(vec3(0.02, 0.02, 0.05), vec3(1.0), stars);
                    gl_FragColor = vec4(col, 1.0);
                }
            `,
            side: THREE.DoubleSide
        });
    }
}
