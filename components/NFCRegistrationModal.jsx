import React, { useState, useEffect } from 'react'
import { 
  ArrowUpFromLine, User, Phone, Clock, MapPin, 
  CheckCircle2, AlertTriangle, Loader2, X, Nfc,
  FlaskConical, Package
} from './Icons'
import { writeNFCTag } from '../services/nfcService'

/**
 * NFC出库登记模态框
 * 用于在出库时关联NFC标签写卡功能
 */
export default function NFCRegistrationModal({ reagent, onClose, onSuccess }) {
  // 表单状态 - 自动填充药品柜UID
  const [formData, setFormData] = useState({
    uid: reagent?.cabinetUid || '', // 自动填充药品柜UID
    borrower_name: '',
    borrower_phone: '',
    borrow_time: new Date().toISOString().slice(0, 16).replace('T', ' '),
    expected_return_time: '',
    remaining_quantity: reagent?.currentAmount?.toString() || '',
    unit: 'ml',
    location: reagent?.position || '',
  })

  // 流程状态
  const [step, setStep] = useState('form') // 'form' | 'waiting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('')
  const [tagUid, setTagUid] = useState('')
  const [countdown, setCountdown] = useState(20)

  // 倒计时效果
  useEffect(() => {
    let timer
    if (step === 'waiting' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    } else if (countdown === 0 && step === 'waiting') {
      setStep('error')
      setErrorMessage('等待NFC标签扫描超时，请重试')
    }
    return () => clearInterval(timer)
  }, [step, countdown])

  // 处理表单输入
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // 提交表单 - 开始NFC写卡流程
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 验证必填字段
    if (!formData.uid.trim()) {
      setErrorMessage('药品柜UID不能为空')
      return
    }
    if (!formData.borrower_name.trim()) {
      setErrorMessage('请输入借用人姓名')
      return
    }

    setErrorMessage('')
    setStep('waiting')
    setCountdown(20)

    try {
      // 调用NFC写卡API
      const result = await writeNFCTag({
        uid: formData.uid,
        chemical_name: reagent?.name || '',
        status: 'borrowed', // 出库状态
        remaining_quantity: formData.remaining_quantity,
        unit: formData.unit,
        borrower_name: formData.borrower_name,
        borrower_phone: formData.borrower_phone,
        borrow_time: formData.borrow_time,
        expected_return_time: formData.expected_return_time,
        location: formData.location,
      })

      if (result.success) {
        setTagUid(result.tagUid || '已记录')
        setStep('success')
        // 通知父组件成功
        if (onSuccess) {
          onSuccess({
            ...formData,
            tagUid: result.tagUid,
            chemical_name: reagent?.name,
          })
        }
      } else {
        setStep('error')
        setErrorMessage(result.message || '写卡失败，请重试')
      }
    } catch (error) {
      setStep('error')
      setErrorMessage(`操作失败: ${error.message}`)
    }
  }

  // 重试
  const handleRetry = () => {
    setStep('form')
    setErrorMessage('')
    setCountdown(20)
  }

  // 共用样式
  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    transition: 'all 0.2s',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    marginBottom: '8px',
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(8px)',
      zIndex: 1100,
      animation: 'fadeIn 0.3s ease-out',
    }} onClick={onClose}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        width: '520px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          padding: '24px 28px',
          color: 'white',
          position: 'relative',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Nfc size={24} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>NFC 出库登记</h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.9 }}>
                  {reagent?.name} · {reagent?.formula}
                </p>
                {reagent?.cabinetUid && (
                  <div style={{
                    marginTop: '6px',
                    padding: '4px 10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'inline-block',
                  }}>
                    📍 {reagent.cabinetUid}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '10px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                fontSize: '20px',
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '28px' }}>
          
          {/* 表单步骤 */}
          {step === 'form' && (
            <form onSubmit={handleSubmit}>
              {/* 错误提示 */}
              {errorMessage && (
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#991b1b',
                  fontSize: '13px',
                }}>
                  <AlertTriangle size={18} />
                  {errorMessage}
                </div>
              )}

              {/* 药品柜UID - 自动填充 */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>
                  <Nfc size={16} /> 药品柜 UID
                  {reagent?.cabinetUid && (
                    <span style={{
                      marginLeft: '8px',
                      padding: '2px 8px',
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600',
                    }}>
                      ✓ 已自动填充
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  name="uid"
                  value={formData.uid}
                  onChange={handleInputChange}
                  placeholder="药品柜UID将自动填充..."
                  required
                  readOnly={!!reagent?.cabinetUid}
                  style={{
                    ...inputStyle,
                    backgroundColor: reagent?.cabinetUid ? '#f0fdf4' : '#f8fafc',
                    borderColor: reagent?.cabinetUid ? '#86efac' : '#e2e8f0',
                    color: reagent?.cabinetUid ? '#166534' : '#0f172a',
                    fontWeight: reagent?.cabinetUid ? '600' : '400',
                    cursor: reagent?.cabinetUid ? 'default' : 'text',
                  }}
                  onFocus={e => { 
                    if (!reagent?.cabinetUid) {
                      e.target.style.borderColor = '#3b82f6'
                      e.target.style.backgroundColor = '#fff'
                    }
                  }}
                  onBlur={e => { 
                    if (!reagent?.cabinetUid) {
                      e.target.style.borderColor = '#e2e8f0'
                      e.target.style.backgroundColor = '#f8fafc'
                    }
                  }}
                />
              </div>

              {/* 借用人信息区域 */}
              <div style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '20px',
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#92400e',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <User size={18} /> 借用人信息
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>
                      <User size={14} /> 姓名 *
                    </label>
                    <input
                      type="text"
                      name="borrower_name"
                      value={formData.borrower_name}
                      onChange={handleInputChange}
                      placeholder="请输入姓名..."
                      required
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.backgroundColor = '#fff' }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc' }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>
                      <Phone size={14} /> 联系电话
                    </label>
                    <input
                      type="tel"
                      name="borrower_phone"
                      value={formData.borrower_phone}
                      onChange={handleInputChange}
                      placeholder="请输入电话..."
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.backgroundColor = '#fff' }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                  <div>
                    <label style={labelStyle}>
                      <Clock size={14} /> 借出时间
                    </label>
                    <input
                      type="text"
                      name="borrow_time"
                      value={formData.borrow_time}
                      onChange={handleInputChange}
                      placeholder="YYYY-MM-DD HH:MM"
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.backgroundColor = '#fff' }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc' }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>
                      <Clock size={14} /> 预计归还
                    </label>
                    <input
                      type="text"
                      name="expected_return_time"
                      value={formData.expected_return_time}
                      onChange={handleInputChange}
                      placeholder="YYYY-MM-DD HH:MM"
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.backgroundColor = '#fff' }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc' }}
                    />
                  </div>
                </div>
              </div>

              {/* 数量和位置 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={labelStyle}>
                    <Package size={14} /> 出库量
                  </label>
                  <input
                    type="text"
                    name="remaining_quantity"
                    value={formData.remaining_quantity}
                    onChange={handleInputChange}
                    placeholder="数量"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.backgroundColor = '#fff' }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc' }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>单位</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="ml">ml</option>
                    <option value="L">L</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="瓶">瓶</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>
                    <MapPin size={14} /> 存放位置
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="位置"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.backgroundColor = '#fff' }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc' }}
                  />
                </div>
              </div>

              {/* 提交按钮 */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.2s',
                }}
              >
                <Nfc size={20} /> 开始写卡
              </button>
            </form>
          )}

          {/* 等待NFC扫描步骤 */}
          {step === 'waiting' && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{
                width: '100px',
                height: '100px',
                margin: '0 auto 24px',
                borderRadius: '50%',
                backgroundColor: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s infinite',
              }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}>
                  <Nfc size={36} />
                </div>
              </div>
              
              <h3 style={{ margin: '0 0 8px', fontSize: '20px', color: '#0f172a', fontWeight: '700' }}>
                等待NFC标签扫描...
              </h3>
              <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#64748b' }}>
                请将NFC标签靠近读卡器
              </p>
              
              <div style={{
                width: '60px',
                height: '60px',
                margin: '0 auto',
                borderRadius: '50%',
                backgroundColor: '#f8fafc',
                border: '3px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                color: countdown <= 5 ? '#ef4444' : '#3b82f6',
              }}>
                {countdown}
              </div>
              <p style={{ margin: '12px 0 0', fontSize: '13px', color: '#94a3b8' }}>
                剩余等待时间（秒）
              </p>
              
              <button
                onClick={handleRetry}
                style={{
                  marginTop: '24px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                取消
              </button>
            </div>
          )}

          {/* 成功步骤 */}
          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 24px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16a34a',
              }}>
                <CheckCircle2 size={48} />
              </div>
              
              <h3 style={{ margin: '0 0 8px', fontSize: '20px', color: '#0f172a', fontWeight: '700' }}>
                出库登记成功！
              </h3>
              <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#64748b' }}>
                NFC标签已成功写入
              </p>
              
              {/* 写卡信息摘要 */}
              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'left',
                marginBottom: '24px',
              }}>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>化学品</span>
                    <span style={{ color: '#0f172a', fontWeight: '600', fontSize: '13px' }}>{reagent?.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>借用人</span>
                    <span style={{ color: '#0f172a', fontWeight: '600', fontSize: '13px' }}>{formData.borrower_name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>Tag UID</span>
                    <span style={{ 
                      color: '#3b82f6', 
                      fontWeight: '600', 
                      fontSize: '13px',
                      fontFamily: 'monospace',
                      backgroundColor: '#eff6ff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}>{tagUid}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={onClose}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                }}
              >
                完成
              </button>
            </div>
          )}

          {/* 错误步骤 */}
          {step === 'error' && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 24px',
                borderRadius: '50%',
                backgroundColor: '#fef2f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#dc2626',
              }}>
                <AlertTriangle size={48} />
              </div>
              
              <h3 style={{ margin: '0 0 8px', fontSize: '20px', color: '#0f172a', fontWeight: '700' }}>
                操作失败
              </h3>
              <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#64748b' }}>
                {errorMessage}
              </p>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={onClose}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: 'white',
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  关闭
                </button>
                <button
                  onClick={handleRetry}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  }}
                >
                  重试
                </button>
              </div>
            </div>
          )}
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
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
