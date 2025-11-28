import React, { useState } from 'react'
import { 
  User, Lock, Eye, EyeOff, FlaskConical, Beaker, 
  ShieldCheck, Zap, ArrowRight, CheckCircle2
} from './Icons'
import { login } from '../services/authService'

export default function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showTestAccounts, setShowTestAccounts] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await login(formData.username, formData.password)
      
      if (result.success) {
        onLogin(result.user)
      } else {
        setError(result.message || '登录失败，请重试')
      }
    } catch (err) {
      console.error('登录错误:', err)
      setError('登录失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        left: '-15%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />
      
      {/* Floating lab equipment icons */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '15%',
        color: 'rgba(255,255,255,0.1)',
        animation: 'float 7s ease-in-out infinite'
      }}>
        <FlaskConical size={60} />
      </div>
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '20%',
        color: 'rgba(255,255,255,0.08)',
        animation: 'float 9s ease-in-out infinite reverse'
      }}>
        <Beaker size={80} />
      </div>

      {/* Chemical Elements and Formulas */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        color: 'rgba(255,255,255,0.06)',
        fontSize: '48px',
        fontWeight: 'bold',
        fontFamily: 'serif',
        animation: 'float 10s ease-in-out infinite'
      }}>
        H₂O
      </div>
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '8%',
        color: 'rgba(255,255,255,0.05)',
        fontSize: '36px',
        fontWeight: 'bold',
        fontFamily: 'serif',
        animation: 'float 12s ease-in-out infinite reverse'
      }}>
        NaCl
      </div>
      <div style={{
        position: 'absolute',
        bottom: '25%',
        right: '15%',
        color: 'rgba(255,255,255,0.07)',
        fontSize: '42px',
        fontWeight: 'bold',
        fontFamily: 'serif',
        animation: 'float 8s ease-in-out infinite'
      }}>
        CO₂
      </div>
      <div style={{
        position: 'absolute',
        bottom: '40%',
        left: '12%',
        color: 'rgba(255,255,255,0.04)',
        fontSize: '32px',
        fontWeight: 'bold',
        fontFamily: 'serif',
        animation: 'float 14s ease-in-out infinite reverse'
      }}>
        C₆H₁₂O₆
      </div>
      <div style={{
        position: 'absolute',
        top: '45%',
        right: '8%',
        color: 'rgba(255,255,255,0.06)',
        fontSize: '38px',
        fontWeight: 'bold',
        fontFamily: 'serif',
        animation: 'float 11s ease-in-out infinite'
      }}>
        NH₃
      </div>
      <div style={{
        position: 'absolute',
        top: '70%',
        left: '20%',
        color: 'rgba(255,255,255,0.05)',
        fontSize: '40px',
        fontWeight: 'bold',
        fontFamily: 'serif',
        animation: 'float 9s ease-in-out infinite reverse'
      }}>
        CH₄
      </div>

      {/* Periodic Table Elements */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '25%',
        width: '50px',
        height: '50px',
        border: '2px solid rgba(255,255,255,0.08)',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255,255,255,0.08)',
        fontSize: '18px',
        fontWeight: 'bold',
        animation: 'float 13s ease-in-out infinite'
      }}>
        <div style={{ fontSize: '12px' }}>1</div>
        <div>H</div>
      </div>
      <div style={{
        position: 'absolute',
        top: '55%',
        right: '25%',
        width: '50px',
        height: '50px',
        border: '2px solid rgba(255,255,255,0.06)',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255,255,255,0.06)',
        fontSize: '18px',
        fontWeight: 'bold',
        animation: 'float 15s ease-in-out infinite reverse'
      }}>
        <div style={{ fontSize: '12px' }}>6</div>
        <div>C</div>
      </div>
      <div style={{
        position: 'absolute',
        bottom: '30%',
        left: '25%',
        width: '50px',
        height: '50px',
        border: '2px solid rgba(255,255,255,0.07)',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255,255,255,0.07)',
        fontSize: '18px',
        fontWeight: 'bold',
        animation: 'float 12s ease-in-out infinite'
      }}>
        <div style={{ fontSize: '12px' }}>8</div>
        <div>O</div>
      </div>

      {/* Molecular Structure Dots */}
      <div style={{
        position: 'absolute',
        top: '25%',
        right: '30%',
        animation: 'float 16s ease-in-out infinite'
      }}>
        <svg width="80" height="60" style={{ opacity: 0.06 }}>
          <circle cx="20" cy="20" r="4" fill="white" />
          <circle cx="60" cy="20" r="4" fill="white" />
          <circle cx="40" cy="40" r="4" fill="white" />
          <line x1="20" y1="20" x2="60" y2="20" stroke="white" strokeWidth="2" />
          <line x1="20" y1="20" x2="40" y2="40" stroke="white" strokeWidth="2" />
          <line x1="60" y1="20" x2="40" y2="40" stroke="white" strokeWidth="2" />
        </svg>
      </div>
      <div style={{
        position: 'absolute',
        bottom: '45%',
        right: '12%',
        animation: 'float 18s ease-in-out infinite reverse'
      }}>
        <svg width="70" height="70" style={{ opacity: 0.05 }}>
          <circle cx="35" cy="15" r="3" fill="white" />
          <circle cx="15" cy="35" r="3" fill="white" />
          <circle cx="55" cy="35" r="3" fill="white" />
          <circle cx="35" cy="55" r="3" fill="white" />
          <line x1="35" y1="15" x2="15" y2="35" stroke="white" strokeWidth="1.5" />
          <line x1="35" y1="15" x2="55" y2="35" stroke="white" strokeWidth="1.5" />
          <line x1="15" y1="35" x2="35" y2="55" stroke="white" strokeWidth="1.5" />
          <line x1="55" y1="35" x2="35" y2="55" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>

      {/* DNA Helix */}
      <div style={{
        position: 'absolute',
        top: '35%',
        left: '5%',
        animation: 'float 20s ease-in-out infinite'
      }}>
        <svg width="30" height="120" style={{ opacity: 0.04 }}>
          <path d="M5 10 Q15 20 5 30 Q15 40 5 50 Q15 60 5 70 Q15 80 5 90 Q15 100 5 110" 
                stroke="white" strokeWidth="2" fill="none" />
          <path d="M25 10 Q15 20 25 30 Q15 40 25 50 Q15 60 25 70 Q15 80 25 90 Q15 100 25 110" 
                stroke="white" strokeWidth="2" fill="none" />
          <line x1="5" y1="15" x2="25" y2="25" stroke="white" strokeWidth="1" />
          <line x1="5" y1="35" x2="25" y2="45" stroke="white" strokeWidth="1" />
          <line x1="5" y1="55" x2="25" y2="65" stroke="white" strokeWidth="1" />
          <line x1="5" y1="75" x2="25" y2="85" stroke="white" strokeWidth="1" />
          <line x1="5" y1="95" x2="25" y2="105" stroke="white" strokeWidth="1" />
        </svg>
      </div>

      {/* Main login card */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '32px',
        padding: '32px',
        width: '100%',
        maxWidth: '420px',
        maxHeight: '85vh',
        overflowY: 'auto',
        boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        animation: 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 20px 40px -12px rgba(102, 126, 234, 0.4)',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            <FlaskConical size={32} color="white" />
          </div>
          <h1 style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: '800',
            color: '#4f46e5', // 添加备用颜色
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '6px',
            textAlign: 'center',
            letterSpacing: '-0.5px'
          }}>
            实验室管理系统
          </h1>
          <p style={{
            margin: 0,
            color: '#64748b',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            安全 · 高效 · 智能化管理
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && (
            <div style={{
              padding: '16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '16px',
              color: '#991b1b',
              fontSize: '14px',
              textAlign: 'center',
              animation: 'shake 0.5s ease-in-out'
            }}>
              {error}
            </div>
          )}

          {/* Username field */}
          <div style={{ position: 'relative' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
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
                required
                style={{
                  width: '100%',
                  padding: '16px 20px 16px 50px',
                  borderRadius: '16px',
                  border: '2px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#667eea'
                  e.target.style.backgroundColor = '#fff'
                  e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#e2e8f0'
                  e.target.style.backgroundColor = '#f8fafc'
                  e.target.style.boxShadow = 'none'
                }}
              />
              <div style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }}>
                <User size={20} />
              </div>
            </div>
          </div>

          {/* Password field */}
          <div style={{ position: 'relative' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
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
                required
                style={{
                  width: '100%',
                  padding: '16px 50px 16px 50px',
                  borderRadius: '16px',
                  border: '2px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#667eea'
                  e.target.style.backgroundColor = '#fff'
                  e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#e2e8f0'
                  e.target.style.backgroundColor = '#f8fafc'
                  e.target.style.boxShadow = 'none'
                }}
              />
              <div style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }}>
                <Lock size={20} />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={e => e.target.style.color = '#667eea'}
                onMouseLeave={e => e.target.style.color = '#9ca3af'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: '16px',
              border: 'none',
              background: isLoading 
                ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow: '0 8px 16px -4px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease',
              transform: isLoading ? 'none' : 'translateY(0)',
            }}
            onMouseEnter={e => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 12px 24px -4px rgba(102, 126, 234, 0.5)'
              }
            }}
            onMouseLeave={e => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 8px 16px -4px rgba(102, 126, 234, 0.4)'
              }
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                登录中...
              </>
            ) : (
              <>
                登录系统
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* Features */}
        <div style={{
          marginTop: '24px',
          padding: '20px',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          borderRadius: '16px',
          border: '1px solid rgba(102, 126, 234, 0.2)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            fontSize: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4f46e5', fontWeight: '500' }}>
              <ShieldCheck size={16} />
              <span>安全管理</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4f46e5', fontWeight: '500' }}>
              <Zap size={16} />
              <span>智能监控</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4f46e5', fontWeight: '500' }}>
              <FlaskConical size={16} />
              <span>试剂追踪</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4f46e5', fontWeight: '500' }}>
              <CheckCircle2 size={16} />
              <span>合规保证</span>
            </div>
          </div>
        </div>

        {/* Test Accounts Toggle */}
        <div style={{
          marginTop: '16px',
          textAlign: 'center'
        }}>
          <button
            type="button"
            onClick={() => setShowTestAccounts(!showTestAccounts)}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              padding: '10px 18px',
              color: '#1e293b',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '0 auto'
            }}
            onMouseEnter={e => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
            }}
            onMouseLeave={e => {
              e.target.style.backgroundColor = 'transparent'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
            }}
          >
            测试账户
            <span style={{
              transform: showTestAccounts ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }}>
              ▼
            </span>
          </button>
        </div>

        {/* Test Accounts */}
        {showTestAccounts && (
          <div style={{
            marginTop: '12px',
            padding: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <div style={{ display: 'grid', gap: '8px' }}>
              {/* Admin Account */}
              <div 
                onClick={() => {
                  setFormData({ username: 'admin', password: 'admin123' })
                }}
                style={{
                  padding: '10px 12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={e => {
                  e.target.style.backgroundColor = '#f1f5f9'
                  e.target.style.borderColor = '#cbd5e1'
                }}
                onMouseLeave={e => {
                  e.target.style.backgroundColor = '#f8fafc'
                  e.target.style.borderColor = '#e2e8f0'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  A
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '13px', 
                    fontWeight: '600', 
                    color: '#0f172a' 
                  }}>
                    管理员
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#64748b',
                    marginTop: '1px'
                  }}>
                    admin / admin123
                  </div>
                </div>
              </div>

              {/* Operator Account */}
              <div 
                onClick={() => {
                  setFormData({ username: 'operator', password: 'operator123' })
                }}
                style={{
                  padding: '10px 12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={e => {
                  e.target.style.backgroundColor = '#f1f5f9'
                  e.target.style.borderColor = '#cbd5e1'
                }}
                onMouseLeave={e => {
                  e.target.style.backgroundColor = '#f8fafc'
                  e.target.style.borderColor = '#e2e8f0'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  O
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '13px', 
                    fontWeight: '600', 
                    color: '#0f172a' 
                  }}>
                    实验员
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#64748b',
                    marginTop: '1px'
                  }}>
                    operator / operator123
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{
              marginTop: '8px',
              fontSize: '11px',
              color: '#64748b',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              点击卡片自动填入账号密码
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(30px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        @keyframes scaleUp {
          from { 
            opacity: 0; 
            transform: scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  )
}
