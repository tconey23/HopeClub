import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useRef } from 'react';
import { PointerLockControls,useGLTF } from '@react-three/drei';
import { Sparkles } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { useMemo } from 'react';
import { Environment } from '@react-three/drei';

const r = Math.PI / 180

const CameraControl = () => {
    const {camera} = useThree()
    const xRef = useRef(10)
    const yRef = useRef(5)
    const zRef = useRef(0)
    const [cameraPosition, setCameraPosition] = useState([0,0,0])
    const [directions, setDirections] = useState({
        forward: false,
        backward: false, 
        left: false,
        right: false,
        up: false
    })
    const speedMultiplier = 2

    useFrame(() => {
        camera.position.set(...cameraPosition)

        if(directions.forward) {
            xRef.current -= 0.01 * speedMultiplier
            setCameraPosition([xRef.current, yRef.current, zRef.current])
        }

        if(directions.backward) {
            xRef.current += 0.01 * speedMultiplier
            setCameraPosition([xRef.current, yRef.current, zRef.current])
        }

        if(directions.left) {
            zRef.current += 0.01 * speedMultiplier
            setCameraPosition([xRef.current, yRef.current, zRef.current])
        }

        if(directions.right) {
            zRef.current -= 0.01 * speedMultiplier
            setCameraPosition([xRef.current, yRef.current, zRef.current])
        }

        if(directions.up) {
            yRef.current += 0.01 * speedMultiplier
            setCameraPosition([xRef.current, yRef.current, zRef.current])
        }

        if(directions.down) {
            yRef.current -= 0.01 * speedMultiplier
            setCameraPosition([xRef.current, yRef.current, zRef.current])
        }
        
        if(!directions.forward) {
            setCameraPosition([xRef.current, yRef.current, zRef.current])
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    })

    const handleKeyDown = (event) => {
        switch (event.code) {
            case 'KeyW':
                setDirections({
                    forward: true
                })
                break;
            case 'KeyS':
                setDirections({
                    backward: true
                })
                break;
            case 'KeyD':
                setDirections({
                    right: true
                })
                break;
            case 'KeyA':
                setDirections({
                    left: true
                })
                break;
            case 'KeyX':
                setDirections({
                    up: true
                })
                break;
            case 'KeyC':
                setDirections({
                    down: true
                })
                break;
            default:
                setDirections({
                    forward: false,
                    backward: false, 
                    left: false,
                    right: false,
                    up: false,
                    down: false
                })
        }
    };

    const handleKeyUp = (event) => {
        switch (event.code) {
            case 'KeyW':
                setDirections({
                    forward: false
                })
                break;
            case 'KeyS':
                setDirections({
                    backward: false
                })
                break;
            case 'KeyD':
                setDirections({
                    right: false
                })
                break;
            case 'KeyA':
                setDirections({
                    left: false
                })
                break;
            case 'KeyX':
                setDirections({
                    up: false
                })
                break;
            case 'KeyC':
                setDirections({
                    down: false
                })
                break;
            default:
                setDirections({
                    forward: false,
                    backward: false, 
                    left: false,
                    right: false,
                    up: false,
                    down: false
                })
        }
    };
}

const CentralCommandCenter = () => {
    const [sparkleColor, setSparkleColor] = useState(['lightblue', 'hotpink']);
    const [fpvCamera, setFpvCamera] = useState()

    return (
        <Canvas shadows style={{ width: '100vw', height: '98vh', background: 'black' }}>
            <CameraControl fpvCamera={fpvCamera} position={[0,0,0]}/>
            <directionalLight castShadow intensity={0.5} position={[5, 5, 10]} />
            <PointLights />
            <ambientLight intensity={0.4} />
            {/* <Sparkles count={1000} speed={1} opacity={0.7} color={sparkleColor[0]} size={50} scale={[100, 100, 100]} noise={[150, 2, 10]} /> */}
            {/* <Sparkles count={1000} speed={1} opacity={0.7} color={sparkleColor[1]} size={50} scale={[100, 100, 100]} noise={[10, 150, 2]} /> */}
            <Environment
                background={true} 
                backgroundBlurriness={0} 
                backgroundIntensity={1} 
                backgroundRotation={[0, Math.PI / 2, 0]} 
                environmentIntensity={1} 
                environmentRotation={[0, Math.PI / 2, 0]}
                preset={'dawn'}
            />
            <Model objScale={[0.5, 0.5, 0.5]} />
            {/* <OrbitControls /> */}
            <PointerLockControls />
        </Canvas>
    );
};

export default CentralCommandCenter;

function Model() {
    const { nodes, materials } = useGLTF('/assets/shipModel.glb');
    const nodeArray = Object.entries(nodes)
    const scaleNum = 0.5
    const scene = nodeArray[1][1].children

    const modelObject = useMemo(() => {
        const objectArray = []
        for(let i = 0; i < scene.length; i++){
                const {x,y,z} = scene[i].position
                objectArray.push(<mesh geometry={scene[i].geometry} material={scene[i].material}></mesh>)
        }
        return objectArray
    }, [])

    return (
        <group position={[0,-1,0]} rotation={[0,0,-r*90]} scale={[scaleNum,scaleNum,scaleNum]}>
            {modelObject}
        </group>
    );
  }

const PointLights = () => {
    return (
        <group>
            <pointLight intensity={2} color={'lightblue'} position={[0, 0, 0]}/>
            <pointLight intensity={2} color={'lightblue'} position={[4, 0, 0]}/>
            <pointLight intensity={2} color={'lightblue'} position={[-4, 0, 0]}/>
            <pointLight intensity={2} color={'lightblue'} position={[0, -4, 0]}/>
            <pointLight intensity={2} color={'lightblue'} position={[0, -4, 0]}/>
        </group>
    )
}

