import React, { useState, useEffect } from 'react'
import { 
  Users, UserPlus, Edit3, Trash2, Eye, EyeOff, 
  Shield, Clock, Mail, Phone, Building, 
  Search, Filter, MoreVertical, X
} from './Icons'
import { getAllUsers, USER_ROLES, PERMISSIONS } from '../services/authService'
import { PermissionGuard, RoleBadge } from './PermissionGuard'

/**
 * 用户管理组件
 * 提供用户列表、添加、编辑、删除等功能
 */
export default function UserManagement({ isVisible, onClose }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)

  // 加载用户列表
  const loadUsers = async () => {
    setLoading(true)
    try {
      const result = await getAllUsers()
      if (result.success) {
        setUsers(result.users)
      } else {
        console.error('加载用户列表失败:', result.message)
      }
    } catch (error) {
      console.error('加载用户列表异常:', error)
    } finally {
      setLoading(false)
    }
  }

  // 组件挂载时加载数据
  useEffect(() => {
    if (isVisible) {
      loadUsers()
    }
  }, [isVisible])

  // 筛选用户
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    
    return matchesSearch && matchesRole
  })

  // 获取角色显示名称
  const getRoleDisplayName = (role) => {
    const roleNames = {
      [USER_ROLES.ADMIN]: '系统管理员',
      [USER_ROLES.OPERATOR]: '实验员'
    }
    return roleNames[role] || role
  }

  // 获取状态显示
  const getStatusDisplay = (status) => {
    const statusConfig = {
      active: { label: '正常', color: '#059669', bg: '#f0fdf4' },
      inactive: { label: '禁用', color: '#dc2626', bg: '#fef2f2' },
      pending: { label: '待激活', color: '#d97706', bg: '#fffbeb' }
    }
    return statusConfig[status] || { label: status, color: '#64748b', bg: '#f8fafc' }
  }

  if (!isVisible) return null

  return (
    <PermissionGuard permission={PERMISSIONS.USER_VIEW} showFallback={true}>
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          zIndex: 2000,
          animation: 'fadeIn 0.3s ease-out',
        }}
        onClick={onClose}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            width: '1000px',
            height: '700px',
            maxWidth: '95vw',
            maxHeight: '90vh',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            padding: '24px 32px',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Users size={24} />
              </div>
              <div>
                <h2 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '700' }}>
                  用户管理
                </h2>
                <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                  管理系统用户和权限
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Toolbar */}
          <div style={{
            padding: '24px 32px 16px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
          }}>
            {/* 搜索框 */}
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder="搜索用户名、姓名或邮箱..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  padding: '10px 16px 10px 40px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <Search size={16} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b',
              }} />
            </div>

            {/* 角色筛选 */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                fontSize: '14px',
                cursor: 'pointer',
                minWidth: '120px',
              }}
            >
              <option value="all">所有角色</option>
              <option value={USER_ROLES.ADMIN}>管理员</option>
              <option value={USER_ROLES.OPERATOR}>实验员</option>
            </select>

            {/* 添加用户按钮 */}
            <PermissionGuard permission={PERMISSIONS.USER_MANAGE}>
              <button
                onClick={() => {
                  setSelectedUser(null)
                  setShowUserModal(true)
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                }}
              >
                <UserPlus size={16} />
                添加用户
              </button>
            </PermissionGuard>
          </div>

          {/* 用户列表 */}
          <div 
            style={{ flex: 1, overflow: 'auto', padding: '16px 32px 32px' }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onScroll={(e) => e.stopPropagation()}
          >
            {loading ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                color: '#64748b',
              }}>
                加载中...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                color: '#64748b',
                textAlign: 'center',
              }}>
                <div>
                  <Users size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                  <p>没有找到用户</p>
                </div>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gap: '16px',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              }}>
                {filteredUsers.map(user => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onEdit={() => {
                      setSelectedUser(user)
                      setShowUserModal(true)
                    }}
                    onDelete={() => {
                      // TODO: 实现删除用户功能
                      console.log('删除用户:', user.id)
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 用户编辑模态框 */}
        {showUserModal && (
          <UserEditModal
            user={selectedUser}
            onClose={() => {
              setShowUserModal(false)
              setSelectedUser(null)
            }}
            onSave={(userData) => {
              // TODO: 实现保存用户功能
              console.log('保存用户:', userData)
              setShowUserModal(false)
              setSelectedUser(null)
              loadUsers() // 重新加载用户列表
            }}
          />
        )}
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
      `}</style>
    </PermissionGuard>
  )
}

/**
 * 用户卡片组件
 */
function UserCard({ user, onEdit, onDelete }) {
  const statusConfig = getStatusDisplay(user.status)
  
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      transition: 'all 0.2s',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = '#cbd5e1'
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = '#e2e8f0'
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)'
    }}
    >
      {/* 用户头像和基本信息 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#4f46e5',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
        }}>
          {user.name.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#0f172a',
            marginBottom: '4px',
          }}>
            {user.name}
          </div>
          <div style={{
            fontSize: '14px',
            color: '#64748b',
          }}>
            @{user.username}
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <PermissionGuard permission={PERMISSIONS.USER_MANAGE}>
            <button
              onClick={onEdit}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b',
              }}
              title="编辑用户"
            >
              <Edit3 size={14} />
            </button>
          </PermissionGuard>
        </div>
      </div>

      {/* 角色和状态 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px',
      }}>
        <RoleBadge user={user} />
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600',
          color: statusConfig.color,
          backgroundColor: statusConfig.bg,
        }}>
          {statusConfig.label}
        </span>
      </div>

      {/* 联系信息 */}
      <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <Building size={12} />
          {user.department}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <Mail size={12} />
          {user.email}
        </div>
        {user.phone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Phone size={12} />
            {user.phone}
          </div>
        )}
      </div>

      {/* 最后登录时间 */}
      {user.lastLogin && (
        <div style={{
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid #f1f5f9',
          fontSize: '12px',
          color: '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <Clock size={12} />
          上次登录：{new Date(user.lastLogin).toLocaleString()}
        </div>
      )}
    </div>
  )
}

/**
 * 用户编辑模态框组件
 */
function UserEditModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    role: user?.role || USER_ROLES.VIEWER,
    status: user?.status || 'active',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      zIndex: 3000,
    }}
    onClick={onClose}
    >
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        width: '500px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '32px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }}
      onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{
          margin: '0 0 24px',
          fontSize: '20px',
          fontWeight: '700',
          color: '#0f172a',
        }}>
          {user ? '编辑用户' : '添加用户'}
        </h3>

        <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
              }}>
                姓名 *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
              }}>
                用户名 *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
              }}>
                邮箱 *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
              }}>
                电话
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
              }}>
                部门
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
              }}>
                角色 *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <option value={USER_ROLES.VIEWER}>观察员</option>
                <option value={USER_ROLES.OPERATOR}>实验员</option>
                <option value={USER_ROLES.MANAGER}>实验室主管</option>
                <option value={USER_ROLES.ADMIN}>系统管理员</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
              }}>
                状态
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <option value="active">正常</option>
                <option value="inactive">禁用</option>
                <option value="pending">待激活</option>
              </select>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              取消
            </button>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 辅助函数
function getStatusDisplay(status) {
  const statusConfig = {
    active: { label: '正常', color: '#059669', bg: '#f0fdf4' },
    inactive: { label: '禁用', color: '#dc2626', bg: '#fef2f2' },
    pending: { label: '待激活', color: '#d97706', bg: '#fffbeb' }
  }
  return statusConfig[status] || { label: status, color: '#64748b', bg: '#f8fafc' }
}
