import React, { useState } from 'react'
import { User, Lock, Eye, EyeOff, AlertTriangle, CheckCircle2, Loader2 } from './Icons'
import { login } from '../services/authService'

// 请确保将背景图片保存为 src/assets/login_bg.jpg
// 如果没有图片，将显示深色背景
import loginBg from '../assets/login_bg.jpg'

/**
 * 登录页面组件 - 玻璃拟态风格
 */
export default function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDemo, setShowDemo] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // 演示账户信息
  const demoAccounts = [
    { username: 'admin', password: 'admin123', name: '系统管理员', role: '完全权限' },
    { username: 'operator', password: 'operator123', name: '实验员', role: '操作权限' }
  ]

  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('') // 清除错误信息
  }

  // 处理登录提交
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.username || !formData.password) {
      setError('请输入用户名和密码')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await login(formData.username, formData.password)
      
      if (result.success) {
        if (onLogin) {
          onLogin(result.user)
        }
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error('登录异常:', error)
      setError('登录过程中发生错误，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  // 快速登录
  const quickLogin = async (username, password) => {
    setFormData({ username, password })
    setIsLoading(true)
    setError('')

    try {
      const result = await login(username, password)
      
      if (result.success) {
        if (onLogin) {
          onLogin(result.user)
        }
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error('快速登录异常:', error)
      setError('登录过程中发生错误，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${loginBg})`, // 使用导入的背景图
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#0f172a', // 备用背景色
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* 遮罩层，增加背景图的可读性 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 0
      }} />

      <div 
        style={{
          width: '400px',
          maxWidth: '90vw',
          padding: '40px',
          borderRadius: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          zIndex: 1,
          animation: 'fadeInUp 0.5s ease-out',
        }}
      >
        {/* 标题区域 */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            margin: '0 0 8px 0',
            fontSize: '28px', 
            fontWeight: '700', 
            color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            实验室管理系统
          </h1>
          <p style={{
            margin: 0,
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            安全 · 高效 · 智能化管理
          </p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(254, 202, 202, 0.2)',
            border: '1px solid rgba(254, 202, 202, 0.4)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#fecaca',
            fontSize: '14px',
          }}>
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 用户名 */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              marginBottom: '8px',
              color: 'rgba(255, 255, 255, 0.9)'
            }}>用户名</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '2px solid rgba(255, 255, 255, 0.5)',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s',
                  boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.5)'}
                onBlur={e => e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.5)'}
              />
              <div style={{
                position: 'absolute',
                right: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                <User size={20} />
              </div>
            </div>
          </div>

          {/* 密码 */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              marginBottom: '8px',
              color: 'rgba(255, 255, 255, 0.9)'
            }}>密码</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '2px solid rgba(255, 255, 255, 0.5)',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s',
                  boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.5)'}
                onBlur={e => e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.5)'}
              />
              <div style={{
                position: 'absolute',
                right: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255, 255, 255, 0.8)',
                cursor: 'pointer'
              }}
              onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Lock size={20} />}
              </div>
            </div>
          </div>


          {/* 登录按钮 */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              marginTop: '16px',
              borderRadius: '30px',
              border: 'none',
              backgroundColor: 'white',
              color: '#0f172a',
              fontSize: '16px',
              fontWeight: '700',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={e => !isLoading && (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={e => !isLoading && (e.currentTarget.style.transform = 'scale(1)')}
          >
            {isLoading ? '登录中...' : '登录系统'}
          </button>
        </form>


        {/* 演示账户入口 (保留功能但隐藏式) */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={() => setShowDemo(!showDemo)}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'rgba(255,255,255,0.7)',
              padding: '5px 10px',
              borderRadius: '15px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            {showDemo ? '隐藏' : '测试账户'}
          </button>
          
          {showDemo && (
            <div style={{ 
              marginTop: '15px', 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              padding: '10px', 
              borderRadius: '10px' 
            }}>
              {demoAccounts.map((account, index) => (
                <div 
                  key={index} 
                  onClick={() => quickLogin(account.username, account.password)}
                  style={{ 
                    padding: '8px', 
                    cursor: 'pointer', 
                    borderBottom: index === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    fontSize: '13px'
                  }}
                >
                  {account.name}: {account.username}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <style>{`
        /* 覆盖浏览器自动填充样式 - 使用 transition hack 让背景色保持透明 */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          transition: background-color 9999s ease-in-out 0s !important;
          -webkit-text-fill-color: white !important;
          background-color: transparent !important;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
