/**
 * 用户认证服务
 * 处理登录、登出、权限验证等功能
 */

// 用户角色定义
export const USER_ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'operator'
}

// 权限定义
export const PERMISSIONS = {
  // 试剂管理权限
  REAGENT_CREATE: 'reagent:create',
  REAGENT_READ: 'reagent:read',
  REAGENT_UPDATE: 'reagent:update',
  REAGENT_DELETE: 'reagent:delete',
  
  // 库存操作权限
  INVENTORY_OUTBOUND: 'inventory:outbound',
  INVENTORY_RESTOCK: 'inventory:restock',
  INVENTORY_DISPOSAL: 'inventory:disposal',
  
  // 用户管理权限
  USER_MANAGE: 'user:manage',
  USER_VIEW: 'user:view',
  
  // 系统管理权限
  SYSTEM_CONFIG: 'system:config',
  AUDIT_LOG: 'audit:log',
  
  // 报表权限
  REPORT_VIEW: 'report:view',
  REPORT_EXPORT: 'report:export'
}

// 角色权限映射
export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    PERMISSIONS.REAGENT_CREATE,
    PERMISSIONS.REAGENT_READ,
    PERMISSIONS.REAGENT_UPDATE,
    PERMISSIONS.REAGENT_DELETE,
    PERMISSIONS.INVENTORY_OUTBOUND,
    PERMISSIONS.INVENTORY_RESTOCK,
    PERMISSIONS.INVENTORY_DISPOSAL,
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.SYSTEM_CONFIG,
    PERMISSIONS.AUDIT_LOG,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.REPORT_EXPORT
  ],
  [USER_ROLES.OPERATOR]: [
    PERMISSIONS.REAGENT_READ,
    PERMISSIONS.INVENTORY_OUTBOUND,
    PERMISSIONS.INVENTORY_RESTOCK,
    PERMISSIONS.REPORT_VIEW
  ]
}

// 模拟用户数据
const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // 实际应用中应该是加密的
    name: '系统管理员',
    role: USER_ROLES.ADMIN,
    department: '信息技术部',
    email: 'admin@lab.com',
    phone: '13800138000',
    avatar: null,
    status: 'active',
    lastLogin: null,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    username: 'operator',
    password: 'operator123',
    name: '实验员',
    role: USER_ROLES.OPERATOR,
    department: '化学实验室',
    email: 'operator@lab.com',
    phone: '13800138001',
    avatar: null,
    status: 'active',
    lastLogin: null,
    createdAt: '2025-01-01T00:00:00Z'
  }
]

// 当前用户状态
let currentUser = null

// 模拟延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 用户登录
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise<{success: boolean, user?: Object, message?: string, token?: string}>}
 */
export const login = async (username, password) => {
  try {
    await delay(1000) // 模拟网络延迟
    
    const user = MOCK_USERS.find(u => u.username === username && u.password === password)
    
    if (!user) {
      return {
        success: false,
        message: '用户名或密码错误'
      }
    }
    
    if (user.status !== 'active') {
      return {
        success: false,
        message: '账户已被禁用，请联系管理员'
      }
    }
    
    // 更新最后登录时间
    user.lastLogin = new Date().toISOString()
    
    // 生成模拟token
    const token = `token_${user.id}_${Date.now()}`
    
    // 设置当前用户
    currentUser = { ...user }
    delete currentUser.password // 移除密码信息
    
    // 注意：不保存到localStorage，刷新页面需要重新登录
    // 只保存token用于会话期间的验证
    sessionStorage.setItem('authToken', token)
    
    // 记录登录日志
    logUserAction('用户登录', { username, loginTime: user.lastLogin })
    
    return {
      success: true,
      user: currentUser,
      token: token,
      message: '登录成功'
    }
  } catch (error) {
    console.error('登录失败:', error)
    return {
      success: false,
      message: '登录过程中发生错误，请重试'
    }
  }
}

/**
 * 用户登出
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const logout = async () => {
  try {
    if (currentUser) {
      // 记录登出日志
      logUserAction('用户登出', { username: currentUser.username, logoutTime: new Date().toISOString() })
    }
    
    // 清除会话存储
    sessionStorage.removeItem('authToken')
    
    // 清除当前用户
    currentUser = null
    
    return {
      success: true,
      message: '登出成功'
    }
  } catch (error) {
    console.error('登出失败:', error)
    return {
      success: false,
      message: '登出过程中发生错误'
    }
  }
}

/**
 * 获取当前用户信息
 * @returns {Object|null} 当前用户信息
 */
