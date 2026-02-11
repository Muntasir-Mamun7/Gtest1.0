import SignatureAnimation from './SignatureAnimation'
import MinecraftWorld from './MinecraftWorld'
import './App.css'

function App() {
  return (
    <div className="app-container map-layout">
      <div className="signature-section">
        <SignatureAnimation />
      </div>
      <div className="minecraft-section">
        <MinecraftWorld />
      </div>
    </div>
  )
}

export default App
