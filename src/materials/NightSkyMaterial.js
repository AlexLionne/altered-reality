import { ShaderMaterial, Vector2 } from 'three'

export default class extends ShaderMaterial {
    constructor() {
        super({
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new Vector2() },
                uParticleCount: { value: 100 },
                uSize: { value: 2.0 },
                uSpeed: { value: 0.2 },
                uOpacity: { value: 0.3 },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                }
            `,
            fragmentShader: `
                precision highp float;
                uniform float uTime;
                uniform vec2 uResolution;
                uniform float uParticleCount;
                uniform float uSize;
                uniform float uSpeed;
                uniform float uOpacity;
                varying vec2 vUv;

                float rand(vec2 co) {
                    return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
                }

                void main() {
                    vec2 uv = gl_FragCoord.xy / uResolution;

                    float alpha = 0.0;
                    for (float i = 0.0; i < 100.0; i++) {
                        if (i >= uParticleCount) break;
                        float id = i / uParticleCount;
                        vec2 seed = vec2(id, id * 0.73);
                        vec2 pos = vec2(rand(seed * 1.3), rand(seed * 8.5));
                        pos.y += fract(uTime * uSpeed + id * 10.0); // mouvement vertical

                        float d = length(uv - fract(pos));
                        alpha += smoothstep(uSize / uResolution.x, 0.0, d);
                    }

                    gl_FragColor = vec4(vec3(1.0), alpha * uOpacity);
                }
            `,
            transparent: false,
            depthWrite: false
        })
    }
}
