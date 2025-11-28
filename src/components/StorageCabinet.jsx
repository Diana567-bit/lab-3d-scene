import React from 'react'

export default function StorageCabinet({ position, rotation = [0, 0, 0], type = 'tall' }) {
  const width = type === 'tall' ? 0.9 : 1.2
  const height = type === 'tall' ? 2.0 : 0.9
  const depth = 0.5

  return (
    <group position={position} rotation={rotation}>
      {/* Cabinet Body - White */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Interior - Light Blue */}
      <mesh position={[0, 0, -depth / 2 + 0.05]}>
        <boxGeometry args={[width - 0.06, height - 0.06, 0.08]} />
        <meshStandardMaterial color="#d0e8f5" roughness={0.4} />
      </mesh>

      {/* Doors with Glass Windows */}
      <group position={[0, 0, depth / 2 + 0.015]}>
        {/* Left Door - White Frame */}
        <group position={[-width / 4, 0, 0]}>
          {/* Door Frame */}
          <mesh castShadow>
            <boxGeometry args={[width / 2 - 0.03, height - 0.1, 0.03]} />
            <meshStandardMaterial color="#fafafa" roughness={0.3} metalness={0.2} />
          </mesh>
          
          {/* Glass Window */}
          <mesh position={[0, height * 0.15, 0.01]}>
            <boxGeometry args={[width / 2 - 0.12, height * 0.6, 0.015]} />
            <meshStandardMaterial 
              color="#d0e8ff" 
              transparent 
              opacity={0.25}
              roughness={0.05}
              metalness={0.05}
            />
          </mesh>
        </group>
        
        {/* Right Door - White Frame */}
        <group position={[width / 4, 0, 0]}>
          {/* Door Frame */}
          <mesh castShadow>
            <boxGeometry args={[width / 2 - 0.03, height - 0.1, 0.03]} />
            <meshStandardMaterial color="#fafafa" roughness={0.3} metalness={0.2} />
          </mesh>
          
          {/* Glass Window */}
          <mesh position={[0, height * 0.15, 0.01]}>
            <boxGeometry args={[width / 2 - 0.12, height * 0.6, 0.015]} />
            <meshStandardMaterial 
              color="#d0e8ff" 
              transparent 
              opacity={0.25}
              roughness={0.05}
              metalness={0.05}
            />
          </mesh>
        </group>

        {/* Blue Hinges - Left Door */}
        {[-0.6, 0, 0.6].map((y, i) => (
          <group key={`left-hinge-${i}`} position={[-(width / 2 - 0.05), y * (height / 2), 0]}>
            <mesh position={[0, 0, 0.02]}>
              <boxGeometry args={[0.03, 0.08, 0.02]} />
              <meshStandardMaterial color="#4a7ba7" roughness={0.3} metalness={0.7} />
            </mesh>
          </group>
        ))}

        {/* Blue Hinges - Right Door */}
        {[-0.6, 0, 0.6].map((y, i) => (
          <group key={`right-hinge-${i}`} position={[(width / 2 - 0.05), y * (height / 2), 0]}>
            <mesh position={[0, 0, 0.02]}>
              <boxGeometry args={[0.03, 0.08, 0.02]} />
              <meshStandardMaterial color="#4a7ba7" roughness={0.3} metalness={0.7} />
            </mesh>
          </group>
        ))}

        {/* Blue Handles */}
        <mesh position={[-width / 8, 0, 0.025]} castShadow>
          <boxGeometry args={[0.03, 0.15, 0.03]} />
          <meshStandardMaterial color="#4a7ba7" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[width / 8, 0, 0.025]} castShadow>
          <boxGeometry args={[0.03, 0.15, 0.03]} />
          <meshStandardMaterial color="#4a7ba7" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Warning Labels - Diamond shaped */}
        {/* Left Door Label */}
        <mesh position={[-width / 4, height / 4, 0.02]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.15, 0.15, 0.005]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-width / 4, height / 4, 0.022]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.13, 0.13, 0.002]} />
          <meshStandardMaterial color="#ff6b00" emissive="#ff6b00" emissiveIntensity={0.3} />
        </mesh>

        {/* Right Door Label */}
        <mesh position={[width / 4, height / 4, 0.02]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.15, 0.15, 0.005]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[width / 4, height / 4, 0.022]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.13, 0.13, 0.002]} />
          <meshStandardMaterial color="#ff6b00" emissive="#ff6b00" emissiveIntensity={0.3} />
        </mesh>

        {/* Blue Info Plates */}
        <mesh position={[-width / 4, -height / 3, 0.02]}>
          <boxGeometry args={[0.2, 0.12, 0.005]} />
          <meshStandardMaterial color="#4a7ba7" emissive="#4a7ba7" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[width / 4, -height / 3, 0.02]}>
          <boxGeometry args={[0.2, 0.12, 0.005]} />
          <meshStandardMaterial color="#4a7ba7" emissive="#4a7ba7" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* Internal Shelves - Blue */}
      {type === 'tall' ? (
        <>
          {[-0.6, -0.2, 0.2, 0.6].map((y, i) => (
            <mesh key={i} position={[0, y, 0]}>
              <boxGeometry args={[width - 0.08, 0.03, depth - 0.08]} />
              <meshStandardMaterial color="#b8d4e8" roughness={0.4} />
            </mesh>
          ))}
        </>
      ) : (
        <>
          {[-0.2, 0.2].map((y, i) => (
            <mesh key={i} position={[0, y, 0]}>
              <boxGeometry args={[width - 0.08, 0.03, depth - 0.08]} />
              <meshStandardMaterial color="#b8d4e8" roughness={0.4} />
            </mesh>
          ))}
        </>
      )}

      {/* Base */}
      <mesh position={[0, -height / 2 - 0.02, 0]}>
        <boxGeometry args={[width + 0.02, 0.04, depth + 0.02]} />
        <meshStandardMaterial color="#d0d0d0" roughness={0.6} metalness={0.2} />
      </mesh>
    </group>
  )
}
