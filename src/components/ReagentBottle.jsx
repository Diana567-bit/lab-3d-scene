import React, { useState } from 'react'

export default function ReagentBottle({ position, type, label, reagentData, onBottleClick, cabinetUid }) {
  const [hovered, setHovered] = useState(false)
  
  // 计算库存百分比
  const remainingPercent = reagentData ? Math.round((reagentData.currentAmount / reagentData.capacity) * 100) : 100
  const isLowStock = remainingPercent <= 20
  const isCriticalStock = remainingPercent <= 10
  
  const handleClick = (e) => {
    e.stopPropagation()
    if (onBottleClick && reagentData) {
      // 将cabinetUid附加到reagentData中传递
      onBottleClick({ ...reagentData, cabinetUid: cabinetUid || '' })
    }
  }
  
  return (
    <group 
      position={position}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Bottle body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.12, 16]} />
        <meshStandardMaterial 
          color={type === 'brown' ? '#4a2511' : '#e8f4ff'}
          transparent={type === 'clear'}
          opacity={type === 'clear' ? 0.3 : 0.9}
          roughness={0.1}
          metalness={0.05}
          emissive={hovered ? '#ffff00' : (isCriticalStock ? '#ff0000' : '#000000')}
          emissiveIntensity={hovered ? 0.3 : (isCriticalStock ? 0.2 : 0)}
        />
      </mesh>
      
      {/* Gray screw cap */}
      <mesh position={[0, 0.07, 0]} castShadow>
        <cylinderGeometry args={[0.048, 0.045, 0.02, 16]} />
        <meshStandardMaterial 
          color="#808080" 
          roughness={0.4} 
          metalness={0.3}
          emissive={hovered ? '#ffff00' : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>
      
      {/* White label */}
      {label && (
        <mesh position={[0, 0, 0.046]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.06, 0.08]} />
          <meshStandardMaterial 
            color={hovered ? '#ffffcc' : '#ffffff'} 
            roughness={0.8} 
          />
        </mesh>
      )}
      
      {/* Low Stock Warning Ring - Always visible for low stock items */}
      {isLowStock && !hovered && (
        <mesh position={[0, -0.065, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <ringGeometry args={[0.04, 0.055, 32]} />
          <meshBasicMaterial 
            color={isCriticalStock ? '#ef4444' : '#f59e0b'} 
            transparent 
            opacity={0.8} 
          />
        </mesh>
      )}
      
      {/* Critical Stock Pulsing Indicator */}
      {isCriticalStock && !hovered && (
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.015, 16, 16]} />
          <meshBasicMaterial 
            color="#ff0000" 
            transparent 
            opacity={0.9}
          />
        </mesh>
      )}
      
      {/* Hover highlight ring */}
      {hovered && (
        <mesh position={[0, -0.06, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <ringGeometry args={[0.05, 0.07, 32]} />
          <meshBasicMaterial 
            color={isCriticalStock ? '#ff0000' : (isLowStock ? '#f59e0b' : '#ffff00')} 
            transparent 
            opacity={0.5} 
          />
        </mesh>
      )}
    </group>
  )
}
