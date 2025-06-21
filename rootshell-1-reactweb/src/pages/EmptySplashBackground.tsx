// src/pages/EmptySplashBackground.tsx

import { useEffect } from 'react'


export default function EmptySplashBackground({ onReady }: { onReady: () => void })  {

    // 웹브라우져 시작이후 시스템에서 각종 초기화 하는 시간 기다려주는 용도.
    //
    useEffect(() => {
        const timer = setTimeout(() => {
        onReady()
        }, 300) // 0.3초

        return () => clearTimeout(timer)
    }, [])


    //
    return (
    <div
        style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'black', // 원하는 배경색
            zIndex: 0,
        }}
        />
    )
}