import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function OverheadLight({ position, isOn = true }) {
  return (
    <group position={position}>
      {/* Ceiling Mount Base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1]} />
        <meshStandardMaterial color="#eeeeee" roughness={0.5} />
      </mesh>

      {/* Main Vertical Column */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>

      {/* Upper Joint */}
      <group position={[0, -0.4, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
           <cylinderGeometry args={[0.1, 0.1, 0.25]} />
           <meshStandardMaterial color="#dddddd" roughness={0.4} />
        </mesh>

        {/* First Arm Section (Diagonal) */}
        <group rotation={[0, 0, 0.5]}>
           <mesh position={[0, -0.35, 0]}>
              <boxGeometry args={[0.12, 0.8, 0.12]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} />
           </mesh>

           {/* Middle Joint */}
           <group position={[0, -0.75, 0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                 <cylinderGeometry args={[0.09, 0.09, 0.22]} />
                 <meshStandardMaterial color="#dddddd" roughness={0.4} />
              </mesh>
              
              {/* Second Arm Section (Correcting angle to be vertical or slightly angled) */}
              <group rotation={[0, 0, -0.5]}>
                 <mesh position={[0, -0.35, 0]}>
                    <cylinderGeometry args={[0.06, 0.06, 0.7]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.2} />
                 </mesh>

                 {/* Light Head Joint */}
                 <group position={[0, -0.7, 0]}>
                    <sphereGeometry args={[0.08]} />
                    <meshStandardMaterial color="#cccccc" metalness={0.5} />
                    
                    {/* Light Head Structure */}
                    <group position={[0, -0.2, 0]}>
                       {/* Housing */}
                       <mesh position={[0, 0, 0]}>
                          <cylinderGeometry args={[0.15, 0.25, 0.3]} />
                          <meshStandardMaterial color="#ffffff" roughness={0.2} />
                       </mesh>
                       
                       
                       {/* Light Face */}
                       <mesh position={[0, -0.16, 0]}>
                          <cylinderGeometry args={[0.22, 0.22, 0.02]} />
                          <meshStandardMaterial color={isOn ? "#ffffff" : "#aaaaaa"} emissive="#ffffff" emissiveIntensity={isOn ? 3 : 0} toneMapped={false} />
                       </mesh>
                       
                       {/* The actual light source */}
                       <spotLight 
                          position={[0, -0.2, 0]} 
                          angle={0.8} 
                          penumbra={0.4} 
                          intensity={isOn ? 2.5 : 0} 
                          distance={6}
                          castShadow
                          color="#ffffff" 
                       />
                    </group>
                 </group>
              </group>
           </group>
        </group>
      </group>
    </group>
  )
}
