import React from 'react'

export default function WorkbenchCabinet({ position, rotation = [0, 0, 0] }) {
  const width = 1.2
  const height = 0.9
  const depth = 0.6

  return (
    <group position={position} rotation={rotation}>
      {/* Top Worksurface - Dark Gray */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.05, depth]} />
        <meshStandardMaterial color="#5a6c7d" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Cabinet Body - White/Light Gray */}
      <mesh position={[0, (height - 0.05) / 2 - 0.025, 0]} castShadow receiveShadow>
        <boxGeometry args={[width - 0.04, height - 0.05, depth - 0.04]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.5} />
      </mesh>

      {/* Cabinet Doors */}
      <group position={[0, (height - 0.05) / 2 - 0.025, depth / 2 + 0.01]}>
        {/* Left Door */}
        <mesh position={[-width / 4, 0, 0]} castShadow>
          <boxGeometry args={[width / 2 - 0.06, height - 0.15, 0.02]} />
          <meshStandardMaterial color="#d0d0d0" roughness={0.4} />
        </mesh>
        
        {/* Right Door */}
        <mesh position={[width / 4, 0, 0]} castShadow>
          <boxGeometry args={[width / 2 - 0.06, height - 0.15, 0.02]} />
          <meshStandardMaterial color="#d0d0d0" roughness={0.4} />
        </mesh>

        {/* Door Handles - Vertical bars */}
        <mesh position={[-width / 8, 0, 0.02]}>
          <cylinderGeometry args={[0.008, 0.008, 0.15]} />
          <meshStandardMaterial color="#888888" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[width / 8, 0, 0.02]}>
          <cylinderGeometry args={[0.008, 0.008, 0.15]} />
          <meshStandardMaterial color="#888888" roughness={0.2} metalness={0.8} />
        </mesh>
      </group>

      {/* Base/Plinth */}
      <mesh position={[0, -height / 2 - 0.02, 0]}>
        <boxGeometry args={[width + 0.02, 0.04, depth + 0.02]} />
        <meshStandardMaterial color="#b0b0b0" roughness={0.6} />
      </mesh>

      {/* Side Panels - Darker accent */}
      <mesh position={[-width / 2 + 0.01, (height - 0.05) / 2 - 0.025, 0]} castShadow>
        <boxGeometry args={[0.02, height - 0.05, depth - 0.04]} />
        <meshStandardMaterial color="#c0c0c0" roughness={0.5} />
      </mesh>
      <mesh position={[width / 2 - 0.01, (height - 0.05) / 2 - 0.025, 0]} castShadow>
        <boxGeometry args={[0.02, height - 0.05, depth - 0.04]} />
        <meshStandardMaterial color="#c0c0c0" roughness={0.5} />
      </mesh>
    </group>
  )
}
