// App.tsx

import { useState } from 'react'

import { KaiaWalletProvider/*, useKaiaWallet*/ } from './context/KaiaContext'
import { PaymentProvider/*, usePayment*/ } from './context/PaymentContext'
import { UnityProvider } from './context/UnityContext'

//import UnityDebugOverlay from './components/UnityDebugOverlay'
import EmptySplashBackground from './pages/EmptySplashBackground'
import AStartSplash from './pages/AStartSplash'

/*
import { UnityWrapper } from './bridge/UnityWrapper'
import MaintenancePage from './pages/MaintenancePage'
import WalletStatusBar from './components/WalletStatusBar'
import AStartSplash from './pages/AStartSplash'
*/

function AppInner() {
  
  const [isReady, setIsReady] = useState(false)

  // ready 된 순간, isReady = true
  const handleReady = () => {
    setIsReady(true)    
  }


  return (
    <UnityProvider>

    <div style={{ position: 'relative' }}>
      <EmptySplashBackground onReady={handleReady}/>   
      {  isReady && <AStartSplash /> }
      {   /*<UnityWrapper />       */  }  



      {   /*<ReactUICanvans />     */  }
      {   /*<WalletStatusBar />    */  }
      {   /*<MaintenancePage />    */  }
      {   /*<UnityDebugOverlay />  */  }
    </div>

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
