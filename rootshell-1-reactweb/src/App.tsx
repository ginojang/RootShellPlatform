import { UnityProvider } from './context/UnityContext'
import { UnityWrapper } from './components/UnityWrapper'

function App() {
  return (
    <UnityProvider>
      <UnityWrapper />
    </UnityProvider>
  )
}

export default App;