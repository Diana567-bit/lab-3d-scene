import React, { useState, useMemo } from 'react'
import { 
  LayoutDashboard, Package, CheckCircle2, AlertTriangle, Clock, 
  Search, Download, Plus, XCircle, AlertOctagon, FlaskConical, 
  ArrowUpFromLine, Hand, Ban
} from './Icons'
import AddReagentModal from './AddReagentModal'
import { hasPermission, PERMISSIONS } from '../services/authService'

export default function InventoryDashboard({ reagents, onReagentSelect, isVisible, setIsVisible, onAddReagent }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [showAddModal, setShowAddModal] = useState(false)
  
  // 计算统计数据
  const stats = useMemo(() => {
    if (!reagents || reagents.length === 0) return null
    
    const today = new Date()
    const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    
    const lowStock = reagents.filter(r => (r.currentAmount / r.capacity) <= 0.2).length
    const criticalStock = reagents.filter(r => (r.currentAmount / r.capacity) <= 0.1).length
    const expiringSoon = reagents.filter(r => new Date(r.expiryDate) <= thirtyDaysLater).length
    const expired = reagents.filter(r => new Date(r.expiryDate) <= today).length
    
    return {
      total: reagents.length,
      lowStock,
      criticalStock,
      expiringSoon,
      expired,
      inStock: reagents.filter(r => r.status === '在库').length,
      borrowed: reagents.filter(r => r.borrowerInfo && r.borrowedAmount > 0).length, // 有借出记录的试剂
    }
  }, [reagents])
  
  // 筛选和搜索
  const filteredReagents = useMemo(() => {
    if (!reagents) return []
    
    let result = [...reagents]
    
    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(r => 
        r.name.toLowerCase().includes(query) ||
        r.formula.toLowerCase().includes(query) ||
        r.id.toLowerCase().includes(query)
      )
    }
    
    // 类别过滤
    switch (activeFilter) {
      case 'lowStock':
        result = result.filter(r => (r.currentAmount / r.capacity) <= 0.2)
        break
      case 'expiring':
        const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        result = result.filter(r => new Date(r.expiryDate) <= thirtyDays && new Date(r.expiryDate) > new Date())
        break
      case 'expired':
        const today = new Date()
        result = result.filter(r => new Date(r.expiryDate) <= today)
        break
      case 'inStock':
        result = result.filter(r => r.status === '在库')
        break
      case 'borrowed':
        result = result.filter(r => r.borrowerInfo && r.borrowedAmount > 0) // 有借出记录的试剂
        break
      default:
        break
    }
    
    // 排序
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'stock':
          return (a.currentAmount / a.capacity) - (b.currentAmount / b.capacity)
        case 'expiry':
          return new Date(a.expiryDate) - new Date(b.expiryDate)
        default:
          return 0
      }
    })
    
    return result
  }, [reagents, searchQuery, activeFilter, sortBy])
  
  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        title={`库存管理中心${stats && stats.expired > 0 ? ` - ${stats.expired}个已过期药品` : ''}`}
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          padding: '8px 16px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(12px)',
          color: 'white',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 101,
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.background = 'rgba(15, 23, 42, 0.6)'
        }}
      >
        <LayoutDashboard size={20} />
        <span>库存管理中心</span>
        {stats && stats.expired > 0 && (
          <span style={{
            backgroundColor: '#ef4444',
            color: 'white',
            borderRadius: '8px',
            padding: '2px 8px',
            fontSize: '12px',
            boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
          }}>
            {stats.expired}
          </span>
        )}
      </button>
    )
  }
  
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
    }} onClick={() => setIsVisible(false)}>
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          width: '900px',
          height: '650px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          overflow: 'hidden',
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        {/* Sidebar */}
        <div style={{
          width: '240px',
          backgroundColor: '#f8fafc',
          borderRight: '1px solid #e2e8f0',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', 
              height: '40px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}>
              <FlaskConical size={24} />
            </div>
            <div>
              <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '16px' }}>LAB MANAGER</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>库存管理系统</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SidebarItem 
              active={activeFilter === 'all'} 
              onClick={() => setActiveFilter('all')}
              icon={<LayoutDashboard size={18} />} label="全部试剂" count={stats?.total} 
            />
            <SidebarItem 
              active={activeFilter === 'inStock'} 
              onClick={() => setActiveFilter('inStock')}
              icon={<CheckCircle2 size={18} />} label="在库试剂" count={stats?.inStock} 
            />
            <SidebarItem 
              active={activeFilter === 'borrowed'} 
              onClick={() => setActiveFilter('borrowed')}
              icon={<Hand size={18} />} label="已借出" count={stats?.borrowed} 
            />
            <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '8px 0' }} />
            <SidebarItem 
              active={activeFilter === 'lowStock'} 
              onClick={() => setActiveFilter('lowStock')}
              icon={<AlertTriangle size={18} />} label="库存不足" count={stats?.lowStock} alert 
            />
            <SidebarItem 
              active={activeFilter === 'expiring'} 
              onClick={() => setActiveFilter('expiring')}
              icon={<Clock size={18} />} label="即将过期" count={stats?.expiringSoon} alert 
            />
            <SidebarItem 
              active={activeFilter === 'expired'} 
              onClick={() => setActiveFilter('expired')}
              icon={<XCircle size={18} />} label="已经过期" count={stats?.expired} alert 
            />
          </div>
          
          <div style={{ marginTop: 'auto' }}>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#eff6ff', 
              borderRadius: '16px',
              border: '1px solid #dbeafe'
            }}>
              <div style={{ fontSize: '12px', color: '#3b82f6', fontWeight: '600', marginBottom: '4px' }}>系统状态</div>
              <div style={{ fontSize: '11px', color: '#60a5fa' }}>所有监测传感器运行正常</div>
              <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                <div style={{ fontSize: '10px', color: '#64748b' }}>在线</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
          {/* Top Bar */}
          <div style={{
            padding: '24px 32px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <h1 style={{ 
                margin: 0, 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#0f172a',
                letterSpacing: activeFilter === 'lowStock' ? '0.5px' : '0',
                lineHeight: '1.2'
              }}>
                {activeFilter === 'all' && '全部试剂'}
                {activeFilter === 'inStock' && '在库试剂'}
                {activeFilter === 'lowStock' && (
                  <span style={{ letterSpacing: '1px' }}>库存不足预警</span>
                )}
                {activeFilter === 'expiring' && '效期预警'}
                {activeFilter === 'expired' && '已经过期'}
              </h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748b' }}>
                共找到 {filteredReagents.length} 个项目
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="搜索试剂..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '10px 16px 10px 40px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    width: '240px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              </div>
              
              {/* Add Reagent Button - Only for users with REAGENT_CREATE permission */}
              {hasPermission(PERMISSIONS.REAGENT_CREATE) && (
                <button
                  onClick={() => setShowAddModal(true)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    backgroundColor: '#0f172a',
                    color: 'white',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Plus size={18} /> 新增试剂
                </button>
              )}
            </div>
          </div>
          
          {/* Stats Row */}
          {activeFilter === 'all' && (
            <div style={{
              padding: '24px 32px 0',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
            }}>
              <ModernStatCard 
                title="已经过期" 
                value={stats.expired} 
                unit="瓶"
                trend="急需处理"
                trendUp={false}
                color="red"
              />
              <ModernStatCard 
                title="需补货" 
                value={stats.lowStock} 
                unit="项"
                trend="注意"
                trendUp={false}
                color="orange"
              />
              <ModernStatCard 
                title="即将过期" 
                value={stats.expiringSoon} 
                unit="项"
                trend="需要处理"
                trendUp={false}
                color="red"
              />
            </div>
          )}
          
          {/* List Header */}
          <div style={{
            padding: '24px 32px 12px',
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
            fontSize: '12px',
            fontWeight: '600',
            color: '#94a3b8',
            letterSpacing: '0.05em',
          }}>
            <div>试剂名称 / 信息</div>
            <div>位置</div>
            <div>状态</div>
            <div>库存量</div>
          </div>
          
          {/* Scrollable List */}
          <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 24px' }}>
            {filteredReagents.map((reagent, index) => (
              <ModernListItem 
                key={reagent.id} 
                reagent={reagent}
                onClick={() => onReagentSelect(reagent)}
                delay={index * 0.05}
              />
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      
      {/* 新增试剂模态框 */}
      <AddReagentModal 
        isVisible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddReagent={(reagentInfo) => {
          console.log('新增试剂信息:', reagentInfo)
          setShowAddModal(false)
          // 直接调用父组件的onAddReagent函数
          if (onAddReagent) {
            return onAddReagent(reagentInfo)
          }
        }}
      />
    </div>
  )
}

function SidebarItem({ icon, label, count, active, onClick, alert }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderRadius: '12px',
        border: 'none',
        backgroundColor: active ? '#ffffff' : 'transparent',
        color: active ? '#0f172a' : '#64748b',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: active ? '0 4px 12px rgba(0, 0, 0, 0.05)' : 'none',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{}}>{icon}</span>
        <span style={{ fontSize: '14px', fontWeight: active ? '600' : '500' }}>{label}</span>
      </div>
      {count !== undefined && (
        <span style={{
          fontSize: '12px',
          fontWeight: '600',
          color: alert && count > 0 ? '#ef4444' : (active ? '#0f172a' : '#94a3b8'),
          backgroundColor: alert && count > 0 ? '#fef2f2' : (active ? '#f1f5f9' : 'transparent'),
          padding: '2px 8px',
          borderRadius: '8px',
        }}>
          {count}
        </span>
      )}
    </button>
  )
}

