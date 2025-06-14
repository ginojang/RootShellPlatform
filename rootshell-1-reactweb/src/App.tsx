import { UnityProvider } from './context/UnityContext'
import { UnityWrapper } from './bridge/UnityWrapper'

function App() {
  return (
    <UnityProvider>
      <UnityWrapper />
    </UnityProvider>
  )
}

export default App;