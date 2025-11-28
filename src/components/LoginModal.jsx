import React, { useState } from 'react'
import { User, Lock, Eye, EyeOff, AlertTriangle, CheckCircle2, Loader2, FlaskConical } from './Icons'
import { login } from '../services/authService'

/**
 * 登录模态框组件
 */
export default function LoginModal({ onLoginSuccess, onClose }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDemo, setShowDemo] = useState(false)

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
        // 登录成功
        if (onLoginSuccess) {
          onLoginSuccess(result.user)
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
        if (onLoginSuccess) {
          onLoginSuccess(result.user)
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
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        zIndex: 3000,
        animation: 'fadeIn 0.3s ease-out',
      }}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          width: '480px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onScroll={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          padding: '40px 40px 32px',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* 装饰性背景 */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}>
              <FlaskConical size={40} />
            </div>
            <h2 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '700' }}>
              实验室管理系统
            </h2>
            <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
              请登录您的账户
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '40px', flex: 1 }}>
          {/* 错误提示 */}
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#991b1b',
              fontSize: '14px',
            }}>
              <AlertTriangle size={20} />
              {error}
            </div>
          )}

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} style={{ marginBottom: '32px' }}>
            {/* 用户名输入 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
              }}>
                用户名
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="请输入用户名"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '14px 18px 14px 50px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: isLoading ? '#f8fafc' : '#f8fafc',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = '#4f46e5'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <div style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                }}>
                  <User size={18} />
                </div>
              </div>
            </div>

            {/* 密码输入 */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
              }}>
                密码
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="请输入密码"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '14px 50px 14px 50px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: isLoading ? '#f8fafc' : '#f8fafc',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = '#4f46e5'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <div style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                }}>
                  <Lock size={18} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    padding: '4px',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                background: isLoading 
                  ? 'linear-gradient(135deg, #94a3b8, #64748b)' 
                  : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: isLoading 
                  ? '0 4px 12px rgba(148, 163, 184, 0.3)' 
                  : '0 4px 12px rgba(79, 70, 229, 0.3)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={e => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                  登录中...
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  登录
                </>
              )}
            </button>
          </form>

          {/* 演示账户 */}
          <div style={{
            borderTop: '1px solid #e2e8f0',
            paddingTop: '24px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <h4 style={{
                margin: 0,
                fontSize: '14px',
                fontWeight: '600',
                color: '#64748b',
              }}>
                演示账户
              </h4>
              <button
                type="button"
                onClick={() => setShowDemo(!showDemo)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4f46e5',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                {showDemo ? '隐藏' : '显示'}
              </button>
            </div>

            {showDemo && (
              <div style={{
                display: 'grid',
                gap: '8px',
              }}>
                {demoAccounts.map((account, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => quickLogin(account.username, account.password)}
                    disabled={isLoading}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: 'white',
                      textAlign: 'left',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      opacity: isLoading ? 0.6 : 1,
                    }}
                    onMouseEnter={e => {
                      if (!isLoading) {
                        e.currentTarget.style.backgroundColor = '#f8fafc'
                        e.currentTarget.style.borderColor = '#cbd5e1'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isLoading) {
                        e.currentTarget.style.backgroundColor = 'white'
                        e.currentTarget.style.borderColor = '#e2e8f0'
                      }
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <div>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#0f172a',
                          marginBottom: '2px',
                        }}>
                          {account.name}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: '#64748b',
                        }}>
                          {account.username} / {account.password}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#4f46e5',
                        fontWeight: '600',
                      }}>
                        {account.role}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
