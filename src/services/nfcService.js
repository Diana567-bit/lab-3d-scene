/**
 * NFC标签服务 - 与Flask后端通信
 * 用于处理NFC标签的读写操作和数据库交互
 */

// Flask后端配置
const API_CONFIG = {
  // 开发环境可以使用本地地址，生产环境使用实际服务器地址
  baseUrl: 'http://121.37.22.129',  // Flask服务器地址
  timeout: 30000,  // 30秒超时（NFC写卡需要等待用户操作）
}

/**
 * NFC写卡请求 - 出库登记
 * @param {Object} data - 写卡数据
 * @param {string} data.uid - ESP32设备UID
 * @param {string} data.chemical_name - 化学品名称
 * @param {string} data.status - 状态 (in_stock/borrowed/delete)
 * @param {string} data.remaining_quantity - 剩余量
 * @param {string} data.unit - 单位
 * @param {string} data.borrower_name - 借用人姓名
 * @param {string} data.borrower_phone - 借用人电话
 * @param {string} data.borrow_time - 借出时间
 * @param {string} data.expected_return_time - 预计归还时间
 * @param {string} data.location - 存放位置
 * @returns {Promise<Object>} - 写卡结果
 */
export async function writeNFCTag(data) {
  try {
    const formData = new FormData()
    
    // 填充表单数据
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key])
      }
    })

    const response = await fetch(`${API_CONFIG.baseUrl}/write_tag`, {
      method: 'POST',
      body: formData,
      // 注意：使用FormData时不要手动设置Content-Type
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Flask返回的是HTML页面，我们需要解析结果
    const htmlText = await response.text()
    
    // 检查是否写卡成功（通过检查返回的HTML内容）
    if (htmlText.includes('写卡成功')) {
      // 从HTML中提取tag_uid
      const tagUidMatch = htmlText.match(/Tag UID: ([A-Fa-f0-9]+)/)
      const tagUid = tagUidMatch ? tagUidMatch[1] : null
      
      return {
        success: true,
        message: '写卡成功',
        tagUid: tagUid,
      }
    } else if (htmlText.includes('超时')) {
      return {
        success: false,
        message: '等待标签超时，请重试',
        error: 'timeout',
      }
    } else {
      return {
        success: false,
        message: '写卡失败，请检查设备连接',
        error: 'unknown',
      }
    }
  } catch (error) {
    console.error('NFC写卡请求失败:', error)
    return {
      success: false,
      message: `网络错误: ${error.message}`,
      error: 'network',
    }
  }
}

/**
 * 通过Tag UID查询化学品信息
 * @param {string} tagUid - NFC标签UID
 * @returns {Promise<Object>} - 化学品信息
 */
export async function getChemicalByTagUid(tagUid) {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/rance_tag?uid=${encodeURIComponent(tagUid)}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, message: '未找到相关记录', error: 'not_found' }
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 返回HTML页面，实际使用时可能需要JSON API
    const htmlText = await response.text()
    
    return {
      success: true,
      data: htmlText,  // 原始HTML内容
    }
  } catch (error) {
    console.error('查询化学品信息失败:', error)
    return {
      success: false,
      message: `网络错误: ${error.message}`,
      error: 'network',
    }
  }
}

/**
 * 创建JSON API请求 - 用于更现代的API交互
 * 注意：这需要Flask后端添加对应的JSON API端点
 * @param {Object} data - 请求数据
 * @returns {Promise<Object>} - API响应
 */
export async function writeNFCTagJSON(data) {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/api/write_tag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('NFC API请求失败:', error)
    return {
      success: false,
      message: `请求失败: ${error.message}`,
      error: 'network',
    }
  }
}

/**
 * 读取NFC标签（用于出库确认）
 * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
 */
export async function readNFCTag() {
  try {
    // 模拟NFC扫描延迟
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // 这里应该调用实际的NFC读取API
    // const response = await fetch('/api/nfc/read', {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // })
    
    console.log('NFC扫描操作')
    
    // 模拟读取到的数据
    const scannedData = {
      tagUid: `NFC${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      chemical_name: '示例试剂',
      status: 'in_stock',
      remaining_quantity: '450',
      unit: 'ml',
      last_updated: new Date().toISOString(),
      batch_number: '20251127',
      expiry_date: '2026-11-27'
    }
    
    return {
      success: true,
      data: scannedData,
      message: 'NFC标签读取成功'
    }
  } catch (error) {
    console.error('NFC扫描失败:', error)
    return {
      success: false,
      message: 'NFC标签读取失败，请重试'
    }
  }
}

/**
 * WebSocket连接管理 - 用于实时接收NFC扫描结果
 * 这是一个更高级的实现，需要后端支持WebSocket
 */
export class NFCWebSocketClient {
  constructor(url = 'ws://121.37.22.129:8080/ws/nfc') {
    this.url = url
    this.socket = null
    this.listeners = new Map()
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(this.url)
        
        this.socket.onopen = () => {
          console.log('NFC WebSocket连接成功')
          resolve(this)
        }

        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data)
          this.notifyListeners(data.type, data)
        }

        this.socket.onerror = (error) => {
          console.error('NFC WebSocket错误:', error)
          reject(error)
        }

        this.socket.onclose = () => {
          console.log('NFC WebSocket连接关闭')
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }

  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, [])
    }
    this.listeners.get(eventType).push(callback)
  }

  off(eventType, callback) {
    if (this.listeners.has(eventType)) {
      const callbacks = this.listeners.get(eventType)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  notifyListeners(eventType, data) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).forEach(callback => callback(data))
    }
  }

  send(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
    }
  }
}

export default {
  writeNFCTag,
  getChemicalByTagUid,
  writeNFCTagJSON,
  NFCWebSocketClient,
}
