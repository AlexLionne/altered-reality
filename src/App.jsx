import React, {useRef} from 'react'
import {Canvas, useLoader} from '@react-three/fiber'
import {OrbitControls, useGLTF} from '@react-three/drei'
import * as THREE from 'three'
import {useGUI} from "./hooks/useGUI.js";

export default function App() {
    // ——— Hook GUI ———
    useGUI(gui => {
        gui.add({exportSceneAsJPG}, 'exportSceneAsJPG').name('Exporter')
    })

    function Scene() {
        function configureTexture(texture, {
            offset = [0, 0],
            repeat = [1, 1],
            rotation = 0,
            center = [0, 0]
        } = {}) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping
            texture.offset.set(...offset)
            texture.repeat.set(...repeat)
            texture.center.set(...center)
            texture.rotation = rotation
            texture.needsUpdate = true
        }
        const {nodes} = useGLTF('/model.glb')
        const {nodes: nodes2} = useGLTF('/untitled.glb')
        const {nodes: nodes3} = useGLTF('/skull.glb')
        const textures = {
            background: useLoader(THREE.TextureLoader, '/img/bg.png'),
            body: useLoader(THREE.TextureLoader, '/img/body.png'),
            mask: useLoader(THREE.TextureLoader, '/img/mask.png'),
        }

        configureTexture(textures.body, {
            offset: [1, 0.1],
            rotation: Math.PI,
            repeat: [-2, 2],
            center: [2, 2]
        })

        configureTexture(textures.mask, {
            offset: [2, 0.23],
            rotation: Math.PI,
            repeat: [-2.2, 2.2],
            center: [0, 0]
        })
//Math.PI / 3
        return (
            <group   rotation={[0, Math.PI / 3 ,0]}>
                <mesh
                    rotation={[0, Math.PI, 0]}
                    position={[0, 0, 5]} // Placé en arrière
                    scale={[5, 5, 1]} // Grand pour couvrir le champ de la caméra
                >
                    <meshStandardMaterial  color={'blue'} side={THREE.DoubleSide} toneMapping={true}/>
                    <planeGeometry args={[1, 1]}/>
                </mesh>
                <mesh
                    castShadow
                    recieveShadow
                    geometry={nodes2.Beanie_Outfit_V01.geometry}
                    rotation={[Math.PI / 2, 0, Math.PI]}
                    position={[0, -10.51, 0]}
                    scale={0.006}>
                    <meshStandardMaterial  map={textures.body} side={THREE.DoubleSide} toneMapping={true}/>
                </mesh>
                <mesh
                    castShadow
                    recieveShadow
                    geometry={nodes3.object_1.geometry}
                    scale={0.11}
                    rotation={[Math.PI / 2, 0, Math.PI]}
                    position={[-0.034, -5.55, -0.2]}
                >
                    <meshStandardMaterial  color={'black'} side={THREE.DoubleSide}/>
                </mesh>
                <mesh
                    castShadow
                    recieveShadow
                    geometry={nodes.mask.geometry}
                    position={[0, 0, 0]}
                    rotation={[0, 0, 0]}
                >
                    <meshStandardMaterial  map={textures.mask} side={THREE.DoubleSide} toneMapping={true}/>
                </mesh>
            </group>
        )
    }

    const glRef = useRef()
    const sceneRef = useRef()
    const cameraRef = useRef()

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
        const factor = 15 // qualité x10
        const width = Math.floor(canvasSize.width * factor)
        const height = Math.floor(canvasSize.height * factor)

        // Préparer un render target 4K
        const renderTarget = new THREE.WebGLRenderTarget(width, height, {
            encoding: THREE.sRGBEncoding
        })

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
        const dataURL = canvas.toDataURL('image/png', 1.0)
        const link = document.createElement('a')
        link.href = dataURL
        link.download = `${Math.random().toString().slice(2, 10)}.jpg`
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
                    // Assurer le bon tone mapping + encodage
                    gl.outputEncoding = THREE.sRGBEncoding
                    gl.toneMapping = THREE.ACESFilmicToneMapping
                    gl.toneMappingExposure = 1.0
                    gl.setClearColor('#1e1e1e'); // ou new THREE.Color(...)
                }}
                orthographic
                camera={{
                    left: -2.7,
                    right: 2.7,
                    top: 2,
                    bottom: -2.2,
                    near: 0.1,
                    far: 100,
                    position: [0, 0, -2],
                    zoom: 1.4
                }}
            >
                <OrbitControls/>
                <Scene/>
                <ambientLight castShadow intensity={5}/>
                <directionalLight castShadow intensity={5} color={'blue'} position={[0, 10, -1]}/>
                <directionalLight castShadow intensity={20} color={'pink'} position={[0, 1, -1]}/>
            </Canvas>
        </div>
    )
}

useGLTF.preload('/model.glb')
useGLTF.preload('/untitled.glb')
useGLTF.preload('/skull.glb')
