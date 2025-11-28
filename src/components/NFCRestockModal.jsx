import React, { useState, useEffect } from 'react'
import { 
  ArrowDownToLine, User, Phone, Clock, MapPin, 
  CheckCircle2, AlertTriangle, Loader2, X, Nfc,
  FlaskConical, Package, ClipboardList
} from './Icons'
import { writeNFCTag } from '../services/nfcService'

/**
 * NFC补货登记模态框
 * 用于在补货时关联NFC标签写卡功能
 */
export default function NFCRestockModal({ reagent, onClose, onSuccess }) {
  // 表单状态 - 自动填充药品柜UID
  const [formData, setFormData] = useState({
    uid: reagent?.cabinetUid || '', // 自动填充药品柜UID
    supplier_name: '',
    restock_time: new Date().toISOString().slice(0, 16).replace('T', ' '),
    added_quantity: '',
    unit: 'ml',
    location: reagent?.position || '',
    expiry_date: '',
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
    if (!formData.supplier_name.trim()) {
      setErrorMessage('请输入供应商名称')
      return
    }
    if (!formData.added_quantity) {
      setErrorMessage('请输入补货数量')
      return
    }

    setErrorMessage('')
    setStep('waiting')
    setCountdown(20)

    try {
      // 计算补货后的总量
      const newTotalAmount = (reagent?.currentAmount || 0) + parseInt(formData.added_quantity)
      
      // 调用NFC写卡API
      const result = await writeNFCTag({
        uid: formData.uid,
        chemical_name: reagent?.name || '',
        status: 'in_stock', // 入库状态
        remaining_quantity: newTotalAmount.toString(),
        unit: formData.unit,
        supplier_name: formData.supplier_name,
        restock_time: formData.restock_time,
        added_quantity: formData.added_quantity,
        location: formData.location,
        expiry_date: formData.expiry_date,
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
            newTotalAmount: newTotalAmount,
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
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          padding: '32px 40px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
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
                  <ArrowDownToLine size={28} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '26px', fontWeight: '700' }}>NFC 补货登记</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '15px', opacity: 0.9 }}>
                    {reagent.name} · {reagent.formula}
                  </p>
                </div>
              </div>
              
              {reagent?.cabinetUid && (
                <div style={{
                  marginTop: '8px',
                  padding: '6px 14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <MapPin size={14} /> {reagent.cabinetUid}
                </div>
              )}
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
        <div style={{ flex: 1, overflow: 'auto' }}>
          {/* 表单步骤 */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} style={{ padding: '40px' }}>
              {errorMessage && (
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  marginBottom: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#991b1b',
                  fontSize: '14px',
                }}>
                  <AlertTriangle size={20} />
                  {errorMessage}
                </div>
              )}

              {/* 药品柜UID - 自动填充 */}
              <div style={{ marginBottom: '28px' }}>
                <label style={labelStyle}>
                  <Nfc size={16} /> 药品柜 UID
                  {reagent?.cabinetUid && (
                    <span style={{
                      marginLeft: '10px',
                      padding: '3px 10px',
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      borderRadius: '6px',
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
                    padding: '14px 18px',
                  }}
                />
              </div>

              {/* 供应商信息 */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <User size={18} /> 供应商信息
                </h3>
                <div>
                  <label style={labelStyle}>供应商名称 *</label>
                  <input
                    type="text"
                    name="supplier_name"
                    value={formData.supplier_name}
                    onChange={handleInputChange}
                    placeholder="如：国药集团"
                    required
                    style={{ ...inputStyle, padding: '14px 18px' }}
                  />
                </div>
              </div>

              {/* 补货信息 */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <Package size={18} /> 补货信息
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                  <div>
                    <label style={labelStyle}>补货数量 *</label>
                    <input
                      type="number"
                      name="added_quantity"
                      value={formData.added_quantity}
                      onChange={handleInputChange}
                      placeholder="补货数量"
                      required
                      min="1"
                      style={{ ...inputStyle, padding: '14px 18px' }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>单位</label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      style={{ ...inputStyle, cursor: 'pointer', padding: '14px 18px' }}
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

              {/* 时间信息 */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <Clock size={18} /> 时间信息
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                  <div>
                    <label style={{
                      ...labelStyle,
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      letterSpacing: '0.025em',
                    }}>补货时间</label>
                    <input
                      type="datetime-local"
                      name="restock_time"
                      value={formData.restock_time.replace(' ', 'T')}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        restock_time: e.target.value.replace('T', ' ') 
                      }))}
                      style={{ 
                        ...inputStyle, 
                        padding: '14px 18px',
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                        fontSize: '14px',
                        letterSpacing: '0.05em',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      ...labelStyle,
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      letterSpacing: '0.025em',
                    }}>有效期至</label>
                    <input
                      type="date"
                      name="expiry_date"
                      value={formData.expiry_date}
                      onChange={handleInputChange}
                      style={{ 
                        ...inputStyle, 
                        padding: '14px 18px',
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                        fontSize: '14px',
                        letterSpacing: '0.05em',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 位置信息 */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <MapPin size={18} /> 位置信息
                </h3>
                <div>
                  <label style={labelStyle}>存放位置</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="如：1-2（层-位）"
                    style={{ ...inputStyle, padding: '14px 18px' }}
                  />
                </div>
              </div>

              {/* 当前库存信息 */}
              <div style={{
                backgroundColor: '#f0f9ff',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '32px',
                border: '1px solid #bae6fd',
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
                  <Package size={18} /> 库存变化预览
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '16px' }}>
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e0f2fe',
                  }}>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>当前库存</div>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>
                      {reagent?.currentAmount || 0} ml
                    </div>
                  </div>
                  <div style={{ color: '#22c55e', fontWeight: '700', fontSize: '18px' }}>
                    +{formData.added_quantity || 0} ml
                  </div>
                  <div style={{ color: '#64748b', fontWeight: '600' }}>→</div>
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: '#dcfce7',
                    borderRadius: '12px',
                    border: '1px solid #bbf7d0',
                  }}>
                    <div style={{ fontSize: '12px', color: '#166534', marginBottom: '4px' }}>补货后</div>
                    <div style={{ fontWeight: '700', color: '#15803d' }}>
                      {(reagent?.currentAmount || 0) + parseInt(formData.added_quantity || 0)} ml
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
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Nfc size={22} /> 开始写入NFC标签
              </button>
            </form>
          )}

          {/* 等待扫描步骤 */}
          {step === 'waiting' && (
            <div style={{ textAlign: 'center', padding: '50px 40px' }}>
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                animation: 'pulse 2s infinite',
              }}>
                <Loader2 size={56} style={{ animation: 'spin 1s linear infinite' }} />
              </div>
              
              <h3 style={{ margin: '0 0 12px', fontSize: '24px', color: '#0f172a', fontWeight: '700' }}>
                等待NFC标签扫描
              </h3>
              <p style={{ margin: '0 0 24px', fontSize: '16px', color: '#64748b' }}>
                请将NFC标签靠近读卡器，剩余时间：{countdown}秒
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
                  <ClipboardList size={18} style={{ display: 'inline', marginRight: '8px' }} />
                  即将写入的信息
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
                    <span style={{ color: '#64748b' }}>药品柜</span>
                    <span style={{ fontWeight: '600', color: '#0f172a' }}>{formData.uid}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    backgroundColor: '#dcfce7',
                    borderRadius: '8px',
                    border: '1px solid #bbf7d0',
                  }}>
                    <span style={{ color: '#166534' }}>补货量</span>
                    <span style={{ fontWeight: '700', color: '#15803d' }}>+{formData.added_quantity} {formData.unit}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid #e0f2fe',
                  }}>
                    <span style={{ color: '#64748b' }}>供应商</span>
                    <span style={{ fontWeight: '600', color: '#0f172a' }}>{formData.supplier_name}</span>
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
                补货登记成功！
              </h3>
              <p style={{ margin: '0 0 24px', fontSize: '16px', color: '#64748b' }}>
                NFC标签已更新，库存信息已同步
              </p>
              
              {tagUid && (
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
                    Tag UID: {tagUid}
                  </div>
                  <div style={{ fontSize: '14px', color: '#15803d' }}>
                    补货后库存：{(reagent?.currentAmount || 0) + parseInt(formData.added_quantity || 0)} {formData.unit}
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
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
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
                操作失败
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
