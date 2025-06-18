// src/pages/AStartSplash.tsx
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { OrbitControls, Html } from '@react-three/drei'

function HanaGlowCore() {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const scale = 1 + Math.sin(t * 1.5) * 0.03
    meshRef.current?.scale.set(scale, scale, scale)
    meshRef.current?.rotation.set(0, t * 0.2, 0)
  })

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.4, 64, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00ffff"
          emissiveIntensity={1.2}
          roughness={0.6}
          metalness={0.3}
          transparent
          opacity={0.6} // 💠 알파 낮춤
        />
      </mesh>

      {[2.0, 2.3, 2.6].map((r, i) => (
        <mesh key={i} position={[0, 0, 0]}>
          <sphereGeometry args={[r, 64, 64]} />
          <meshBasicMaterial
            color="#00ffff"
            transparent
            opacity={0.035} // 💫 더 낮게, 알파 이빠이 줌
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.FrontSide}
          />
        </mesh>
      ))}
    </>
  )
}


function StarParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  const count = 500
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 30
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.02
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
<bufferAttribute
  attach="attributes-position"
  args={[positions, 3]} // args로 넘기면 오류 없음
/>
      </bufferGeometry>
      <pointsMaterial
        color="#99ccff"
        size={0.08}
        sizeAttenuation
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export default function AStartSplash() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, position: 'relative', overflow: 'hidden', background: 'radial-gradient(circle at center, #020c12, #000)' }}>
      <Canvas style={{ width: '100vw', height: '100vh' }} camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#00ffff" />
        {/*<HanaGlowCore />*/}
        <StarParticles />
        <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />

        <Html fullscreen>
          <div
            style={{
              position: 'absolute',
              top: '35%',
              width: '100%',
              textAlign: 'center',
              color: '#ccfaff',
              fontFamily: 'Orbitron, sans-serif',
              textShadow: '0 0 6px #00ffffaa, 0 0 12px #00ffff55',
              animation: 'fadeIn 3s ease forwards',
            }}
          >
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', fontWeight: 300 }}>
              KAIA 지갑 연결이 필요합니다.
            </h2>
            <p style={{ marginTop: '2rem', fontSize: '1.1rem', animation: 'pulse 2s infinite' }}>
              화면을 터치하면 지갑이 연결됩니다.
            </p>
          </div>
        </Html>
      </Canvas>

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
