import React from 'react'
import { hasPermission, hasRole, getCurrentUser } from '../services/authService'
import { AlertTriangle, Lock } from './Icons'

/**
 * 权限守卫组件
 * 根据用户权限控制组件的显示和访问
 */

/**
 * 权限检查组件
 * @param {Object} props
 * @param {string|Array} props.permission - 需要的权限（单个或数组）
 * @param {string} props.role - 需要的角色
 * @param {React.ReactNode} props.children - 子组件
 * @param {React.ReactNode} props.fallback - 无权限时显示的内容
 * @param {boolean} props.showFallback - 是否显示无权限提示
 */
export function PermissionGuard({ 
  permission, 
  role, 
  children, 
  fallback, 
  showFallback = false 
}) {
  const user = getCurrentUser()
  
  // 未登录用户
  if (!user) {
    return showFallback ? (
      fallback || <NoPermissionMessage message="请先登录" />
    ) : null
  }
  
  // 检查角色权限
  if (role && !hasRole(role)) {
    return showFallback ? (
      fallback || <NoPermissionMessage message="角色权限不足" />
    ) : null
  }
  
  // 检查具体权限
  if (permission) {
    const permissions = Array.isArray(permission) ? permission : [permission]
    const hasAllPermissions = permissions.every(perm => hasPermission(perm))
    
    if (!hasAllPermissions) {
      return showFallback ? (
        fallback || <NoPermissionMessage message="操作权限不足" />
      ) : null
    }
  }
  
  return children
}

/**
 * 无权限提示组件
 */
function NoPermissionMessage({ message = "权限不足" }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      color: '#64748b',
    }}>
      <div>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#fef2f2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: '#dc2626',
        }}>
          <Lock size={32} />
        </div>
        <h3 style={{
          margin: '0 0 8px',
          fontSize: '18px',
          fontWeight: '600',
          color: '#374151',
        }}>
          {message}
        </h3>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#64748b',
        }}>
          请联系管理员获取相应权限
        </p>
      </div>
    </div>
  )
}

/**
 * 按钮权限控制组件
 * 根据权限控制按钮的显示和禁用状态
 */
export function PermissionButton({ 
  permission, 
  role, 
  children, 
  disabled = false,
  showDisabled = true,
  disabledMessage = "权限不足",
  ...props 
}) {
  const user = getCurrentUser()
  
  // 检查权限
  const hasRequiredPermission = () => {
    if (!user) return false
    
    if (role && !hasRole(role)) return false
    
    if (permission) {
      const permissions = Array.isArray(permission) ? permission : [permission]
      return permissions.every(perm => hasPermission(perm))
    }
    
    return true
  }
  
  const hasPermissionFlag = hasRequiredPermission()
  
  // 如果没有权限且不显示禁用按钮，则不渲染
  if (!hasPermissionFlag && !showDisabled) {
    return null
  }
  
  // 按钮样式处理
  const buttonProps = {
    ...props,
    disabled: disabled || !hasPermissionFlag,
    title: !hasPermissionFlag ? disabledMessage : props.title,
    style: {
      ...props.style,
      opacity: !hasPermissionFlag ? 0.5 : 1,
      cursor: !hasPermissionFlag ? 'not-allowed' : props.style?.cursor || 'pointer',
    }
  }
  
  return React.cloneElement(children, buttonProps)
}

/**
 * 角色标签组件
 * 显示用户角色信息
 */
export function RoleBadge({ user }) {
  if (!user) return null
  
  const roleConfig = {
    admin: { label: '管理员', color: '#dc2626', bg: '#fef2f2' },
    manager: { label: '主管', color: '#d97706', bg: '#fffbeb' },
    operator: { label: '操作员', color: '#059669', bg: '#f0fdf4' },
    viewer: { label: '观察员', color: '#4f46e5', bg: '#eef2ff' }
  }
  
  const config = roleConfig[user.role] || { label: user.role, color: '#64748b', bg: '#f8fafc' }
  
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      color: config.color,
      backgroundColor: config.bg,
      border: `1px solid ${config.color}20`,
    }}>
      {config.label}
    </span>
  )
}

/**
 * 权限信息组件
 * 显示当前用户的权限列表
 */
export function PermissionInfo() {
  const user = getCurrentUser()
  
  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
        用户未登录
      </div>
    )
  }
  
  return (
    <div style={{
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e2e8f0',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#4f46e5',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 'bold',
        }}>
          {user.name.charAt(0)}
        </div>
        <div>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#0f172a',
            marginBottom: '4px',
          }}>
            {user.name}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '14px', color: '#64748b' }}>
              {user.username}
            </span>
            <RoleBadge user={user} />
          </div>
        </div>
      </div>
      
      <div style={{
        fontSize: '14px',
        color: '#64748b',
        marginBottom: '8px',
      }}>
        部门：{user.department}
      </div>
      
      {user.lastLogin && (
        <div style={{
          fontSize: '12px',
          color: '#94a3b8',
        }}>
          上次登录：{new Date(user.lastLogin).toLocaleString()}
        </div>
      )}
    </div>
  )
}

/**
 * 高阶组件：权限包装器
 * 用于包装需要权限控制的组件
 */
export function withPermission(WrappedComponent, requiredPermission, requiredRole) {
  return function PermissionWrappedComponent(props) {
    return (
      <PermissionGuard 
        permission={requiredPermission} 
        role={requiredRole}
        showFallback={true}
      >
        <WrappedComponent {...props} />
      </PermissionGuard>
    )
  }
}

export default {
  PermissionGuard,
  PermissionButton,
  RoleBadge,
  PermissionInfo,
  withPermission
}
