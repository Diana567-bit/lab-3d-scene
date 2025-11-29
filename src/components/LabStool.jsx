import React from 'react'

export default function LabStool({ position }) {
  return (
    <group position={position}>
      {/* Seat - Round Black Cushion */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.08, 32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </mesh>
      
      {/* Connecting Plate under seat */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      
      {/* Column - Silver */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.6, 16]} />
        <meshStandardMaterial color="#c0c0c0" roughness={0.3} metalness={0.8} />
      </mesh>
      
      {/* Height Adjustment Lever (Cosmetic) */}
      <mesh position={[0.05, 0.55, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.005, 0.005, 0.15]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* 5-Star Base */}
      <group position={[0, 0.08, 0]}>
        {[0, 72, 144, 216, 288].map((angle) => (
            <group key={angle} rotation={[0, (angle * Math.PI) / 180, 0]}>
                {/* Leg */}
                <mesh position={[0, 0, 0.15]} rotation={[0.1, 0, 0]}>
                    <boxGeometry args={[0.03, 0.02, 0.3]} />
                    <meshStandardMaterial color="#c0c0c0" roughness={0.3} metalness={0.8} />
                </mesh>
                {/* Caster/Wheel */}
                <group position={[0, -0.06, 0.28]}>
                    <mesh rotation={[Math.PI/2, 0, 0]}>
                         <cylinderGeometry args={[0.025, 0.025, 0.02]} />
                         <meshStandardMaterial color="#111111" />
                    </mesh>
                    {/* Caster Housing */}
                    <mesh position={[0, 0.03, 0]}>
                        <boxGeometry args={[0.02, 0.04, 0.02]} />
                        <meshStandardMaterial color="#222222" />
                    </mesh>
                </group>
            </group>
        ))}
      </group>
    </group>
  )
}
