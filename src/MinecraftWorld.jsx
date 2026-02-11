/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Sky, 
  Html,
  PerspectiveCamera,
  PointerLockControls,
  Stars
} from '@react-three/drei';
import { 
  EffectComposer, 
  Bloom, 
  Vignette 
} from '@react-three/postprocessing';
import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import './MinecraftWorld.css';

// Helper function for creating consistent text label styles
const createLabelStyle = (fontSize = '1rem', color = '#FFFFFF', shadowSize = '2px') => ({
  fontFamily: "'Press Start 2P', cursive",
  fontSize,
  color,
  textShadow: `${shadowSize} ${shadowSize} 0 #000`,
  whiteSpace: 'nowrap',
  pointerEvents: 'none'
});

// Floating particle component
function FloatingParticle({ position, color, delay = 0 }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + delay) * 0.5;
      meshRef.current.rotation.y += 0.02;
    }
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

// Block component with hover effects
function Block({ position, color1, onClick, infoText, emissive = false }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);
    if (onClick) onClick();
  };

  // Create textured material with optional emissive
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color1 || '#7EC850'),
    roughness: 0.8,
    metalness: 0.2,
    emissive: emissive ? new THREE.Color(color1 || '#7EC850') : new THREE.Color('#000000'),
    emissiveIntensity: emissive ? 0.3 : 0,
  });

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    } else if (meshRef.current && !hovered) {
      meshRef.current.rotation.y = 0;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        material={material}
        castShadow
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
        scale={hovered ? 1.1 : 1}
      >
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      {(hovered || clicked) && infoText && (
        <Html position={[0, 1, 0]} center>
          <div className="block-info">
            {infoText}
          </div>
        </Html>
      )}
      {hovered && (
        <>
          <FloatingParticle position={[0.3, 1.5, 0.3]} color="#FFD700" delay={0} />
          <FloatingParticle position={[-0.3, 1.5, -0.3]} color="#FFD700" delay={0.5} />
        </>
      )}
    </group>
  );
}