export const getCurrentUser = () => {
  // 只返回内存中的用户状态，刷新页面后需要重新登录
  return currentUser
}

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否已登录
 */
export const isAuthenticated = () => {
  return getCurrentUser() !== null
}

/**
 * 检查用户是否有指定权限
 * @param {string} permission - 权限名称
 * @returns {boolean} 是否有权限
 */
export const hasPermission = (permission) => {
  const user = getCurrentUser()
  if (!user) return false
  
  const userPermissions = ROLE_PERMISSIONS[user.role] || []
  return userPermissions.includes(permission)
}

/**
 * 检查用户是否有指定角色
 * @param {string} role - 角色名称
 * @returns {boolean} 是否有该角色
 */
export const hasRole = (role) => {
  const user = getCurrentUser()
  return user ? user.role === role : false
}

/**
 * 获取用户权限列表
 * @returns {Array} 权限列表
 */
export const getUserPermissions = () => {
  const user = getCurrentUser()
  if (!user) return []
  
  return ROLE_PERMISSIONS[user.role] || []
}

/**
 * 修改密码
 * @param {string} oldPassword - 旧密码
 * @param {string} newPassword - 新密码
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const changePassword = async (oldPassword, newPassword) => {
  try {
    await delay(500)
    
    const user = getCurrentUser()
    if (!user) {
      return {
        success: false,
        message: '用户未登录'
      }
    }
    
    // 在实际应用中，这里应该调用后端API验证旧密码
    // 这里只是模拟
    const fullUser = MOCK_USERS.find(u => u.id === user.id)
    if (fullUser.password !== oldPassword) {
      return {
        success: false,
        message: '旧密码错误'
      }
    }
    
    // 更新密码
    fullUser.password = newPassword
    
    // 记录操作日志
    logUserAction('修改密码', { username: user.username })
    
    return {
      success: true,
      message: '密码修改成功'
    }
  } catch (error) {
    console.error('修改密码失败:', error)
    return {
      success: false,
      message: '修改密码过程中发生错误'
    }
  }
}

/**
 * 获取所有用户列表（仅管理员可用）
 * @returns {Promise<{success: boolean, users?: Array, message?: string}>}
 */
export const getAllUsers = async () => {
  try {
    if (!hasPermission(PERMISSIONS.USER_VIEW)) {
      return {
        success: false,
        message: '权限不足'
      }
    }
    
    await delay(300)
    
    // 返回用户列表（移除密码信息）
    const users = MOCK_USERS.map(user => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })
    
    return {
      success: true,
      users: users
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return {
      success: false,
      message: '获取用户列表失败'
    }
  }
}

/**
 * 记录用户操作日志
 * @param {string} action - 操作类型
 * @param {Object} details - 操作详情
 */
export const logUserAction = (action, details = {}) => {
  const user = getCurrentUser()
  const logEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: user?.id || 'anonymous',
    username: user?.username || 'anonymous',
    action: action,
    details: details,
    timestamp: new Date().toISOString(),
    ip: '127.0.0.1', // 在实际应用中应该获取真实IP
    userAgent: navigator.userAgent
  }
  
  // 保存到localStorage（实际应用中应该发送到后端）
  const logs = JSON.parse(localStorage.getItem('auditLogs') || '[]')
  logs.unshift(logEntry) // 添加到开头
  
  // 只保留最近1000条记录
  if (logs.length > 1000) {
    logs.splice(1000)
  }
  
  localStorage.setItem('auditLogs', JSON.stringify(logs))
  
  console.log('用户操作日志:', logEntry)
}

/**
 * 获取操作日志（仅有权限用户可用）
 * @param {number} limit - 限制条数
 * @returns {Promise<{success: boolean, logs?: Array, message?: string}>}
 */
export const getAuditLogs = async (limit = 100) => {
  try {
    if (!hasPermission(PERMISSIONS.AUDIT_LOG)) {
      return {
        success: false,
        message: '权限不足'
      }
    }
    
    await delay(200)
    
    const logs = JSON.parse(localStorage.getItem('auditLogs') || '[]')
    
    return {
      success: true,
      logs: logs.slice(0, limit)
    }
  } catch (error) {
    console.error('获取操作日志失败:', error)
    return {
      success: false,
      message: '获取操作日志失败'
    }
  }
}

// 导出默认对象
export default {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  hasPermission,
  hasRole,
  getUserPermissions,
  changePassword,
  getAllUsers,
  logUserAction,
  getAuditLogs,
  USER_ROLES,
  PERMISSIONS
}
