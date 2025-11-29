import React from 'react'

export default function VentilationArm({ position }) {
  return (
    <group position={position}>
      {/* Ceiling Mount */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.5]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.4} metalness={0.3} />
      </mesh>
      
      {/* Upper Arm */}
      <group position={[0, -0.25, 0]} rotation={[0, 0, 0.3]}>
         <mesh position={[0, -0.6, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 1.2]} />
            <meshStandardMaterial color="#fafafa" roughness={0.3} metalness={0.2} />
         </mesh>
         
         {/* Elbow Joint */}
         <mesh position={[0, -1.2, 0]} castShadow>
            <sphereGeometry args={[0.1]} />
            <meshStandardMaterial color="#e0e0e0" roughness={0.4} metalness={0.4} />
         </mesh>

         {/* Lower Arm */}
         <group position={[0, -1.2, 0]} rotation={[0, 0, -0.6]}>
            <mesh position={[0, -0.5, 0]} castShadow>
                <cylinderGeometry args={[0.05, 0.05, 1]} />
                <meshStandardMaterial color="#fafafa" roughness={0.3} metalness={0.2} />
            </mesh>
            
            {/* Hood */}
            <mesh position={[0, -1.1, 0]} castShadow>
                <coneGeometry args={[0.2, 0.3, 32, 1, true]} />
                <meshStandardMaterial color="#f5f5f5" roughness={0.4} side={2} />
            </mesh>
         </group>
      </group>
    </group>
  )
}