// Treasure chest component
function TreasureChest({ position }) {
  const [opened, setOpened] = useState(false);
  const lidRef = useRef();
  
  useFrame(() => {
    if (lidRef.current) {
      const targetRotation = opened ? -Math.PI / 3 : 0;
      lidRef.current.rotation.x += (targetRotation - lidRef.current.rotation.x) * 0.1;
    }
  });
  
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.5, 0.8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      
      {/* Lid */}
      <group ref={lidRef} position={[0, 0.5, -0.4]}>
        <mesh position={[0, 0.25, 0.4]} castShadow>
          <boxGeometry args={[1.2, 0.5, 0.8]} />
          <meshStandardMaterial color="#654321" roughness={0.9} />
        </mesh>
      </group>
      
      {/* Lock */}
      <mesh position={[0, 0.3, 0.41]} castShadow>
        <boxGeometry args={[0.2, 0.3, 0.1]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Click area */}
      <mesh
        position={[0, 0.5, 0]}
        onClick={() => setOpened(!opened)}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <boxGeometry args={[1.2, 1, 0.8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {opened && (
        <>
          <FloatingParticle position={[0, 1.5, 0]} color="#FFD700" delay={0} />
          <FloatingParticle position={[0.3, 1.7, 0.3]} color="#FFD700" delay={0.3} />
          <FloatingParticle position={[-0.3, 1.7, -0.3]} color="#FFD700" delay={0.6} />
          <Html position={[0, 1.8, 0]} center>
            <div className="block-info">🎉 Passionate Developer!</div>
          </Html>
        </>
      )}
    </group>
  );
}

// Tree component
function MinecraftTree({ position }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 2, 0.5]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <meshStandardMaterial color="#654321" roughness={0.9} />
      </mesh>
      
      {/* Leaves */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#228B22" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1, 1.5]} />
        <meshStandardMaterial color="#2E8B57" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Information tower with developer data
function InfoTower({ developerData }) {
  const blocks = [
    { 
      pos: [0, 0, 0], 
      color1: '#654321',
      info: `${developerData.name}`
    },
    { 
      pos: [0, 1, 0], 
      color1: '#FFD700',
      info: `Role: ${developerData.role}`
    },
    { 
      pos: [0, 2, 0], 
      color1: '#4169E1',
      info: `Location: ${developerData.location}`
    },
    { 
      pos: [0, 3, 0], 
      color1: '#32CD32',
      info: `Focus: ${developerData.currentFocus}`
    },
    { 
      pos: [0, 4, 0], 
      color1: '#FF6347',
      info: `Passion: ${developerData.passion}`
    },
  ];

  return (
    <group position={[0, 0, 0]}>
      {blocks.map((block, i) => (
        <Block
          key={i}
          position={block.pos}
          color1={block.color1}
          infoText={block.info}
        />
      ))}
      <Html position={[0, 5.5, 0]} center>
        <div style={createLabelStyle('1.5rem', '#FFD700', '3px')}>
          {developerData.name}
        </div>
      </Html>
    </group>
  );
}

// Skills blocks display
function SkillsDisplay({ languages, position }) {
  return (
    <group position={position}>
      {languages.map((lang, i) => (
        <Block
          key={i}
          position={[i * 1.2, 0, 0]}
          color1="#9370DB"
          infoText={lang}
        />
      ))}
      <Html position={[languages.length * 0.6 - 0.6, 1.5, 0]} center>
        <div style={createLabelStyle('1rem', '#FFFFFF', '2px')}>
          Languages
        </div>
      </Html>
    </group>
  );
}

// Technologies showcase
function TechShowcase({ technologies, position }) {
  const allTechs = [
    ...technologies.blockchain,
    ...technologies.tools,
    ...technologies.learning
  ];

  return (
    <group position={position}>
      {allTechs.slice(0, 8).map((tech, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        return (
          <Block
            key={i}
            position={[col * 1.2, row * 1.2, 0]}
            color1="#FF4500"
            infoText={tech}
          />
        );
      })}
      <Html position={[1.5, 2.5, 0]} center>
        <div style={createLabelStyle('1rem', '#FFFFFF', '2px')}>
          Technologies
        </div>
      </Html>
    </group>
  );
}

// Ground plane with grass texture
function Ground() {
  const meshRef = useRef();
  
  // Create custom shader material for ground with animated grass
  const grassMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#7EC850') },
      uColor2: { value: new THREE.Color('#5A9D3A') },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        // Create grass-like pattern
        float pattern = mod(floor(vUv.x * 20.0) + floor(vUv.y * 20.0), 2.0);
        vec3 grassColor = mix(uColor1, uColor2, pattern * 0.5);
        
        // Add some variation
        float noise = sin(vUv.x * 50.0) * cos(vUv.y * 50.0) * 0.1;
        grassColor += noise;
        
        gl_FragColor = vec4(grassColor, 1.0);
      }
    `
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (meshRef.current) {
        grassMaterial.uniforms.uTime.value += 0.01;
      }
    }, 16);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <mesh 
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -0.5, 0]} 
      receiveShadow
      material={grassMaterial}
    >
      <planeGeometry args={[50, 50, 20, 20]} />
    </mesh>
  );
}

// Animated clouds
function Clouds() {
  const cloudRef = useRef();
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (cloudRef.current) {
        cloudRef.current.position.x += 0.01;
        if (cloudRef.current.position.x > 15) {
          cloudRef.current.position.x = -15;
        }
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <group ref={cloudRef} position={[-10, 8, -5]}>
      <mesh>
        <boxGeometry args={[3, 1, 1]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[1.5, 0, 0]}>
        <boxGeometry args={[2, 1, 1]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}

// Main scene component
function Scene({ developerData }) {
  const spotLightRef = useRef();
  
  return (
    <>
      {/* Lighting setup for realistic shadows and volume */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Volumetric spotlight */}
      <spotLight
        ref={spotLightRef}
        position={[0, 10, 0]}
        angle={0.5}
        penumbra={0.5}
        intensity={1.5}
        castShadow
        color="#FFD700"
      />
      
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#FFD700" />
      
      {/* Ground */}
      <Ground />
      
      {/* Developer info tower (center) */}
      <InfoTower developerData={developerData} />
      
      {/* Skills display */}
      <SkillsDisplay 
        languages={developerData.languages} 
        position={[-4, 0, -3]} 
      />
      
      {/* Technologies showcase */}
      <TechShowcase 
        technologies={developerData.technologies} 
        position={[2, 0, -3]} 
      />
      
      {/* Decorative blocks */}
      <Block position={[-2, 0, 2]} color1="#808080" infoText="Stone Block" />
      <Block position={[2, 0, 2]} color1="#CD853F" infoText="Wood Block" />
      <Block position={[-3, 0, 4]} color1="#FF4500" infoText="Redstone Block" emissive={true} />
      <Block position={[3, 0, 4]} color1="#4169E1" infoText="Diamond Block" emissive={true} />
      
      {/* Treasure chest */}
      <TreasureChest position={[0, 0, 5]} />
      
      {/* Trees */}
      <MinecraftTree position={[-6, 0, -2]} />
      <MinecraftTree position={[6, 0, 1]} />
      <MinecraftTree position={[-5, 0, 6]} />
      
      {/* Floating golden particles around the scene */}
      {[...Array(20)].map((_, i) => (
        <FloatingParticle
          key={i}
          position={[
            Math.sin(i * 0.5) * 8,
            2 + Math.cos(i * 0.3) * 2,
            Math.cos(i * 0.5) * 8
          ]}
          color="#FFD700"
          delay={i * 0.2}
        />
      ))}
      
      {/* Animated clouds */}
      <Clouds />
      
      {/* Sky */}
      <Sky 
        distance={450000}
        sunPosition={[10, 10, 5]}
        inclination={0.6}
        azimuth={0.25}
      />
      
      {/* Stars for added atmosphere */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1}
      />
    </>
  );
}

// Main component
function MinecraftWorld() {
  const [controlMode, setControlMode] = useState('orbit'); // 'orbit' or 'fps'
  
  const developerData = {
    name: "Muntasir Mamun",
    role: "Software Developer",
    location: "🌍 Earth",
    currentFocus: "Blockchain & Smart Contracts",
    languages: ["Java", "C++", "C#", "Solidity", "JavaScript"],
    technologies: {
      blockchain: ["Ethereum", "Smart Contracts", "Solidity"],
      tools: ["Git", "Unity", "Figma", "Canva"],
      learning: ["Web3", "DeFi", "NFTs"]
    },
    passion: "Building innovative solutions with code 💡"
  };

  return (
    <div className="minecraft-container">
      <div className="controls-ui">
        <h1 className="title">{developerData.name.split(' ')[0]}&apos;s Minecraft Portfolio</h1>
        <div className="control-buttons">
          <button 
            className={controlMode === 'orbit' ? 'active' : ''}
            onClick={() => setControlMode('orbit')}
          >
            🎮 Orbit View
          </button>
          <button 
            className={controlMode === 'fps' ? 'active' : ''}
            onClick={() => setControlMode('fps')}
          >
            🏃 First Person
          </button>
        </div>
        <div className="instructions">
          {controlMode === 'orbit' ? (
            <>
              <p>🖱️ Click and drag to rotate</p>
              <p>🔍 Scroll to zoom</p>
              <p>👆 Click blocks for info</p>
              <p>📦 Click chest to open</p>
            </>
          ) : (
            <>
              <p>🖱️ Click to lock pointer</p>
              <p>⌨️ WASD to move</p>
              <p>👆 Click blocks for info</p>
              <p>📦 Click chest to open</p>
            </>
          )}
        </div>
      </div>
      
      <Canvas
        shadows
        camera={{ position: [8, 6, 8], fov: 60 }}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <PerspectiveCamera makeDefault position={[8, 6, 8]} />
        
        {controlMode === 'orbit' ? (
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={3}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2}
          />
        ) : (
          <PointerLockControls />
        )}
        
        <Scene developerData={developerData} />
        
        {/* Post-processing effects: Bloom, Vignette */}
        <EffectComposer>
          <Bloom
            intensity={0.3}
            luminanceThreshold={0.9}
            luminanceSmoothing={0.9}
          />
          <Vignette
            offset={0.3}
            darkness={0.5}
          />
        </EffectComposer>
      </Canvas>
      
      <div className="info-panel">
        <h2>Developer Info</h2>
        <p><strong>Name:</strong> {developerData.name}</p>
        <p><strong>Role:</strong> {developerData.role}</p>
        <p><strong>Focus:</strong> {developerData.currentFocus}</p>
        <p><strong>Passion:</strong> {developerData.passion}</p>
      </div>
    </div>
  );
}

export default MinecraftWorld;
