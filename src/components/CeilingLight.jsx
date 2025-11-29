import React from 'react'

export default function CeilingLight({ position, isOn = true }) {
  return (
    <group position={position}>
      {/* Light Panel - Emissive */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[1.1, 1.1]} />
        <meshStandardMaterial 
          color={isOn ? "#ffffff" : "#888888"} 
          emissive={isOn ? "#ffffee" : "#000000"}
          emissiveIntensity={isOn ? 2.5 : 0}
          toneMapped={false}
        />
      </mesh>
      {/* Frame */}
      <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
         <boxGeometry args={[1.25, 1.25, 0.08]} />
         <meshStandardMaterial color="#e8e8e8" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Actual Light Source - Softer */}
      <pointLight 
        position={[0, -0.1, 0]}
        intensity={isOn ? 5 : 0} 
        distance={8}
        decay={2}
        color="#fffffa" 
      />
    </group>
  )
}
