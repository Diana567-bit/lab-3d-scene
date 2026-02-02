import React, { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function Door({ position }) {
  const [isOpen, setIsOpen] = useState(false)
  const doorRef = useRef()
  
  useFrame((state, delta) => {
    if (doorRef.current) {
      const targetRotation = isOpen ? -Math.PI / 2 : 0
      doorRef.current.rotation.y += (targetRotation - doorRef.current.rotation.y) * delta * 3
    }
  })

  return (
    <group position={position}>
        {/* Frame is static */}
        <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0, 0]}>
            <boxGeometry args={[1.6, 2.5, 0.05]} />
            <meshStandardMaterial color="#e0e0e0" roughness={0.6} />
        </mesh>
        
        {/* Moving Door Part */}
        <group 
            ref={doorRef} 
            position={[0, 0, 0.75]} 
            onClick={(e) => {
                e.stopPropagation()
                setIsOpen(!isOpen)
            }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}
        >
            <group position={[0, 0, -0.75]}> 
                <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
                    <boxGeometry args={[1.5, 2.4, 0.05]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.4} metalness={0.1} />
                </mesh>
                {/* Door Handle */}
                <mesh position={[0.6, 0, 0.05]} rotation={[0, Math.PI / 2, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.15]} rotation={[0, 0, Math.PI / 2]} />
                    <meshStandardMaterial color="#888888" roughness={0.3} metalness={0.8} />
                </mesh>
            </group>
        </group>
    </group>
  )
}

