// UnityWrapper.tsx
import React, { useEffect, useRef, useState } from 'react'
import { UnityCanvas } from './UnityCanvas'
import { useUnity } from '../context/UnityContext'
import { unityMessageHandlers } from './UnityMessageHandler'
import { handleUnityMessage } from './UnityMessageHandler'

import { log, logError, logSuccess, logWarn } from '../utils/log';

declare global {
  interface Window {
    onUnityMessage?: (message: string) => void;
  }
}

export const UnityWrapper: React.FC = () => {
  const { unityInstanceRef, handshakeDone, unityMessageQueueRef } = useUnity()
  const [showSplash, setShowSplash] = useState(true)
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [unityReady, setUnityReady] = useState(false)
  const [reactReady, setReactReady] = useState(false)

  // 유니티에서 받은 메시지 큐처리
  useEffect(() => {
    const interval = setInterval(() => {
      while (unityMessageQueueRef.current.length > 0) {
        const msg = unityMessageQueueRef.current.shift();
        if (msg) {
            const parsed = JSON.parse(msg);
            const handler = unityMessageHandlers[parsed.type];
            if (handler) {
            try {
                handler(parsed.payload);
            } catch (e) {
                logError(`메시지 처리 오류: ${parsed.type} ${e}`);
            }
            } else {
            logWarn(`알 수 없는 메시지 타입: ${parsed.type}`);
            }
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);


  // Unity에서 준비 완료 시 호출될 전역 함수 등록
  
  const unityReadyCallCountRef = useRef(0)

  useEffect(() => {
    (window as any).onUnityReady = () => {
      unityReadyCallCountRef.current += 1

      logSuccess(`Unity → React 준비 완료 수신  (count: ${unityReadyCallCountRef.current})`)
      setShowSplash(false)
      setUnityReady(true)
    }
  }, [])

  

  // 핸드셰이크 조건이 모두 충족되었는지 체크 후 전송
  useEffect(() => {
    if (reactReady && unityReady && !handshakeDone.current) {

      //
      const tempUniqueID = '111';
      //

      logSuccess('핸드셰이크 성공! SendMessage 전송');
      handshakeDone.current = true
      unityInstanceRef.current?.SendMessage('RootShellBridge', 'OnReactReady', tempUniqueID)
      //setTimeout(() => setShowSplash(false), 500)
    }
  }, [reactReady, unityReady])

  //
  /*
  useEffect(() => {
    window.onUnityMessage = handleUnityMessage;
    logSuccess("window.onUnityMessage 등록됨");

    return () => {
      delete window.onUnityMessage;
    };
  }, []);*/
  let isUnityMessageRegistered = false;

useEffect(() => {
  if (!isUnityMessageRegistered) {
    window.onUnityMessage = handleUnityMessage;
    isUnityMessageRegistered = true;
    logSuccess("✅ window.onUnityMessage 최초 등록 완료");
  } else {
    logWarn("⚠️ 이미 onUnityMessage가 등록되어 있음. 재등록 방지됨.");
  }

  return () => {
    delete window.onUnityMessage;
    isUnityMessageRegistered = false;
    logWarn("❌ window.onUnityMessage 해제됨");
  };
}, []);


  // Unity 인스턴스 생성
  useEffect(() => {
    const script = document.createElement('script')
    script.src = './UnityBuild/O2Jam/Build/O2Jam.loader.js'
    script.onload = () => {
      (window as any).createUnityInstance(canvasRef.current, {
        dataUrl: './UnityBuild/O2Jam/Build/O2Jam.data',
        frameworkUrl: './UnityBuild/O2Jam/Build/O2Jam.framework.js',
        codeUrl: './UnityBuild/O2Jam/Build/O2Jam.wasm',
        streamingAssetsUrl: './UnityBuild/O2Jam/StreamingAssets',
        companyName: 'QueseraGames',
        productName: 'RootShell-unity',
        productVersion: '0.1.0',
      }, (progress: number) => {
        if (progress < 0.9) {
          setProgress(progress)
        } else {
          setProgress(0.9)
          const fakeInterval = setInterval(() => {
            setProgress((prev) => {
              if (prev >= 0.99) {
                clearInterval(fakeInterval)
                return 0.99
              }
              return prev + 0.0025
            })
          }, 30)
        }
      }).then((instance: any) => {
        logSuccess("Unity 인스턴스 생성 완료");
        (window as any).unityInstance = instance
        setProgress(1)
        setFadeOut(true);

        (window as any).unityInstance = instance;
        unityInstanceRef.current = instance;
        setReactReady(true);
      })
    }
    document.body.appendChild(script)
  }, [])

  // 종료
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (handshakeDone.current && unityInstanceRef.current) {
        log("종료 메시지 전송 중...");
        unityInstanceRef.current.SendMessage('Bootstrap', 'OnReactClose', 'end-mq');
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      handleBeforeUnload(); // 🔁 React 언마운트 시점에도 호출!
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, []);

  return (
    <UnityCanvas
      canvasRef={canvasRef}
      showSplash={showSplash}
      progress={progress}
      fadeOut={fadeOut}
    />
  )
}
