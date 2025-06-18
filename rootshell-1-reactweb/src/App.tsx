import { UnityProvider } from './context/UnityContext'
import { UnityWrapper } from './bridge/UnityWrapper'
import UnityDebugOverlay from './components/UnityDebugOverlay'


function App() {
  return (
    
    <UnityProvider>
      <UnityDebugOverlay />
      <UnityWrapper />
    </UnityProvider>
  )
}

export default App;