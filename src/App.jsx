import React, { useState, useEffect } from 'react'
import LoginPage from './components/LoginPage'
import Laboratory from './Laboratory'
import { getCurrentUser, logout } from './services/authService'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // 检查本地存储的登录状态
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const currentUser = getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('检查登录状态时出错:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

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