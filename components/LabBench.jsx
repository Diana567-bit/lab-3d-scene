import React from 'react'

// Sub-component for a set of 3 drawers
function DrawerCabinet({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Cabinet Body */}
      <mesh position={[0, 0.425, 0]} castShadow>
        <boxGeometry args={[0.9, 0.75, 0.7]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      
      {/* Drawers */}
      {[0.65, 0.4, 0.15].map((y, i) => (
        <group key={i} position={[0, y, 0.36]}>
          {/* Drawer Front */}
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.22, 0.02]} />
            <meshStandardMaterial color="#fcfcfc" roughness={0.2} />
          </mesh>
          {/* Handle - Wide dark grey handle */}
          <mesh position={[0, 0, 0.02]}>
             <boxGeometry args={[0.7, 0.02, 0.01]} />
             <meshStandardMaterial color="#333333" roughness={0.5} />
          </mesh>
        </group>
      ))}
      
      {/* Kick Plate / Plinth */}
      <mesh position={[0, 0.05, 0.3]}>
         <boxGeometry args={[0.9, 0.1, 0.05]} />
         <meshStandardMaterial color="#222222" roughness={0.8} />
      </mesh>
    </group>
  )
}

// Sub-component for a double door cabinet
function DoorCabinet({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Cabinet Body */}
      <mesh position={[0, 0.425, 0]} castShadow>
        <boxGeometry args={[0.9, 0.75, 0.7]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      
      {/* Doors */}
      <group position={[0, 0.425, 0.36]}>
          {/* Left Door */}
          <mesh position={[-0.22, 0, 0]} castShadow>
            <boxGeometry args={[0.42, 0.73, 0.02]} />
            <meshStandardMaterial color="#fcfcfc" roughness={0.2} />
          </mesh>
          {/* Right Door */}
          <mesh position={[0.22, 0, 0]} castShadow>
            <boxGeometry args={[0.42, 0.73, 0.02]} />
            <meshStandardMaterial color="#fcfcfc" roughness={0.2} />
          </mesh>
          
          {/* Handles */}
          <mesh position={[-0.15, 0.25, 0.02]}>
             <boxGeometry args={[0.1, 0.02, 0.01]} />
             <meshStandardMaterial color="#333333" roughness={0.5} />
          </mesh>
          <mesh position={[0.15, 0.25, 0.02]}>
             <boxGeometry args={[0.1, 0.02, 0.01]} />
             <meshStandardMaterial color="#333333" roughness={0.5} />
          </mesh>
      </group>

      {/* Kick Plate */}
      <mesh position={[0, 0.05, 0.3]}>
         <boxGeometry args={[0.9, 0.1, 0.05]} />
         <meshStandardMaterial color="#222222" roughness={0.8} />
      </mesh>
    </group>
  )
}

// Sub-component for Reagent Rack
function ReagentRack({ width = 3 }) {
  return (
    <group position={[0, 0.9, 0]}>
       {/* Vertical Columns - White, thick */}
       <mesh position={[-width/2 + 0.3, 0.5, 0]} castShadow>
         <boxGeometry args={[0.15, 1.0, 0.15]} />
         <meshStandardMaterial color="#ffffff" roughness={0.2} />
       </mesh>
       <mesh position={[width/2 - 0.3, 0.5, 0]} castShadow>
         <boxGeometry args={[0.15, 1.0, 0.15]} />
         <meshStandardMaterial color="#ffffff" roughness={0.2} />
       </mesh>
       
       {/* Shelves - Two Levels */}
       {[0.35, 0.75].map((y, i) => (
         <group key={i} position={[0, y, 0]}>
            {/* Glass Shelf */}
            <mesh>
                <boxGeometry args={[width - 0.6, 0.02, 0.3]} />
                <meshStandardMaterial 
                    color="#e8f7ff" 
                    transparent 
                    opacity={0.85} 
                    roughness={0.05}
                    metalness={0.9}
                />
            </mesh>
            {/* Blue LED Strip - Front and Back - Lighter color */}
            <mesh position={[0, 0, 0.15]}>
                <boxGeometry args={[width - 0.6, 0.025, 0.01]} />
                <meshStandardMaterial color="#33bbff" emissive="#88ddff" emissiveIntensity={1.2} toneMapped={false} />
            </mesh>
            <mesh position={[0, 0, -0.15]}>
                <boxGeometry args={[width - 0.6, 0.025, 0.01]} />
                <meshStandardMaterial color="#33bbff" emissive="#88ddff" emissiveIntensity={1.2} toneMapped={false} />
            </mesh>
         </group>
       ))}
    </group>
  )
}

