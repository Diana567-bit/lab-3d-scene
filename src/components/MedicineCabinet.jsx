import React, { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function CabinetDoor({ position, offset, rotationDir, children }) {
  const [isOpen, setIsOpen] = useState(false)
  const groupRef = useRef()
  
  useFrame((state, delta) => {
    const targetRotation = isOpen ? rotationDir * Math.PI / 1.8 : 0
    // Smooth damping for realistic door motion
    if (groupRef.current) {
      groupRef.current.rotation.y += (targetRotation - groupRef.current.rotation.y) * delta * 4
    }
  })

  return (
    <group 
      position={position} 
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation()
        setIsOpen(!isOpen)
      }}a
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      <group position={offset}>
        {children}
      </group>
    </group>
  )
}

export default function MedicineCabinet({ position, rotation = [0, 0, 0], type = 'standard' }) {
  const width = 0.9  // 900mm
  const height = 1.8 // 1800mm
  const depth = 0.45 // 450mm
  
  // Corrosive Safety Cabinet Style
  if (type === 'corrosive') {
     // 腐蚀品柜自定义尺寸：高度降低0.15m，宽度增大0.2m
     const corrosiveWidth = width + 0.2  // 1.1m (原0.9m + 0.2m)
     const corrosiveHeight = height - 0.15 // 1.65m (原1.8m - 0.3m + 0.15m)
     
     return (
       <group position={position} rotation={rotation}>
         {/* Cabinet Body - White */}
         <mesh position={[0, 0, -depth/2 + 0.01]} castShadow>
           <boxGeometry args={[corrosiveWidth, corrosiveHeight, 0.02]} />
           <meshStandardMaterial color="#ffffff" roughness={0.2} />
         </mesh>
         <mesh position={[-corrosiveWidth/2 + 0.01, 0, 0]} castShadow>
           <boxGeometry args={[0.02, corrosiveHeight, depth]} />
           <meshStandardMaterial color="#ffffff" roughness={0.2} />
         </mesh>
         <mesh position={[corrosiveWidth/2 - 0.01, 0, 0]} castShadow>
           <boxGeometry args={[0.02, corrosiveHeight, depth]} />
           <meshStandardMaterial color="#ffffff" roughness={0.2} />
         </mesh>
         <mesh position={[0, corrosiveHeight/2 - 0.01, 0]} castShadow>
           <boxGeometry args={[corrosiveWidth, 0.02, depth]} />
           <meshStandardMaterial color="#ffffff" roughness={0.2} />
         </mesh>
         <mesh position={[0, -corrosiveHeight/2 + 0.01, 0]} castShadow>
           <boxGeometry args={[corrosiveWidth, 0.02, depth]} />
           <meshStandardMaterial color="#ffffff" roughness={0.2} />
         </mesh>

         {/* Internal Shelves - White - 4 Shelves (调整到新高度1.65m) */}
         {[0.33, 0.66, 0.99, 1.32].map((y, i) => (
             <mesh key={i} position={[0, y - corrosiveHeight/2, 0]}>
                <boxGeometry args={[corrosiveWidth - 0.05, 0.02, depth - 0.05]} />
                <meshStandardMaterial color="#ffffff" roughness={0.2} />
             </mesh>
         ))}

         {/* Doors */}
         <group position={[0, 0, depth/2 + 0.01]}>
            {/* Left Door */}
            <CabinetDoor 
               position={[-corrosiveWidth/2, 0, 0]} 
               offset={[corrosiveWidth/4, 0, 0]} 
               rotationDir={-1}
            >
                {/* Bottom Solid Panel */}
                <mesh position={[0, -corrosiveHeight/4, 0]} castShadow>
                   <boxGeometry args={[corrosiveWidth/2 - 0.01, corrosiveHeight/2, 0.02]} />
                   <meshStandardMaterial color="#ffffff" roughness={0.2} />
                </mesh>
                
                {/* Top Frame - Top Bar */}
                <mesh position={[0, corrosiveHeight/2 - 0.03, 0]} castShadow>
                   <boxGeometry args={[corrosiveWidth/2 - 0.01, 0.06, 0.02]} />
                   <meshStandardMaterial color="#ffffff" roughness={0.2} />
                </mesh>
                {/* Top Frame - Bottom Bar (Middle) */}
                <mesh position={[0, 0.03, 0]} castShadow>
                   <boxGeometry args={[corrosiveWidth/2 - 0.01, 0.06, 0.02]} />
                   <meshStandardMaterial color="#ffffff" roughness={0.2} />
                </mesh>
                {/* Top Frame - Left Bar */}
                <mesh position={[-(corrosiveWidth/4 - 0.035), corrosiveHeight/4, 0]} castShadow>
                   <boxGeometry args={[0.06, corrosiveHeight/2 - 0.12, 0.02]} />
                   <meshStandardMaterial color="#ffffff" roughness={0.2} />
                </mesh>
                {/* Top Frame - Right Bar */}
                <mesh position={[(corrosiveWidth/4 - 0.035), corrosiveHeight/4, 0]} castShadow>
                   <boxGeometry args={[0.06, corrosiveHeight/2 - 0.12, 0.02]} />
                   <meshStandardMaterial color="#ffffff" roughness={0.2} />
                </mesh>

                {/* Glass Window (True Transparent) */}
                <mesh position={[0, corrosiveHeight/4, 0]}>
                   <boxGeometry args={[corrosiveWidth/2 - 0.14, corrosiveHeight/2 - 0.12, 0.005]} />
                   <meshStandardMaterial color="#e0f7fa" transparent opacity={0.2} roughness={0.1} metalness={0.8} />
                </mesh>

                {/* Corrosive Sign (Bottom Half) */}
                <group position={[0, -corrosiveHeight/4 + 0.1, 0.015]} rotation={[0, 0, Math.PI/4]}>
                   <mesh>
                      <boxGeometry args={[0.18, 0.18, 0.002]} />
                      <meshStandardMaterial color="#ffffff" />
                   </mesh>
                   <mesh position={[0, 0, 0.001]}>
                      <boxGeometry args={[0.17, 0.17, 0.002]} />
                      <meshStandardMaterial color="#000000" />
                   </mesh>
                   <mesh position={[0, 0, 0.002]}>
                      <boxGeometry args={[0.16, 0.16, 0.002]} />
                      <meshStandardMaterial color="#ffffff" />
                   </mesh>
                   {/* Symbol simulation (Text or Shapes) */}
                   <mesh position={[0, 0, 0.003]} rotation={[0, 0, -Math.PI/4]}>
                      <boxGeometry args={[0.12, 0.04, 0.002]} />
                      <meshStandardMaterial color="#000000" />
                   </mesh>
                </group>
                {/* Blue Handle */}
                <mesh position={[corrosiveWidth/4 - 0.05, 0, 0.03]}>
                   <boxGeometry args={[0.02, 0.15, 0.02]} />
                   <meshStandardMaterial color="#5a8ab5" />
                </mesh>
                {/* Blue Hinges */}
                {[-0.6, -0.3, 0.3, 0.6].map((y, i) => (
                   <mesh key={i} position={[-corrosiveWidth/4 + 0.02, y, 0.02]}>
                      <boxGeometry args={[0.02, 0.06, 0.01]} />
                      <meshStandardMaterial color="#5a8ab5" />
                   </mesh>
                ))}
            </CabinetDoor>

            {/* Right Door */}
            <CabinetDoor 
               position={[corrosiveWidth/2, 0, 0]} 
               offset={[-corrosiveWidth/4, 0, 0]} 
               rotationDir={1}
            >
                {/* Bottom Solid Panel */}
                <mesh position={[0, -corrosiveHeight/4, 0]} castShadow>
                   <boxGeometry args={[corrosiveWidth/2 - 0.01, corrosiveHeight/2, 0.02]} />
                   <meshStandardMaterial color="#ffffff" roughness={0.2} />
                </mesh>
                
                {/* Top Frame - Top Bar */}
                <mesh position={[0, corrosiveHeight/2 - 0.03, 0]} castShadow>
                   <boxGeometry args={[corrosiveWidth/2 - 0.01, 0.06, 0.02]} />
                   <meshStandardMaterial color="#ffffff" roughness={0.2} />
                </mesh>
                {/* Top Frame - Bottom Bar (Middle) */}
                <mesh position={[0, 0.03, 0]} castShadow>
                   <boxGeometry args={[corrosiveWidth/2 - 0.01, 0.06, 0.02]} />
                   <meshStandardMaterial color="#ffffff" roughness={0.2} />
                </mesh>
                {/* Top Frame - Left Bar */}
                <mesh position={[-(corrosiveWidth/4 - 0.035), corrosiveHeight/4, 0]} castShadow>
                   <boxGeometry args={[0.06, corrosiveHeight/2 - 0.12, 0.02]} />
                   <meshStandardMaterial color="#ffffff" roughness={0.2} />
                </mesh>
                {/* Top Frame - Right Bar */}
                <mesh position={[(corrosiveWidth/4 - 0.035), corrosiveHeight/4, 0]} castShadow>
                   <boxGeometry args={[0.06, corrosiveHeight/2 - 0.12, 0.02]} />
                   <meshStandardMaterial color="#ffffff" roughness={0.2} />
                </mesh>

                {/* Glass Window (True Transparent) */}
                <mesh position={[0, corrosiveHeight/4, 0]}>
                   <boxGeometry args={[corrosiveWidth/2 - 0.14, corrosiveHeight/2 - 0.12, 0.005]} />
                   <meshStandardMaterial color="#e0f7fa" transparent opacity={0.2} roughness={0.1} metalness={0.8} />
                </mesh>

                {/* Corrosive Sign (Bottom Half) */}
                <group position={[0, -corrosiveHeight/4 + 0.1, 0.015]} rotation={[0, 0, Math.PI/4]}>
                   <mesh>
                      <boxGeometry args={[0.18, 0.18, 0.002]} />
                      <meshStandardMaterial color="#ffffff" />
                   </mesh>
                   <mesh position={[0, 0, 0.001]}>
                      <boxGeometry args={[0.17, 0.17, 0.002]} />
                      <meshStandardMaterial color="#000000" />
                   </mesh>
                   <mesh position={[0, 0, 0.002]}>
                      <boxGeometry args={[0.16, 0.16, 0.002]} />
                      <meshStandardMaterial color="#ffffff" />
                   </mesh>
                   <mesh position={[0, 0, 0.003]} rotation={[0, 0, -Math.PI/4]}>
                      <boxGeometry args={[0.12, 0.04, 0.002]} />
                      <meshStandardMaterial color="#000000" />
                   </mesh>
                </group>
                {/* Blue Handle */}
                <mesh position={[-corrosiveWidth/4 + 0.05, 0, 0.03]}>
                   <boxGeometry args={[0.02, 0.15, 0.02]} />
                   <meshStandardMaterial color="#5a8ab5" />
                </mesh>
                {/* Blue Hinges */}
                {[-0.6, -0.3, 0.3, 0.6].map((y, i) => (
                   <mesh key={i} position={[corrosiveWidth/4 - 0.02, y, 0.02]}>
                      <boxGeometry args={[0.02, 0.06, 0.01]} />
                      <meshStandardMaterial color="#5a8ab5" />
                   </mesh>
                ))}
            </CabinetDoor>
         </group>
       </group>
     )
  }

  // PP Safety Cabinet Style (45 Gallon)
  if (type === 'pp') {
     const ppWidth = 1.09
     const ppHeight = 1.65
     const ppDepth = 0.46
     
     return (
       <group position={position} rotation={rotation}>
         {/* Cabinet Body - White PP */}
         <mesh position={[0, 0, -ppDepth/2 + 0.01]} castShadow>
           <boxGeometry args={[ppWidth, ppHeight, 0.02]} />
           <meshStandardMaterial color="#ffffff" roughness={0.3} />
         </mesh>
         <mesh position={[-ppWidth/2 + 0.01, 0, 0]} castShadow>
           <boxGeometry args={[0.02, ppHeight, ppDepth]} />
           <meshStandardMaterial color="#ffffff" roughness={0.3} />
         </mesh>
         <mesh position={[ppWidth/2 - 0.01, 0, 0]} castShadow>
           <boxGeometry args={[0.02, ppHeight, ppDepth]} />
           <meshStandardMaterial color="#ffffff" roughness={0.3} />
         </mesh>
         <mesh position={[0, ppHeight/2 - 0.01, 0]} castShadow>
           <boxGeometry args={[ppWidth, 0.02, ppDepth]} />
           <meshStandardMaterial color="#ffffff" roughness={0.3} />
         </mesh>
         <mesh position={[0, -ppHeight/2 + 0.01, 0]} castShadow>
           <boxGeometry args={[ppWidth, 0.02, ppDepth]} />
           <meshStandardMaterial color="#ffffff" roughness={0.3} />
         </mesh>

         {/* Internal Shelves - Grayish White - 4 Shelves */}
         {[0.33, 0.66, 0.99, 1.32].map((y, i) => (
             <mesh key={i} position={[0, y - ppHeight/2, 0]}>
                <boxGeometry args={[ppWidth - 0.05, 0.02, ppDepth - 0.05]} />
                <meshStandardMaterial color="#f0f0f0" roughness={0.3} />
             </mesh>
         ))}

         {/* Doors - Solid White with Signs */}
         <group position={[0, 0, ppDepth/2 + 0.01]}>
            {/* Left Door */}
            <CabinetDoor 
               position={[-ppWidth/2, 0, 0]} 
               offset={[ppWidth/2, 0, 0]} 
               rotationDir={-1}
            >
               <group position={[-ppWidth/4, 0, 0]}>
                   <mesh position={[0, 0, 0]} castShadow>
                      <boxGeometry args={[ppWidth/2 - 0.005, ppHeight - 0.02, 0.02]} />
                      <meshStandardMaterial color="#ffffff" roughness={0.3} />
                   </mesh>
                   
                   {/* Hazard Sign */}
                   <group position={[0, 0.2, 0.015]} rotation={[0, 0, Math.PI/4]}>
                      <mesh>
                         <boxGeometry args={[0.2, 0.2, 0.002]} />
                         <meshStandardMaterial color="#ffffff" />
                      </mesh>
                      <mesh position={[0, 0, 0.001]}>
                         <boxGeometry args={[0.19, 0.19, 0.002]} />
                         <meshStandardMaterial color="#000000" />
                      </mesh>
                      <mesh position={[0, 0, 0.002]}>
                         <boxGeometry args={[0.18, 0.18, 0.002]} />
                         <meshStandardMaterial color="#ffffff" />
                      </mesh>
                      <mesh position={[0, 0, 0.003]} rotation={[0, 0, -Math.PI/4]}>
                         <boxGeometry args={[0.14, 0.05, 0.002]} />
                         <meshStandardMaterial color="#000000" />
                      </mesh>
                   </group>

                   {/* Blue Handle */}
                   <mesh position={[ppWidth/4 - 0.06, 0, 0.03]}>
                      <boxGeometry args={[0.02, 0.15, 0.02]} />
                      <meshStandardMaterial color="#6a8caf" />
                   </mesh>
                   {/* Blue Hinges */}
                   {[-0.6, -0.2, 0.2, 0.6].map((y, i) => (
                      <mesh key={i} position={[-ppWidth/4 + 0.02, y, 0.02]}>
                         <boxGeometry args={[0.02, 0.05, 0.01]} />
                         <meshStandardMaterial color="#6a8caf" />
                      </mesh>
                   ))}
               </group>
            </CabinetDoor>

            {/* Right Door */}
            <CabinetDoor 
               position={[ppWidth/2, 0, 0]} 
               offset={[-ppWidth/2, 0, 0]} 
               rotationDir={1}
            >
               <group position={[ppWidth/4, 0, 0]}>
                   <mesh position={[0, 0, 0]} castShadow>
                      <boxGeometry args={[ppWidth/2 - 0.005, ppHeight - 0.02, 0.02]} />
                      <meshStandardMaterial color="#ffffff" roughness={0.3} />
                   </mesh>
                   
                   {/* Hazard Sign */}
                   <group position={[0, 0.2, 0.015]} rotation={[0, 0, Math.PI/4]}>
                      <mesh>
                         <boxGeometry args={[0.2, 0.2, 0.002]} />
                         <meshStandardMaterial color="#ffffff" />
                      </mesh>
                      <mesh position={[0, 0, 0.001]}>
                         <boxGeometry args={[0.19, 0.19, 0.002]} />
                         <meshStandardMaterial color="#000000" />
                      </mesh>
                      <mesh position={[0, 0, 0.002]}>
                         <boxGeometry args={[0.18, 0.18, 0.002]} />
                         <meshStandardMaterial color="#ffffff" />
                      </mesh>
                      <mesh position={[0, 0, 0.003]} rotation={[0, 0, -Math.PI/4]}>
                         <boxGeometry args={[0.14, 0.05, 0.002]} />
                         <meshStandardMaterial color="#000000" />
                      </mesh>
                   </group>

                   {/* Blue Handle */}
                   <mesh position={[-ppWidth/4 + 0.06, 0, 0.03]}>
                      <boxGeometry args={[0.02, 0.15, 0.02]} />
                      <meshStandardMaterial color="#6a8caf" />
                   </mesh>
                   {/* Blue Hinges */}
                   {[-0.6, -0.2, 0.2, 0.6].map((y, i) => (
                      <mesh key={i} position={[ppWidth/4 - 0.02, y, 0.02]}>
                         <boxGeometry args={[0.02, 0.05, 0.01]} />
                         <meshStandardMaterial color="#6a8caf" />
                      </mesh>
                   ))}
               </group>
            </CabinetDoor>
         </group>
       </group>
     )
  }
  
  const upperHeight = height * 0.6  // Upper 60% with glass
  const lowerHeight = height * 0.4  // Lower 40% solid

  return (
    <group position={position} rotation={rotation}>
      {/* Cabinet Body - Hollow Frame */}
      <group>
        {/* Back Panel */}
        <mesh position={[0, 0, -depth / 2 + 0.01]} castShadow receiveShadow>
          <boxGeometry args={[width, height, 0.02]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Left Panel */}
        <mesh position={[-width / 2 + 0.01, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.02, height, depth]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Right Panel */}
        <mesh position={[width / 2 - 0.01, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.02, height, depth]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Top Panel */}
        <mesh position={[0, height / 2 - 0.01, 0]} castShadow receiveShadow>
          <boxGeometry args={[width - 0.04, 0.02, depth]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Bottom Panel */}
        <mesh position={[0, -height / 2 + 0.01, 0]} castShadow receiveShadow>
          <boxGeometry args={[width - 0.04, 0.02, depth]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.3} metalness={0.1} />
        </mesh>
      </group>

      {/* Interior - White/Light gray */}
      <mesh position={[0, 0, -depth / 2 + 0.03]}>
        <boxGeometry args={[width - 0.05, height - 0.05, 0.05]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.4} />
      </mesh>

      {/* Doors */}
      <group>
        {/* Left Door */}
        <CabinetDoor 
          position={[-width / 2, 0, depth / 2 + 0.02]} 
          offset={[width / 2, 0, 0]} 
          rotationDir={-1}
        >
          {/* Upper Glass Windows - Left Door - dark tinted with shadow */}
          <mesh position={[-width / 4, height * 0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[width / 2 - 0.1, height * 0.55, 0.01]} />
            <meshStandardMaterial 
              color="#6a8aa8" 
              transparent 
              opacity={0.5}
              roughness={0.2}
              metalness={0.15}
            />
          </mesh>

          {/* Lower Solid Doors - Left */}
          <mesh position={[-width / 4, -height * 0.25, 0]}>
            <boxGeometry args={[width / 2 - 0.1, height * 0.35, 0.03]} />
            <meshStandardMaterial color="#f8f8f8" roughness={0.3} />
          </mesh>

          {/* Left door frame */}
          <group position={[-width / 4, 0, -0.01]}>
            <mesh position={[0, height / 2 - 0.03, 0]}>
              <boxGeometry args={[width / 2 - 0.04, 0.06, 0.03]} />
              <meshStandardMaterial color="#f0f0f0" roughness={0.4} />
            </mesh>
            <mesh position={[0, -height / 2 + 0.03, 0]}>
              <boxGeometry args={[width / 2 - 0.04, 0.06, 0.03]} />
              <meshStandardMaterial color="#f0f0f0" roughness={0.4} />
            </mesh>
            <mesh position={[-(width / 4 - 0.02), 0, 0]}>
              <boxGeometry args={[0.04, height, 0.03]} />
              <meshStandardMaterial color="#f0f0f0" roughness={0.4} />
            </mesh>
            <mesh position={[(width / 4 - 0.02), 0, 0]}>
              <boxGeometry args={[0.04, height, 0.03]} />
              <meshStandardMaterial color="#f0f0f0" roughness={0.4} />
            </mesh>
          </group>

          {/* Blue Handles */}
          <mesh position={[-width / 8, 0, 0.03]}>
            <boxGeometry args={[0.025, 0.12, 0.025]} />
            <meshStandardMaterial color="#5a8ab5" roughness={0.3} metalness={0.7} />
          </mesh>

          {/* Warning Labels */}
          <mesh position={[-width / 4, height * 0.3, 0.025]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.12, 0.12, 0.003]} />
            <meshStandardMaterial color="#ff6b00" emissive="#ff6b00" emissiveIntensity={0.4} />
          </mesh>

          {/* Blue Info Plates */}
          <mesh position={[-width / 4, height * 0.42, 0.025]}>
            <boxGeometry args={[0.15, 0.08, 0.003]} />
            <meshStandardMaterial color="#5a8ab5" emissive="#5a8ab5" emissiveIntensity={0.3} />
          </mesh>
        </CabinetDoor>
        
        {/* Right Door */}
        <CabinetDoor 
          position={[width / 2, 0, depth / 2 + 0.02]} 
          offset={[-width / 2, 0, 0]} 
          rotationDir={1}
        >
          {/* Upper Glass Windows - Right Door - dark tinted with shadow */}
          <mesh position={[width / 4, height * 0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[width / 2 - 0.1, height * 0.55, 0.01]} />
            <meshStandardMaterial 
              color="#6a8aa8" 
              transparent 
              opacity={0.5}
              roughness={0.2}
              metalness={0.15}
            />
          </mesh>

          {/* Lower Solid Doors - Right */}
          <mesh position={[width / 4, -height * 0.25, 0]}>
            <boxGeometry args={[width / 2 - 0.1, height * 0.35, 0.03]} />
            <meshStandardMaterial color="#f8f8f8" roughness={0.3} />
          </mesh>

          {/* Right door frame */}
          <group position={[width / 4, 0, -0.01]}>
            <mesh position={[0, height / 2 - 0.03, 0]}>
              <boxGeometry args={[width / 2 - 0.04, 0.06, 0.03]} />
              <meshStandardMaterial color="#f0f0f0" roughness={0.4} />
            </mesh>
            <mesh position={[0, -height / 2 + 0.03, 0]}>
              <boxGeometry args={[width / 2 - 0.04, 0.06, 0.03]} />
              <meshStandardMaterial color="#f0f0f0" roughness={0.4} />
            </mesh>
            <mesh position={[-(width / 4 - 0.02), 0, 0]}>
              <boxGeometry args={[0.04, height, 0.03]} />
              <meshStandardMaterial color="#f0f0f0" roughness={0.4} />
            </mesh>
            <mesh position={[(width / 4 - 0.02), 0, 0]}>
              <boxGeometry args={[0.04, height, 0.03]} />
              <meshStandardMaterial color="#f0f0f0" roughness={0.4} />
            </mesh>
          </group>

          {/* Blue Handles */}
          <mesh position={[width / 8, 0, 0.03]}>
            <boxGeometry args={[0.025, 0.12, 0.025]} />
            <meshStandardMaterial color="#5a8ab5" roughness={0.3} metalness={0.7} />
          </mesh>

          {/* Warning Labels */}
          <mesh position={[width / 4, height * 0.3, 0.025]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.12, 0.12, 0.003]} />
            <meshStandardMaterial color="#ff6b00" emissive="#ff6b00" emissiveIntensity={0.4} />
          </mesh>

          {/* Blue Info Plates */}
          <mesh position={[width / 4, height * 0.42, 0.025]}>
            <boxGeometry args={[0.15, 0.08, 0.003]} />
            <meshStandardMaterial color="#5a8ab5" emissive="#5a8ab5" emissiveIntensity={0.3} />
          </mesh>
        </CabinetDoor>

        {/* Blue Hinges - Static on frame */}
        <group position={[0, 0, depth / 2 + 0.02]}>
          {[-0.7, -0.3, 0.1, 0.5].map((y, i) => (
            <React.Fragment key={i}>
              <mesh position={[-(width / 2 - 0.03), y * height, 0.02]}>
                <boxGeometry args={[0.025, 0.06, 0.02]} />
                <meshStandardMaterial color="#5a8ab5" roughness={0.3} metalness={0.7} />
              </mesh>
              <mesh position={[(width / 2 - 0.03), y * height, 0.02]}>
                <boxGeometry args={[0.025, 0.06, 0.02]} />
                <meshStandardMaterial color="#5a8ab5" roughness={0.3} metalness={0.7} />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      </group>

      {/* Bottom Ventilation Grille */}
      <group position={[0, -height / 2 + 0.1, depth / 2]}>
        {[-0.3, -0.15, 0, 0.15, 0.3].map((x, i) => (
          <mesh key={i} position={[x * width, 0, 0.01]}>
            <boxGeometry args={[0.08, 0.15, 0.01]} />
            <meshStandardMaterial color="#d0d0d0" />
          </mesh>
        ))}
        {/* Grille slots */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={`slot-${i}`} position={[0, -0.06 + i * 0.018, 0.015]}>
            <boxGeometry args={[width - 0.15, 0.008, 0.005]} />
            <meshStandardMaterial color="#888888" />
          </mesh>
        ))}
      </group>

      {/* Base */}
      <mesh position={[0, -height / 2 - 0.015, 0]}>
        <boxGeometry args={[width + 0.02, 0.03, depth + 0.02]} />
        <meshStandardMaterial color="#c0c0c0" roughness={0.5} />
      </mesh>

    </group>
  )
}
