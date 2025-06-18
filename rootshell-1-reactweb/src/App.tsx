import { useState, useEffect } from 'react'
import { KaiaWalletProvider, useKaiaWallet } from './context/KaiaContext'

import { UnityProvider } from './context/UnityContext'
import { UnityWrapper } from './bridge/UnityWrapper'
import UnityDebugOverlay from './components/UnityDebugOverlay'
import KaiaLoginView from './pages/KaiaLoginView'

import TopLeftMenuButton from './components/TopLeftMenuButton'
import MaintenancePage from './pages/MaintenancePage'

import WalletStatusBar from './components/WalletStatusBar'

// 🔥 추가
import { PaymentProvider/*, usePayment*/ } from './context/PaymentContext'

import AStartSplash from './pages/AStartSplash'

/*
function PaymentButton() {
  const { isPaying, paymentStatus, startPayment } = usePayment()

  return (
    <div style={{ marginTop: '20px' }}>
      <button
        onClick={startPayment}
        disabled={isPaying}
        style={{
          padding: '12px 20px',
          fontSize: '16px',
          borderRadius: '8px',
          backgroundColor: '#00c7a7',
          color: 'white',
          border: 'none',
          cursor: isPaying ? 'not-allowed' : 'pointer',
        }}
      >
        {paymentStatus === 'idle' && '💳 결제 시작'}
        {paymentStatus === 'started' && '⏳ 결제 중...'}
        {paymentStatus === 'completed' && '✅ 결제 완료'}
      </button>
    </div>
  )
}*/


function AppInner() {
  const { isConnected } = useKaiaWallet()
  const [showUnity, setShowUnity] = useState(false)
  const [showMaintenance, setShowMaintenance] = useState(false)

  const toggleMaintenance = () => setShowMaintenance(prev => !prev)
  const handleUnityStart = () => setShowUnity(true)

  useEffect(() => {
    console.log('🔁 상태 변경 감지됨')
    console.log('💡 isConnected:', isConnected)
    console.log('💡 showUnity:', showUnity)
  }, [isConnected, showUnity])

  return (
    <UnityProvider>
      <UnityDebugOverlay />
      <WalletStatusBar /> {}
      <TopLeftMenuButton onClick={toggleMaintenance} />

      {showMaintenance ? (
        <MaintenancePage />
      ) : isConnected && showUnity ? (
        <UnityWrapper />
      ) : (
        <>
          {/*<KaiaLoginView onStartUnity={handleUnityStart} />*/  
          }
          {
            <AStartSplash/>
          }
        </>
      )}
    </UnityProvider>
  )
}

export default function App() {
  return (
    <KaiaWalletProvider>
      <PaymentProvider>
        <AppInner />
      </PaymentProvider>
    </KaiaWalletProvider>
  )
}
