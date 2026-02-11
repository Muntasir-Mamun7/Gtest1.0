import { useState } from 'react'
import SignatureAnimation from './SignatureAnimation'
import MinecraftWorld from './MinecraftWorld'
import './App.css'

function App() {
  const [mode, setMode] = useState('minecraft') // Start with minecraft as default

  return (
    <div className="app-container">
      {mode === 'signature' ? (
        <>
          <SignatureAnimation />
          <button 
            className="mode-switch-btn"
            onClick={() => setMode('minecraft')}
          >
            🎮 Switch to 3D Game
          </button>
        </>
      ) : (
        <>
          <MinecraftWorld />
          <button 
            className="mode-switch-btn signature-mode"
            onClick={() => setMode('signature')}
          >
            ✍️ Switch to Signature
          </button>
        </>
      )}
    </div>
  )
}

export default App
