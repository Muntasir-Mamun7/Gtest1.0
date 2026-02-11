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
import { useState, useRef, useEffect, useMemo } from 'react';
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

// Block component with hover effects and smooth animations
function Block({ position, color1, onClick, infoText, emissive = false }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const scaleRef = useRef(1);

  const handleClick = () => {
    setClicked(!clicked);
    if (onClick) onClick();
  };

  // Create textured material with optional emissive and better properties
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color1 || '#7EC850'),
    roughness: 0.7,
    metalness: 0.3,
    emissive: emissive ? new THREE.Color(color1 || '#7EC850') : new THREE.Color('#000000'),
    emissiveIntensity: emissive ? 0.4 : 0,
  });

  useFrame((state) => {
    if (meshRef.current) {
      // Smooth hover rotation with easing
      if (hovered) {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.15;
        scaleRef.current += (1.15 - scaleRef.current) * 0.1;
      } else {
        meshRef.current.rotation.y += (0 - meshRef.current.rotation.y) * 0.1;
        scaleRef.current += (1 - scaleRef.current) * 0.1;
      }
      meshRef.current.scale.set(scaleRef.current, scaleRef.current, scaleRef.current);
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
      >
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      {(hovered || clicked) && infoText && (
        <Html position={[0, 1.3, 0]} center>
          <div className="block-info">
            {infoText}
          </div>
        </Html>
      )}
      {hovered && (
        <>
          <FloatingParticle position={[0.3, 1.5, 0.3]} color="#FFD700" delay={0} />
          <FloatingParticle position={[-0.3, 1.5, -0.3]} color="#FFD700" delay={0.5} />
          <FloatingParticle position={[0.3, 1.5, -0.3]} color="#FF6347" delay={0.25} />
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

// Ground plane with grass texture - Enhanced and bigger
function Ground() {
  const meshRef = useRef();
  const grassMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#7EC850') },
      uColor2: { value: new THREE.Color('#5A9D3A') },
      uColor3: { value: new THREE.Color('#6FBF44') },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vElevation;
      
      void main() {
        vUv = uv;
        vPosition = position;
        
        // Add subtle elevation variation
        float elevation = sin(position.x * 0.5) * cos(position.y * 0.5) * 0.3;
        vElevation = elevation;
        
        vec3 newPosition = position;
        newPosition.z += elevation;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      
      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vElevation;
      
      void main() {
        // Create more detailed grass pattern
        float pattern1 = mod(floor(vUv.x * 30.0) + floor(vUv.y * 30.0), 2.0);
        float pattern2 = mod(floor(vUv.x * 60.0) + floor(vUv.y * 60.0), 2.0);
        
        // Mix patterns for depth
        vec3 grassColor = mix(uColor1, uColor2, pattern1 * 0.5);
        grassColor = mix(grassColor, uColor3, pattern2 * 0.3);
        
        // Add noise for organic feel
        float noise1 = sin(vUv.x * 80.0 + uTime) * cos(vUv.y * 80.0 + uTime) * 0.08;
        float noise2 = sin(vUv.x * 120.0) * cos(vUv.y * 120.0) * 0.05;
        grassColor += noise1 + noise2;
        
        // Add elevation-based color variation
        grassColor = mix(grassColor, uColor2, vElevation * 0.5);
        
        gl_FragColor = vec4(grassColor, 1.0);
      }
    `
  }), []);
  
  useFrame((state) => {
    if (grassMaterial && grassMaterial.uniforms) {
      // Shader uniform updates are required for animation and don't trigger re-renders
      // eslint-disable-next-line react-hooks/immutability
      grassMaterial.uniforms.uTime.value = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh 
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -0.5, 0]} 
      receiveShadow
      material={grassMaterial}
    >
      <planeGeometry args={[150, 150, 50, 50]} />
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

// UAV/Drone component
function UAV({ position, color = '#404040' }) {
  const droneRef = useRef();
  const propellerRefs = [useRef(), useRef(), useRef(), useRef()];
  
  useFrame((state) => {
    if (droneRef.current) {
      // Flying path
      droneRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.5) * 10;
      droneRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 2;
      droneRef.current.position.z = position[2] + Math.cos(state.clock.elapsedTime * 0.5) * 10;
      
      // Slight tilt based on movement
      droneRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      droneRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.5) * 0.1;
    }
    
    // Spin propellers
    propellerRefs.forEach(ref => {
      if (ref.current) {
        ref.current.rotation.y += 0.5;
      }
    });
  });
  
  return (
    <group ref={droneRef} position={position}>
      {/* Main body */}
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.3, 0.8]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Arms */}
      {[[-0.5, 0, -0.5], [0.5, 0, -0.5], [-0.5, 0, 0.5], [0.5, 0, 0.5]].map((armPos, i) => (
        <group key={i} position={armPos}>
          <mesh castShadow>
            <boxGeometry args={[0.2, 0.1, 0.2]} />
            <meshStandardMaterial color="#202020" />
          </mesh>
          {/* Propeller */}
          <mesh ref={propellerRefs[i]} position={[0, 0.15, 0]}>
            <boxGeometry args={[0.4, 0.02, 0.1]} />
            <meshStandardMaterial color="#606060" metalness={0.8} />
          </mesh>
          {/* LED lights */}
          <mesh position={[0, -0.1, 0]}>
            <sphereGeometry args={[0.05]} />
            <meshStandardMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={2} />
          </mesh>
        </group>
      ))}
      
      {/* Camera underneath */}
      <mesh position={[0, -0.25, 0]} castShadow>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

// House component
function House({ position, color = '#8B4513' }) {
  return (
    <group position={position}>
      {/* Walls */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 2, 3]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2.2, 1.5, 4]} />
        <meshStandardMaterial color="#8B0000" roughness={0.8} />
      </mesh>
      
      {/* Door */}
      <mesh position={[0, 0.6, 1.51]} castShadow>
        <boxGeometry args={[0.8, 1.4, 0.1]} />
        <meshStandardMaterial color="#654321" roughness={0.9} />
      </mesh>
      
      {/* Windows */}
      <mesh position={[-1, 1.2, 1.51]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.6} metalness={0.5} />
      </mesh>
      <mesh position={[1, 1.2, 1.51]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.6} metalness={0.5} />
      </mesh>
      
      {/* Chimney */}
      <mesh position={[1, 3, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial color="#696969" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Pond component
function Pond({ position, size = 4 }) {
  const waterRef = useRef();
  const [lilypadRotations] = useState(() => [...Array(5)].map(() => Math.random() * Math.PI));
  
  useFrame((state) => {
    if (waterRef.current) {
      waterRef.current.material.emissiveIntensity = 0.2 + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });
  
  return (
    <group position={position}>
      {/* Water */}
      <mesh 
        ref={waterRef}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.05, 0]} 
        receiveShadow
      >
        <circleGeometry args={[size, 32]} />
        <meshStandardMaterial 
          color="#1E90FF" 
          transparent 
          opacity={0.7}
          metalness={0.9}
          roughness={0.1}
          emissive="#1E90FF"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Pond border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <ringGeometry args={[size, size + 0.3, 32]} />
        <meshStandardMaterial color="#8B7355" roughness={0.9} />
      </mesh>
      
      {/* Lilypads */}
      {[...Array(5)].map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        const radius = size * 0.6;
        return (
          <mesh 
            key={i}
            rotation={[-Math.PI / 2, 0, lilypadRotations[i]]} 
            position={[
              Math.cos(angle) * radius,
              0.08,
              Math.sin(angle) * radius
            ]}
          >
            <circleGeometry args={[0.3, 8]} />
            <meshStandardMaterial color="#228B22" roughness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

// Animated bird/animal component
function Bird({ position, color = '#FFD700' }) {
  const birdRef = useRef();
  const leftWingRef = useRef();
  const rightWingRef = useRef();
  
  useFrame((state) => {
    if (birdRef.current) {
      birdRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.8) * 8;
      birdRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 1;
      birdRef.current.position.z = position[2] + Math.cos(state.clock.elapsedTime * 0.8) * 8;
      birdRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.5;
    }
    
    // Flap wings
    if (leftWingRef.current) {
      leftWingRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 8) * 0.5;
    }
    if (rightWingRef.current) {
      rightWingRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 8) * -0.5;
    }
  });
  
  return (
    <group ref={birdRef} position={position}>
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[0.3, 0.2, 0.4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.1, 0.25]} castShadow>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Beak */}
      <mesh position={[0, 0.05, 0.37]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.05, 0.1, 4]} />
        <meshStandardMaterial color="#FF8C00" />
      </mesh>
      
      {/* Wings */}
      <mesh ref={leftWingRef} position={[-0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.3, 0.05, 0.4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh ref={rightWingRef} position={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.3, 0.05, 0.4]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

// NPC Person component
function Person({ position, skinColor = '#FFB366' }) {
  const personRef = useRef();
  
  useFrame((state) => {
    if (personRef.current) {
      // Slight idle animation
      personRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });
  
  return (
    <group ref={personRef} position={position}>
      {/* Head */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[0.7, 0.9, 0.4]} />
        <meshStandardMaterial color="#4169E1" />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.45, 1.2, 0]} castShadow>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh position={[0.45, 1.2, 0]} castShadow>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.2, 0.4, 0]} castShadow>
        <boxGeometry args={[0.25, 0.8, 0.25]} />
        <meshStandardMaterial color="#2F4F4F" />
      </mesh>
      <mesh position={[0.2, 0.4, 0]} castShadow>
        <boxGeometry args={[0.25, 0.8, 0.25]} />
        <meshStandardMaterial color="#2F4F4F" />
      </mesh>
    </group>
  );
}

// Shop/Portfolio showcase component
function Shop({ position, projects, certificates }) {
  const [showInfo, setShowInfo] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  return (
    <group position={position}>
      {/* Shop building */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 3, 3]} />
        <meshStandardMaterial color="#CD853F" roughness={0.9} />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.5, 0.3, 3.5]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      
      {/* Sign */}
      <mesh position={[0, 3.8, 0]} castShadow>
        <boxGeometry args={[3, 0.8, 0.2]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Door */}
      <mesh position={[0, 0.8, 1.51]} castShadow>
        <boxGeometry args={[1, 1.8, 0.1]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      
      {/* Display windows */}
      <mesh position={[-1.3, 1.5, 1.51]} castShadow>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.4} />
      </mesh>
      <mesh position={[1.3, 1.5, 1.51]} castShadow>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.4} />
      </mesh>
      
      {/* Interactive area */}
      <mesh
        position={[0, 1.5, 1.8]}
        onClick={() => setShowInfo(!showInfo)}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
          setSelectedItem('shop');
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
          setSelectedItem(null);
        }}
      >
        <boxGeometry args={[4, 3, 0.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Info display */}
      {showInfo && (
        <Html position={[0, 4.5, 0]} center>
          <div style={{
            background: 'rgba(0,0,0,0.9)',
            padding: '15px',
            borderRadius: '10px',
            border: '3px solid #FFD700',
            minWidth: '250px',
            fontFamily: "'Press Start 2P', cursive",
            fontSize: '0.6rem',
            color: '#FFD700',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '10px' }}>🏪 Portfolio Shop</h3>
            <p style={{ fontSize: '0.5rem', lineHeight: '1.6' }}>
              Projects: {projects}<br/>
              Certificates: {certificates}
            </p>
          </div>
        </Html>
      )}
      
      {selectedItem === 'shop' && (
        <Html position={[0, 4, 0]} center>
          <div className="block-info">
            Click to view Portfolio!
          </div>
        </Html>
      )}
      
      {/* Glowing particles around shop */}
      <FloatingParticle position={[-2.5, 2, 0]} color="#FFD700" delay={0} />
      <FloatingParticle position={[2.5, 2, 0]} color="#FFD700" delay={0.5} />
    </group>
  );
}

// Settings Signboard component
function SettingsSignboard({ position }) {
  const [showSettings, setShowSettings] = useState(false);
  
  return (
    <group position={position}>
      {/* Signboard post */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 2, 0.3]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Sign */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 1.5, 0.2]} />
        <meshStandardMaterial color="#F0E68C" emissive="#F0E68C" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Gear icon representation */}
      <mesh position={[0, 2.5, 0.15]} castShadow>
        <torusGeometry args={[0.3, 0.1, 6, 6]} />
        <meshStandardMaterial color="#404040" metalness={0.8} />
      </mesh>
      
      {/* Interactive area */}
      <mesh
        position={[0, 2.5, 0]}
        onClick={() => setShowSettings(!showSettings)}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <boxGeometry args={[2, 1.5, 0.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {showSettings && (
        <Html position={[0, 3.5, 0]} center>
          <div style={{
            background: 'rgba(0,0,0,0.95)',
            padding: '20px',
            borderRadius: '10px',
            border: '4px solid #FFD700',
            minWidth: '280px',
            fontFamily: "'Press Start 2P', cursive",
            fontSize: '0.55rem',
            color: '#fff'
          }}>
            <h3 style={{ color: '#FFD700', marginBottom: '15px', textAlign: 'center' }}>
              ⚙️ Settings
            </h3>
            <div style={{ lineHeight: '2' }}>
              <p>🎮 Graphics: Ultra</p>
              <p>🔊 Sound: On</p>
              <p>🌍 World Size: Large</p>
              <p>✨ Particles: High</p>
              <p>🌤️ Weather: Clear</p>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Main scene component
function Scene({ developerData }) {
  const spotLightRef = useRef();
  
  return (
    <>
      {/* Enhanced lighting setup for realistic shadows and volume */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      
      {/* Volumetric spotlight */}
      <spotLight
        ref={spotLightRef}
        position={[0, 15, 0]}
        angle={0.6}
        penumbra={0.5}
        intensity={1.5}
        castShadow
        color="#FFD700"
      />
      
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#FFD700" />
      <pointLight position={[10, 5, 10]} intensity={0.3} color="#FF6347" />
      <pointLight position={[-10, 5, -10]} intensity={0.3} color="#4169E1" />
      
      {/* Ground - Now bigger! */}
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
      
      {/* Portfolio Shop - NEW! */}
      <Shop 
        position={[-8, 0, 5]} 
        projects={15}
        certificates={8}
      />
      
      {/* Settings Signboard - NEW! */}
      <SettingsSignboard position={[8, 0, 5]} />
      
      {/* Houses - NEW! */}
      <House position={[-15, 0, -10]} color="#8B4513" />
      <House position={[-10, 0, -15]} color="#A0522D" />
      <House position={[12, 0, -12]} color="#CD853F" />
      <House position={[15, 0, 8]} color="#DEB887" />
      <House position={[-12, 0, 15]} color="#8B7355" />
      
      {/* Ponds - NEW! */}
      <Pond position={[10, 0, -5]} size={3} />
      <Pond position={[-15, 0, 5]} size={2.5} />
      
      {/* NPCs/Persons - NEW! */}
      <Person position={[-6, 0, 3]} skinColor="#FFB366" />
      <Person position={[5, 0, -1]} skinColor="#F4A460" />
      <Person position={[-3, 0, 8]} skinColor="#DEB887" />
      <Person position={[7, 0, 7]} skinColor="#FFD7B3" />
      
      {/* Birds flying - NEW! */}
      <Bird position={[-5, 8, 0]} color="#FFD700" />
      <Bird position={[10, 10, 5]} color="#87CEEB" />
      <Bird position={[0, 12, -8]} color="#FF6347" />
      
      {/* UAVs/Drones - NEW! */}
      <UAV position={[0, 15, 0]} color="#404040" />
      <UAV position={[10, 18, 10]} color="#606060" />
      
      {/* Decorative blocks */}
      <Block position={[-2, 0, 2]} color1="#808080" infoText="Stone Block" />
      <Block position={[2, 0, 2]} color1="#CD853F" infoText="Wood Block" />
      <Block position={[-3, 0, 4]} color1="#FF4500" infoText="Redstone Block" emissive={true} />
      <Block position={[3, 0, 4]} color1="#4169E1" infoText="Diamond Block" emissive={true} />
      
      {/* Treasure chest */}
      <TreasureChest position={[0, 0, 5]} />
      
      {/* More trees for bigger world */}
      <MinecraftTree position={[-6, 0, -2]} />
      <MinecraftTree position={[6, 0, 1]} />
      <MinecraftTree position={[-5, 0, 6]} />
      <MinecraftTree position={[8, 0, -8]} />
      <MinecraftTree position={[-12, 0, -5]} />
      <MinecraftTree position={[10, 0, 12]} />
      <MinecraftTree position={[-18, 0, 8]} />
      <MinecraftTree position={[15, 0, -6]} />
      
      {/* Enhanced floating particles around the scene */}
      {[...Array(40)].map((_, i) => (
        <FloatingParticle
          key={i}
          position={[
            Math.sin(i * 0.4) * 15,
            2 + Math.cos(i * 0.3) * 2,
            Math.cos(i * 0.4) * 15
          ]}
          color={i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? "#FF6347" : "#4169E1"}
          delay={i * 0.15}
        />
      ))}
      
      {/* Multiple animated clouds */}
      <Clouds />
      
      {/* Additional cloud layers for depth */}
      <group position={[5, 10, -8]}>
        <mesh>
          <boxGeometry args={[4, 1.2, 1.2]} />
          <meshStandardMaterial color="#FFFFFF" transparent opacity={0.8} />
        </mesh>
      </group>
      
      <group position={[-8, 12, 3]}>
        <mesh>
          <boxGeometry args={[3.5, 1, 1]} />
          <meshStandardMaterial color="#FFFFFF" transparent opacity={0.7} />
        </mesh>
      </group>
      
      {/* Sky */}
      <Sky 
        distance={450000}
        sunPosition={[10, 10, 5]}
        inclination={0.6}
        azimuth={0.25}
      />
      
      {/* More stars for enhanced atmosphere */}
      <Stars 
        radius={100} 
        depth={50} 
        count={8000} 
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
  console.log('MinecraftWorld component rendering...');
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
              <p>🏪 Visit the shop!</p>
              <p>⚙️ Check settings board</p>
            </>
          ) : (
            <>
              <p>🖱️ Click to lock pointer</p>
              <p>⌨️ WASD to move</p>
              <p>👆 Click blocks for info</p>
              <p>📦 Click chest to open</p>
              <p>🏪 Explore the world!</p>
            </>
          )}
        </div>
      </div>
      
      <Canvas
        shadows
        camera={{ position: [15, 12, 15], fov: 65 }}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          shadowMapType: THREE.PCFSoftShadowMap,
        }}
        onCreated={(state) => {
          console.log('Canvas created successfully. WebGL version:', state.gl.capabilities.isWebGL2 ? '2.0' : '1.0');
          console.log('Renderer:', state.gl.info.render);
        }}
        onError={(error) => {
          console.error('Canvas error:', error);
        }}
      >
        <PerspectiveCamera makeDefault position={[15, 12, 15]} />
        
        {controlMode === 'orbit' ? (
          <OrbitControls
            enableDamping
            dampingFactor={0.03}
            minDistance={5}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2.2}
            enablePan={true}
          />
        ) : (
          <PointerLockControls />
        )}
        
        <Scene developerData={developerData} />
        
        {/* Enhanced post-processing effects */}
        <EffectComposer>
          <Bloom
            intensity={0.4}
            luminanceThreshold={0.85}
            luminanceSmoothing={0.9}
            mipmapBlur={true}
          />
          <Vignette
            offset={0.3}
            darkness={0.5}
          />
        </EffectComposer>
      </Canvas>
      
      <div className="info-panel">
        <h2>World Info</h2>
        <p><strong>Developer:</strong> {developerData.name}</p>
        <p><strong>Role:</strong> {developerData.role}</p>
        <p><strong>World Size:</strong> Large (150x150)</p>
        <p><strong>Houses:</strong> 5</p>
        <p><strong>NPCs:</strong> 4</p>
        <p><strong>Drones:</strong> 2</p>
        <p><strong>Features:</strong> Shop, Settings, Ponds, Wildlife</p>
      </div>
    </div>
  );
}

export default MinecraftWorld;
