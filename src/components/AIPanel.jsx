/**
 * AI智能面板组件
 * 提供异常检测、风险评估、知识问答三大功能
 */
import React, { useState, useEffect } from 'react'
import { detectAnomaly, assessRisk, askQuestion, checkAIServiceHealth } from '../services/aiService'

// 图标组件
const Icons = {
  Brain: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2a8 8 0 0 0-8 8c0 3.4 2 6 5 7v5h6v-5c3-1 5-3.6 5-7a8 8 0 0 0-8-8z"/>
    </svg>
  ),
  Alert: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
    </svg>
  ),
  Shield: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l8 4v6c0 5.5-3.8 10.7-8 12-4.2-1.3-8-6.5-8-12V6l8-4z"/>
    </svg>
  ),
  Chat: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"/>
    </svg>
  ),
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  ),
  Refresh: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 4v6h-6M1 20v-6h6"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  ),
}

// 风险等级颜色映射
const riskColors = {
  low: '#22c55e',
  medium: '#eab308',
  high: '#f97316',
  critical: '#ef4444',
  D: '#22c55e',
  C: '#eab308',
  B: '#f97316',
  A: '#ef4444',
}

export default function AIPanel({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('anomaly')
  const [isServiceOnline, setIsServiceOnline] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // 异常检测状态
  const [anomalyResult, setAnomalyResult] = useState(null)
  
  // 风险评估状态
  const [riskResult, setRiskResult] = useState(null)
  
  // 问答状态
  const [question, setQuestion] = useState('')
  const [qaHistory, setQaHistory] = useState([])
  
  // 检查服务状态
  useEffect(() => {
    const checkService = async () => {
      const online = await checkAIServiceHealth()
      setIsServiceOnline(online)
    }
    checkService()
    const interval = setInterval(checkService, 10000)
    return () => clearInterval(interval)
  }, [])
  
  // 执行异常检测
  const handleDetectAnomaly = async () => {
    setLoading(true)
    const result = await detectAnomaly('LAB_SENSOR_001')
    if (result.success) {
      setAnomalyResult(result.data)
    }
    setLoading(false)
  }
  
  // 执行风险评估
  const handleAssessRisk = async () => {
    setLoading(true)
    const result = await assessRisk('实验室')
    if (result.success) {
      setRiskResult(result.data)
    }
    setLoading(false)
  }
  
  // 发送问题
  const handleAskQuestion = async () => {
    if (!question.trim()) return
    
    setLoading(true)
    const userQ = question
    setQuestion('')
    
    setQaHistory(prev => [...prev, { type: 'user', content: userQ }])
    
    const result = await askQuestion(userQ)
    if (result.success) {
      setQaHistory(prev => [...prev, { type: 'ai', content: result.data.answer }])
    } else {
      setQaHistory(prev => [...prev, { type: 'ai', content: '抱歉，AI服务暂时不可用' }])
    }
    setLoading(false)
  }
  
  if (!isOpen) return null
  
  return (
    <div style={styles.overlay}>
      <div style={styles.panel}>
        {/* 头部 */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <Icons.Brain />
            <h2 style={styles.title}>AI智能助手</h2>
            <span style={{
              ...styles.statusBadge,
              background: isServiceOnline ? '#22c55e' : '#ef4444'
            }}>
              {isServiceOnline ? '在线' : '离线'}
            </span>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <Icons.Close />
          </button>
        </div>
        
        {/* 标签页 */}
        <div style={styles.tabs}>
          <button 
            style={{...styles.tab, ...(activeTab === 'anomaly' ? styles.activeTab : {})}}
            onClick={() => setActiveTab('anomaly')}
          >
            <Icons.Alert /> 异常检测
          </button>
          <button 
            style={{...styles.tab, ...(activeTab === 'risk' ? styles.activeTab : {})}}
            onClick={() => setActiveTab('risk')}
          >
            <Icons.Shield /> 风险评估
          </button>
          <button 
            style={{...styles.tab, ...(activeTab === 'qa' ? styles.activeTab : {})}}
            onClick={() => setActiveTab('qa')}
          >
            <Icons.Chat /> 知识问答
          </button>
        </div>
        
        {/* 内容区 */}
        <div style={styles.content}>
          {!isServiceOnline ? (
            <div style={styles.offlineMessage}>
              <p>⚠️ AI服务未启动</p>
              <p style={{fontSize: '14px', color: '#666'}}>
                请运行: <code>python d:\Rance的毕设\ai_modules\app.py</code>
              </p>
            </div>
          ) : activeTab === 'anomaly' ? (
            <div style={styles.tabContent}>
              <p style={styles.desc}>实时分析传感器数据，预测未来30分钟的异常风险</p>
              <button onClick={handleDetectAnomaly} style={styles.actionBtn} disabled={loading}>
                {loading ? '检测中...' : '开始检测'} <Icons.Refresh />
              </button>
              
              {anomalyResult && (
                <div style={styles.resultCard}>
                  <div style={styles.resultHeader}>
                    <span style={{
                      ...styles.riskBadge,
                      background: riskColors[anomalyResult.riskLevel]
                    }}>
                      {anomalyResult.riskLevel.toUpperCase()}
                    </span>
                    <span>异常概率: {(anomalyResult.probability * 100).toFixed(1)}%</span>
                  </div>
                  <p style={styles.message}>{anomalyResult.message}</p>
                </div>
              )}
            </div>
          ) : activeTab === 'risk' ? (
            <div style={styles.tabContent}>
              <p style={styles.desc}>综合评估实验室/仓库的安全风险等级</p>
              <button onClick={handleAssessRisk} style={styles.actionBtn} disabled={loading}>
                {loading ? '评估中...' : '开始评估'} <Icons.Refresh />
              </button>
              
              {riskResult && (
                <div style={styles.resultCard}>
                  <div style={styles.resultHeader}>
                    <span style={{
                      ...styles.riskBadge,
                      background: riskColors[riskResult.riskLevel]
                    }}>
                      {riskResult.riskLevel}级风险
                    </span>
                    <span>评分: {riskResult.riskScore}</span>
                  </div>
                  
                  {riskResult.factors?.length > 0 && (
                    <div style={styles.factorList}>
                      <h4>风险因素:</h4>
                      {riskResult.factors.slice(0, 3).map((f, i) => (
                        <div key={i} style={styles.factorItem}>
                          • {f.factor}: {f.value}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {riskResult.recommendations?.length > 0 && (
                    <div style={styles.recommendations}>
                      <h4>处置建议:</h4>
                      {riskResult.recommendations.slice(0, 2).map((r, i) => (
                        <div key={i} style={styles.recItem}>
                          [{r.priority}] {r.action}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div style={styles.tabContent}>
              <p style={styles.desc}>询问化学品安全知识、存储条件、应急处置等</p>
              
              <div style={styles.chatBox}>
                {qaHistory.length === 0 ? (
                  <div style={styles.chatPlaceholder}>
                    <p>💡 试着问我:</p>
                    <p>"硫酸有什么危险？"</p>
                    <p>"甲醇怎么存储？"</p>
                    <p>"盐酸和氢氧化钠能一起放吗？"</p>
                  </div>
                ) : (
                  qaHistory.map((msg, i) => (
                    <div key={i} style={{
                      ...styles.chatMessage,
                      ...(msg.type === 'user' ? styles.userMessage : styles.aiMessage)
                    }}>
                      {msg.content}
                    </div>
                  ))
                )}
              </div>
              
              <div style={styles.inputArea}>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                  placeholder="输入您的问题..."
                  style={styles.input}
                />
                <button onClick={handleAskQuestion} style={styles.sendBtn} disabled={loading}>
                  发送
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  panel: {
    width: '500px',
    maxHeight: '80vh',
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
  },
  statusBadge: {
    fontSize: '12px',
    padding: '2px 8px',
    borderRadius: '10px',
    color: 'white',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '4px',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #e5e7eb',
  },
  tab: {
    flex: 1,
    padding: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    color: '#666',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  activeTab: {
    color: '#667eea',
    borderBottom: '2px solid #667eea',
    fontWeight: '600',
  },
  content: {
    padding: '20px',
    minHeight: '300px',
  },
  tabContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  desc: {
    color: '#666',
    fontSize: '14px',
    margin: 0,
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  resultCard: {
    background: '#f8fafc',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #e2e8f0',
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  riskBadge: {
    padding: '4px 12px',
    borderRadius: '6px',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
  },
  message: {
    margin: 0,
    color: '#374151',
    lineHeight: '1.5',
  },
  factorList: {
    marginTop: '12px',
  },
  factorItem: {
    color: '#666',
    fontSize: '14px',
    padding: '4px 0',
  },
  recommendations: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #e2e8f0',
  },
  recItem: {
    color: '#764ba2',
    fontSize: '14px',
    padding: '4px 0',
  },
  offlineMessage: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
  chatBox: {
    height: '200px',
    overflowY: 'auto',
    background: '#f8fafc',
    borderRadius: '8px',
    padding: '12px',
  },
  chatPlaceholder: {
    color: '#999',
    textAlign: 'center',
    fontSize: '14px',
  },
  chatMessage: {
    padding: '10px 14px',
    borderRadius: '12px',
    marginBottom: '8px',
    maxWidth: '85%',
    fontSize: '14px',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
  },
  userMessage: {
    background: '#667eea',
    color: 'white',
    marginLeft: 'auto',
  },
  aiMessage: {
    background: 'white',
    border: '1px solid #e2e8f0',
  },
  inputArea: {
    display: 'flex',
    gap: '8px',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
  },
  sendBtn: {
    padding: '10px 20px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
}
