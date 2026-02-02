import React, { useState, useEffect } from 'react'
import { 
  FlaskConical, Package, MapPin, User, Clock, AlertTriangle,
  CheckCircle2, Nfc, Plus, X, Loader2, ShieldAlert
} from './Icons'
import { writeNFCTag } from '../services/nfcService'
import reagentDatabase from '../data/reagentData'
import { getCurrentUser, hasPermission, PERMISSIONS } from '../services/authService'

// 药品柜容量配置 (层数 x 每层位置数)
const CABINET_CAPACITY = {
  'corrosive': { shelves: 5, positionsPerShelf: 4 }, // 腐蚀品柜：5层，每层4个位置
  'pp': { shelves: 5, positionsPerShelf: 4 },        // PP安全柜：5层，每层4个位置  
  'standard': { shelves: 5, positionsPerShelf: 5 },  // 普通药品柜：5层，每层5个位置
}

// 生成药品柜的所有可能位置
const generateCabinetPositions = (cabinetType) => {
  const config = CABINET_CAPACITY[cabinetType]
  if (!config) return []
  
  const positions = []
  for (let shelf = 1; shelf <= config.shelves; shelf++) {
    for (let pos = 1; pos <= config.positionsPerShelf; pos++) {
      positions.push(`${shelf}-${pos}`)
    }
  }
  return positions
}

// 模拟已占用位置（实际应用中应该从数据库获取）
const getOccupiedPositions = (cabinetUid) => {
  // 这里模拟一些已占用的位置
  const mockOccupied = {
    '腐蚀品柜1号': ['1-1', '1-2', '2-1', '3-1', '3-2', '3-3'],
    '腐蚀品柜2号': ['1-1', '1-3', '2-2', '4-1'],
    '腐蚀品柜3号': ['1-1', '1-2', '1-3', '1-4', '2-1', '2-2'],
    '腐蚀品柜4号': ['1-1', '2-1', '3-1'],
    'PP安全柜1号': ['1-1', '1-2', '2-1', '2-3', '3-1'],
    'PP安全柜2号': ['1-1', '1-4', '2-2', '3-1', '3-2', '3-3'],
    'PP安全柜3号': ['1-1', '2-1', '4-1', '4-2'],
    'PP安全柜4号': ['1-1', '1-2', '1-3', '2-1', '2-2'],
    '药品柜1号': ['1-1', '1-2', '1-3', '2-1', '2-2', '3-1', '3-2', '3-3', '3-4'],
    '药品柜2号': ['1-1', '1-5', '2-2', '2-3', '3-1'],
    '药品柜3号': ['1-1', '1-2', '2-1', '2-4', '2-5', '3-1', '3-2'],
    '药品柜4号': ['1-1', '2-1', '3-1', '4-1', '4-2', '4-3'],
  }
  return mockOccupied[cabinetUid] || []
}

// 获取药品柜的第一个空位
const getNextAvailablePosition = (cabinetUid) => {
  const cabinet = CABINET_OPTIONS.find(c => c.value === cabinetUid)
  if (!cabinet) return ''
  
  const allPositions = generateCabinetPositions(cabinet.type)
  const occupiedPositions = getOccupiedPositions(cabinetUid)
  
  // 找到第一个未占用的位置
  const availablePosition = allPositions.find(pos => !occupiedPositions.includes(pos))
  return availablePosition || ''
}
const CABINET_OPTIONS = [
  { value: '腐蚀品柜1号', label: '腐蚀品柜1号', type: 'corrosive' },
  { value: '腐蚀品柜2号', label: '腐蚀品柜2号', type: 'corrosive' },
  { value: '腐蚀品柜3号', label: '腐蚀品柜3号', type: 'corrosive' },
  { value: '腐蚀品柜4号', label: '腐蚀品柜4号', type: 'corrosive' },
  { value: 'PP安全柜1号', label: 'PP安全柜1号', type: 'pp' },
  { value: 'PP安全柜2号', label: 'PP安全柜2号', type: 'pp' },
  { value: 'PP安全柜3号', label: 'PP安全柜3号', type: 'pp' },
  { value: 'PP安全柜4号', label: 'PP安全柜4号', type: 'pp' },
  { value: '药品柜1号', label: '药品柜1号', type: 'standard' },
  { value: '药品柜2号', label: '药品柜2号', type: 'standard' },
  { value: '药品柜3号', label: '药品柜3号', type: 'standard' },
  { value: '药品柜4号', label: '药品柜4号', type: 'standard' },
]

