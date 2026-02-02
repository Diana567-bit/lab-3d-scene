import React from 'react'

export default function LabTools({ position, type = 'tweezers' }) {
  
  if (type === 'tweezers') {
    return (
      <group position={position}>
        {/* Tweezers body */}
        <mesh rotation={[0, 0, Math.PI / 6]}>
          <boxGeometry args={[0.12, 0.008, 0.003]} />
          <meshStandardMaterial color="#888888" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 6]}>
          <boxGeometry args={[0.12, 0.008, 0.003]} />
          <meshStandardMaterial color="#888888" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>
    )
  }
  
  if (type === 'spatula') {
    return (
      <group position={position}>
        {/* Handle */}
        <mesh position={[-0.05, 0, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.003, 0.003, 0.1]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#333333" roughness={0.6} />
        </mesh>
        {/* Blade */}
        <mesh position={[0.03, 0, 0]}>
          <boxGeometry args={[0.06, 0.015, 0.001]} />
          <meshStandardMaterial color="#aaaaaa" roughness={0.2} metalness={0.8} />
        </mesh>
      </group>
    )
  }
  
  if (type === 'pipette') {
    return (
      <group position={position}>
        {/* Glass tube */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.002, 0.002, 0.15]} />
          <meshStandardMaterial 
            color="#e0f0ff" 
            transparent 
            opacity={0.4}
            roughness={0.1}
          />
        </mesh>
        {/* Rubber bulb */}
        <mesh position={[0.08, 0, 0]}>
          <sphereGeometry args={[0.01, 12, 12]} />
          <meshStandardMaterial color="#ff4444" roughness={0.6} />
        </mesh>
      </group>
    )
  }
  
  if (type === 'scalpel') {
    return (
      <group position={position}>
        {/* Handle */}
        <mesh position={[-0.03, 0, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.06]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#222222" roughness={0.5} />
        </mesh>
        {/* Blade */}
        <mesh position={[0.02, 0, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.04, 0.008, 0.0005]} />
          <meshStandardMaterial color="#cccccc" roughness={0.1} metalness={0.95} />
        </mesh>
      </group>
    )
  }

  return null
}