function LabWindow({ position, rotation, isDay = true }) {
  const outerWidth = 1.8
  const outerHeight = 2.6
  const sashWidth = 0.85
  const sashHeight = 2.3
  const frameThick = 0.08

  const Sash = ({ position }) => (
    <group position={position}>
      {/* Top Frame */}
      <mesh position={[0, sashHeight/2 - frameThick/2, 0]}>
        <boxGeometry args={[sashWidth, frameThick, 0.05]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      {/* Bottom Frame */}
      <mesh position={[0, -sashHeight/2 + frameThick/2, 0]}>
        <boxGeometry args={[sashWidth, frameThick, 0.05]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      {/* Left Frame */}
      <mesh position={[-sashWidth/2 + frameThick/2, 0, 0]}>
        <boxGeometry args={[frameThick, sashHeight - 2*frameThick, 0.05]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      {/* Right Frame */}
      <mesh position={[sashWidth/2 - frameThick/2, 0, 0]}>
        <boxGeometry args={[frameThick, sashHeight - 2*frameThick, 0.05]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      
      {/* Glass Pane */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[sashWidth - 2*frameThick, sashHeight - 2*frameThick]} />
        <meshStandardMaterial 
            color={isDay ? "#ffffee" : "#d0e8f5"} 
            transparent 
            opacity={isDay ? 0.6 : 0.3} 
            roughness={0.0}
            metalness={0.9}
            envMapIntensity={1}
            emissive={isDay ? "#ffffaa" : "#000000"}
            emissiveIntensity={isDay ? 0.5 : 0}
        />
      </mesh>
    </group>
  )

  return (
    <group position={position} rotation={rotation}>
      {/* Outer Frame (Constructed from 4 bars to be hollow) */}
      {/* Top */}
      <mesh position={[0, outerHeight/2 - 0.05, -0.05]}>
        <boxGeometry args={[outerWidth, 0.1, 0.15]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -outerHeight/2 + 0.05, -0.05]}>
        <boxGeometry args={[outerWidth, 0.1, 0.15]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      {/* Left */}
      <mesh position={[-outerWidth/2 + 0.05, 0, -0.05]}>
        <boxGeometry args={[0.1, outerHeight, 0.15]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      {/* Right */}
      <mesh position={[outerWidth/2 - 0.05, 0, -0.05]}>
        <boxGeometry args={[0.1, outerHeight, 0.15]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>

      {/* Left Sash (Inner/Forward) */}
      <Sash position={[-0.4, 0, 0.02]} />
      
      {/* Handle on Left Sash */}
      <mesh position={[-0.4 + sashWidth/2 - 0.06, 0, 0.06]}>
        <boxGeometry args={[0.02, 0.15, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>

      {/* Right Sash (Outer/Backward) */}
      <Sash position={[0.4, 0, -0.02]} />
      
      {/* Sunlight Rays Effect (Day Only) */}
      {isDay && (
        <>
          <spotLight 
            position={[0.5, 0, 0.3]} 
            angle={0.6} 
            penumbra={0.5} 
            intensity={3} 
            distance={8}
            color="#ffffee"
            castShadow
          />
          <spotLight 
            position={[-0.5, 0.5, 0.3]} 
            angle={0.5} 
            penumbra={0.6} 
            intensity={2} 
            distance={7}
            color="#ffffdd"
          />
        </>
      )}

      {/* Blinds / Roller Shade Housing */}
      <mesh position={[0, 1.25, 0.05]} castShadow>
        <boxGeometry args={[1.9, 0.25, 0.15]} />
        <meshStandardMaterial color="#f8f8f8" roughness={0.5} />
      </mesh>
      
      {/* Window Sill */}
      <mesh position={[0, -1.35, 0.08]} receiveShadow>
        <boxGeometry args={[2.0, 0.1, 0.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
    </group>
  )
}

function Ceiling({ width, length, height, lightsOn, isDay }) {
  // Grid configuration
  const tileSize = 2
  const gap = 0.06
  
  // Calculate grid layout
  // Room is centered at 0,0
  // width 14 -> range -7 to 7
  // length 18 -> range -9 to 9
  
  const tilesX = Math.floor(width / tileSize) // 7
  const tilesZ = Math.floor(length / tileSize) // 9
  
  // Generate tiles
  const tiles = []
  for (let x = -Math.floor(tilesX/2); x <= Math.floor(tilesX/2); x++) {
    for (let z = -Math.floor(tilesZ/2); z <= Math.floor(tilesZ/2); z++) {
      // Calculate position (center of tile)
      const posX = x * tileSize
      const posZ = z * tileSize
      
      // Check if this tile is a light
      // Lights at X: -4, 0, 4
      // Lights at Z: -6, -2, 2, 6
      const isLightX = Math.abs(posX) === 4 || posX === 0
      const isLightZ = Math.abs(posZ) === 6 || Math.abs(posZ) === 2
      const isLight = isLightX && isLightZ
      
      tiles.push({ x: posX, z: posZ, isLight })
    }
  }

  return (
    <group position={[0, height, 0]}>
      {/* Main Grid Background (The "T-bar" color) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
         <planeGeometry args={[width, length]} />
         <meshStandardMaterial color={isDay ? "#999999" : "#555555"} roughness={0.5} metalness={0.5} />
      </mesh>
      
      {/* Tiles */}
      {tiles.map((tile, i) => (
        <group key={i} position={[tile.x, 0, tile.z]}>
           {/* The Tile Panel */}
           <mesh rotation={[Math.PI / 2, 0, 0]}>
              <boxGeometry args={[tileSize - gap, tileSize - gap, 0.02]} />
              <meshStandardMaterial 
                color={tile.isLight ? "#ffffff" : (isDay ? "#ffffff" : "#cccccc")} 
                roughness={tile.isLight ? 0.2 : 0.6}
                emissive={tile.isLight ? (lightsOn ? "#ffffff" : (isDay ? "#ffffff" : "#000000")) : "#000000"}
                emissiveIntensity={tile.isLight ? (lightsOn ? 2.0 : (isDay ? 0.2 : 0)) : 0}
              />
           </mesh>
           
           {/* Actual Light Source for light tiles */}
           {tile.isLight && lightsOn && (
             <pointLight 
                position={[0, -0.5, 0]} 
                intensity={0.8} 
                distance={8} 
                color="#ffffff"
             />
           )}
        </group>
      ))}
    </group>
  )
}
function SafetyPoster({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Board Background */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.7, 1.0, 0.02]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      
      {/* Header - Blue */}
      <mesh position={[0, 0.4, 0.011]}>
        <planeGeometry args={[0.6, 0.12]} />
        <meshStandardMaterial color="#0077cc" />
      </mesh>
      
      {/* Title Text Placeholder - White strip */}
      <mesh position={[0, 0.4, 0.012]}>
        <planeGeometry args={[0.4, 0.04]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Content Blocks - Text simulation */}
      {/* Left Column */}
      <group position={[-0.15, 0, 0]}>
          {[0.2, 0.1, 0, -0.1, -0.2, -0.3, -0.4].map((y, i) => (
            <mesh key={`l-${i}`} position={[0, y, 0.011]}>
                <planeGeometry args={[0.25, 0.015]} />
                <meshStandardMaterial color="#555555" />
            </mesh>
          ))}
      </group>
      
      {/* Right Column */}
      <group position={[0.15, 0, 0]}>
          {[0.2, 0.1, 0, -0.1, -0.2, -0.3, -0.4].map((y, i) => (
            <mesh key={`r-${i}`} position={[0, y, 0.011]}>
                <planeGeometry args={[0.25, 0.015]} />
                <meshStandardMaterial color="#555555" />
            </mesh>
          ))}
      </group>
      
      {/* Blue Footer */}
      <mesh position={[0, -0.45, 0.011]}>
        <planeGeometry args={[0.6, 0.03]} />
        <meshStandardMaterial color="#0077cc" />
      </mesh>
    </group>
  )
}

function LightSwitch({ position, isOn, onToggle }) {
  return (
    <group position={position}>
      {/* Base Plate - Darker Gray/Silver to contrast with wall */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.14, 0.09, 0.01]} />
        <meshStandardMaterial color="#888888" roughness={0.3} metalness={0.4} />
      </mesh>
      
      {/* Rocker Panel - Lighter Gray */}
      <group 
        position={[0.008, 0.005, 0]} 
        rotation={[0, 0, isOn ? -0.08 : 0.08]} // Rocking animation
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <mesh rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[0.10, 0.07, 0.015]} />
            <meshStandardMaterial color="#bbbbbb" roughness={0.4} metalness={0.2} />
        </mesh>
        
        {/* LED Indicator Strip - Horizontal Slit */}
        <mesh position={[0.008, 0.015, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.02, 0.003]} />
            <meshStandardMaterial 
                color={isOn ? "#00aaff" : "#444444"} 
                emissive={isOn ? "#00aaff" : "#000000"}
                emissiveIntensity={isOn ? 2 : 0}
            />
        </mesh>
      </group>
      
      {/* Brand Logo Placeholder */}
      <mesh position={[0.006, -0.035, 0]} rotation={[0, Math.PI / 2, 0]}>
         <planeGeometry args={[0.02, 0.01]} />
         <meshStandardMaterial color="#666666" />
      </mesh>
    </group>
  )
}

export default function Room({ width = 15, length = 20, height = 4, lightsOn, toggleLights, overheadLightsOn, toggleOverheadLights, isDay = true }) {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#e8dcc8" roughness={0.9} metalness={0.05} />
      </mesh>
      
      {/* Main Light Switch near Door */}
      <LightSwitch position={[-width / 2 + 0.1, 1.4, -3.9]} isOn={lightsOn} onToggle={toggleLights} />
      
      {/* Overhead Light Switch (Next to Main Switch) */}
      <LightSwitch position={[-width / 2 + 0.1, 1.4, -3.7]} isOn={overheadLightsOn} onToggle={toggleOverheadLights} />

      {/* Ceiling Grid */}
      <Ceiling width={width} length={length} height={height} lightsOn={lightsOn} isDay={isDay} />

      {/* Back Wall */}
      <mesh position={[0, height / 2, -length / 2]} receiveShadow>
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color="#fafafa" roughness={0.85} />
      </mesh>

      {/* Front Wall (Invisible from camera usually, but good to have) */}
      <mesh position={[0, height / 2, length / 2]} receiveShadow>
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color="#fafafa" roughness={0.85} side={2} /> 
      </mesh>

      {/* Left Wall */}
      <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[length, height, 0.1]} />
        <meshStandardMaterial color="#fafafa" roughness={0.85} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[length, height, 0.1]} />
        <meshStandardMaterial color="#fafafa" roughness={0.85} />
      </mesh>
      
      {/* Windows on Right Wall */}
      {[ -5, 0, 5 ].map((z, i) => (
        <LabWindow key={`win-${i}`} position={[width / 2 - 0.1, 2.2, z]} rotation={[0, -Math.PI / 2, 0]} isDay={isDay} />
      ))}

      {/* Safety Management Posters on Right Wall (between windows) */}
      {[ -2.5, 2.5 ].map((z, i) => (
        <SafetyPoster key={`poster-${i}`} position={[width / 2 - 0.11, 2.2, z]} rotation={[0, -Math.PI / 2, 0]} />
      ))}

      {/* Door on Left Wall */}
      <Door position={[-width / 2 + 0.1, 1.2, -5]} />
    </group>
  )
}
