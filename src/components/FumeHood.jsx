import React from 'react'

export default function FumeHood({ position, rotation = [0, 0, 0], type = 'standard', width: propWidth, height: propHeight }) {
  // Default width based on type if not provided
  const width = propWidth || (type === 'modern' ? 1.2 : 1.2)
  const depth = 0.8
  const height = propHeight || 2.2
  const baseHeight = 0.9

  // Modern Blue/White Style
  if (type === 'modern') {
    // Calculate door widths dynamically for wider units
    const numDoors = 3
    const doorGap = 0.02
    const sideMargin = 0.02
    const totalDoorSpace = width - (2 * sideMargin) - ((numDoors - 1) * doorGap)
    const doorWidth = totalDoorSpace / numDoors
    
    // Calculate door positions centered
    const doorPositions = []
    const startX = -width/2 + sideMargin + doorWidth/2
    for (let i = 0; i < numDoors; i++) {
        doorPositions.push(startX + i * (doorWidth + doorGap))
    }

    return (
      <group position={position} rotation={rotation}>
        {/* Base Cabinet */}
        <group position={[0, baseHeight / 2, 0]}>
          {/* Cabinet Body - White */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[width, baseHeight, depth]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
          
          {/* Blue Doors - Dynamic panels */}
          {doorPositions.map((x, i) => (
            <group key={i} position={[x, 0, depth / 2 + 0.01]}>
              <mesh castShadow>
                <boxGeometry args={[doorWidth, baseHeight - 0.15, 0.02]} />
                <meshStandardMaterial color="#2b6cb0" roughness={0.4} />
              </mesh>
              {/* Handle */}
              <mesh position={[doorWidth/2 - 0.05, 0.2, 0.02]}>
                <boxGeometry args={[0.1, 0.01, 0.01]} />
                <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          ))}

          {/* Kick Plate */}
          <mesh position={[0, -baseHeight/2 + 0.05, depth/2]}>
            <boxGeometry args={[width, 0.1, 0.01]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
        </group>

        {/* Chemical Resistant Worktop - Black */}
        <mesh position={[0, baseHeight + 0.025, 0.05]} castShadow receiveShadow>
          <boxGeometry args={[width + 0.05, 0.05, depth + 0.1]} />
          <meshStandardMaterial color="#1a202c" roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Upper Unit Frame - White */}
        <group position={[0, baseHeight + (height - baseHeight) / 2, 0]}>
          {/* Left Wall */}
          <mesh position={[-width / 2 + 0.025, 0, 0]} castShadow>
            <boxGeometry args={[0.05, height - baseHeight, depth]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          {/* Right Wall */}
          <mesh position={[width / 2 - 0.025, 0, 0]} castShadow>
            <boxGeometry args={[0.05, height - baseHeight, depth]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          {/* Top Panel (Behind Header) */}
          <mesh position={[0, (height - baseHeight) / 2 - 0.025, 0]} castShadow>
            <boxGeometry args={[width, 0.05, depth]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          {/* Back Wall */}
          <mesh position={[0, 0, -depth / 2 + 0.01]}>
            <boxGeometry args={[width, height - baseHeight, 0.02]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>

          {/* Baffles (Slots) on Back Wall */}
          <group position={[0, -0.2, -depth / 2 + 0.025]}>
            {[-0.3, -0.15, 0, 0.15, 0.3].map((y, i) => (
               <group key={i} position={[0, y, 0]}>
                 {[-0.4, -0.2, 0, 0.2, 0.4].map((x, j) => (
                   <mesh key={j} position={[x, 0, 0]}>
                     <boxGeometry args={[0.1, 0.015, 0.001]} />
                     <meshStandardMaterial color="#cbd5e0" />
                   </mesh>
                 ))}
               </group>
            ))}
          </group>
        </group>

        {/* Header Panel - Blue */}
        <group position={[0, height - 0.15, depth/2]}>
          <mesh position={[0, 0, 0]}>
             <boxGeometry args={[width, 0.3, 0.05]} />
             <meshStandardMaterial color="#2b6cb0" roughness={0.4} />
          </mesh>
          {/* "FUME HOOD" Text Simulation (White Strips) */}
          <mesh position={[-0.3, 0, 0.03]}>
             <boxGeometry args={[0.4, 0.04, 0.01]} />
             <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
          </mesh>
        </group>

        {/* Sash Window */}
        <group position={[0, baseHeight + 0.6, depth/2]}>
          {/* Glass */}
          <mesh>
            <boxGeometry args={[width - 0.15, 0.9, 0.02]} />
            <meshStandardMaterial 
              color="#e6fffa" 
              transparent 
              opacity={0.3} 
              roughness={0.0} 
              metalness={0.9} 
            />
          </mesh>
          {/* Handle/Frame Bottom */}
          <mesh position={[0, -0.45, 0.02]}>
            <boxGeometry args={[width - 0.15, 0.04, 0.04]} />
            <meshStandardMaterial color="#a0aec0" metalness={0.5} />
          </mesh>
        </group>

        {/* Control Panel - Right Column */}
        <group position={[width/2 - 0.05, baseHeight + 0.5, depth/2 + 0.02]}>
           <mesh position={[0, 0, 0]}>
             <boxGeometry args={[0.08, 0.4, 0.01]} />
             <meshStandardMaterial color="#e2e8f0" />
           </mesh>
           {/* Buttons/Screen */}
           <mesh position={[0, 0.1, 0.01]}>
             <boxGeometry args={[0.05, 0.08, 0.005]} />
             <meshStandardMaterial color="#2d3748" />
           </mesh>
           <mesh position={[0, -0.05, 0.01]}>
             <cylinderGeometry args={[0.015, 0.015, 0.01]} rotation={[Math.PI/2, 0, 0]} />
             <meshStandardMaterial color="#48bb78" />
           </mesh>
           <mesh position={[0, -0.12, 0.01]}>
             <cylinderGeometry args={[0.015, 0.015, 0.01]} rotation={[Math.PI/2, 0, 0]} />
             <meshStandardMaterial color="#f56565" />
           </mesh>
        </group>
      </group>
    )
  }

  // Standard Style (Default)
  return (
    <group position={position} rotation={rotation}>
      {/* Base Cabinet */}
      <group position={[0, baseHeight / 2, 0]}>
        {/* Cabinet Body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[width, baseHeight, depth]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.5} />
        </mesh>
        
        {/* Cabinet Door - Beige/Cream color */}
        <mesh position={[0, 0, depth / 2 + 0.01]} castShadow>
          <boxGeometry args={[width - 0.1, baseHeight - 0.1, 0.02]} />
          <meshStandardMaterial color="#f0e6d2" roughness={0.4} />
        </mesh>
        
        {/* Warning Label */}
        <mesh position={[0, 0.15, depth / 2 + 0.02]}>
          <boxGeometry args={[0.15, 0.15, 0.01]} />
          <meshStandardMaterial color="#ffd700" emissive="#ffaa00" emissiveIntensity={0.3} />
        </mesh>
        
        {/* Door Handle */}
        <mesh position={[0.3, 0, depth / 2 + 0.03]}>
          <cylinderGeometry args={[0.015, 0.015, 0.15]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#888888" roughness={0.2} metalness={0.8} />
        </mesh>
      </group>

      {/* Main Frame */}
      <group position={[0, baseHeight + (height - baseHeight) / 2, 0]}>
        {/* Left Frame */}
        <mesh position={[-width / 2 + 0.025, 0, 0]} castShadow>
          <boxGeometry args={[0.05, height - baseHeight, depth]} />
          <meshStandardMaterial color="#4a5568" roughness={0.4} metalness={0.6} />
        </mesh>
        
        {/* Right Frame */}
        <mesh position={[width / 2 - 0.025, 0, 0]} castShadow>
          <boxGeometry args={[0.05, height - baseHeight, depth]} />
          <meshStandardMaterial color="#4a5568" roughness={0.4} metalness={0.6} />
        </mesh>
        
        {/* Top Frame */}
        <mesh position={[0, (height - baseHeight) / 2 - 0.025, 0]} castShadow>
          <boxGeometry args={[width, 0.05, depth]} />
          <meshStandardMaterial color="#4a5568" roughness={0.4} metalness={0.6} />
        </mesh>
        
        {/* Bottom Frame */}
        <mesh position={[0, -(height - baseHeight) / 2 + 0.025, 0]} castShadow>
          <boxGeometry args={[width, 0.05, depth]} />
          <meshStandardMaterial color="#4a5568" roughness={0.4} metalness={0.6} />
        </mesh>
      </group>

      {/* Interior White Workspace */}
      <group position={[0, baseHeight + (height - baseHeight) / 2, -depth / 2 + 0.05]}>
        {/* Back Wall */}
        <mesh>
          <boxGeometry args={[width - 0.1, height - baseHeight - 0.1, 0.02]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        
        {/* Side Walls */}
        <mesh position={[-width / 2 + 0.05, 0, depth / 4]}>
          <boxGeometry args={[0.02, height - baseHeight - 0.1, depth / 2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        <mesh position={[width / 2 - 0.05, 0, depth / 4]}>
          <boxGeometry args={[0.02, height - baseHeight - 0.1, depth / 2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        
        {/* Top */}
        <mesh position={[0, (height - baseHeight) / 2 - 0.05, depth / 4]}>
          <boxGeometry args={[width - 0.1, 0.02, depth / 2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        
        {/* Work Surface */}
        <mesh position={[0, -(height - baseHeight) / 2 + 0.05, depth / 4]}>
          <boxGeometry args={[width - 0.1, 0.02, depth / 2]} />
          <meshStandardMaterial color="#e8e8e8" roughness={0.4} />
        </mesh>
      </group>

      {/* Glass Sash - Upper Section */}
      <group position={[0, baseHeight + (height - baseHeight) * 0.7, depth / 2 - 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[width - 0.12, (height - baseHeight) * 0.4, 0.03]} />
          <meshStandardMaterial 
            color="#d0e8f5" 
            transparent 
            opacity={0.25}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
        
        {/* Glass Frame */}
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[width - 0.1, (height - baseHeight) * 0.42, 0.01]} />
          <meshStandardMaterial color="#4a5568" roughness={0.4} metalness={0.5} />
        </mesh>
      </group>

      {/* Glass Sash - Lower Section (Main Working Window) */}
      <group position={[0, baseHeight + (height - baseHeight) * 0.35, depth / 2 - 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[width - 0.12, (height - baseHeight) * 0.5, 0.03]} />
          <meshStandardMaterial 
            color="#d0e8f5" 
            transparent 
            opacity={0.25}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
        
        {/* Glass Frame */}
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[width - 0.1, (height - baseHeight) * 0.52, 0.01]} />
          <meshStandardMaterial color="#4a5568" roughness={0.4} metalness={0.5} />
        </mesh>
        
        {/* Handle */}
        <mesh position={[0, -(height - baseHeight) * 0.22, 0.02]}>
          <boxGeometry args={[0.3, 0.02, 0.02]} />
          <meshStandardMaterial color="#666666" roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* Control Panel - Right Side */}
      <group position={[width / 2 - 0.05, baseHeight + 0.8, 0]}>
        {/* Panel Background */}
        <mesh position={[0.03, 0, 0]} castShadow>
          <boxGeometry args={[0.06, 0.4, 0.15]} />
          <meshStandardMaterial color="#2d3748" roughness={0.3} metalness={0.5} />
        </mesh>
        
        {/* Indicator Lights */}
        {[0.12, 0.04, -0.04, -0.12].map((y, i) => (
          <mesh key={i} position={[0.04, y, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.01]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial 
              color={i === 1 ? "#00ff00" : i === 2 ? "#00ffff" : "#ff0000"}
              emissive={i === 1 ? "#00ff00" : i === 2 ? "#00ffff" : "#ff0000"}
              emissiveIntensity={i === 1 ? 0.8 : 0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Internal Lighting */}
      <pointLight 
        position={[0, baseHeight + height - baseHeight - 0.2, 0]}
        intensity={1.5}
        distance={2}
        color="#ffffff"
      />
    </group>
  )
}
