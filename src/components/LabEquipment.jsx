import React from 'react'

export default function LabEquipment({ position, type = 'beaker' }) {
  if (type === 'beaker') {
    return (
      <group position={position}>
        {/* Glass Beaker */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.06, 0.2, 16]} />
          <meshStandardMaterial 
            color="#e0f0ff" 
            transparent 
            opacity={0.3} 
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
        {/* Liquid inside */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.075, 0.055, 0.15, 16]} />
          <meshStandardMaterial 
            color="#4080ff" 
            transparent 
            opacity={0.6}
          />
        </mesh>
      </group>
    )
  }
  
  if (type === 'flask') {
    return (
      <group position={position}>
        {/* Erlenmeyer Flask */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <coneGeometry args={[0.1, 0.16, 16]} />
          <meshStandardMaterial 
            color="#e0f0ff" 
            transparent 
            opacity={0.3}
            roughness={0.1}
          />
        </mesh>
        {/* Neck */}
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.04, 8]} />
          <meshStandardMaterial 
            color="#e0f0ff" 
            transparent 
            opacity={0.3}
            roughness={0.1}
          />
        </mesh>
      </group>
    )
  }
  
  if (type === 'test-tube-rack') {
    return (
      <group position={position}>
        {/* Rack Base */}
        <mesh position={[0, 0.02, 0]} castShadow>
          <boxGeometry args={[0.3, 0.04, 0.15]} />
          <meshStandardMaterial color="#8B4513" roughness={0.8} />
        </mesh>
        {/* Test Tubes */}
        {[-0.1, -0.03, 0.04, 0.11].map((x, i) => (
          <group key={i} position={[x, 0.04, 0]}>
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.16, 8]} />
              <meshStandardMaterial 
                color="#e0f0ff" 
                transparent 
                opacity={0.4}
                roughness={0.1}
              />
            </mesh>
            {/* Colored liquid in some tubes */}
            {i % 2 === 0 && (
              <mesh position={[0, 0.05, 0]}>
                <cylinderGeometry args={[0.009, 0.009, 0.1, 8]} />
                <meshStandardMaterial 
                  color={i === 0 ? "#ff6060" : "#60ff60"} 
                  transparent 
                  opacity={0.7}
                />
              </mesh>
            )}
          </group>
        ))}
      </group>
    )
  }
  
  if (type === 'microscope') {
    return (
      <group position={position}>
        {/* Base */}
        <mesh position={[0, 0.01, 0]} castShadow>
          <boxGeometry args={[0.15, 0.02, 0.1]} />
          <meshStandardMaterial color="#333333" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Arm */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.14]} />
          <meshStandardMaterial color="#444444" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Eyepiece */}
        <mesh position={[0, 0.15, 0]} rotation={[0.3, 0, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.04]} />
          <meshStandardMaterial color="#222222" roughness={0.2} metalness={0.8} />
        </mesh>
      </group>
    )
  }
  
  if (type === 'test-tube-rack-set') {
    const RackFrame = ({ position, showHoles = false }) => (
      <group position={position}>
        {/* Side Walls */}
        <mesh position={[-0.14, 0.075, 0]} castShadow>
          <boxGeometry args={[0.02, 0.15, 0.1]} />
          <meshStandardMaterial color="#e0e0e0" roughness={0.5} />
        </mesh>
        <mesh position={[0.14, 0.075, 0]} castShadow>
          <boxGeometry args={[0.02, 0.15, 0.1]} />
          <meshStandardMaterial color="#e0e0e0" roughness={0.5} />
        </mesh>
        {/* Top Plate */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <boxGeometry args={[0.26, 0.02, 0.1]} />
          <meshStandardMaterial color="#e0e0e0" roughness={0.5} />
        </mesh>
        {/* Bottom Plate */}
        <mesh position={[0, 0.03, 0]} castShadow>
          <boxGeometry args={[0.26, 0.02, 0.1]} />
          <meshStandardMaterial color="#e0e0e0" roughness={0.5} />
        </mesh>
        
        {/* Holes on Top Plate */}
        {showHoles && [-0.1, -0.07, -0.04, -0.01, 0.02, 0.05, 0.08, 0.11].map((x, i) => (
          <React.Fragment key={`holes-${i}`}>
            {/* Top Hole */}
            <mesh position={[x, 0.131, 0]} rotation={[-Math.PI/2, 0, 0]}>
              <circleGeometry args={[0.011, 16]} />
              <meshStandardMaterial color="#333333" roughness={0.8} />
            </mesh>
            {/* Bottom Hole */}
            <mesh position={[x, 0.041, 0]} rotation={[-Math.PI/2, 0, 0]}>
              <circleGeometry args={[0.011, 16]} />
              <meshStandardMaterial color="#333333" roughness={0.8} />
            </mesh>
          </React.Fragment>
        ))}
      </group>
    )

    const TestTube = ({ x, color = "#e0f0ff", liquidColor = null }) => {
      const isGlass = color === "#e0f0ff" || color === "#ffffff";
      return (
        <group position={[x, 0.08, 0]}>
          {/* Tube Glass */}
          <mesh>
            <cylinderGeometry args={[0.01, 0.01, 0.16, 8]} />
            <meshStandardMaterial 
              color={color} 
              transparent={isGlass} 
              opacity={isGlass ? 0.4 : 1}
              roughness={0.2}
            />
          </mesh>
          {/* Liquid */}
          {liquidColor && (
            <mesh position={[0, -0.03, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.1, 8]} />
              <meshStandardMaterial 
                color={liquidColor} 
                transparent 
                opacity={0.8}
              />
            </mesh>
          )}
        </group>
      )
    }

    return (
      <group position={position}>
        {/* Left Rack: 3 Tubes (2 Clear, 1 Red) */}
        <group position={[-0.32, 0, 0]}>
          <RackFrame position={[0, 0, 0]} showHoles={true} />
          <TestTube x={-0.08} liquidColor="#e0f0ff" />
          <TestTube x={0} liquidColor="#e0f0ff" />
          <TestTube x={0.08} liquidColor="#ff0000" />
        </group>

        {/* Middle Rack: Empty with Holes */}
        <group position={[0, 0, 0]}>
          <RackFrame position={[0, 0, 0]} showHoles={true} />
        </group>

        {/* Right Rack: Full of White Tubes */}
        <group position={[0.32, 0, 0]}>
          <RackFrame position={[0, 0, 0]} />
          {[-0.1, -0.07, -0.04, -0.01, 0.02, 0.05, 0.08, 0.11].map((x, i) => (
            <TestTube key={i} x={x} color="#ffffff" />
          ))}
        </group>
      </group>
    )
  }
  
  if (type === 'glassware-set') {
    const GraduatedCylinder = ({ position, color, level = 0.7 }) => (
      <group position={position}>
        {/* Base */}
        <mesh position={[0, 0.005, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.01, 6]} />
          <meshStandardMaterial color="#e0f0ff" transparent opacity={0.5} roughness={0.2} />
        </mesh>
        {/* Cylinder Body */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 16]} />
          <meshStandardMaterial color="#e0f0ff" transparent opacity={0.3} roughness={0.1} />
        </mesh>
        {/* Liquid */}
        {color && (
          <mesh position={[0, 0.15 * level + 0.01, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.3 * level, 16]} />
            <meshStandardMaterial color={color} transparent opacity={0.8} />
          </mesh>
        )}
      </group>
    )

    const SimpleBeaker = ({ position, color }) => (
      <group position={position}>
        <mesh position={[0, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.05, 0.16, 16]} />
          <meshStandardMaterial color="#e0f0ff" transparent opacity={0.3} roughness={0.1} />
        </mesh>
        {color && (
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.055, 0.045, 0.1, 16]} />
            <meshStandardMaterial color={color} transparent opacity={0.8} />
          </mesh>
        )}
      </group>
    )

    const SimpleFlask = ({ position, color }) => (
      <group position={position}>
        <mesh position={[0, 0.07, 0]} castShadow>
          <coneGeometry args={[0.08, 0.14, 16]} />
          <meshStandardMaterial color="#e0f0ff" transparent opacity={0.3} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.06, 8]} />
            <meshStandardMaterial color="#e0f0ff" transparent opacity={0.3} roughness={0.1} />
        </mesh>
        {color && (
            <mesh position={[0, 0.04, 0]}>
              <coneGeometry args={[0.07, 0.08, 16]} />
              <meshStandardMaterial color={color} transparent opacity={0.8} />
            </mesh>
        )}
      </group>
    )

    return (
      <group position={position}>
        {/* Row 1 (Back) - Tall items mixed */}
        {/* Left to Right: 3 Blue Cylinders, 2 Red Flasks */}
        <GraduatedCylinder position={[-0.4, 0, 0.08]} color="#0066cc" level={0.8} />
        <GraduatedCylinder position={[-0.2, 0, 0.08]} color="#0066cc" level={0.7} />
        <GraduatedCylinder position={[0, 0, 0.08]} color="#0066cc" level={0.8} />
        <SimpleFlask position={[0.2, 0, 0.08]} color="#cc0000" />
        <SimpleFlask position={[0.4, 0, 0.08]} color="#cc0000" />

        {/* Row 2 (Front) - Shorter items mixed */}
        {/* Left to Right: 2 Blue Cylinders, 1 Orange Beaker, 2 Clear Cylinders */}
        <GraduatedCylinder position={[-0.4, 0, -0.08]} color="#0066cc" level={0.6} />
        <GraduatedCylinder position={[-0.2, 0, -0.08]} color="#0066cc" level={0.5} />
        <SimpleBeaker position={[0, 0, -0.08]} color="#ffaa00" />
        <GraduatedCylinder position={[0.2, 0, -0.08]} />
        <GraduatedCylinder position={[0.4, 0, -0.08]} />
      </group>
    )
  }

  if (type === 'computer') {
    return (
      <group position={position}>
        {/* Monitor */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[0.4, 0.25, 0.02]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0.15, 0.011]}>
          <planeGeometry args={[0.36, 0.22]} />
          <meshStandardMaterial 
            color="#2060a0" 
            emissive="#1040a0" 
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Stand */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.03, 0.05, 0.1]} />
          <meshStandardMaterial color="#333333" roughness={0.4} metalness={0.6} />
        </mesh>
      </group>
    )
  }
  
  return null
}
