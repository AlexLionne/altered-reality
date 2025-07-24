import React, {useRef, useState} from 'react'
import {Canvas, extend, useFrame, useThree} from '@react-three/fiber'
import {OrbitControls, useGLTF} from '@react-three/drei'
import * as THREE from 'three'
import WarpMaterialModel from "./materials/WarpMaterialModel.js"
import BodyWarpMaterialModel from "./materials/BodyWarpMaterialModel.js"
import {useGUI} from "./hooks/useGUI.js"

// 1) Extend deux shaders : modèle (avec éclairage/réflection) et fond (pattern seul)
extend({
    WarpMaterialModel,
    BodyWarpMaterialModel
})
const getRandomColor = () => {
    const h = Math.floor(Math.random() * 360);
    const s = 100;
    const l = 50;
    const rgb = hslToRgb(h / 360, s / 100, l / 100);
    return '#' + rgb.map(x => x.toString(16).padStart(2, '0')).join('');
};


function hslToRgb(h, s, l) {
    let r, g, b
    if (s === 0) {
        r = g = b = l
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1 / 6) return p + (q - p) * 6 * t
            if (t < 1 / 2) return q
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
            return p
        }
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        r = hue2rgb(p, q, h + 1 / 3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1 / 3)
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

export default function App() {
    // ——— États liquides & couleurs ———
    const [liquid, setLiquid] = useState({
        colors: [
            {id: 1, value: "#000", intensity: 2},
            {id: 2, value: "#000", intensity: 2},
            {id: 3, value: getRandomColor(), intensity: 2},
            {id: 4, value: getRandomColor(), intensity: 2},
            {id: 5, value: getRandomColor(), intensity: 2},
        ],
        intensity: 2,
        level: 2,
        seed: 0,
        yBias: 10,
    })
    const addColor = () => {
        setLiquid(l => {
            if (l.colors.length >= 5) return l
            return {
                ...l,
                colors: [...l.colors, {id: l.colors.length + 1, value: '#ffffff', intensity: 1}]
            }
        })
    }
    const removeColor = id =>
        setLiquid(l => ({...l, colors: l.colors.filter(c => c.id !== id)}))
    const updateColorValue = (id, v) =>
        setLiquid(l => ({
            ...l,
            colors: l.colors.map(c => (c.id === id ? {...c, value: v} : c))
        }))
    const updateColorIntensity = (id, i) =>
        setLiquid(l => ({
            ...l,
            colors: l.colors.map(c => (c.id === id ? {...c, intensity: i} : c))
        }))
    const moveColorUp = i => {
        setLiquid(l => {
            if (i === 0) return l
            const a = [...l.colors]
            ;[a[i - 1], a[i]] = [a[i], a[i - 1]]
            return {...l, colors: a}
        })
    }
    const moveColorDown = i => {
        setLiquid(l => {
            if (i === l.colors.length - 1) return l
            const a = [...l.colors]
            ;[a[i], a[i + 1]] = [a[i + 1], a[i]]
            return {...l, colors: a}
        })
    }

    // ——— États shader ———
    const [dx, setDx] = useState(1)
    const [dy, setDy] = useState(1)
    const [deformAmplitude, setDeformAmplitude] = useState(1)  // Nouvel état pour l'amplitude
    const [noiseScale, setNoiseScale] = useState(1.9)
    const [opacity, setOpacity] = useState(1)
    const [cartoonLvls, setCartoonLvls] = useState(50)
    const [roughness, setRoughness] = useState(1)
    const [reflectivity, setReflectivity] = useState(0)
    const [brightness, setBrightness] = useState(0)

    const matRef = useRef()
    const matRef2 = useRef()
    const matRef3 = useRef()
    const timeOffset = useRef(300)

    // export
    const isExportingVideo = useRef(false)
    const exportBaseTime = useRef(0)
    const exportFrame = useRef(0)

    // ——— Hook GUI ———
    useGUI(gui => {
        // Shader controls
        gui.add({dx}, 'dx', 0, 1, 0.01).name('Dépl X').onChange(setDx)
        gui.add({dy}, 'dy', 0, 1, 0.01).name('Dépl Y').onChange(setDy)
        gui.add({deformAmplitude}, 'deformAmplitude', 0, 2, 0.01).name('Ampl. Déform').onChange(setDeformAmplitude)  // Nouveau contrôle GUI
        gui.add({noiseScale}, 'noiseScale', 1.9, 2, 0.01).name('Échelle bruit').onChange(setNoiseScale)
        gui.add({opacity}, 'opacity', 0, 1, 0.01).name('Opacité').onChange(setOpacity)
        gui.add({cartoonLvls}, 'cartoonLvls', 50, 50, 1).name('Cartoon Lvls').onChange(setCartoonLvls)
        gui.add({roughness}, 'roughness', 0, 1, 0.01).name('Roughness').onChange(setRoughness)
        gui.add({reflectivity}, 'reflectivity', 0, 1, 0.01).name('Reflectivity').onChange(setReflectivity)
        gui.add({brightness}, 'brightness', 0, 1, 0.01)
            .name('Éclaircir')
            .onChange(setBrightness)

        gui.add({runExport}, 'runExport').name('Exporter')
        gui.add({startExportVideo}, 'startExportVideo').name('Video Exporter')

        // Liquide folder
        const lf = gui.addFolder('Liquide')
        lf.add(liquid, 'intensity', 0, 2, 0.01).name('Intensité')
            .onChange(v => setLiquid(l => ({...l, intensity: v})))
        lf.add(liquid, 'level', -2, 2, 0.1).name('Level')
            .onChange(v => setLiquid(l => ({...l, level: v})))
        lf.add(liquid, 'yBias', -10, 10, 0.1).name('Y Bias')
            .onChange(v => setLiquid(l => ({...l, yBias: v})))
        lf.add({addColor}, 'addColor').name('Ajouter couleur')
            .disable(liquid.colors.length >= 5)

        liquid.colors.forEach((c, i) => {
            const cf = lf.addFolder(`Couleur ${c.id}`)
            cf.addColor(c, 'value').name('Couleur').onChange(v => updateColorValue(c.id, v))
            cf.add(c, 'intensity', 0, 2, 0.01).name('Intensité')
                .onChange(v => updateColorIntensity(c.id, v))
            cf.add({remove: () => removeColor(c.id)}, 'remove').name('Supprimer')
                .disable(liquid.colors.length <= 1)
            cf.add({up: () => moveColorUp(i)}, 'up').name('↑').disable(i === 0)
            cf.add({down: () => moveColorDown(i)}, 'down').name('↓')
                .disable(i === liquid.colors.length - 1)
        })
    })

    function Scene() {
        const {camera} = useThree()
        const meshRef = useRef()
        const mesh2Ref = useRef()
        const {nodes} = useGLTF('/model.glb')
        const {nodes: nodes2} = useGLTF('/untitled.glb')
        const {nodes: nodes3} = useGLTF('/skull.glb')

        useFrame((state, delta) => {
            // Fond pattern
            if (matRef2.current && matRef.current && matRef3.current) {
                const u = matRef2.current.uniforms
                const v = matRef.current.uniforms
                const w = matRef3.current.uniforms

                /*
                const elapsed = isExportingVideo.current

                ? exportBaseTime.current + exportFrame.current / fps
                : performance.now() / 1000
                u.uTime.value = elapsed
                v.uTime.value = elapsed
                */

                u.uResolution.value.set(state.size.width, state.size.height)
                u.uDisplacementX.value = dx
                u.uDisplacementY.value = dy
                u.uDeformAmplitude.value = deformAmplitude  // Mise à jour de la nouvelle uniform
                u.uNoiseScale.value = noiseScale * 2 //* 4
                u.uOpacity.value = opacity
                u.uCartoonLevels.value = cartoonLvls
                u.uColors.value = liquid.colors.map(c => new THREE.Vector3(...new THREE.Color(c.value).toArray()))
                u.uColorIntensities.value = liquid.colors.map(c => c.intensity)
                u.uNumColors.value = liquid.colors.length
                u.uIntensity.value = liquid.intensity
                u.uLevel.value = liquid.level
                u.uSeed.value = liquid.seed
                u.uYBias.value = liquid.yBias

                v.uBrightness.value = brightness
                v.uResolution.value.set(state.size.width, state.size.height)
                v.uDisplacementX.value = dx
                v.uDisplacementY.value = dy
                v.uDeformAmplitude.value = deformAmplitude  // Mise à jour de la nouvelle uniform
                v.uNoiseScale.value = noiseScale * 1.5
                v.uOpacity.value = opacity
                v.uCartoonLevels.value = cartoonLvls
                v.uRoughness.value = roughness
                v.uReflectivity.value = 0
                v.uEnvMap.value = null  // Désactive l'environnement
                v.uCamPos.value.copy(camera.position)
                v.uColors.value = liquid.colors.map(c => new THREE.Vector3(...new THREE.Color(c.value).toArray()))
                v.uColorIntensities.value = liquid.colors.map(c => c.intensity)
                v.uNumColors.value = liquid.colors.length
                v.uIntensity.value = liquid.intensity
                v.uLevel.value = liquid.level
                v.uSeed.value = liquid.seed
                v.uYBias.value = liquid.yBias


                w.uBrightness.value = brightness
                w.uResolution.value.set(state.size.width, state.size.height)
                w.uDisplacementX.value = dx
                w.uDisplacementY.value = dy
                w.uDeformAmplitude.value = deformAmplitude  // Mise à jour de la nouvelle uniform
                w.uNoiseScale.value = noiseScale
                w.uOpacity.value = opacity
                w.uCartoonLevels.value = 1
                w.uRoughness.value = 0
                w.uReflectivity.value = 0
                w.uEnvMap.value = null  // Désactive l'environnement
                w.uCamPos.value.copy(camera.position)
                w.uColors.value = liquid.colors.map(c => new THREE.Vector3(...new THREE.Color(c.value).toArray()))
                w.uColorIntensities.value = liquid.colors.map(c => c.intensity)
                w.uNumColors.value = liquid.colors.length
                w.uIntensity.value = liquid.intensity
                w.uLevel.value = liquid.level
                w.uSeed.value = liquid.seed
                w.uYBias.value = liquid.yBias

            }
        })

        return (
            <group>
                <mesh
                    ref={mesh2Ref}
                    geometry={nodes2.Beanie_Outfit_V01.geometry}
                    rotation={[Math.PI / 2, 0, Math.PI]}
                    position={[0, -10.7, 0]}
                    scale={0.006}>
                    <warpMaterialModel ref={matRef2}/>
                </mesh>
                <mesh
                    geometry={nodes3.object_1.geometry}
                    scale={0.11}
                    rotation={[Math.PI / 2, 0, Math.PI]}
                    position={[0, -5.6, -0.15]}
                >
                    <bodyWarpMaterialModel ref={matRef3}/>
                </mesh>
                <mesh
                    ref={meshRef}
                    geometry={nodes.mask.geometry}
                    position={[0.0225, 0, 0]}
                    rotation={[0, 0, 0]}
                >
                    <warpMaterialModel ref={matRef}/>
                </mesh>
            </group>
        )
    }

    const glRef = useRef()
    const sceneRef = useRef()
    const cameraRef = useRef()
    const imageCount = useRef(0)
    const randomizeColors = () => {
        setLiquid(l => ({
            ...l,
            colors: [
                {id: 1, value: "#000", intensity: 2},
                {id: 2, value: "#000", intensity: 2},
                ...l.colors.slice(2, l.colors.length).map(c => ({
                    ...c,
                    value: getRandomColor()
                }))]
        }))
    }
    const runExport = () => {
        const interval = setInterval(() => {
            if (imageCount.current >= 100) {
                clearInterval(interval)
                return
            }


            setTimeout(() => {
                exportSceneAsJPG()
                timeOffset.current = Math.floor(Math.random() * 10000)
                randomizeColors()
                imageCount.current++
            }, 1000)

        }, 10000)

        return () => clearInterval(interval)
    }
    const fps = 60
    const duration = 5
    const totalFrames = fps * duration
    const videoCount = useRef(0)

    const startExportVideo = async () => {
        const gl = glRef.current
        const scene = sceneRef.current
        const camera = cameraRef.current
        if (!gl || !scene || !camera) return

        const canvasSize = gl.domElement.getBoundingClientRect()
        const factor = 10
        const width = Math.floor(canvasSize.width * factor)
        const height = Math.floor(canvasSize.height * factor)
        const renderTarget = new THREE.WebGLRenderTarget(width, height)
        renderTarget.texture.encoding = gl.outputEncoding

        exportBaseTime.current = Math.random() * 100
        exportFrame.current = 0
        isExportingVideo.current = true

        for (let frame = 0; frame < totalFrames; frame++) {
            exportFrame.current = frame

            console.log('exporting frame', frame)
            // Attend le rendu complet de la frame
            await new Promise(resolve => requestAnimationFrame(resolve))

            gl.setRenderTarget(renderTarget)
            gl.setSize(width, height)
            camera.updateProjectionMatrix()
            gl.render(scene, camera)

            const buffer = new Uint8Array(width * height * 4)
            gl.readRenderTargetPixels(renderTarget, 0, 0, width, height, buffer)

            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')
            const imageData = ctx.createImageData(width, height)

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const src = ((height - y - 1) * width + x) * 4
                    const dst = (y * width + x) * 4
                    imageData.data[dst] = buffer[src]
                    imageData.data[dst + 1] = buffer[src + 1]
                    imageData.data[dst + 2] = buffer[src + 2]
                    imageData.data[dst + 3] = buffer[src + 3]
                }
            }

            ctx.putImageData(imageData, 0, 0)

            await new Promise(resolve => {
                canvas.toBlob(blob => {
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `video${videoCount.current.toString().padStart(2, '0')}_frame_${frame.toString().padStart(3, '0')}.png`
                    a.click()
                    URL.revokeObjectURL(url)
                    resolve()
                }, 'image/png')
            })
            await new Promise(resolve => setTimeout(resolve, 5000))
        }

        isExportingVideo.current = false
        videoCount.current++
        renderTarget.dispose()
        gl.setRenderTarget(null)
        //ffmpeg -framerate 60 -i video00_frame_%03d.png -c:v libx264 -pix_fmt yuv420p output.mp4
    }

    const exportSceneAsJPG = () => {
        const gl = glRef.current
        const scene = sceneRef.current
        const camera = cameraRef.current

        if (!gl || !scene || !camera) return

        const originalSize = new THREE.Vector2()
        gl.getSize(originalSize)

        const originalZoom = camera.zoom

        // Résolution cible
        const canvasSize = gl.domElement.getBoundingClientRect()
        const factor = 20 // qualité x10
        const width = Math.floor(canvasSize.width * factor)
        const height = Math.floor(canvasSize.height * factor)

        // Préparer un render target 4K
        const renderTarget = new THREE.WebGLRenderTarget(width, height)
        renderTarget.texture.encoding = gl.outputEncoding

        // Redimensionner temporairement le renderer
        gl.setRenderTarget(renderTarget)
        gl.setSize(width, height)

        // Garder les bornes camera.left/right/top/bottom INCHANGÉES
        // Juste s’assurer que le zoom reste cohérent
        camera.zoom = originalZoom
        camera.updateProjectionMatrix()

        // Forcer les matériaux visibles
        scene.traverse(obj => {
            if (obj.material?.uniforms?.uOpacity !== undefined) {
                obj.material.uniforms.uOpacity.value = 1
            }
        })

        // Rendu
        gl.render(scene, camera)

        // Lecture pixels
        const buffer = new Uint8Array(width * height * 4)
        gl.readRenderTargetPixels(renderTarget, 0, 0, width, height, buffer)

        // Conversion en canvas
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        const imageData = ctx.createImageData(width, height)

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const src = ((height - y - 1) * width + x) * 4
                const dst = (y * width + x) * 4
                imageData.data[dst] = buffer[src]
                imageData.data[dst + 1] = buffer[src + 1]
                imageData.data[dst + 2] = buffer[src + 2]
                imageData.data[dst + 3] = buffer[src + 3]
            }
        }

        ctx.putImageData(imageData, 0, 0)

        // Téléchargement
        const dataURL = canvas.toDataURL('image/jpeg', 1.0)
        const link = document.createElement('a')
        link.href = dataURL
        link.download = 'scene-4k.jpg'
        link.click()

        // Nettoyage
        renderTarget.dispose()
        gl.setRenderTarget(null)
        gl.setSize(originalSize.x, originalSize.y)
        camera.zoom = originalZoom
        camera.updateProjectionMatrix()
    }


    return (
        <div style={{width: 400, height: 400, margin: 'auto', backgroundColor: 'black'}}>
            <Canvas
                onCreated={({gl, scene, camera}) => {
                    glRef.current = gl
                    sceneRef.current = scene
                    cameraRef.current = camera
                }}
                orthographic
                camera={{
                    left: -2.7,
                    right: 3,
                    top: 2,
                    bottom: -2.5,
                    near: 0.1,
                    far: 100,
                    position: [0, 0, -2],
                    zoom: 1.4
                }}
            >
                <OrbitControls/>
                <Scene/>
            </Canvas>
        </div>
    )
}

useGLTF.preload('/model.glb')
useGLTF.preload('/untitled.glb')
useGLTF.preload('/skull.glb')