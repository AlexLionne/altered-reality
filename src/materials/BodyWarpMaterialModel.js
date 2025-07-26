import { ShaderMaterial } from "three";
import * as THREE from "three";

export default class extends ShaderMaterial {
    constructor() {
        super({
            uniforms: {
                uTime:             { value: 0 },
                uResolution:       { value: new THREE.Vector2() },
                uDisplacementX:    { value: 0 },
                uDisplacementY:    { value: 0 },
                uDeformAmplitude:  { value: 1.0 },
                uNoiseScale:       { value: 10 },
                uOpacity:          { value: 0.8 },
                uCartoonLevels:    { value: 4.0 },
                uBrightness:       { value: 0.0 },
                uRoughness:        { value: 0.5 },
                uReflectivity:     { value: 0.5 },
                uLightDir:         { value: new THREE.Vector3(0,10,10).normalize() },
                uLightIntensity:   { value: 1 },
                uEnvMap:           { value: null },
                uCamPos:           { value: new THREE.Vector3() },
                uColors:           { value: Array(5).fill(new THREE.Vector3()) },
                uColorIntensities: { value: Array(5).fill(0) },
                uNumColors:        { value: 1 },
                uIntensity:        { value: 0 },
                uLevel:            { value: 0 },
                uSeed:             { value: 0 },
                uYBias:            { value: 0 },
                uPixelSize:        { value: 0 },
                uImages: { value: Array(8).fill(null) },
                uUseImages: { value: Array(8).fill(false) },
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vWorldPos;
                void main() {
                    vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    vWorldPos = (modelMatrix * vec4(position,1.0)).xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform vec2 uResolution;
                uniform float uDisplacementX;
                uniform float uDisplacementY;
                uniform float uDeformAmplitude;
                uniform float uNoiseScale;
                uniform float uOpacity;
                uniform float uCartoonLevels;
                uniform float uBrightness;
                uniform float uRoughness;
                uniform float uReflectivity;
                uniform vec3 uLightDir;
                uniform float uLightIntensity;
                uniform samplerCube uEnvMap;
                uniform vec3 uCamPos;
                uniform vec3 uColors[5];
                uniform float uColorIntensities[5];
                uniform int uNumColors;
                uniform float uIntensity;
                uniform float uLevel;
                uniform float uSeed;
                uniform float uYBias;
                uniform float uPixelSize;

                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vWorldPos;
                uniform sampler2D uImages[5];
                uniform bool uUseImages[5];

                float rand(vec3 p) {
                    return fract(sin(dot(p, vec3(12.9898,78.233,45.5432))) * 43758.5453);
                }
                float noise(vec2 p, float s) {
                    vec2 ip = floor(p), u = fract(p);
                    u = u*u*(3.0-2.0*u);
                    float a = rand(vec3(ip,s));
                    float b = rand(vec3(ip + vec2(1.0,0.0),s));
                    float c = rand(vec3(ip + vec2(0.0,1.0),s));
                    float d = rand(vec3(ip + vec2(1.0,1.0),s));
                    float m1 = mix(a,b,u.x), m2 = mix(c,d,u.x);
                    return mix(m1,m2,u.y) * mix(m1,m2,u.y);
                }
                const mat2 mtx = mat2(1.2,0.0,-0.3,0.8);
                float fbm(vec2 p, float s) {
                    p *= uNoiseScale;
                    float f = 0.0;
                    f += 0.5   * noise(p + uTime*0.1, s); p = mtx * p * 2.02;
                    f += 0.25  * noise(p, s);            p = mtx * p * 2.01;
                    f += 0.125 * noise(p, s);            p = mtx * p * 2.03;
                    f += 0.0625* noise(p + sin(uTime)*0.5, s);
                    return f / 0.9375;
                }
                float pattern(vec2 p, float s) {
                    return fbm(p + fbm(p + fbm(p + fbm(p + fbm(p, s), s), s), s), s);
                }
                vec3 colormapColor(float x) {
                    if (uNumColors < 2) return uColors[0] * uColorIntensities[0];
                    float step = 1.0 / float(uNumColors - 1);
                    int idx = int(floor(x / step));
                    float t = (x - float(idx) * step) / step;
                    idx = clamp(idx, 0, uNumColors - 2);
                    vec3 c = mix(uColors[idx], uColors[idx+1], t);
                    float i = mix(uColorIntensities[idx], uColorIntensities[idx+1], t);
                    return c * i;
                }

                void main() {
                    vec2 frag = vUv * uResolution;
                    if (uPixelSize > 1.0) {
                        frag = floor(frag / uPixelSize) * uPixelSize;
                    }
                    vec2 uv   = frag / uResolution.x;
                    float dx  = pattern(uv, uSeed);
                    float dy  = pattern(uv + vec2(1.7,2.3), uSeed);
                    vec2 duv  = uv + vec2(dx * uDisplacementX, dy * uDisplacementY) * uDeformAmplitude;

                    vec4 baseCol = vec4(0.0);
                    if (uNumColors > 0) {
                        float sh = pattern(duv, uSeed) * uIntensity;
                        sh = floor(sh * uCartoonLevels) / uCartoonLevels;
                        vec3 rgb = colormapColor(sh);
                        float yF = vUv.y * 2.0 * uYBias;
                        float a  = smoothstep(0.4, 0.6, sh + uLevel + yF);
                        baseCol = mix(vec4(0.0), vec4(rgb,1.0), a);
                    }
                    
                   

                    vec3 N = normalize(vNormal);
                    vec3 L = normalize(uLightDir);
                    float lam = max(dot(N, L), 0.0) * uLightIntensity;
                    float shin= mix(8.0, 64.0, 1.0 - uRoughness);
                    float spec= pow(lam, shin) * uLightIntensity;

                    vec3 V = normalize(uCamPos - vWorldPos);
                    vec3 R = reflect(-V, N);
                    vec3 env = textureCube(uEnvMap, R).rgb;

                    vec3 lit = baseCol.rgb * lam + spec * (1.0 - uRoughness);
                    vec3 color = mix(lit, env, uReflectivity);
                    color = mix(color, vec3(1.0), uBrightness);
                    gl_FragColor = vec4(color, uOpacity);
                }
            `,
            transparent: false,
            side: THREE.DoubleSide
        });
    }
}
