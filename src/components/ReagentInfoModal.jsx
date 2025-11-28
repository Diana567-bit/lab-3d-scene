import React, { useState, useEffect } from 'react'
import { 
  LayoutDashboard, Package, CheckCircle2, AlertTriangle, Clock, 
  Search, Download, Plus, XCircle, AlertOctagon, FlaskConical, 
  Flame, ShieldAlert, History, ClipboardList, Ban, Eye, Hand, 
  Wind, Utensils, ArrowDownToLine, ArrowUpFromLine, Trash2, 
  MapPin, User, FileText, ChevronLeft, Beaker
} from './Icons'
import NFCOutboundModal from './NFCOutboundModal'
import NFCRestockModal from './NFCRestockModal'
import { deleteReagent } from '../services/reagentService'
import { hasPermission, PERMISSIONS } from '../services/authService'

export default function ReagentInfoModal({ reagent, onClose, onReagentUpdate }) {
  const [viewMode, setViewMode] = useState('simple') // 'simple' or 'detail'
  const [activeTab, setActiveTab] = useState('basic') // 'basic', 'safety', 'history'
  const [showNFCModal, setShowNFCModal] = useState(false) // NFC出库登记模态框
  const [showRestockModal, setShowRestockModal] = useState(false) // NFC补货登记模态框
  const [showDisposalModal, setShowDisposalModal] = useState(false) // 报废确认模态框
  
  // Lock body scroll when modal is open
  useEffect(() => {
    if (reagent) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [reagent])
  
  if (!reagent) return null
  
  // 获取试剂的实际状态（包括即将过期判断）
  const getActualStatus = (reagent) => {
    // 首先检查是否已过期
    const today = new Date()
    const expiryDate = new Date(reagent.expiryDate)
    
    if (expiryDate <= today) {
      return '已经过期'
    }
    
    // 检查是否有借出记录（在库但有借出）
    if (reagent.status === '在库' && reagent.borrowerInfo && reagent.borrowedAmount > 0) {
      return '部分借出'
    }
    
    // 对于在库试剂，检查是否即将过期
    if (reagent.status === '在库') {
      const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
      
      if (expiryDate <= thirtyDaysLater && expiryDate > today) {
        return '即将过期'
      }
    }
    
    return reagent.status
  }
  
  // 根据状态返回对应颜色
  const getStatusColor = (status) => {
    switch (status) {
      case '在库': return { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' }
      case '部分借出': return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' }
      case '已借出': return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' }
      case '即将过期': return { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' }
      case '已经过期': return { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' }
      default: return { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' }
    }
  }
  
  // 根据危险等级返回对应颜色
  const getHazardColor = (hazard) => {
    if (hazard === '无') return { bg: '#dcfce7', text: '#166534' }
    if (hazard.includes('致癌') || hazard.includes('有毒')) return { bg: '#fee2e2', text: '#991b1b' }
    if (hazard.includes('易燃') || hazard.includes('极易燃')) return { bg: '#ffedd5', text: '#9a3412' }
    if (hazard.includes('腐蚀') || hazard.includes('氧化')) return { bg: '#fef9c3', text: '#854d0e' }
    return { bg: '#fef3c7', text: '#92400e' }
  }
  
  // 计算剩余量百分比
  const remainingPercent = Math.round((reagent.currentAmount / reagent.capacity) * 100)
  
  // 处理报废
  const handleDisposal = async () => {
    try {
      // 调用API删除试剂记录
      const result = await deleteReagent(reagent.id)
      
      if (result.success) {
        // 通知父组件更新数据
        if (onReagentUpdate) {
          onReagentUpdate('delete', reagent.id)
        }
        
        // 关闭所有模态框
        setShowDisposalModal(false)
        onClose()
        
        console.log('试剂已报废删除:', reagent.name, result.message)
      } else {
        // 显示错误信息
        console.error('报废失败:', result.message)
        // 这里可以显示错误提示给用户
        alert(`报废失败: ${result.message}`)
      }
    } catch (error) {
      console.error('报废操作异常:', error)
      alert('报废操作失败，请重试')
    }
  }
  
  // 详细视图
  if (viewMode === 'detail') {
    return (
      <DetailView 
        reagent={reagent} 
        onClose={onClose} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setViewMode={setViewMode}
        getStatusColor={getStatusColor}
        remainingPercent={remainingPercent}
        getHazardColor={getHazardColor}
        showNFCModal={showNFCModal}
        setShowNFCModal={setShowNFCModal}
        showRestockModal={showRestockModal}
        setShowRestockModal={setShowRestockModal}
        showDisposalModal={showDisposalModal}
        setShowDisposalModal={setShowDisposalModal}
        handleDisposal={handleDisposal}
      />
    )
  }
  
  // 简洁视图
  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease-out',
      }} 
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div 
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderRadius: '24px',
          padding: '24px',
          minWidth: '400px',
          maxWidth: '480px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }} 
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onScroll={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              boxShadow: '0 10px 20px -10px rgba(99, 102, 241, 0.5)',
            }}>
              {reagent.formula.charAt(0)}
            </div>
            <div>
              <h2 style={{
                margin: 0,
                fontSize: '22px',
                fontWeight: '800',
                color: '#1e293b',
                letterSpacing: '-0.025em',
              }}>
                {reagent.name}
              </h2>
              <p style={{
                margin: '4px 0 0 0',
                fontSize: '14px',
                color: '#64748b',
                fontFamily: 'monospace',
                fontWeight: '500',
              }}>
                {reagent.formula}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(241, 245, 249, 0.8)',
              border: 'none',
              borderRadius: '12px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#64748b',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(241, 245, 249, 0.8)'; e.currentTarget.style.color = '#64748b' }}
          >
            ×
          </button>
        </div>
        
        {/* Status Badge */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
        }}>
          {(() => {
            const actualStatus = getActualStatus(reagent)
            const s = getStatusColor(actualStatus)
            return (
              <span style={{
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: s.bg,
                color: s.text,
                border: `1px solid ${s.border}`,
              }}>
                {actualStatus}
              </span>
            )
          })()}
          
          {(() => {
            const h = getHazardColor(reagent.hazard)
            return (
              <span style={{
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: h.bg,
                color: h.text,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <span><AlertTriangle size={14} /></span>
                {reagent.hazard}
              </span>
            )
          })()}
        </div>
        
        {/* Borrower Information for reagents with borrowing records */}
        {reagent.borrowerInfo && reagent.borrowedAmount > 0 && (
          <div style={{
            padding: '16px',
            backgroundColor: '#fff7ed',
            border: '1px solid #fed7aa',
            borderRadius: '12px',
            marginBottom: '24px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
            }}>
              <User size={16} style={{ color: '#ea580c' }} />
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#ea580c' }}>
                借出信息
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#78716c', fontWeight: '500' }}>借出人：</span>
                <span style={{ color: '#0f172a', fontWeight: '600' }}>{reagent.borrowerInfo.borrowerName}</span>
              </div>
              <div>
                <span style={{ color: '#78716c', fontWeight: '500' }}>借出量：</span>
                <span style={{ color: '#ea580c', fontWeight: '700' }}>{reagent.borrowedAmount}ml</span>
              </div>
              <div>
                <span style={{ color: '#78716c', fontWeight: '500' }}>借出日期：</span>
                <span style={{ color: '#0f172a', fontWeight: '600' }}>{reagent.borrowerInfo.borrowDate}</span>
              </div>
              <div>
                <span style={{ color: '#78716c', fontWeight: '500' }}>预计归还：</span>
                <span style={{ color: '#0f172a', fontWeight: '600' }}>{reagent.borrowerInfo.expectedReturnDate}</span>
              </div>
            </div>
            <div style={{ marginTop: '8px', fontSize: '13px' }}>
              <span style={{ color: '#78716c', fontWeight: '500' }}>用途：</span>
              <span style={{ color: '#0f172a', fontWeight: '600' }}>{reagent.borrowerInfo.purpose}</span>
            </div>
          </div>
        )}
        
        {/* Low Stock Warning */}
        {remainingPercent <= 20 && (
          <div style={{
            backgroundColor: remainingPercent <= 10 ? '#fef2f2' : '#fffbeb',
            border: `1px solid ${remainingPercent <= 10 ? '#fecaca' : '#fde68a'}`,
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: remainingPercent <= 10 ? '#fee2e2' : '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: remainingPercent <= 10 ? '#991b1b' : '#92400e',
            }}>
              {remainingPercent <= 10 ? <AlertOctagon size={24} /> : <AlertTriangle size={24} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontWeight: '700', 
                fontSize: '14px',
                color: remainingPercent <= 10 ? '#991b1b' : '#92400e',
                marginBottom: '2px',
              }}>
                {remainingPercent <= 10 ? '库存严重不足！' : '库存不足预警'}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: remainingPercent <= 10 ? '#b91c1c' : '#b45309',
              }}>
                仅剩 {remainingPercent}%，请及时补充
              </div>
            </div>
            <button 
              onClick={() => setShowRestockModal(true)}
              style={{
              padding: '8px 12px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: remainingPercent <= 10 ? '#dc2626' : '#d97706',
              color: 'white',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <ArrowDownToLine size={14} /> 补货
            </button>
          </div>
        )}
        
        {/* Info Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '28px',
        }}>
          <InfoItem label="编号" value={reagent.id} />
          <InfoItem label="纯度" value={reagent.purity} />
          <InfoItem label="有效期" value={reagent.expiryDate} />
          <InfoItem label="供应商" value={reagent.supplier} />
          <InfoItem label="位置" value={`${reagent.storageRoom} ${reagent.position}`} fullWidth />
        </div>
        
        {/* Capacity Bar */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>当前库存</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
              {reagent.currentAmount}ml <span style={{ color: '#94a3b8', fontWeight: '400' }}>/ {reagent.capacity}ml</span>
            </span>
          </div>
          <div style={{
            height: '10px',
            backgroundColor: '#f1f5f9',
            borderRadius: '6px',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
          }}>
            <div style={{
              height: '100%',
              width: `${remainingPercent}%`,
              background: remainingPercent > 50 ? 'linear-gradient(90deg, #22c55e, #16a34a)' : remainingPercent > 20 ? 'linear-gradient(90deg, #fbbf24, #d97706)' : 'linear-gradient(90deg, #f87171, #dc2626)',
              borderRadius: '6px',
              transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }} />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
        }}>
          <button 
            onClick={() => setViewMode('detail')}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              color: '#0f172a',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#e2e8f0' }}
          >
            <ClipboardList size={18} /> 查看详情
          </button>
          {/* Outbound Button - Only for users with INVENTORY_OUTBOUND permission */}
          {hasPermission(PERMISSIONS.INVENTORY_OUTBOUND) && (
            <button 
              onClick={() => setShowNFCModal(true)}
              style={{
              flex: 1,
              padding: '14px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <ArrowUpFromLine size={18} /> 出库登记
            </button>
          )}
        </div>
      </div>
      
      {/* NFC 出库登记模态框 */}
      {showNFCModal && (
        <NFCOutboundModal 
          reagent={reagent}
          onClose={() => setShowNFCModal(false)}
          onSuccess={(data) => {
            console.log('NFC出库成功:', data)
            setShowNFCModal(false)
            // 更新库存数量
            if (onReagentUpdate) {
              onReagentUpdate('update', reagent.id, {
                currentAmount: reagent.currentAmount - data.outboundQuantity
              })
            }
          }}
        />
      )}
      
      {/* NFC 补货登记模态框 */}
      {showRestockModal && (
        <NFCRestockModal 
          reagent={reagent}
          onClose={() => setShowRestockModal(false)}
          onSuccess={(data) => {
            console.log('NFC补货成功:', data)
            setShowRestockModal(false)
            // 可以在这里更新库存数量或执行其他操作
          }}
        />
      )}
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}

// 详细视图组件
function DetailView({ reagent, onClose, activeTab, setActiveTab, setViewMode, getStatusColor, remainingPercent, getHazardColor, showNFCModal, setShowNFCModal, showRestockModal, setShowRestockModal, showDisposalModal, setShowDisposalModal, handleDisposal }) {
  // 模拟使用记录
  const usageHistory = [
    { date: '2025-11-25', action: '入库', amount: '+500ml', operator: '张三', phone: '13800138001', note: '新批次入库', detail: '常规采购入库，批次号 #20251125-01' },
    { date: '2025-11-20', action: '出库', amount: '-100ml', operator: '李四', phone: '13900139002', note: '实验使用', detail: '用于有机合成实验项目，预计归还时间 2025-11-22' },
    { date: '2025-11-18', action: '出库', amount: '-50ml', operator: '王五', phone: '13700137003', note: '学生实验', detail: '本科生化学实验课消耗' },
    { date: '2025-11-15', action: '盘点', amount: '0', operator: '赵六', phone: '13600136004', note: '月度盘点', detail: '例行库存核对，数量无误' },
    { date: '2025-11-10', action: '出库', amount: '-200ml', operator: '张三', phone: '13800138001', note: '科研项目', detail: '重点研发计划项目使用' },
  ]

  const [selectedRecord, setSelectedRecord] = useState(null)

  return (
    <div 
      style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)',
        zIndex: 1000, animation: 'fadeIn 0.3s ease-out',
      }} 
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* Record Detail Modal */}
      {selectedRecord && (
        <div style={{
          position: 'fixed', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.2)',
          zIndex: 1100,
          animation: 'fadeIn 0.2s ease-out'
        }} onClick={(e) => { e.stopPropagation(); setSelectedRecord(null); }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '20px',
            padding: '32px', width: '400px', maxWidth: '90vw',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            animation: 'scaleUp 0.2s ease-out',
            border: '1px solid #f1f5f9'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>记录详情</h3>
              <button onClick={() => setSelectedRecord(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
                <XCircle size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '16px' }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '12px', 
                backgroundColor: selectedRecord.action === '入库' ? '#dcfce7' : selectedRecord.action === '出库' ? '#fee2e2' : '#e0e7ff', 
                color: selectedRecord.action === '入库' ? '#16a34a' : selectedRecord.action === '出库' ? '#dc2626' : '#4f46e5', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px'
              }}>
                {selectedRecord.action === '入库' ? <ArrowDownToLine size={24} /> : selectedRecord.action === '出库' ? <ArrowUpFromLine size={24} /> : <ClipboardList size={24} />}
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{selectedRecord.action}</div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>{selectedRecord.date}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: '18px', fontWeight: '700', fontFamily: 'monospace', color: selectedRecord.amount.startsWith('+') ? '#16a34a' : selectedRecord.amount.startsWith('-') ? '#dc2626' : '#64748b' }}>
                {selectedRecord.amount}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', display: 'block', fontWeight: '500' }}>操作人信息</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                    <User size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{selectedRecord.operator}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{selectedRecord.phone}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', display: 'block', fontWeight: '500' }}>备注说明</label>
                <div style={{ fontSize: '14px', color: '#334155', lineHeight: '1.5', padding: '12px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                  {selectedRecord.detail || selectedRecord.note}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div 
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)',
          borderRadius: '24px', width: '900px', height: '650px',
          maxWidth: '95vw', maxHeight: '90vh', overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex', flexDirection: 'column',
        }} 
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onScroll={(e) => e.stopPropagation()}
      >
        
        {/* Header Area */}
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          padding: '32px 40px', 
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute', top: '-50%', right: '-10%',
            width: '300px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-20%', left: '10%',
            width: '150px', height: '150px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
               <div style={{
                 width: '72px', height: '72px', borderRadius: '20px',
                 backgroundColor: 'rgba(255, 255, 255, 0.2)',
                 backdropFilter: 'blur(10px)',
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 fontSize: '32px', fontWeight: 'bold',
                 boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                 border: '1px solid rgba(255, 255, 255, 0.3)',
               }}>
                 {reagent.formula.charAt(0)}
               </div>
               <div>
                 <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                   <span style={{ opacity: 0.7 }}>编号</span> 
                   <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{reagent.id}</span>
                 </div>
                 <h2 style={{ margin: 0, fontSize: '32px', fontWeight: '800', letterSpacing: '-0.025em' }}>{reagent.name}</h2>
                 <p style={{ margin: '6px 0 0 0', fontSize: '18px', fontFamily: 'monospace', opacity: 0.8, fontWeight: '500' }}>
                   {reagent.formula}
                 </p>
               </div>
            </div>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '12px',
              width: '40px', height: '40px', fontSize: '24px', cursor: 'pointer', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >×</button>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '24px', position: 'relative', zIndex: 1 }}>
            <div style={{ 
              padding: '6px 16px', borderRadius: '20px', 
              fontSize: '13px', fontWeight: '600', 
              backgroundColor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <MapPin size={14} /> {reagent.storageRoom} · {reagent.position}
            </div>
            {(() => {
              const s = getStatusColor(reagent.status)
              return (
                 <div style={{ 
                  padding: '6px 16px', borderRadius: '20px', 
                  fontSize: '13px', fontWeight: '600', 
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  color: '#4f46e5',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  {reagent.status === '在库' ? <CheckCircle2 size={14} /> : <Package size={14} />} {reagent.status}
                </div>
              )
            })()}
          </div>
        </div>
        
        {/* Content Container */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar Tabs */}
          <div style={{ 
            width: '200px', 
            backgroundColor: '#f8fafc', 
            borderRight: '1px solid #e2e8f0',
            padding: '24px 16px',
            display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            {[{ id: 'basic', label: '基本信息', icon: <FileText size={18} /> }, { id: 'safety', label: '安全信息', icon: <ShieldAlert size={18} /> }, { id: 'history', label: '使用记录', icon: <History size={18} /> }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: '12px 16px', border: 'none',
                borderRadius: '12px',
                backgroundColor: activeTab === tab.id ? '#fff' : 'transparent',
                color: activeTab === tab.id ? '#4f46e5' : '#64748b',
                fontSize: '14px', fontWeight: activeTab === tab.id ? '600' : '500', 
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '12px',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s',
                textAlign: 'left',
              }}>
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Tab Content Area */}
          <div style={{ flex: 1, padding: '32px', overflow: 'auto', backgroundColor: '#fff' }}>
            {activeTab === 'basic' && (
              <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <SectionTitle title="库存状态" icon={<Package size={18} />} />
                <div style={{ 
                  backgroundColor: '#f8fafc', borderRadius: '20px', padding: '24px', marginBottom: '32px',
                  border: '1px solid #e2e8f0',
                  display: 'flex', gap: '32px', alignItems: 'center'
                }}>
                  {/* Circular Progress */}
                  <div style={{ width: '120px', height: '120px', flexShrink: 0 }}>
                    <CircleProgress percentage={remainingPercent} color={remainingPercent <= 10 ? '#ef4444' : remainingPercent <= 20 ? '#f59e0b' : '#22c55e'} />
                  </div>
                  
                  {/* Stock Details Grid */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                      <div>
                        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>当前容量</div>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>
                          {reagent.currentAmount} <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '500' }}>ml</span>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>总容量</div>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>
                          {reagent.capacity} <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '500' }}>ml</span>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>有效期至</div>
                        <div style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>
                          {reagent.expiryDate}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>上次补货</div>
                        <div style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>
                          {reagent.lastUpdated}
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Message */}
                    {remainingPercent <= 20 ? (
                      <div style={{
                        padding: '12px 16px', borderRadius: '12px',
                        backgroundColor: remainingPercent <= 10 ? '#fef2f2' : '#fffbeb',
                        border: `1px solid ${remainingPercent <= 10 ? '#fecaca' : '#fde68a'}`,
                        display: 'flex', alignItems: 'center', gap: '12px'
                      }}>
                        <span style={{ color: remainingPercent <= 10 ? '#dc2626' : '#d97706' }}>
                          {remainingPercent <= 10 ? <AlertOctagon size={18} /> : <AlertTriangle size={18} />}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: remainingPercent <= 10 ? '#b91c1c' : '#b45309', flex: 1 }}>
                          {remainingPercent <= 10 ? '库存严重不足，请立即补充！' : '库存不足，建议尽快补充'}
                        </span>
                        {/* Restock Button - Only for users with INVENTORY_RESTOCK permission */}
                        {hasPermission(PERMISSIONS.INVENTORY_RESTOCK) && (
                          <button 
                            onClick={() => setShowRestockModal(true)}
                            style={{
                            padding: '6px 12px', borderRadius: '8px', border: 'none',
                            backgroundColor: remainingPercent <= 10 ? '#dc2626' : '#d97706',
                            color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '4px'
                          }}>
                            <ArrowDownToLine size={12} /> 补货
                          </button>
                        )}
                      </div>
                    ) : (
                      <div style={{
                        padding: '12px 16px', borderRadius: '12px',
                        backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0',
                        display: 'flex', alignItems: 'center', gap: '12px'
                      }}>
                        <span style={{ color: '#16a34a' }}><CheckCircle2 size={18} /></span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#15803d' }}>
                          库存充足，无需补货
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Borrower Information for reagents with borrowing records */}
                {reagent.borrowerInfo && reagent.borrowedAmount > 0 && (
                  <>
                    <SectionTitle title="借出信息" icon={<User size={18} />} />
                    <div style={{ 
                      backgroundColor: '#fff7ed', borderRadius: '20px', padding: '24px', marginBottom: '32px',
                      border: '1px solid #fed7aa',
                      display: 'flex', gap: '24px', alignItems: 'flex-start'
                    }}>
                      {/* Borrower Avatar */}
                      <div style={{
                        width: '60px', height: '60px', borderRadius: '50%',
                        backgroundColor: '#ea580c', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '24px', fontWeight: 'bold', flexShrink: 0
                      }}>
                        {reagent.borrowerInfo.borrowerName.charAt(0)}
                      </div>
                      
                      {/* Borrower Details Grid */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                          <div>
                            <div style={{ fontSize: '13px', color: '#78716c', marginBottom: '4px', fontWeight: '500' }}>借出人</div>
                            <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
                              {reagent.borrowerInfo.borrowerName}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', color: '#78716c', marginBottom: '4px', fontWeight: '500' }}>联系电话</div>
                            <div style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', fontFamily: 'monospace' }}>
                              {reagent.borrowerInfo.borrowerPhone}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', color: '#78716c', marginBottom: '4px', fontWeight: '500' }}>借出日期</div>
                            <div style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>
                              {reagent.borrowerInfo.borrowDate}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', color: '#78716c', marginBottom: '4px', fontWeight: '500' }}>预计归还</div>
                            <div style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>
                              {reagent.borrowerInfo.expectedReturnDate}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <div style={{ fontSize: '13px', color: '#78716c', marginBottom: '4px', fontWeight: '500' }}>借出数量</div>
                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#ea580c' }}>
                              {reagent.borrowedAmount} <span style={{ fontSize: '14px', color: '#78716c', fontWeight: '500' }}>ml</span>
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', color: '#78716c', marginBottom: '4px', fontWeight: '500' }}>使用用途</div>
                            <div style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>
                              {reagent.borrowerInfo.purpose}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                <SectionTitle title="物理性质" icon={<Beaker size={18} />} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                  <PropertyCard label="CAS号" value={reagent.cas || 'N/A'} />
                  <PropertyCard label="摩尔质量" value={reagent.molarMass || 'N/A'} />
                  <PropertyCard label="密度" value={reagent.density || 'N/A'} />
                  <PropertyCard label="溶解度" value={reagent.solubility || 'N/A'} />
                  <PropertyCard label="熔点" value={reagent.meltingPoint || 'N/A'} />
                  <PropertyCard label="沸点" value={reagent.boilingPoint || 'N/A'} />
                </div>
                
                <SectionTitle title="其他信息" icon={<ClipboardList size={18} />} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                  <PropertyCard label="外观" value={reagent.appearance || '见实物'} />
                  <PropertyCard label="供应商" value={reagent.supplier} />
                  <PropertyCard label="入库日期" value={reagent.lastUpdated} />
                  <PropertyCard label="有效期至" value={reagent.expiryDate} />
                </div>
              </div>
            )}
            
            {activeTab === 'safety' && (
              <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <SectionTitle title="危险性分类" icon={<AlertTriangle size={18} />} />
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
                  {(reagent.ghsSymbols || [reagent.hazard]).map((symbol, i) => (
                    <div key={i} style={{ 
                      backgroundColor: '#fef2f2', border: '1px solid #fecaca', 
                      borderRadius: '16px', padding: '16px 20px', 
                      display: 'flex', alignItems: 'center', gap: '12px',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.05)'
                    }}>
                      <span style={{ color: '#dc2626' }}><AlertTriangle size={28} /></span>
                      <span style={{ fontWeight: '700', color: '#b91c1c', fontSize: '16px' }}>{symbol}</span>
                    </div>
                  ))}
                </div>
                
                <SectionTitle title="储存条件" icon={<Package size={18} />} />
                <div style={{ 
                  backgroundColor: '#fffbeb', border: '1px solid #fcd34d', 
                  borderRadius: '16px', padding: '20px', marginBottom: '32px',
                  display: 'flex', gap: '16px'
                }}>
                  <span style={{ color: '#d97706' }}><Package size={24} /></span>
                  <div>
                    <div style={{ fontWeight: '700', color: '#92400e', marginBottom: '4px', fontSize: '15px' }}>储存要求</div>
                    <div style={{ color: '#b45309', fontSize: '14px', lineHeight: 1.6 }}>{reagent.storageCondition || '常温干燥保存，避免阳光直射'}</div>
                  </div>
                </div>
                
                <SectionTitle title="化学品不相容性" icon={<Ban size={18} />} />
                <div style={{ 
                  backgroundColor: '#fef2f2', border: '1px solid #fecaca', 
                  borderRadius: '16px', padding: '20px', marginBottom: '32px' 
                }}>
                  <div style={{ fontWeight: '700', color: '#991b1b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Ban size={16} /> 禁止混放物质
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {getIncompatibleChemicals(reagent.hazard).map((item, i) => (
                      <span key={i} style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        border: '1px solid #fee2e2',
                        color: '#dc2626',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}>{item}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: '13px', color: '#b91c1c', lineHeight: 1.6, padding: '12px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '8px' }}>
                    {getIncompatibilityNote(reagent.hazard)}
                  </div>
                </div>
                
                <SectionTitle title="应急处理" icon={<AlertOctagon size={18} />} />
                <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
                  <EmergencyCard icon={<Eye size={24} />} title="眼睛接触" content="立即用大量清水冲洗至少15分钟，并就医" />
                  <EmergencyCard icon={<Hand size={24} />} title="皮肤接触" content="脱去污染的衣物，用肥皂水和清水彻底冲洗皮肤" />
                  <EmergencyCard icon={<Wind size={24} />} title="吸入" content="迅速撤离至空气新鲜处，保持呼吸道通畅" />
                  <EmergencyCard icon={<Utensils size={24} />} title="误食" content="禁止催吐，用清水漱口，给饮牛奶或蛋清，立即就医" />
                </div>
              </div>
            )}
            
            {activeTab === 'history' && (
              <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <SectionTitle title="最近操作记录" icon={<History size={18} />} />
                {usageHistory.map((record, i) => (
                  <div key={i} style={{ 
                    backgroundColor: '#fff', borderRadius: '16px', padding: '16px 20px', 
                    border: '1px solid #e2e8f0', marginBottom: '12px',
                    display: 'flex', alignItems: 'center', gap: '16px',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedRecord(record)}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  >
                    <div style={{ 
                      width: '42px', height: '42px', borderRadius: '12px', 
                      backgroundColor: record.action === '入库' ? '#dcfce7' : record.action === '出库' ? '#fee2e2' : '#e0e7ff', 
                      color: record.action === '入库' ? '#16a34a' : record.action === '出库' ? '#dc2626' : '#4f46e5', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {record.action === '入库' ? <ArrowDownToLine size={20} /> : record.action === '出库' ? <ArrowUpFromLine size={20} /> : <ClipboardList size={20} />}
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px', marginBottom: '2px' }}>
                          {record.action} <span style={{ marginLeft: '8px', fontFamily: 'monospace', color: record.amount.startsWith('+') ? '#16a34a' : record.amount.startsWith('-') ? '#dc2626' : '#64748b' }}>{record.amount}</span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{record.note}</span>
                          <span style={{ width: '4px', height: '4px', backgroundColor: '#cbd5e1', borderRadius: '50%' }} />
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <User size={12} /> {record.operator}
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>{record.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div style={{ 
          padding: '24px 32px', 
          borderTop: '1px solid #e2e8f0', 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'flex-end' 
        }}>
          {/* Disposal Button - Only for users with INVENTORY_DISPOSAL permission */}
          {hasPermission(PERMISSIONS.INVENTORY_DISPOSAL) && (
            <button style={{ 
              padding: '12px 24px', borderRadius: '12px', border: '1px solid #fecaca', 
              backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '14px', fontWeight: '600', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'all 0.2s'
            }}
            onClick={() => setShowDisposalModal(true)}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fecaca'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fee2e2'}
            >
              <Trash2 size={16} /> 报废
            </button>
          )}
          {/* Outbound Button - Only for users with INVENTORY_OUTBOUND permission */}
          {hasPermission(PERMISSIONS.INVENTORY_OUTBOUND) && (
            <button style={{ 
              padding: '12px 24px', borderRadius: '12px', border: 'none', 
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)', 
              color: '#ffffff', fontSize: '14px', fontWeight: '600', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.2s'
            }}
            onClick={() => setShowNFCModal(true)}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <ArrowUpFromLine size={16} /> 出库登记
            </button>
          )}
        </div>
      </div>
      
      {/* NFC 出库登记模态框 */}
      {showNFCModal && (
        <NFCOutboundModal 
          reagent={reagent}
          onClose={() => setShowNFCModal(false)}
          onSuccess={(data) => {
            console.log('NFC出库成功:', data)
            setShowNFCModal(false)
            // 更新库存数量
            if (onReagentUpdate) {
              onReagentUpdate('update', reagent.id, {
                currentAmount: reagent.currentAmount - data.outboundQuantity
              })
            }
          }}
        />
      )}
      
      {/* NFC 补货登记模态框 */}
      {showRestockModal && (
        <NFCRestockModal 
          reagent={reagent}
          onClose={() => setShowRestockModal(false)}
          onSuccess={(data) => {
            console.log('NFC补货成功:', data)
            setShowRestockModal(false)
          }}
        />
      )}
      
      {/* 报废确认模态框 */}
      {showDisposalModal && (
        <DisposalConfirmModal 
          reagent={reagent}
          onClose={() => setShowDisposalModal(false)}
          onConfirm={handleDisposal}
        />
      )}
    </div>
  )
}

function SectionTitle({ title, icon }) {
  return (
    <h3 style={{ 
      margin: '0 0 16px 0', 
      fontSize: '15px', 
      fontWeight: '700',
      color: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      {icon}
      {title}
    </h3>
  )
}

// Info Item Component
function InfoItem({ label, value, fullWidth }) {
  return (
    <div style={{ 
      gridColumn: fullWidth ? '1 / -1' : 'auto',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      padding: '14px 16px',
      border: '1px solid #e2e8f0',
      transition: 'all 0.2s',
    }}
    onMouseEnter={e => { 
      e.currentTarget.style.backgroundColor = '#f1f5f9'
      e.currentTarget.style.borderColor = '#cbd5e1'
      e.currentTarget.style.transform = 'translateY(-1px)'
    }}
    onMouseLeave={e => { 
      e.currentTarget.style.backgroundColor = '#f8fafc'
      e.currentTarget.style.borderColor = '#e2e8f0'
      e.currentTarget.style.transform = 'translateY(0)'
    }}
    >
      <div style={{
        fontSize: '12px',
        color: '#64748b',
        marginBottom: '6px',
        fontWeight: '500',
        letterSpacing: '0.025em'
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '14px',
        fontWeight: '600',
        color: '#0f172a',
        lineHeight: '1.4'
      }}>
        {value}
      </div>
    </div>
  )
}

// Property Card Component
function PropertyCard({ label, value }) {
  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '16px',
      padding: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
      transition: 'all 0.2s'
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.transform = 'translateY(-2px)' }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: '500' }}>
        {label}
      </div>
      <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
        {value}
      </div>
    </div>
  )
}

// Emergency Card Component
function EmergencyCard({ icon, title, content }) {
  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '16px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
      transition: 'all 0.2s'
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = '#fecaca'; e.currentTarget.style.backgroundColor = '#fef2f2' }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.backgroundColor = '#fff' }}
    >
      <div style={{ 
        width: '48px', height: '48px', 
        borderRadius: '12px',
        backgroundColor: '#fee2e2', 
        color: '#ef4444',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0
      }}>{icon}</div>
      <div>
        <div style={{ fontWeight: '700', color: '#991b1b', marginBottom: '4px', fontSize: '15px' }}>
          {title}
        </div>
        <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
          {content}
        </div>
      </div>
    </div>
  )
}

// 获取不相容化学品列表
function getIncompatibleChemicals(hazard) {
  const incompatibilityMap = {
    '氧化剂': ['易燃物', '还原剂', '有机溶剂', '金属粉末'],
    '强腐蚀性': ['碱类', '活性金属', '有机物', '氧化剂'],
    '腐蚀性': ['碱类', '活性金属', '氧化剂'],
    '易燃': ['氧化剂', '强酸', '强碱', '卤素'],
    '极易燃': ['氧化剂', '强酸', '热源', '火源', '静电'],
    '有毒': ['食品', '饲料', '药品'],
    '有害': ['食品', '饮用水源'],
    '刺激性': ['强酸', '强碱', '氧化剂'],
    '致癌': ['任何可能接触的物质', '通风不良环境'],
    '有毒/腐蚀': ['还原剂', '有机物', '碱类'],
    '易燃/致癌': ['氧化剂', '热源', '火源', '静电'],
    '无': [],
  }
  return incompatibilityMap[hazard] || ['请查阅MSDS']
}

// 获取不相容说明
function getIncompatibilityNote(hazard) {
  const noteMap = {
    '氧化剂': '与还原性物质接触可能引起剧烈反应甚至爆炸，严禁与易燃物混放。',
    '强腐蚀性': '能腐蚀多种金属，与碱类混合会产生剧烈放热反应，需单独存放。',
    '腐蚀性': '避免与碱类及活性金属接触，存放于耐腐蚀容器中。',
    '易燃': '远离氧化剂、热源和火源，存放于阴凉通风处。',
    '极易燃': '蒸汽可能与空气形成爆炸性混合物，严禁明火和静电。',
    '有毒': '严格隔离存放，防止污染食品和水源。',
    '有害': '避免长期接触，做好个人防护。',
    '刺激性': '避免接触皮肤和眼睛，使用时佩戴防护装备。',
    '致癌': '严格限制接触，必须在通风橱内操作。',
    '有毒/腐蚀': '具有双重危险性，需特别注意储存和操作安全。',
    '易燃/致癌': '同时具有火灾和健康风险，必须采取严格防护措施。',
    '无': '一般安全，但仍需遵守实验室安全规范。',
  }
  return noteMap[hazard] || '请查阅化学品安全数据表(MSDS)获取详细信息。'
}

// CircleProgress Component
function CircleProgress({ percentage, color }) {
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="100%" height="100%" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>{percentage}%</div>
        <div style={{ fontSize: '12px', color: '#64748b' }}>剩余</div>
      </div>
    </div>
  )
}

// 报废确认模态框组件
function DisposalConfirmModal({ reagent, onClose, onConfirm }) {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm()
    } finally {
      setIsLoading(false)
    }
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
      zIndex: 3000,
      animation: 'fadeIn 0.3s ease-out',
    }} onClick={!isLoading ? onClose : undefined}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '32px',
        minWidth: '400px',
        maxWidth: '500px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* 警告图标 */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#fef2f2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          color: '#dc2626',
        }}>
          {isLoading ? (
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid #fecaca',
              borderTop: '3px solid #dc2626',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
          ) : (
            <AlertTriangle size={32} />
          )}
        </div>
        
        {/* 标题和内容 */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '20px',
            fontWeight: '700',
            color: '#0f172a',
          }}>
            {isLoading ? '正在报废...' : '确认报废试剂'}
          </h3>
          <p style={{
            margin: '0 0 8px 0',
            fontSize: '16px',
            color: '#64748b',
            lineHeight: '1.5',
          }}>
            {isLoading 
              ? '正在删除试剂记录，请稍候...' 
              : '您确定要报废以下试剂吗？此操作将永久删除该试剂记录。'
            }
          </p>
          
          {/* 试剂信息卡片 */}
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            padding: '16px',
            marginTop: '16px',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
              }}>
                {reagent.formula.charAt(0)}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#0f172a',
                }}>
                  {reagent.name}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#64748b',
                  fontFamily: 'monospace',
                }}>
                  {reagent.formula} · {reagent.id}
                </div>
              </div>
            </div>
            <div style={{
              fontSize: '14px',
              color: '#64748b',
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <span>当前库存：{reagent.currentAmount}ml</span>
              <span>位置：{reagent.storageRoom} {reagent.position}</span>
            </div>
          </div>
        </div>
        
        {/* 按钮组 */}
        <div style={{
          display: 'flex',
          gap: '12px',
        }}>
          <button
            onClick={onClose}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              backgroundColor: isLoading ? '#f8fafc' : 'white',
              color: isLoading ? '#94a3b8' : '#64748b',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
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
            取消
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: isLoading 
                ? 'linear-gradient(135deg, #94a3b8, #64748b)' 
                : 'linear-gradient(135deg, #dc2626, #b91c1c)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: isLoading 
                ? '0 4px 12px rgba(148, 163, 184, 0.3)' 
                : '0 4px 12px rgba(220, 38, 38, 0.3)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
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
            <Trash2 size={16} />
            {isLoading ? '处理中...' : '确认报废'}
          </button>
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
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