export default function LabBench({ position = [0, 0, 0], rotation = [0, 0, 0], type = 'island' }) {
  const width = 3;
  const depth = type === 'island' ? 1.5 : 0.8;
  const height = 0.9;

  // Original simple bench style for wall/window benches
  if (type !== 'island') {
    return (
        <group position={position} rotation={rotation}>
          {/* Countertop - Split into 4 pieces to create sink hole at x=0.8 */}
          {/* Hole Area: x[0.5, 1.1], z[-0.25, 0.25] (Sink is 0.6x0.5) */}
          
          {/* 1. Left Slab (x < 0.5) */}
          <mesh position={[-0.5, height, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.0, 0.05, depth]} />
            <meshStandardMaterial color="#4a4a4a" roughness={0.3} metalness={0.6} />
          </mesh>
          
          {/* 2. Right Slab (x > 1.1) */}
          <mesh position={[1.3, height, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.4, 0.05, depth]} />
            <meshStandardMaterial color="#4a4a4a" roughness={0.3} metalness={0.6} />
          </mesh>
          
          {/* 3. Front Strip (z > 0.25) - Center z is (0.4 + 0.25)/2 = 0.325 */}
          <mesh position={[0.8, height, 0.325]} castShadow receiveShadow>
            <boxGeometry args={[0.6, 0.05, 0.15]} />
            <meshStandardMaterial color="#4a4a4a" roughness={0.3} metalness={0.6} />
          </mesh>
          
          {/* 4. Back Strip (z < -0.25) - Center z is (-0.4 + -0.25)/2 = -0.325 */}
          <mesh position={[0.8, height, -0.325]} castShadow receiveShadow>
            <boxGeometry args={[0.6, 0.05, 0.15]} />
            <meshStandardMaterial color="#4a4a4a" roughness={0.3} metalness={0.6} />
          </mesh>
    
          {/* Cabinets (Base) */}
          <group position={[0, height / 2, 0]}>
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[width - 0.1, height, depth - 0.1]} />
                <meshStandardMaterial color="#fefefe" roughness={0.5} metalness={0.05} />
            </mesh>
            
            {/* Drawer details (Front) */}
            {[-1, 0, 1].map((x, i) => (
                <group key={i} position={[x, 0, depth/2 - 0.05]}>
                    {/* Top Drawer */}
                    <mesh position={[0, 0.25, 0.01]} castShadow>
                        <boxGeometry args={[0.8, 0.2, 0.02]} />
                        <meshStandardMaterial color="#f5f5f5" roughness={0.4} />
                    </mesh>
                    {/* Bottom Cabinet */}
                    <mesh position={[0, -0.15, 0.01]} castShadow>
                        <boxGeometry args={[0.8, 0.5, 0.02]} />
                        <meshStandardMaterial color="#f5f5f5" roughness={0.4} />
                    </mesh>
                    {/* Handles */}
                    <mesh position={[0, 0.25, 0.03]}>
                        <boxGeometry args={[0.2, 0.02, 0.01]} />
                        <meshStandardMaterial color="#999999" roughness={0.2} metalness={0.8} />
                    </mesh>
                    <mesh position={[0.3, -0.15, 0.03]} rotation={[0,0,Math.PI/2]}>
                        <boxGeometry args={[0.2, 0.02, 0.01]} />
                        <meshStandardMaterial color="#999999" roughness={0.2} metalness={0.8} />
                    </mesh>
                </group>
            ))}
          </group>
          
          {/* Recessed Sink Basin */}
          {/* Positioned slightly lower to be INSIDE the hole */}
          <group position={[0.8, height - 0.15/2, 0]}>
             {/* Dimensions: 0.6 x 0.5 x 0.15 (Depth) */}
             {/* Bottom */}
             <mesh position={[0, -0.15/2 + 0.01, 0]}>
                <boxGeometry args={[0.6, 0.02, 0.5]} />
                <meshStandardMaterial color="#aaddff" roughness={0.4} metalness={0.2} />
             </mesh>
             {/* Walls (Stainless Steel) */}
             {/* Left Wall */}
             <mesh position={[-0.3 + 0.01, 0, 0]}>
                <boxGeometry args={[0.02, 0.15, 0.5]} />
                <meshStandardMaterial color="#d0d0d0" roughness={0.2} metalness={0.8} />
             </mesh>
             {/* Right Wall */}
             <mesh position={[0.3 - 0.01, 0, 0]}>
                <boxGeometry args={[0.02, 0.15, 0.5]} />
                <meshStandardMaterial color="#d0d0d0" roughness={0.2} metalness={0.8} />
             </mesh>
             {/* Front Wall */}
             <mesh position={[0, 0, 0.25 - 0.01]}>
                <boxGeometry args={[0.56, 0.15, 0.02]} />
                <meshStandardMaterial color="#d0d0d0" roughness={0.2} metalness={0.8} />
             </mesh>
             {/* Back Wall */}
             <mesh position={[0, 0, -0.25 + 0.01]}>
                <boxGeometry args={[0.56, 0.15, 0.02]} />
                <meshStandardMaterial color="#d0d0d0" roughness={0.2} metalness={0.8} />
             </mesh>
             
             {/* High Arc Modern Faucet (Attached to Back Strip of Countertop) */}
             <group position={[0, 0.15, -0.22]}>
                {/* Base */}
                <mesh position={[0, 0, 0]}>
                   <cylinderGeometry args={[0.03, 0.03, 0.02]} />
                   <meshStandardMaterial color="#d0d0d0" roughness={0.1} metalness={0.9} />
                </mesh>
                {/* Vertical Stem */}
                <mesh position={[0, 0.12, 0]}>
                   <cylinderGeometry args={[0.015, 0.015, 0.24]} />
                   <meshStandardMaterial color="#d0d0d0" roughness={0.1} metalness={0.9} />
                </mesh>
                {/* Horizontal Arm */}
                <mesh position={[0, 0.24, 0.08]} rotation={[Math.PI/2, 0, 0]}>
                   <cylinderGeometry args={[0.015, 0.015, 0.16]} />
                   <meshStandardMaterial color="#d0d0d0" roughness={0.1} metalness={0.9} />
                </mesh>
                {/* Spout Down */}
                <mesh position={[0, 0.20, 0.16]}>
                   <cylinderGeometry args={[0.015, 0.015, 0.08]} />
                   <meshStandardMaterial color="#d0d0d0" roughness={0.1} metalness={0.9} />
                </mesh>
                {/* Handle */}
                <mesh position={[0.05, 0.05, 0]} rotation={[0, 0, -0.5]}>
                   <cylinderGeometry args={[0.008, 0.008, 0.08]} />
                   <meshStandardMaterial color="#d0d0d0" roughness={0.1} metalness={0.9} />
                </mesh>
             </group>
          </group>
        </group>
      )
  }

  // Fancy new style for Island benches
  return (
    <group position={position} rotation={rotation}>
      {/* Countertop */}
      <mesh position={[0, height, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.05, depth]} />
        <meshStandardMaterial color="#555555" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Base Cabinets Configuration */}
      {type === 'island' ? (
        <>
           {/* Front Side (Z > 0) */}
           {/* Left: Drawer Unit */}
           <DrawerCabinet position={[-0.95, 0, depth/4]} />
           {/* Right: Door Unit */}
           <DoorCabinet position={[0.95, 0, depth/4]} />
           
           {/* Back Side (Z < 0) - Mirrored */}
           <group rotation={[0, Math.PI, 0]}>
               <DrawerCabinet position={[-0.95, 0, depth/4]} />
               <DoorCabinet position={[0.95, 0, depth/4]} />
           </group>
           
           {/* Center Panels (Knee space Backs) */}
           <mesh position={[0, 0.45, 0]}>
              <boxGeometry args={[0.9, 0.9, 0.05]} />
              <meshStandardMaterial color="#eeeeee" />
           </mesh>
        </>
      ) : (
        <>
           {/* Wall Bench - Just one row */}
           <DrawerCabinet position={[-0.95, 0, 0]} />
           <DoorCabinet position={[0.95, 0, 0]} />
           {/* Center knee space filler panel at back */}
           <mesh position={[0, 0.45, -0.35]}>
              <boxGeometry args={[0.9, 0.9, 0.02]} />
              <meshStandardMaterial color="#ffffff" />
           </mesh>
        </>
      )}

      {/* Reagent Rack */}
      <ReagentRack width={width} />
      

    </group>
  )
}
