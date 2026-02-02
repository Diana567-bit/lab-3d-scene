import React, { useState, useEffect } from 'react'
import { 
  ArrowUpFromLine, User, Phone, Clock, MapPin, 
  CheckCircle2, AlertTriangle, Loader2, X, Nfc,
  FlaskConical, Package, Scan
} from './Icons'
import { readNFCTag } from '../services/nfcService'

/**
 * NFC出库确认模态框
 * 通过扫描NFC标签确认出库信息，不写入数据
 */
export default function NFCOutboundModal({ reagent, onClose, onSuccess }) {
  // 表单状态
  const [formData, setFormData] = useState({
    borrower_name: '',
    borrower_phone: '',
    borrow_time: new Date().toISOString().slice(0, 16).replace('T', ' '),
    expected_return_time: '',
    outbound_quantity: '',
    unit: 'ml',
    location: reagent?.position || '',
    note: '',
  })

  // 流程状态
  const [step, setStep] = useState('form') // 'form' | 'scanning' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('')
  const [scannedData, setScannedData] = useState(null)
  const [countdown, setCountdown] = useState(20)

  // 倒计时效果
  useEffect(() => {
    let timer
    if (step === 'scanning' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (step === 'scanning' && countdown === 0) {
      setStep('error')
      setErrorMessage('扫描超时，请重试')
    }
    return () => clearTimeout(timer)
  }, [step, countdown])

  // 处理表单输入
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // 提交表单，开始NFC扫描
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 验证出库数量
    const outboundQty = parseInt(formData.outbound_quantity)
    if (outboundQty <= 0 || outboundQty > reagent.currentAmount) {
      setErrorMessage('出库数量无效，请检查输入')
      return
    }
    
    setStep('scanning')
    setCountdown(20)
    setErrorMessage('')
    
    // 模拟NFC扫描过程
    try {
      // 这里应该调用实际的NFC读取API
      const result = await readNFCTag()
      
      if (result.success) {
        setScannedData(result.data)
        setStep('success')
        
        // 通知父组件出库成功
        if (onSuccess) {
          onSuccess({
            ...formData,
            scannedData: result.data,
            reagentId: reagent.id,
            outboundQuantity: outboundQty
          })
        }
      } else {
        setStep('error')
        setErrorMessage(result.message || 'NFC扫描失败')
      }
    } catch (error) {
      setStep('error')
      setErrorMessage('扫描过程中发生错误，请重试')
    }
  }

  // 重试扫描
  const handleRetry = () => {
    setStep('form')
    setErrorMessage('')
    setCountdown(20)
  }

  if (!reagent) return null

  // 共用样式
  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s',
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '10px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(8px)',
      zIndex: 2000,
      animation: 'fadeIn 0.3s ease-out',
      padding: '20px',
    }} onClick={onClose}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '28px',
        width: '680px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          padding: '32px 40px 40px', // 减少上下留白，保持适中
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <ArrowUpFromLine size={28} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '26px', fontWeight: '700' }}>NFC 出库确认</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '15px', opacity: 0.9 }}>
                    {reagent.name} · {reagent.formula}
                  </p>
                </div>
              </div>
              
              <div style={{
                marginTop: '8px',
                padding: '8px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
              }}>
                <MapPin size={16} /> {reagent.storageRoom} · {reagent.position}
              </div>
            </div>
            
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '12px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                cursor: 'pointer',
                color: 'white',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#f8fafc' }}>
          {/* 表单步骤 */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} style={{ padding: '40px' }}> {/* 增加外部间距 */}
              {errorMessage && (
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  marginBottom: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#991b1b',
                  fontSize: '14px',
                  boxShadow: '0 2px 4px rgba(239, 68, 68, 0.05)'
                }}>
                  <AlertTriangle size={20} />
                  {errorMessage}
                </div>
              )}

              {/* 借用人信息卡片 */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '24px', // 增加圆角
                padding: '32px', // 增加内部空间
                marginBottom: '32px', // 增加卡片间距
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.03), 0 4px 6px -2px rgba(0, 0, 0, 0.01)',
                border: '1px solid #f1f5f9'
              }}>
                <h3 style={{
                  margin: '0 0 24px 0', // 增加标题下边距
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <div style={{ 
                    padding: '8px', 
                    backgroundColor: '#eff6ff', 
                    borderRadius: '10px',
                    color: '#3b82f6',
                    display: 'flex' 
                  }}>
                    <User size={20} />
                  </div>
                  借用人信息
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}> {/* 减小列间距防止溢出 */}
                  <div>
                    <label style={{...labelStyle, marginBottom: '14px', fontSize: '15px', color: '#475569'}}>借用人姓名 *</label>
                    <input
                      type="text"
                      name="borrower_name"
                      value={formData.borrower_name}
                      onChange={handleInputChange}
                      placeholder="如：张三"
                      required
                      style={{ 
                        ...inputStyle, 
                        width: '100%', // 确保宽度自适应
                        padding: '16px 20px', // 稍微减小内边距以适应布局
                        backgroundColor: '#f8fafc', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px', 
                        fontSize: '16px',
                        boxSizing: 'border-box' // 确保padding不增加总宽度
                      }}
                    />
                  </div>
                  <div>
                    <label style={{...labelStyle, marginBottom: '14px', fontSize: '15px', color: '#475569'}}>联系电话</label>
                    <input
                      type="tel"
                      name="borrower_phone"
                      value={formData.borrower_phone}
                      onChange={handleInputChange}
                      placeholder="联系电话"
                      style={{ 
                        ...inputStyle, 
                        width: '100%',
                        padding: '16px 20px',
                        backgroundColor: '#f8fafc', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 出库信息卡片 */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '24px',
                padding: '32px',
                marginBottom: '32px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.03), 0 4px 6px -2px rgba(0, 0, 0, 0.01)',
                border: '1px solid #f1f5f9'
              }}>
                <h3 style={{
                  margin: '0 0 24px 0',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <div style={{ 
                    padding: '8px', 
                    backgroundColor: '#fff1f2', 
                    borderRadius: '10px',
                    color: '#e11d48',
                    display: 'flex' 
                  }}>
                    <Package size={20} />
                  </div>
                  出库信息
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}> {/* 减小列间距 */}
                  <div>
                    <label style={{...labelStyle, marginBottom: '14px', fontSize: '15px', color: '#475569'}}>出库数量 *</label>
                    <input
                      type="number"
                      name="outbound_quantity"
                      value={formData.outbound_quantity}
                      onChange={handleInputChange}
                      placeholder="出库数量"
                      required
                      min="1"
                      max={reagent.currentAmount}
                      style={{ 
                        ...inputStyle, 
                        width: '100%',
                        padding: '16px 20px',
                        backgroundColor: '#f8fafc', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{...labelStyle, marginBottom: '14px', fontSize: '15px', color: '#475569'}}>单位</label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      style={{ 
                        ...inputStyle, 
                        width: '100%',
                        cursor: 'pointer', 
                        padding: '16px 20px',
                        backgroundColor: '#f8fafc', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="ml">毫升 (ml)</option>
                      <option value="L">升 (L)</option>
                      <option value="g">克 (g)</option>
                      <option value="kg">千克 (kg)</option>
                      <option value="个">个</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 时间信息卡片 */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '24px',
                padding: '32px',
                marginBottom: '32px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.03), 0 4px 6px -2px rgba(0, 0, 0, 0.01)',
                border: '1px solid #f1f5f9'
              }}>
                <h3 style={{
                  margin: '0 0 24px 0',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <div style={{ 
                    padding: '8px', 
                    backgroundColor: '#f0fdf4', 
                    borderRadius: '10px',
                    color: '#16a34a',
                    display: 'flex' 
                  }}>
                    <Clock size={20} />
                  </div>
                  时间信息
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}> {/* 减小列间距 */}
                  <div>
                    <label style={{...labelStyle, marginBottom: '14px', fontSize: '15px', color: '#475569'}}>借用时间</label>
                    <input
                      type="datetime-local"
                      name="borrow_time"
                      value={formData.borrow_time.replace(' ', 'T')}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        borrow_time: e.target.value.replace('T', ' ') 
                      }))}
                      style={{ 
                        ...inputStyle, 
                        width: '100%',
                        padding: '16px 20px',
                        backgroundColor: '#f8fafc', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{...labelStyle, marginBottom: '14px', fontSize: '15px', color: '#475569'}}>预计归还时间</label>
                    <input
                      type="datetime-local"
                      name="expected_return_time"
                      value={formData.expected_return_time}
                      onChange={handleInputChange}
                      style={{ 
                        ...inputStyle, 
                        width: '100%',
                        padding: '16px 20px',
                        backgroundColor: '#f8fafc', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 备注信息卡片 */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '24px',
                padding: '32px',
                marginBottom: '32px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.03), 0 4px 6px -2px rgba(0, 0, 0, 0.01)',
                border: '1px solid #f1f5f9'
              }}>
                <h3 style={{
                  margin: '0 0 24px 0',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <div style={{ 
                    padding: '8px', 
                    backgroundColor: '#f1f5f9', 
                    borderRadius: '10px',
                    color: '#475569',
                    display: 'flex' 
                  }}>
                    <AlertTriangle size={20} />
                  </div>
                  备注
                </h3>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="出库用途或备注信息"
                  rows={3}
                  style={{ 
                    ...inputStyle, 
                    resize: 'vertical',
                    minHeight: '100px', 
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '18px 24px',
                    borderRadius: '16px',
                    fontSize: '16px',
                    width: '100%', // 确保宽度自适应
                    boxSizing: 'border-box', // 防止padding撑大宽度
                    maxWidth: '100%' // 双重保险
                  }}
                />
              </div>

              {/* 当前库存信息卡片 */}
              <div style={{
                backgroundColor: '#f0f9ff',
                borderRadius: '20px',
                padding: '24px',
                marginBottom: '24px',
                border: '1px solid #bae6fd',
                boxShadow: '0 4px 6px -1px rgba(3, 105, 161, 0.05)'
              }}>
                <div style={{ 
                  fontSize: '15px', 
                  fontWeight: '700', 
                  color: '#0369a1', 
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <div style={{ 
                    padding: '6px', 
                    backgroundColor: 'white', 
                    borderRadius: '8px',
                    color: '#0284c7',
                    display: 'flex',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}>
                    <Package size={18} />
                  </div>
                  库存变化预览
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '16px' }}>
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e0f2fe',
                    flex: 1,
                    textAlign: 'center',
                    boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.05)'
                  }}>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>当前库存</div>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>
                      {reagent?.currentAmount || 0} ml
                    </div>
                  </div>
                  <div style={{ color: '#dc2626', fontWeight: '700', fontSize: '18px' }}>
                    -{formData.outbound_quantity || 0} ml
                  </div>
                  <div style={{ color: '#64748b', fontWeight: '600' }}>→</div>
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: '#fef2f2',
                    borderRadius: '12px',
                    border: '1px solid #fecaca',
                    flex: 1,
                    textAlign: 'center',
                    boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.05)'
                  }}>
                    <div style={{ fontSize: '12px', color: '#991b1b', marginBottom: '4px' }}>出库后</div>
                    <div style={{ fontWeight: '700', color: '#b91c1c' }}>
                      {Math.max(0, (reagent?.currentAmount || 0) - parseInt(formData.outbound_quantity || 0))} ml
                    </div>
                  </div>
                </div>
              </div>

              {/* 提交按钮 */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '18px',
                  borderRadius: '16px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: '0 8px 16px -4px rgba(59, 130, 246, 0.4)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Scan size={22} /> 扫描NFC标签确认出库
              </button>
            </form>
          )}

          {/* 扫描步骤 */}
          {step === 'scanning' && (
            <div style={{ textAlign: 'center', padding: '50px 40px' }}>
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                animation: 'pulse 2s infinite',
              }}>
                <Loader2 size={56} style={{ animation: 'spin 1s linear infinite' }} />
              </div>
              
              <h3 style={{ margin: '0 0 12px', fontSize: '24px', color: '#0f172a', fontWeight: '700' }}>
                请扫描NFC标签
              </h3>
              <p style={{ margin: '0 0 24px', fontSize: '16px', color: '#64748b' }}>
                将试剂瓶上的NFC标签靠近读卡器，剩余时间：{countdown}秒
              </p>
              
              <div style={{
                backgroundColor: '#f0f9ff',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '32px',
                border: '1px solid #bae6fd',
                maxWidth: '500px',
                margin: '0 auto 32px',
              }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#0369a1', marginBottom: '16px' }}>
                  <Scan size={18} style={{ display: 'inline', marginRight: '8px' }} />
                  即将确认的出库信息
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid #e0f2fe',
                  }}>
                    <span style={{ color: '#64748b' }}>试剂</span>
                    <span style={{ fontWeight: '600', color: '#0f172a' }}>{reagent?.name}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid #e0f2fe',
                  }}>
                    <span style={{ color: '#64748b' }}>借用人</span>
                    <span style={{ fontWeight: '600', color: '#0f172a' }}>{formData.borrower_name}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    backgroundColor: '#fef2f2',
                    borderRadius: '8px',
                    border: '1px solid #fecaca',
                  }}>
                    <span style={{ color: '#991b1b' }}>出库量</span>
                    <span style={{ fontWeight: '700', color: '#b91c1c' }}>-{formData.outbound_quantity} {formData.unit}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid #e0f2fe',
                  }}>
                    <span style={{ color: '#64748b' }}>预计归还</span>
                    <span style={{ fontWeight: '600', color: '#0f172a' }}>{formData.expected_return_time || '未设定'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 成功步骤 */}
          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '50px 40px' }}>
              <div style={{
                width: '100px',
                height: '100px',
                margin: '0 auto 32px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16a34a',
              }}>
                <CheckCircle2 size={56} />
              </div>
              
              <h3 style={{ margin: '0 0 12px', fontSize: '24px', color: '#0f172a', fontWeight: '700' }}>
                出库确认成功！
              </h3>
              <p style={{ margin: '0 0 24px', fontSize: '16px', color: '#64748b' }}>
                NFC标签验证通过，出库记录已更新
              </p>
              
              {scannedData && (
                <div style={{
                  backgroundColor: '#f0fdf4',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '32px',
                  border: '1px solid #bbf7d0',
                  maxWidth: '400px',
                  margin: '0 auto 32px',
                }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>
                    <Nfc size={16} style={{ display: 'inline', marginRight: '8px' }} />
                    扫描成功
                  </div>
                  <div style={{ fontSize: '14px', color: '#15803d' }}>
                    出库后剩余：{Math.max(0, (reagent?.currentAmount || 0) - parseInt(formData.outbound_quantity || 0))} {formData.unit}
                  </div>
                </div>
              )}
              
              <button
                onClick={onClose}
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  padding: '16px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                完成
              </button>
            </div>
          )}

          {/* 错误步骤 */}
          {step === 'error' && (
            <div style={{ textAlign: 'center', padding: '50px 40px' }}>
              <div style={{
                width: '100px',
                height: '100px',
                margin: '0 auto 32px',
                borderRadius: '50%',
                backgroundColor: '#fef2f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#dc2626',
              }}>
                <AlertTriangle size={56} />
              </div>
              
              <h3 style={{ margin: '0 0 12px', fontSize: '24px', color: '#0f172a', fontWeight: '700' }}>
                扫描失败
              </h3>
              <p style={{ margin: '0 0 32px', fontSize: '16px', color: '#64748b' }}>
                {errorMessage}
              </p>
              
              <button
                onClick={handleRetry}
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  padding: '16px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                重试
              </button>
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
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
