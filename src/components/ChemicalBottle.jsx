import React from 'react'

export default function ChemicalBottle({ 
  position, 
  type = 'clear', // 'clear', 'brown', 'labeled'
  size = 'medium' // 'small', 'medium', 'large'
}) {
  const heights = { small: 0.18, medium: 0.26, large: 0.35 }
  const radii = { small: 0.045, medium: 0.06, large: 0.075 }
  
  const height = heights[size]
  const radius = radii[size]
  
  const glassColor = type === 'brown' ? '#8B4513' : '#e0f0ff'
  const glassOpacity = type === 'brown' ? 1.0 : 1.0  // Fully opaque

  return (
    <group position={position}>
      {/* Bottle Body */}
      <mesh castShadow>
        <cylinderGeometry args={[radius, radius * 0.9, height, 16]} />
        <meshStandardMaterial 
          color={glassColor}
          transparent={false}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Bottle Neck */}
      <mesh position={[0, height / 2 + 0.015, 0]}>
        <cylinderGeometry args={[radius * 0.4, radius * 0.4, 0.03, 12]} />
        <meshStandardMaterial 
          color={glassColor}
          roughness={0.3}
        />
      </mesh>

      {/* Cap */}
      <mesh position={[0, height / 2 + 0.035, 0]}>
        <cylinderGeometry args={[radius * 0.45, radius * 0.45, 0.02, 12]} />
        <meshStandardMaterial 
          color="#333333" 
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Label (if labeled type) */}
      {type === 'labeled' && (
        <mesh position={[0, 0, radius + 0.001]} rotation={[0, 0, 0]}>
          <planeGeometry args={[radius * 1.5, height * 0.5]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
      )}

      {/* Liquid inside (for clear bottles) */}
      {type === 'clear' && (
        <mesh position={[0, -height * 0.15, 0]}>
          <cylinderGeometry args={[radius * 0.85, radius * 0.75, height * 0.7, 16]} />
          <meshStandardMaterial 
            color="#3080ff"
            roughness={0.2}
            emissive="#1060dd"
            emissiveIntensity={0.3}
          />
        </mesh>
      )}
    </group>
  )
}
