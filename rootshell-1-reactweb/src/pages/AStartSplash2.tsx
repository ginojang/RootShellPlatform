// src/pages/AStartSplash.tsx
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo, useState, useEffect} from 'react'
import type { ReactNode } from 'react'
import * as THREE from 'three'
import { OrbitControls, Html } from '@react-three/drei'
import { useKaiaWallet } from '../context/KaiaContext' // 🔗 지갑 훅 임포트

function StarParticles({ 
  active = true, 
  useColorOnly = false, // 🌈 이걸 true로 하면 컬러만 보임
}: { 
  active: boolean 
  useColorOnly?: boolean
}) {
  const particlesRef = useRef<THREE.Points>(null)
  const count = 500
  const texture = useMemo(() => new THREE.TextureLoader().load('/images/dust-star.png'), [])

  const { positions, alphas } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const alpha = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30
      alpha[i] = Math.random() * 0.1// + 0.1 // 0.2 ~ 1.0 사이의 랜덤 투명도
    }

    return { positions: pos, alphas: alpha }
  }, [])

  useFrame(({ clock }) => {
    if (!active) return
    const t = clock.getElapsedTime()
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.02
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-alpha" args={[alphas, 1]} />
      </bufferGeometry>
      <pointsMaterial
        map={useColorOnly ? undefined : texture}
        color={useColorOnly ? 'cyan' : undefined} // 🎨 컬러 적용
        size={0.1}
        sizeAttenuation
        transparent
        vertexColors={false} // 알파는 따로 처리됨
        opacity={0.8} // 기본값은 1
        blending={THREE.AdditiveBlending}
        depthWrite={true}
      />
    </points>
  )
}

type Props = {
  onStartUnity: () => void
}



export default function AStartSplash( {onStartUnity } : Props)  {
  
  const { connect, connectionStatus, address } = useKaiaWallet()

  const getMessageTitle = () => {
    switch (connectionStatus) {
      case 'idle':
        return 'KAIA 지갑 연결이 필요합니다.'
      case 'connected':
        return 'KAIA 지갑 연결 성공'
      default:
        return ''
    }
  }

  const getMessage = () => {
    switch (connectionStatus) {
      case 'idle':
        return '화면을 터치하면 지갑이 연결됩니다.'
      case 'connecting':
        return '접속 중...'
      case 'connected':
         return (
          <>
            <span>{address}</span>
            <br />
            <span>지갑이 연결되었습니다.</span>
          </>
        )
      case 'failed':
        return '지갑 연결을 실패했습니다.'
      default:
        return ''
    }
  }

  const [shouldFadeOut, setShouldFadeOut] = useState(false)
  const [animationActive, setAnimationActive] = useState(true)

  useEffect(() => {
  if (connectionStatus === 'connected') {
    setTimeout(() => {
      setShouldFadeOut(true)
      setAnimationActive(false)  // 🌌 입자 멈춤
      setTimeout(() => {
        onStartUnity()
      }, 1000) // fadeOut 끝난 후 Unity 실행
    }, 3000)
  }
  }, [connectionStatus])

  // 🧠 메시지 상태 캐시
  const [messageCache, setMessageCache] = useState<ReactNode>('')

  // 메시지 캐싱 처리
  useEffect(() => {
    setMessageCache(getMessage())
  }, [connectionStatus])


  const handleTouchEnd  = () => {
    console.log('[🌸RootShell]✅ 화면 터치됨 → 지갑 연결 시도')
    connect()
  }

  return (
    
    <div
      onClick={handleTouchEnd}
      onTouchStart={handleTouchEnd}
      style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at center, #020c12, #000)',
        touchAction: 'manipulation', // 📱 모바일 터치 반응성 향상
      }}
    >
   <Canvas 
    style={{ width: '100vw', height: '100vh' }} 
    camera={{ position: [0, 0, 5] }} 
    gl={{ powerPreference: 'high-performance', alpha: true, antialias: true }}>
        <ambientLight intensity={1.2} />
        <pointLight position={[5, 5, 5]} intensity={5.0} color="#00ffff" />
        <StarParticles active={animationActive}/>

        
        <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
  
  <Html fullscreen>
    <div
      className={`splash-message ${shouldFadeOut ? 'fade-out' : 'fade-in'}`}
      style={{
        position: 'absolute',
        top: '40vh',
        width: '100%',
        textAlign: 'center',
        color: '#ccfaff',
        fontFamily: 'Orbitron, sans-serif',
        padding: '0 5vw',
        textShadow: '0 0 6px #00ffffaa, 0 0 12px #00ffff55',
        
      }}
    >

      <h2
        style={{
          fontSize: 'clamp(1.2rem, 4vw, 2rem)',
          marginBottom: '1rem',
          fontWeight: 300,
        }}
      >
        {getMessageTitle()}
      
      </h2>
      <p
        style={{
          marginTop: '2rem',
          fontSize: 'clamp(1rem, 3vw, 1.4rem)',
          animation: connectionStatus === 'idle' ? 'pulse 2s infinite' : 'none',
        }}
      >
         {messageCache}
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

        .fade-in {
          animation: fadeIn 3s ease forwards;
        }

        .fade-out {
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 1.5s ease-in-out, transform 1.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
