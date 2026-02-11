import SignatureAnimation from './SignatureAnimation'
import MinecraftWorld from './MinecraftWorld'
import './App.css'

console.log('App component loaded');

function App() {
  console.log('App component rendering...');
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