// 危险性分类
const HAZARD_OPTIONS = [
  '无', '易燃', '腐蚀性', '强腐蚀性', '氧化剂', '有毒', '有害', '刺激性', '致癌', '易燃/有毒'
]

// 纯度等级
const PURITY_OPTIONS = ['AR', 'CP', 'GR', 'HPLC', 'ACS']

// 供应商
const SUPPLIER_OPTIONS = ['国药集团', '西陇科学', '阿拉丁', '麦克林', '其他']

/**
 * 新增试剂模态框 - 支持NFC标签写入
 */
export default function AddReagentModal({ isVisible, onClose, onAddReagent }) {
  // 获取当前用户和权限
  const currentUser = getCurrentUser()
  const canCreateReagent = hasPermission(PERMISSIONS.REAGENT_CREATE)
  
  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    formula: '',
    cabinetUid: '',
    position: '',
    capacity: '500',
    currentAmount: '',
    unit: 'ml',
    hazard: '无',
    purity: 'AR',
    supplier: '国药集团',
    expiryDate: '',
    cas: '',
    storageCondition: '',
    operator: currentUser?.name || currentUser?.username || '', // 添加操作员信息
  })

  // 流程状态
  const [step, setStep] = useState('form') // 'form' | 'nfc' | 'waiting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('')
  const [tagUid, setTagUid] = useState('')
  const [countdown, setCountdown] = useState(20)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // 重置表单
  useEffect(() => {
    if (isVisible) {
      setStep('form')
      setErrorMessage('')
      setTagUid('')
      setFormData({
        name: '',
        formula: '',
        cabinetUid: '',
        position: '',
        capacity: '500',
        currentAmount: '',
        unit: 'ml',
        hazard: '无',
        purity: 'AR',
        supplier: '国药集团',
        expiryDate: '',
        cas: '',
        storageCondition: '',
        operator: currentUser?.name || currentUser?.username || '', // 保持操作员信息
      })
    }
  }, [isVisible, currentUser])

  // 倒计时
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

  // 处理输入
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // 当输入试剂名称时，显示建议并自动填写相关信息
    if (name === 'name') {
      if (value.trim()) {
        // 查找匹配的试剂（模糊搜索）
        const filteredSuggestions = reagentDatabase.filter(reagent => 
          reagent.name.toLowerCase().includes(value.trim().toLowerCase())
        ).slice(0, 5) // 最多显示5个建议
        
        setSuggestions(filteredSuggestions)
        setShowSuggestions(filteredSuggestions.length > 0)
        
        // 精确匹配时自动填写
        const exactMatch = reagentDatabase.find(reagent => 
          reagent.name.toLowerCase() === value.trim().toLowerCase()
        )
        
        if (exactMatch) {
          setFormData(prev => ({
            ...prev,
            [name]: value,
            formula: exactMatch.formula || prev.formula,
            cas: exactMatch.cas || prev.cas,
            hazard: exactMatch.hazard || prev.hazard,
            storageCondition: exactMatch.storageCondition || prev.storageCondition,
          }))
          setShowSuggestions(false)
        }
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }
    
    // 当选择药品柜时，自动填写空余位置
    if (name === 'cabinetUid' && value) {
      const availablePosition = getNextAvailablePosition(value)
      setFormData(prev => ({
        ...prev,
        [name]: value,
        position: availablePosition,
      }))
    }
  }

  // 选择建议项
  const handleSuggestionSelect = (reagent) => {
    setFormData(prev => ({
      ...prev,
      name: reagent.name,
      formula: reagent.formula || prev.formula,
      cas: reagent.cas || prev.cas,
      hazard: reagent.hazard || prev.hazard,
      storageCondition: reagent.storageCondition || prev.storageCondition,
    }))
    setShowSuggestions(false)
    setSuggestions([])
  }

  // 第一步：验证表单并进入NFC写卡
  const handleFormSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setErrorMessage('请输入试剂名称')
      return
    }
    if (!formData.formula.trim()) {
      setErrorMessage('请输入分子式')
      return
    }
    if (!formData.currentAmount) {
      setErrorMessage('请输入当前容量')
      return
    }

    setErrorMessage('')
    // 强制进入NFC写卡步骤
    setStep('nfc')
  }

  // 开始NFC写卡
  const handleStartNFC = async () => {
    setStep('waiting')
    setCountdown(20)

    try {
      const result = await writeNFCTag({
        uid: formData.cabinetUid,
        chemical_name: formData.name,
        status: 'in_stock',
        remaining_quantity: formData.currentAmount,
        unit: formData.unit,
        borrower_name: '',
        borrower_phone: '',
        borrow_time: '',
        expected_return_time: '',
        location: formData.position || formData.cabinetUid,
      })

      if (result.success) {
        setTagUid(result.tagUid || '已记录')
        setStep('success')
        
        // 通知父组件添加新试剂（使用新的位置管理系统）
        if (onAddReagent) {
          const newReagent = onAddReagent({
            name: formData.name,
            formula: formData.formula,
            hazard: formData.hazard,
            currentAmount: parseInt(formData.currentAmount),
            capacity: parseInt(formData.capacity || formData.currentAmount),
            supplier: formData.supplier,
            purity: formData.purity,
            expiryDate: formData.expiryDate,
            cas: formData.cas,
            storageCondition: formData.storageCondition,
            tagUid: result.tagUid,
          })
          console.log('新增试剂成功，自动分配位置:', newReagent.position, '柜子:', newReagent.cabinetUid)
        }
      } else {
        setStep('error')
        setErrorMessage(result.message || 'NFC写卡失败')
      }
    } catch (error) {
      setStep('error')
      setErrorMessage(`操作失败: ${error.message}`)
    }
  }

  // 重试
  const handleRetry = () => {
    setStep('nfc')
    setErrorMessage('')
    setCountdown(20)
  }

  // 共用样式
  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
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
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
    marginBottom: '6px',
  }

  if (!isVisible) return null

  // 权限检查 - 如果用户没有创建试剂的权限，显示权限不足提示
  if (!canCreateReagent) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(8px)',
        zIndex: 1200,
        animation: 'fadeIn 0.3s ease-out',
      }} onClick={onClose}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          width: '400px',
          padding: '32px',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }} onClick={(e) => e.stopPropagation()}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#fef2f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <ShieldAlert size={32} color="#dc2626" />
          </div>
          
          <h3 style={{
            margin: '0 0 16px',
            fontSize: '20px',
            fontWeight: '700',
            color: '#0f172a',
          }}>
            权限不足
          </h3>
          
          <p style={{
            margin: '0 0 24px',
            fontSize: '14px',
            color: '#64748b',
            lineHeight: '1.5',
          }}>
            您当前的角色（{currentUser?.role === 'operator' ? '实验员' : '用户'}）没有创建试剂的权限。
            <br />
            请联系管理员获取相应权限。
          </p>
          
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#4f46e5',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.target.style.backgroundColor = '#4338ca'}
            onMouseLeave={e => e.target.style.backgroundColor = '#4f46e5'}
          >
            我知道了
          </button>
        </div>
      </div>
    )
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
      zIndex: 1200,
      animation: 'fadeIn 0.3s ease-out',
    }} onClick={onClose}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        width: '600px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          padding: '24px 28px',
          color: 'white',
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
                <Plus size={24} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>新增试剂</h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.9 }}>
                  {step === 'form' && '填写试剂信息'}
                  {step === 'nfc' && '准备写入NFC标签'}
                  {step === 'waiting' && '等待NFC扫描...'}
                  {step === 'success' && '添加成功'}
                  {step === 'error' && '操作失败'}
                </p>
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
          
          {/* 步骤指示器 */}
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            marginTop: '20px',
            alignItems: 'center',
          }}>
            <StepIndicator number={1} label="填写信息" active={step === 'form'} done={step !== 'form'} />
            <div style={{ width: '30px', height: '2px', backgroundColor: 'rgba(255,255,255,0.3)' }} />
            <StepIndicator number={2} label="NFC写卡" active={step === 'nfc' || step === 'waiting'} done={step === 'success'} />
            <div style={{ width: '30px', height: '2px', backgroundColor: 'rgba(255,255,255,0.3)' }} />
            <StepIndicator number={3} label="完成" active={step === 'success'} done={false} />
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 28px', maxHeight: '60vh', overflow: 'auto' }}>
          
          {/* 表单步骤 */}
          {step === 'form' && (
            <form onSubmit={handleFormSubmit}>
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

              {/* 基本信息 */}
              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid #e2e8f0',
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#0f172a',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <FlaskConical size={18} /> 试剂信息
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ position: 'relative' }}>
                    <label style={labelStyle}>试剂名称 *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => {
                        if (suggestions.length > 0) setShowSuggestions(true)
                      }}
                      onBlur={() => {
                        // 延迟隐藏建议，允许点击建议项
                        setTimeout(() => setShowSuggestions(false), 200)
                      }}
                      placeholder="如：乙醇"
                      required
                      style={inputStyle}
                      autoComplete="off"
                    />
                    
                    {/* 自动完成建议列表 */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000,
                        maxHeight: '200px',
                        overflowY: 'auto',
                      }}>
                        {suggestions.map((reagent, index) => (
                          <div
                            key={index}
                            onClick={() => handleSuggestionSelect(reagent)}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              borderBottom: index < suggestions.length - 1 ? '1px solid #f1f5f9' : 'none',
                              transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={e => e.target.style.backgroundColor = '#f8fafc'}
                            onMouseLeave={e => e.target.style.backgroundColor = 'white'}
                          >
                            <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>
                              {reagent.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                              {reagent.formula} • CAS: {reagent.cas}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={labelStyle}>
                      分子式 *
                      {formData.formula && reagentDatabase.find(r => r.name.toLowerCase() === formData.name.toLowerCase()) && (
                        <span style={{
                          marginLeft: '8px',
                          padding: '2px 6px',
                          backgroundColor: '#dcfce7',
                          color: '#166534',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '600',
                        }}>
                          ✓ 自动填充
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="formula"
                      value={formData.formula}
                      onChange={handleInputChange}
                      placeholder="如：C₂H₅OH"
                      required
                      style={{
                        ...inputStyle,
                        backgroundColor: formData.formula && reagentDatabase.find(r => r.name.toLowerCase() === formData.name.toLowerCase()) ? '#f0fdf4' : inputStyle.backgroundColor,
                        borderColor: formData.formula && reagentDatabase.find(r => r.name.toLowerCase() === formData.name.toLowerCase()) ? '#86efac' : inputStyle.borderColor,
                      }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>
                      CAS号
                      {formData.cas && reagentDatabase.find(r => r.name.toLowerCase() === formData.name.toLowerCase()) && (
                        <span style={{
                          marginLeft: '8px',
                          padding: '2px 6px',
                          backgroundColor: '#dcfce7',
                          color: '#166534',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '600',
                        }}>
                          ✓ 自动填充
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="cas"
                      value={formData.cas}
                      onChange={handleInputChange}
                      placeholder="如：64-17-5"
                      style={{
                        ...inputStyle,
                        backgroundColor: formData.cas && reagentDatabase.find(r => r.name.toLowerCase() === formData.name.toLowerCase()) ? '#f0fdf4' : inputStyle.backgroundColor,
                        borderColor: formData.cas && reagentDatabase.find(r => r.name.toLowerCase() === formData.name.toLowerCase()) ? '#86efac' : inputStyle.borderColor,
                      }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>
                      危险性分类
                      {formData.hazard !== '无' && reagentDatabase.find(r => r.name.toLowerCase() === formData.name.toLowerCase()) && (
                        <span style={{
                          marginLeft: '8px',
                          padding: '2px 6px',
                          backgroundColor: '#dcfce7',
                          color: '#166534',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '600',
                        }}>
                          ✓ 自动填充
                        </span>
                      )}
                    </label>
                    <select
                      name="hazard"
                      value={formData.hazard}
                      onChange={handleInputChange}
                      style={{ 
                        ...inputStyle, 
                        cursor: 'pointer',
                        backgroundColor: formData.hazard !== '无' && reagentDatabase.find(r => r.name.toLowerCase() === formData.name.toLowerCase()) ? '#f0fdf4' : inputStyle.backgroundColor,
                        borderColor: formData.hazard !== '无' && reagentDatabase.find(r => r.name.toLowerCase() === formData.name.toLowerCase()) ? '#86efac' : inputStyle.borderColor,
                      }}
                    >
                      {HAZARD_OPTIONS.map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 存放位置 */}
              <div style={{
                backgroundColor: '#eff6ff',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid #dbeafe',
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#1e40af',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <MapPin size={18} /> 存放位置
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>药品柜 *</label>
                    <select
                      name="cabinetUid"
                      value={formData.cabinetUid}
                      onChange={handleInputChange}
                      required
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      <option value="">请选择药品柜</option>
                      <optgroup label="腐蚀品柜">
                        {CABINET_OPTIONS.filter(c => c.type === 'corrosive').map(c => {
                          const occupied = getOccupiedPositions(c.value).length
                          const total = generateCabinetPositions(c.type).length
                          return (
                            <option key={c.value} value={c.value}>
                              {c.label} ({occupied}/{total} 已占用)
                            </option>
                          )
                        })}
                      </optgroup>
                      <optgroup label="PP安全柜">
                        {CABINET_OPTIONS.filter(c => c.type === 'pp').map(c => {
                          const occupied = getOccupiedPositions(c.value).length
                          const total = generateCabinetPositions(c.type).length
                          return (
                            <option key={c.value} value={c.value}>
                              {c.label} ({occupied}/{total} 已占用)
                            </option>
                          )
                        })}
                      </optgroup>
                      <optgroup label="普通药品柜">
                        {CABINET_OPTIONS.filter(c => c.type === 'standard').map(c => {
                          const occupied = getOccupiedPositions(c.value).length
                          const total = generateCabinetPositions(c.type).length
                          return (
                            <option key={c.value} value={c.value}>
                              {c.label} ({occupied}/{total} 已占用)
                            </option>
                          )
                        })}
                      </optgroup>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>
                      具体位置
                      {formData.position && formData.cabinetUid && (
                        <span style={{
                          marginLeft: '8px',
                          padding: '2px 6px',
                          backgroundColor: '#dbeafe',
                          color: '#1e40af',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '600',
                        }}>
                          ✓ 自动分配
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      placeholder="格式：层-位 (如：1-2)"
                      style={{
                        ...inputStyle,
                        backgroundColor: formData.position && formData.cabinetUid ? '#eff6ff' : inputStyle.backgroundColor,
                        borderColor: formData.position && formData.cabinetUid ? '#93c5fd' : inputStyle.borderColor,
                      }}
                    />
                    {formData.cabinetUid && (
                      <div style={{
                        fontSize: '11px',
                        color: '#64748b',
                        marginTop: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}>
                        <span>💡</span>
                        <span>
                          {(() => {
                            const occupied = getOccupiedPositions(formData.cabinetUid).length
                            const total = generateCabinetPositions(CABINET_OPTIONS.find(c => c.value === formData.cabinetUid)?.type).length
                            const available = total - occupied
                            return `还有 ${available} 个空位可用`
                          })()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 容量信息 */}
              <div style={{
                backgroundColor: '#f0fdf4',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid #bbf7d0',
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#166534',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <Package size={18} /> 容量信息
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>总容量</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      placeholder="500"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>当前容量 *</label>
                    <input
                      type="number"
                      name="currentAmount"
                      value={formData.currentAmount}
                      onChange={handleInputChange}
                      placeholder="输入容量"
                      required
                      style={inputStyle}
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
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '16px' }}>
                  <div>
                    <label style={labelStyle}>纯度</label>
                    <select
                      name="purity"
                      value={formData.purity}
                      onChange={handleInputChange}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      {PURITY_OPTIONS.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>供应商</label>
                    <select
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleInputChange}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      {SUPPLIER_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>有效期至</label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* 操作员信息 */}
              <div style={{
                backgroundColor: '#f0fdf4',
                borderRadius: '16px',
                padding: '16px 20px',
                marginBottom: '24px',
                border: '1px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <User size={24} color="#059669" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#065f46', fontSize: '14px' }}>
                    操作员信息
                  </div>
                  <div style={{ fontSize: '13px', color: '#059669', marginTop: '2px' }}>
                    {currentUser?.name || currentUser?.username} 
                    {currentUser?.role && (
                      <span style={{ marginLeft: '8px', color: '#047857' }}>
                        ({currentUser.role === 'admin' ? '管理员' : '实验员'})
                      </span>
                    )}
                    {currentUser?.department && (
                      <span style={{ marginLeft: '8px', color: '#047857' }}>
                        · {currentUser.department}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* NFC标签提示 */}
              <div style={{
                backgroundColor: '#eff6ff',
                borderRadius: '16px',
                padding: '16px 20px',
                marginBottom: '24px',
                border: '1px solid #dbeafe',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <Nfc size={24} color="#3b82f6" />
                <div>
                  <div style={{ fontWeight: '600', color: '#1e40af', fontSize: '14px' }}>
                    必须绑定NFC标签
                  </div>
                  <div style={{ fontSize: '12px', color: '#3b82f6' }}>
                    添加试剂时将自动写入NFC标签，确保库存管理的准确性
                  </div>
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
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                }}
              >
                <Nfc size={20} /> 下一步：写入NFC标签
              </button>
            </form>
          )}

          {/* NFC准备步骤 */}
          {step === 'nfc' && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{
                width: '100px',
                height: '100px',
                margin: '0 auto 24px',
                borderRadius: '50%',
                backgroundColor: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Nfc size={48} color="#3b82f6" />
              </div>
              
              <h3 style={{ margin: '0 0 12px', fontSize: '20px', color: '#0f172a', fontWeight: '700' }}>
                准备写入NFC标签
              </h3>
              
              {/* 试剂信息摘要 */}
              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'left',
                marginBottom: '24px',
              }}>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>将写入以下信息：</div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>试剂名称</span>
                    <span style={{ fontWeight: '600', color: '#0f172a' }}>{formData.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>分子式</span>
                    <span style={{ fontWeight: '600', color: '#0f172a' }}>{formData.formula}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>药品柜</span>
                    <span style={{ fontWeight: '600', color: '#3b82f6' }}>{formData.cabinetUid}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>容量</span>
                    <span style={{ fontWeight: '600', color: '#0f172a' }}>{formData.currentAmount} {formData.unit}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>操作员</span>
                    <span style={{ fontWeight: '600', color: '#059669' }}>{formData.operator}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>添加时间</span>
                    <span style={{ fontWeight: '600', color: '#0f172a' }}>{new Date().toLocaleString('zh-CN')}</span>
                  </div>
                </div>
              </div>
              
              <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#64748b' }}>
                点击下方按钮后，请将NFC标签靠近读卡器
              </p>
              
              <button
                onClick={handleStartNFC}
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
                }}
              >
                <Nfc size={20} /> 开始写卡
              </button>
            </div>
          )}

          {/* 等待扫描步骤 */}
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
                试剂添加成功！
              </h3>
              <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#64748b' }}>
                {tagUid === '未绑定' ? '试剂已添加（未绑定NFC）' : 'NFC标签已成功绑定'}
              </p>
              
              {/* 信息摘要 */}
              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'left',
                marginBottom: '24px',
              }}>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>试剂名称</span>
                    <span style={{ color: '#0f172a', fontWeight: '600', fontSize: '13px' }}>{formData.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>存放位置</span>
                    <span style={{ color: '#0f172a', fontWeight: '600', fontSize: '13px' }}>{formData.cabinetUid}</span>
                  </div>
                  {tagUid !== '未绑定' && (
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
                  )}
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
              
              <button
                onClick={handleRetry}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                }}
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
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}

// 步骤指示器组件
function StepIndicator({ number, label, active, done }) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      opacity: active || done ? 1 : 0.5,
    }}>
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        backgroundColor: done ? 'rgba(34, 197, 94, 0.3)' : (active ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        fontWeight: '700',
        border: active ? '2px solid white' : 'none',
      }}>
        {done ? '✓' : number}
      </div>
      <span style={{ fontSize: '13px', fontWeight: active ? '600' : '500' }}>{label}</span>
    </div>
  )
}
