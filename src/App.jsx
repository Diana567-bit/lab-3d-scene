import React, { useState, useEffect } from 'react'
import LoginPage from './components/LoginPage'
import Laboratory from './Laboratory'
import { getCurrentUser, logout } from './services/authService'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // 检查登录状态（刷新后需要重新登录，所以这里直接设置为未登录）
  useEffect(() => {
    // 刷新页面后不恢复登录状态，直接显示登录界面
    setIsLoading(false)
  }, [])

  // 监听网络状态，网络中断时自动退出到登录界面
  useEffect(() => {
    const handleOffline = async () => {
      console.log('网络中断，正在退出登录...')
      if (isAuthenticated) {
        await logout()
        setUser(null)
        setIsAuthenticated(false)
        alert('网络连接已中断，请重新登录')
      }
    }

    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('offline', handleOffline)
    }
  }, [isAuthenticated])

  const handleLogin = (userObj) => {
    setUser(userObj)
    setIsAuthenticated(true)
  }

  const handleLogout = async () => {
    try {
      await logout()
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  // 显示加载状态
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          color: 'white'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ fontSize: '16px', fontWeight: '500' }}>加载中...</p>
        </div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // 根据认证状态显示不同的界面
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <Laboratory user={user} onLogout={handleLogout} />
}