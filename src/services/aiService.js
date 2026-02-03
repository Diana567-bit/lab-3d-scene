/**
 * AI服务 - 连接AI模块API
 * 提供异常检测、风险评估、知识问答功能
 */

// AI服务地址 - 腾讯云服务器
c0nst AI_API_BASE = 'http://42.192.58.127:5000'

/**
 * 异常检测 - 预测未来30分钟的环境异常
 * @param {string} deviceId - 设备ID
 * @returns {Promise<Object>} 预测结果
 */
export const detectAnomaly = async (deviceId = 'DEVICE_001') => {
  try {
    const response = await fetch(`${AI_API_BASE}/api/anomaly/${deviceId}`)
    const data = await response.json()
    return {
      success: true,
      data: {
        probability: data.anomaly_probability,
        riskLevel: data.risk_level,  // low, medium, high, critical
        message: data.message,
        predictions: data.predictions,
        mode: data.mode
      }
    }
  } catch (error) {
    console.error('异常检测服务调用失败:', error)
    return {
      success: false,
      error: 'AI服务未启动，请先运行 ai_modules/app.py'
    }
  }
}

/**
 * 风险评估 - 综合评估仓库/实验室风险
 * @param {string} zone - 区域名称
 * @returns {Promise<Object>} 风险评估结果
 */
export const assessRisk = async (zone = '实验室A区') => {
  try {
    const response = await fetch(`${AI_API_BASE}/api/risk/${encodeURIComponent(zone)}`)
    const data = await response.json()
    return {
      success: true,
      data: {
        riskLevel: data.risk_level,  // A(极高), B(高), C(中), D(低)
        riskScore: data.risk_score,
        factors: data.risk_factors,
        recommendations: data.recommendations
      }
    }
  } catch (error) {
    console.error('风险评估服务调用失败:', error)
    return {
      success: false,
      error: 'AI服务未启动'
    }
  }
}

/**
 * 知识问答 - 化学品安全知识查询
 * @param {string} question - 用户问题
 * @returns {Promise<Object>} 问答结果
 */
export const askQuestion = async (question) => {
  try {
    const response = await fetch(`${AI_API_BASE}/api/qa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    })
    const data = await response.json()
    return {
      success: true,
      data: {
        answer: data.answer,
        intent: data.intent,
        entities: data.entities
      }
    }
  } catch (error) {
    console.error('知识问答服务调用失败:', error)
    return {
      success: false,
      error: 'AI服务未启动'
    }
  }
}

/**
 * 检查AI服务状态
 * @returns {Promise<boolean>}
 */
export const checkAIServiceHealth = async () => {
  try {
    const response = await fetch(`${AI_API_BASE}/api/health`)
    const data = await response.json()
    return data.status === 'healthy'
  } catch {
    return false
  }
}

/**
 * 根据试剂信息获取安全建议
 * @param {Object} reagent - 试剂对象
 * @returns {Promise<Object>}
 */
export const getReagentSafetyInfo = async (reagent) => {
  const question = `${reagent.name}有什么危险？怎么存储？`
  return await askQuestion(question)
}

/**
 * 检查两种试剂是否兼容
 * @param {string} reagent1 - 试剂1名称
 * @param {string} reagent2 - 试剂2名称
 * @returns {Promise<Object>}
 */
export const checkCompatibility = async (reagent1, reagent2) => {
  const question = `${reagent1}和${reagent2}可以一起存放吗？`
  return await askQuestion(question)
}


