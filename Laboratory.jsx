import React, { Suspense, useState, useMemo, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { EffectComposer, SSAO } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import LabScene from './components/LabScene'
import KeyboardNavigation from './components/KeyboardNavigation'
import ReagentInfoModal from './components/ReagentInfoModal'
import InventoryDashboard from './components/InventoryDashboard'
import UserManagement from './components/UserManagement'
import AIPanel from './components/AIPanel'
import { generateReagentData, createNewReagent } from './data/reagentData'
import { Sun, Moon, LogOut, Users, Lock } from './components/Icons'
import { hasPermission, PERMISSIONS } from './services/authService'

function Laboratory({ user, onLogout }) {
  const [lightsOn, setLightsOn] = useState(true)
  const [overheadLightsOn, setOverheadLightsOn] = useState(true)
  const [isDay, setIsDay] = useState(true)
  const [selectedReagent, setSelectedReagent] = useState(null)
  const [showDashboard, setShowDashboard] = useState(false)
  
  // UI状态
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showUserManagement, setShowUserManagement] = useState(false)
  const [showAIPanel, setShowAIPanel] = useState(false)
  
  // 生成试剂数据 - 使用状态以便可以更新
  const [reagentData, setReagentData] = useState(() => generateReagentData())
  
  // 刷新试剂数据
  const refreshReagentData = () => {
    const newData = generateReagentData()
    setReagentData(newData)
    console.log('试剂数据已更新，新的分布：')
    console.log('- 在库试剂:', newData.filter(r => r.status === '在库').length, '个')
    console.log('- 已借出:', newData.filter(r => r.status === '已借出').length, '个')
    console.log('- 已过期:', newData.filter(r => r.status === '已过期').length, '个')
    console.log('- 库存不足:', newData.filter(r => r.status === '在库' && (r.currentAmount / r.capacity) <= 0.2).length, '个')
    console.log('- 即将过期:', newData.filter(r => {
      const today = new Date()
      const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
      return new Date(r.expiryDate) <= thirtyDaysLater && new Date(r.expiryDate) > today
    }).length, '个')
  }
  
  // 组件挂载后立即刷新数据以应用新的分布逻辑
  useEffect(() => {
    refreshReagentData()
  }, [])
  
  // 处理登出
  const handleLogout = () => {
    setShowUserMenu(false)
    setShowDashboard(false)
    setSelectedReagent(null)
    onLogout()
    console.log('用户已登出')
  }
  
  // 处理新增试剂
  const handleAddReagent = (reagentInfo) => {
    const newReagent = createNewReagent(reagentInfo, reagentData)
    setReagentData(prevData => [...prevData, newReagent])
    console.log('新增试剂成功:', newReagent.name, '位置:', newReagent.position, '柜子:', newReagent.cabinetUid)
    return newReagent
  }
  
  // 处理试剂更新（删除、修改等）
  const handleReagentUpdate = (action, reagentId, updatedData) => {
    setReagentData(prevData => {
      switch (action) {
        case 'delete':
          // 删除试剂
          return prevData.filter(reagent => reagent.id !== reagentId)
        case 'update':
          // 更新试剂信息（包括出库减少库存）
          return prevData.map(reagent => 
            reagent.id === reagentId ? { ...reagent, ...updatedData } : reagent
          )
        case 'restock':
          // 补货更新
          return prevData.map(reagent => {
            if (reagent.id === reagentId) {
              const newAmount = reagent.currentAmount + updatedData.addedAmount
              const remainingPercent = (newAmount / reagent.capacity) * 100
              
              // 根据补货后的剩余量智能设置状态
              let newStatus = reagent.status
              if (reagent.status !== '已过期') {
                newStatus = '在库' // 补货后恢复在库状态（除非已过期）
              }
              
              return { 
                ...reagent, 
                currentAmount: newAmount,
                status: newStatus
              }
            }
            return reagent
          })
        case 'outbound':
          // 出库更新（减少库存）
          return prevData.map(reagent => {
            if (reagent.id === reagentId) {
              const newAmount = Math.max(0, reagent.currentAmount - updatedData.outboundQuantity)
              const remainingPercent = (newAmount / reagent.capacity) * 100
              
              // 出库后状态保持不变（除非已过期）
              let newStatus = reagent.status
              
              return { 
                ...reagent, 
                currentAmount: newAmount,
                status: newStatus
              }
            }
            return reagent
          })
        default:
          return prevData
      }
    })
    
    // 如果删除的是当前选中的试剂，关闭模态框
    if (action === 'delete' && selectedReagent?.id === reagentId) {
      setSelectedReagent(null)
    }
  }

  return (
    <>
      {/* Top Controls */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        {/* Day/Night Controls */}
        <div style={{
          display: 'flex',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '10px',
          borderRadius: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <button 
            onClick={() => setIsDay(true)} 
            style={{
              fontSize: '24px', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              opacity: isDay ? 1 : 0.4,
              transition: 'opacity 0.3s'
            }}
            title="Day Mode"
          >
            <Sun size={24} />
          </button>
          <button 
            onClick={() => setIsDay(false)} 
            style={{
              fontSize: '24px', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              opacity: !isDay ? 1 : 0.4,
              transition: 'opacity 0.3s'
            }}
            title="Night Mode"
          >
            <Moon size={24} />
          </button>
        </div>

        {/* User Menu */}
        {user && (
          <div style={{ position: 'relative', marginTop: '60px' }}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'}
            >
              {/* User Avatar */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: user.role === 'admin' ? '#ef4444' : '#3b82f6',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                {user.name ? user.name.charAt(0).toUpperCase() : user.charAt(0).toUpperCase()}
              </div>
              
              {/* User Info */}
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '2px' }}>
                  {user.name || user}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{user.role === 'admin' ? '管理员' : user.role === 'operator' ? '实验员' : '实验室用户'}</span>
                  {user.department && (
                    <>
                      <span>•</span>
                      <span>{user.department}</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Dropdown Arrow */}
              <div style={{ 
                fontSize: '12px', 
                color: '#94a3b8',
                transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }}>
                ▼
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                border: '1px solid #e2e8f0',
                minWidth: '200px',
                zIndex: 1000,
              }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: user.role === 'admin' ? '#ef4444' : '#3b82f6',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}>
                      {user.name ? user.name.charAt(0).toUpperCase() : user.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>
                        {user.name || user}
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{user.role === 'admin' ? '系统管理员' : user.role === 'operator' ? '实验员' : '实验室用户'}</span>
                        {user.department && (
                          <>
                            <span>•</span>
                            <span>{user.department}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div style={{ padding: '8px' }}>
                  {/* User Management - Show for all users but with different states */}
                  <button
                    onClick={() => {
                      if (hasPermission(PERMISSIONS.USER_MANAGE)) {
                        setShowUserManagement(true)
                        setShowUserMenu(false)
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      background: 'none',
                      borderRadius: '8px',
                      cursor: hasPermission(PERMISSIONS.USER_MANAGE) ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '14px',
                      color: hasPermission(PERMISSIONS.USER_MANAGE) ? '#374151' : '#9ca3af',
                      transition: 'background 0.2s',
                      marginBottom: '4px',
                      opacity: hasPermission(PERMISSIONS.USER_MANAGE) ? 1 : 0.6
                    }}
                    onMouseEnter={e => {
                      if (hasPermission(PERMISSIONS.USER_MANAGE)) {
                        e.currentTarget.style.background = '#f3f4f6'
                      }
                    }}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    {hasPermission(PERMISSIONS.USER_MANAGE) ? (
                      <Users size={16} />
                    ) : (
                      <Lock size={16} />
                    )}
                    <span style={{ flex: 1, textAlign: 'left' }}>用户管理</span>
                    {!hasPermission(PERMISSIONS.USER_MANAGE) && (
                      <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: '500' }}>
                        无权限
                      </span>
                    )}
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: 'none',
                      background: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '14px',
                      color: '#dc2626',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <LogOut size={16} />
                    退出登录
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <color attach="background" args={[isDay ? '#f0f8ff' : '#111122']} />
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[5, 3, -5.5]} rotation={[-0.1, 2.5, 0]} fov={60} />
          <KeyboardNavigation isEnabled={!selectedReagent && !showDashboard} />
          
          {/* Enhanced Lighting Setup */}
          {/* Ambient Light: Higher in day, lower in night. Adds up when lights are on. */}
          <ambientLight intensity={(isDay ? 1.6 : 0.1) + (lightsOn ? (isDay ? 0.1 : 2.5) : 0)} />
          
          {/* Sun / Moon Light */}
          <directionalLight 
            position={[10, 12, 8]} 
            intensity={isDay ? 2.0 : 0.2} 
            color={isDay ? "#ffffff" : "#aaccff"}
            castShadow 
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-15}
            shadow-camera-right={15}
            shadow-camera-top={15}
            shadow-camera-bottom={-15}
          />
          
          {/* Fill Light */}
          <directionalLight 
            position={[-8, 10, -6]} 
            intensity={isDay ? 0.8 : 0.1} 
            color={isDay ? "#ffffff" : "#444466"} 
          />
          
          {/* Top Light */}
          <directionalLight 
            position={[0, 15, 0]} 
            intensity={isDay ? 0.5 : 0.1} 
            color="#ffffff" 
          />
          
          <LabScene 
            lightsOn={lightsOn} 
            setLightsOn={setLightsOn} 
            overheadLightsOn={overheadLightsOn} 
            setOverheadLightsOn={setOverheadLightsOn}
            isDay={isDay}
            onReagentClick={setSelectedReagent}
            reagentData={reagentData}
          />
          
          {/* Post-processing for vector style */}
        <EffectComposer multisampling={8}>
          <SSAO 
            blendFunction={BlendFunction.MULTIPLY}
            samples={30}
            radius={5}
            intensity={20}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
    
    {/* Inventory Dashboard */}
    <InventoryDashboard
      reagents={reagentData}
      onReagentSelect={setSelectedReagent}
      isVisible={showDashboard}
      setIsVisible={setShowDashboard}
      onAddReagent={handleAddReagent}
    />
    
    {/* Reagent Info Modal */}
    <ReagentInfoModal 
      reagent={selectedReagent} 
      onClose={() => setSelectedReagent(null)} 
      onReagentUpdate={handleReagentUpdate}
    />
    
    {/* User Management Modal */}
    <UserManagement
      isVisible={showUserManagement}
      onClose={() => setShowUserManagement(false)}
    />
    
    {/* AI Panel */}
    <AIPanel
      isOpen={showAIPanel}
      onClose={() => setShowAIPanel(false)}
    />
    
    {/* AI Button - 固定在左下角 */}
    <button
      onClick={() => setShowAIPanel(true)}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        color: 'white',
        fontSize: '24px',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.1)'
        e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)'
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)'
        e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
      }}
      title="AI智能助手"
    >
      🧠
    </button>
    </>
  )
}

export default Laboratory
