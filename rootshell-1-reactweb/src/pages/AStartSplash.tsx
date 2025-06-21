
//src/pages/AStartSplash.tsx

import { useEffect, useRef  } from 'react'
import { log} from '../utils/log';


//
export default function AStartSplash() {

    const didInit = useRef(false);

    useEffect(() => {
    if (!didInit.current) {
        didInit.current = true;
        log('[AStartSplash] ✅✅✅✅✅ Init Called!')

        // 여기에 진짜 Init 로직
    }

    // 최초 마운트 시 로직
    log('[AStartSplash] mounted')

    return () => {
      log('[AStartSplash] unmounted')
    }
  }, [])


  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        backgroundColor: 'black',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        fontFamily: 'sans-serif',
      }}
    >
      <CanvasLayer />
        <div style={{ position: 'absolute', zIndex: 2 }}>
        </div>
    </div>
  )
}

function CanvasLayer() {
  // 나중에 Three.js나 Pixi.js 붙일 수 있는 placeholder
  return (
    <canvas
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  )
}