function ModernStatCard({ title, value, unit, trend, trendUp, color }) {
  const colors = {
    blue: { bg: '#eff6ff', text: '#3b82f6' },
    orange: { bg: '#fff7ed', text: '#f97316' },
    red: { bg: '#fef2f2', text: '#ef4444' },
  }
  const c = colors[color]
  
  return (
    <div style={{
      padding: '20px',
      borderRadius: '20px',
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a' }}>{value}</span>
        <span style={{ fontSize: '14px', color: '#94a3b8' }}>{unit}</span>
      </div>
      <div style={{ 
        alignSelf: 'flex-start',
        padding: '4px 10px',
        borderRadius: '20px',
        backgroundColor: c.bg,
        color: c.text,
        fontSize: '12px',
        fontWeight: '600',
      }}>
        {trend}
      </div>
    </div>
  )
}

function ModernListItem({ reagent, onClick, delay }) {
  const percent = Math.round((reagent.currentAmount / reagent.capacity) * 100)
  const isLow = percent <= 20
  const isCritical = percent <= 10
  
  // 获取试剂的实际状态（包括即将过期判断）
  const getActualStatus = (reagent) => {
    // 首先检查是否已过期
    const today = new Date()
    const expiryDate = new Date(reagent.expiryDate)
    
    if (expiryDate <= today) {
      return '已经过期'
    }
    
    if (reagent.status === '已借出') return '已借出'
    
    // 对于在库试剂，检查是否即将过期
    if (reagent.status === '在库') {
      const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
      
      if (expiryDate <= thirtyDaysLater && expiryDate > today) {
        return '即将过期'
      }
      
      // 检查库存状态
      if (isCritical) return '严重不足'
      if (isLow) return '库存不足'
    }
    
    return '正常'
  }
  
  const actualStatus = getActualStatus(reagent)
  
  // 根据实际状态获取颜色
  const getStatusStyle = (status) => {
    switch (status) {
      case '已经过期':
        return { bg: '#f3f4f6', color: '#374151', border: '#e5e7eb' }
      case '已借出':
        return { bg: '#fef3c7', color: '#92400e', border: '#fde68a' }
      case '即将过期':
        return { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' }
      case '严重不足':
        return { bg: '#fef2f2', color: '#ef4444', border: '#fecaca' }
      case '库存不足':
        return { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' }
      default:
        return { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' }
    }
  }
  
  const statusStyle = getStatusStyle(actualStatus)
  
  return (
    <div
      onClick={onClick}
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
        alignItems: 'center',
        padding: '16px 12px',
        borderRadius: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        borderBottom: '1px solid #f1f5f9',
        animation: `fadeIn 0.4s ease-out forwards`,
        animationDelay: `${Math.min(delay, 0.5)}s`,
        opacity: 0, // Start hidden for animation
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = '#f8fafc'
        e.currentTarget.style.transform = 'scale(1.01)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = 'transparent'
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      {/* Name & Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          backgroundColor: isCritical ? '#fef2f2' : '#eff6ff',
          color: isCritical ? '#ef4444' : '#3b82f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: '700',
        }}>
          {reagent.formula.charAt(0)}
        </div>
        <div>
          <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>{reagent.name}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>{reagent.formula}</div>
        </div>
      </div>
      
      {/* Location */}
      <div style={{ fontSize: '13px', color: '#64748b' }}>
        {reagent.storageRoom}
      </div>
      
      {/* Status */}
      <div>
        <span style={{
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          backgroundColor: statusStyle.bg,
          color: statusStyle.color,
          border: `1px solid ${statusStyle.border}`,
        }}>
          {actualStatus}
        </span>
      </div>
      
      {/* Stock Bar */}
      <div style={{ paddingRight: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>{percent}%</span>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{reagent.currentAmount}ml</span>
        </div>
        <div style={{
          height: '8px',
          backgroundColor: '#e2e8f0',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${percent}%`,
            backgroundColor: isCritical ? '#ef4444' : (isLow ? '#f97316' : '#3b82f6'),
            borderRadius: '4px',
          }} />
        </div>
      </div>
    </div>
  )
}
