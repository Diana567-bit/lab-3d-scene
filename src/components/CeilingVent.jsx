import React from 'react'

export default function CeilingVent({ position }) {
  return (
    <group position={position}>
      {/* Vent Frame */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.05]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.6} />
      </mesh>
      
      {/* Vent Grilles */}
      {[-0.2, -0.1, 0, 0.1, 0.2].map((offset, i) => (
        <mesh key={i} position={[offset, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.5, 0.02, 0.01]} />
          <meshStandardMaterial color="#999999" roughness={0.4} metalness={0.3} />
        </mesh>
      ))}
    </group>
  )
}
