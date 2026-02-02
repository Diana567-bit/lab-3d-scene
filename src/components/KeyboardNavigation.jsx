import { useEffect, useState, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function KeyboardNavigation({ isEnabled = true }) {
  const { camera } = useThree()
  const [keys, setKeys] = useState({})
  const isDragging = useRef(false)
  const enabledRef = useRef(isEnabled)

  useEffect(() => {
    enabledRef.current = isEnabled
    if (!isEnabled) {
      setKeys({}) // Reset keys when disabled
      isDragging.current = false
    }
  }, [isEnabled])

  useEffect(() => {
    // Set rotation order to YXZ to avoid gimbal lock (standard for FPS)
    camera.rotation.order = 'YXZ'

    const handleKeyDown = (e) => {
      if (!enabledRef.current) return
      setKeys(k => ({ ...k, [e.code]: true }))
    }
    const handleKeyUp = (e) => {
      if (!enabledRef.current) return
      setKeys(k => ({ ...k, [e.code]: false }))
    }
    
    const handleMouseDown = () => { 
      if (!enabledRef.current) return
      isDragging.current = true 
    }
    const handleMouseUp = () => { isDragging.current = false }
    
    const handleMouseMove = (e) => {
      if (!enabledRef.current) return
      if (!isDragging.current) return
      
      // Sensitivity factor
      const sensitivity = 0.002
      
      camera.rotation.y -= e.movementX * sensitivity
      camera.rotation.x -= e.movementY * sensitivity
      
      // Clamp pitch (up/down) to avoid flipping
      camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x))
    }

    const handleWheel = (e) => {
      if (!enabledRef.current) return
      // Adjust FOV based on scroll direction
      // deltaY < 0 means scroll up (forward) -> Zoom In -> Decrease FOV
      // deltaY > 0 means scroll down (backward) -> Zoom Out -> Increase FOV
      
      const zoomSpeed = 2
      const delta = e.deltaY > 0 ? 1 : -1
      
      camera.fov += delta * zoomSpeed
      
      // Clamp FOV between 10 (very zoomed in) and 75 (wide angle)
      camera.fov = Math.max(10, Math.min(75, camera.fov))
      camera.updateProjectionMatrix()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('wheel', handleWheel)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [camera])

  useFrame((state, delta) => {
    if (!enabledRef.current) return

    const speed = 2 * delta // Slower speed
    
    // Local movements (Relative to camera view)
    // A (Left) / D (Right)
    if (keys['KeyA']) camera.translateX(-speed)
    if (keys['KeyD']) camera.translateX(speed)
    
    // Q (Forward) / E (Backward)
    if (keys['KeyQ']) camera.translateZ(-speed)
    if (keys['KeyE']) camera.translateZ(speed)
    
    // Global Y movements (Up/Down)
    // W (Up) / S (Down)
    if (keys['KeyW']) camera.position.y += speed
    if (keys['KeyS']) camera.position.y -= speed
  })

  return null
}
