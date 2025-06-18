import { useState, useEffect } from 'react'
import { KaiaWalletProvider, useKaiaWallet } from './context/KaiaContext'

import { UnityProvider } from './context/UnityContext'
import { UnityWrapper } from './bridge/UnityWrapper'
import UnityDebugOverlay from './components/UnityDebugOverlay'
import KaiaLoginView from './pages/KaiaLoginView'

function AppInner() {
  const { isConnected } = useKaiaWallet()
  const [showUnity, setShowUnity] = useState(false)

  const handleUnityStart = () => setShowUnity(true)

  useEffect(() => {
    console.log('🔁 상태 변경 감지됨')
    console.log('💡 isConnected:', isConnected)
    console.log('💡 showUnity:', showUnity)
  }, [isConnected, showUnity])

  return (
    <UnityProvider>
      <UnityDebugOverlay />
      {isConnected && showUnity ? (
        <UnityWrapper />
      ) : (
        <KaiaLoginView onStartUnity={handleUnityStart} />
      )}
    </UnityProvider>
  )
}

export default function App() {
  return (
    <KaiaWalletProvider>
      <AppInner />
    </KaiaWalletProvider>
  )
}
