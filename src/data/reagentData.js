// 试剂数据库
const reagentDatabase = [
  // 常见化学试剂
  { 
    name: '高锰酸钾', 
    formula: 'KMnO₄', 
    hazard: '氧化剂', 
    color: 'purple',
    cas: '7722-64-7',
    molarMass: '158.034 g/mol',
    density: '2.7 g/cm³',
    meltingPoint: '240°C (分解)',
    boilingPoint: 'N/A',
    solubility: '6.4 g/100mL (20°C)',
    appearance: '深紫色针状晶体',
    storageCondition: '阴凉干燥处，远离可燃物',
    ghsSymbols: ['氧化剂', '腐蚀性', '环境危害'],
  },
  { 
    name: '硫酸', 
    formula: 'H₂SO₄', 
    hazard: '强腐蚀性', 
    color: 'clear',
    cas: '7664-93-9',
    molarMass: '98.079 g/mol',
    density: '1.84 g/cm³',
    meltingPoint: '10°C',
    boilingPoint: '337°C',
    solubility: '与水混溶',
    appearance: '无色油状液体',
    storageCondition: '阴凉通风处，远离碱类',
    ghsSymbols: ['腐蚀性'],
  },
  { 
    name: '盐酸', 
    formula: 'HCl', 
    hazard: '腐蚀性', 
    color: 'clear',
    cas: '7647-01-0',
    molarMass: '36.46 g/mol',
    density: '1.18 g/cm³ (37%)',
    meltingPoint: '-27°C',
    boilingPoint: '110°C',
    solubility: '与水混溶',
    appearance: '无色发烟液体',
    storageCondition: '阴凉通风处，防腐蚀',
    ghsSymbols: ['腐蚀性', '刺激性'],
  },
  { 
    name: '氢氧化钠', 
    formula: 'NaOH', 
    hazard: '强腐蚀性', 
    color: 'white',
    cas: '1310-73-2',
    molarMass: '40.00 g/mol',
    density: '2.13 g/cm³',
    meltingPoint: '323°C',
    boilingPoint: '1388°C',
    solubility: '111 g/100mL (20°C)',
    appearance: '白色固体',
    storageCondition: '密封干燥保存',
    ghsSymbols: ['腐蚀性'],
  },
  { 
    name: '硝酸银', 
    formula: 'AgNO₃', 
    hazard: '腐蚀性', 
    color: 'clear',
    cas: '7761-88-8',
    molarMass: '169.87 g/mol',
    density: '4.35 g/cm³',
    meltingPoint: '212°C',
    boilingPoint: '440°C (分解)',
    solubility: '234 g/100mL (25°C)',
    appearance: '无色晶体',
    storageCondition: '避光保存',
    ghsSymbols: ['腐蚀性', '氧化剂', '环境危害'],
  },
  { 
    name: '氯化钠', 
    formula: 'NaCl', 
    hazard: '无', 
    color: 'white',
    cas: '7647-14-5',
    molarMass: '58.44 g/mol',
    density: '2.16 g/cm³',
    meltingPoint: '801°C',
    boilingPoint: '1413°C',
    solubility: '36 g/100mL (20°C)',
    appearance: '白色晶体',
    storageCondition: '常温干燥保存',
    ghsSymbols: [],
  },
  { 
    name: '碳酸钠', 
    formula: 'Na₂CO₃', 
    hazard: '刺激性', 
    color: 'white',
    cas: '497-19-8',
    molarMass: '105.99 g/mol',
    density: '2.54 g/cm³',
    meltingPoint: '851°C',
    boilingPoint: '1600°C',
    solubility: '21.5 g/100mL (20°C)',
    appearance: '白色粉末',
    storageCondition: '密封干燥保存',
    ghsSymbols: ['刺激性'],
  },
  { 
    name: '硫酸铜', 
    formula: 'CuSO₄·5H₂O', 
    hazard: '有害', 
    color: 'blue',
    cas: '7758-99-8',
    molarMass: '249.69 g/mol',
    density: '2.286 g/cm³',
    meltingPoint: '110°C (失水)',
    boilingPoint: '650°C (分解)',
    solubility: '31.6 g/100mL (20°C)',
    appearance: '蓝色晶体',
    storageCondition: '密封保存',
    ghsSymbols: ['有害', '刺激性', '环境危害'],
  },
  { 
    name: '氯化铁', 
    formula: 'FeCl₃', 
    hazard: '腐蚀性', 
    color: 'brown',
    cas: '7705-08-0',
    molarMass: '162.2 g/mol',
    density: '2.9 g/cm³',
    meltingPoint: '307°C',
    boilingPoint: '316°C',
    solubility: '92 g/100mL (20°C)',
    appearance: '棕色晶体',
    storageCondition: '密封避光保存',
    ghsSymbols: ['腐蚀性', '刺激性'],
  },
  { 
    name: '乙醇', 
    formula: 'C₂H₅OH', 
    hazard: '易燃', 
    color: 'clear',
    cas: '64-17-5',
    molarMass: '46.07 g/mol',
    density: '0.789 g/cm³',
    meltingPoint: '-114°C',
    boilingPoint: '78°C',
    solubility: '与水混溶',
    appearance: '无色液体',
    storageCondition: '阴凉通风处，远离火源',
    ghsSymbols: ['易燃'],
  },
  { 
    name: '丙酮', 
    formula: 'CH₃COCH₃', 
    hazard: '易燃', 
    color: 'clear',
    cas: '67-64-1',
    molarMass: '58.08 g/mol',
    density: '0.791 g/cm³',
    meltingPoint: '-95°C',
    boilingPoint: '56°C',
    solubility: '与水混溶',
    appearance: '无色液体',
    storageCondition: '阴凉通风处，远离火源',
    ghsSymbols: ['易燃', '刺激性'],
  },
  { 
    name: '甲醇', 
    formula: 'CH₃OH', 
    hazard: '易燃/有毒', 
    color: 'clear',
    cas: '67-56-1',
    molarMass: '32.04 g/mol',
    density: '0.792 g/cm³',
    meltingPoint: '-98°C',
    boilingPoint: '65°C',
    solubility: '与水混溶',
    appearance: '无色液体',
    storageCondition: '阴凉通风处，远离火源',
    ghsSymbols: ['易燃', '急性毒性', '健康危害'],
  },
  { 
    name: '氨水', 
    formula: 'NH₃·H₂O', 
    hazard: '腐蚀性', 
    color: 'clear',
    cas: '1336-21-6',
    molarMass: '35.05 g/mol',
    density: '0.91 g/cm³ (25%)',
    meltingPoint: '-77°C',
    boilingPoint: '38°C',
    solubility: '与水混溶',
    appearance: '无色液体，有刺激性气味',
    storageCondition: '阴凉通风处，密封保存',
    ghsSymbols: ['腐蚀性', '环境危害'],
  },
  { 
    name: '过氧化氢', 
    formula: 'H₂O₂', 
    hazard: '氧化剂', 
    color: 'clear',
    cas: '7722-84-1',
    molarMass: '34.01 g/mol',
    density: '1.45 g/cm³ (100%)',
    meltingPoint: '-0.43°C',
    boilingPoint: '150°C',
    solubility: '与水混溶',
    appearance: '无色液体',
    storageCondition: '阴凉避光处',
    ghsSymbols: ['氧化剂', '腐蚀性', '急性毒性'],
  },
  { 
    name: '硝酸', 
    formula: 'HNO₃', 
    hazard: '强腐蚀性', 
    color: 'clear',
    cas: '7697-37-2',
    molarMass: '63.01 g/mol',
    density: '1.51 g/cm³',
    meltingPoint: '-42°C',
    boilingPoint: '83°C',
    solubility: '与水混溶',
    appearance: '无色发烟液体',
    storageCondition: '阴凉通风处，远离有机物',
    ghsSymbols: ['腐蚀性', '氧化剂'],
  },
  // 添加更多试剂以支持50个不同试剂
  { name: '乙醇', formula: 'C₂H₅OH', hazard: '易燃', color: 'clear', cas: '64-17-5', molarMass: '46.07 g/mol', density: '0.789 g/cm³', appearance: '无色液体', storageCondition: '阴凉通风处，远离火源' },
  { name: '丙酮', formula: 'C₃H₆O', hazard: '易燃', color: 'clear', cas: '67-64-1', molarMass: '58.08 g/mol', density: '0.784 g/cm³', appearance: '无色液体', storageCondition: '阴凉通风处，远离火源' },
  { name: '甲醇', formula: 'CH₃OH', hazard: '有毒/易燃', color: 'clear', cas: '67-56-1', molarMass: '32.04 g/mol', density: '0.792 g/cm³', appearance: '无色液体', storageCondition: '阴凉通风处，远离火源' },
  { name: '氯化钠', formula: 'NaCl', hazard: '无', color: 'white', cas: '7647-14-5', molarMass: '58.44 g/mol', density: '2.16 g/cm³', appearance: '白色晶体', storageCondition: '干燥处保存' },
  { name: '硫酸铜', formula: 'CuSO₄·5H₂O', hazard: '刺激性', color: 'blue', cas: '7758-99-8', molarMass: '249.68 g/mol', density: '2.286 g/cm³', appearance: '蓝色晶体', storageCondition: '干燥处保存' },
  { name: '氯化钙', formula: 'CaCl₂', hazard: '刺激性', color: 'white', cas: '10043-52-4', molarMass: '110.98 g/mol', density: '2.15 g/cm³', appearance: '白色颗粒', storageCondition: '密封干燥保存' },
  { name: '硫酸镁', formula: 'MgSO₄·7H₂O', hazard: '无', color: 'white', cas: '10034-99-8', molarMass: '246.47 g/mol', density: '1.68 g/cm³', appearance: '白色晶体', storageCondition: '干燥处保存' },
  { name: '氢氧化钙', formula: 'Ca(OH)₂', hazard: '腐蚀性', color: 'white', cas: '1305-62-0', molarMass: '74.09 g/mol', density: '2.21 g/cm³', appearance: '白色粉末', storageCondition: '密封干燥保存' },
  { name: '碳酸钠', formula: 'Na₂CO₃', hazard: '刺激性', color: 'white', cas: '497-19-8', molarMass: '105.99 g/mol', density: '2.54 g/cm³', appearance: '白色粉末', storageCondition: '干燥处保存' },
  { name: '硫酸钠', formula: 'Na₂SO₄', hazard: '无', color: 'white', cas: '7757-82-6', molarMass: '142.04 g/mol', density: '2.66 g/cm³', appearance: '白色晶体', storageCondition: '干燥处保存' },
  { name: '氯化铁', formula: 'FeCl₃', hazard: '腐蚀性', color: 'brown', cas: '7705-08-0', molarMass: '162.20 g/mol', density: '2.90 g/cm³', appearance: '棕黄色晶体', storageCondition: '密封干燥保存' },
  { name: '硝酸银', formula: 'AgNO₃', hazard: '氧化剂', color: 'white', cas: '7761-88-8', molarMass: '169.87 g/mol', density: '4.35 g/cm³', appearance: '无色晶体', storageCondition: '避光密封保存' },
  { name: '碘化钾', formula: 'KI', hazard: '刺激性', color: 'white', cas: '7681-11-0', molarMass: '166.00 g/mol', density: '3.13 g/cm³', appearance: '白色晶体', storageCondition: '避光干燥保存' },
  { name: '溴化钾', formula: 'KBr', hazard: '刺激性', color: 'white', cas: '7758-02-3', molarMass: '119.00 g/mol', density: '2.75 g/cm³', appearance: '白色晶体', storageCondition: '干燥处保存' },
  { name: '氯化钾', formula: 'KCl', hazard: '无', color: 'white', cas: '7447-40-7', molarMass: '74.55 g/mol', density: '1.98 g/cm³', appearance: '白色晶体', storageCondition: '干燥处保存' },
  { name: '硫酸钾', formula: 'K₂SO₄', hazard: '无', color: 'white', cas: '7778-80-5', molarMass: '174.26 g/mol', density: '2.66 g/cm³', appearance: '白色晶体', storageCondition: '干燥处保存' },
  { name: '磷酸', formula: 'H₃PO₄', hazard: '腐蚀性', color: 'clear', cas: '7664-38-2', molarMass: '97.99 g/mol', density: '1.88 g/cm³', appearance: '无色液体', storageCondition: '阴凉通风处' },
  { name: '醋酸', formula: 'CH₃COOH', hazard: '腐蚀性', color: 'clear', cas: '64-19-7', molarMass: '60.05 g/mol', density: '1.05 g/cm³', appearance: '无色液体', storageCondition: '阴凉通风处' },
  { name: '氨水', formula: 'NH₃·H₂O', hazard: '腐蚀性', color: 'clear', cas: '1336-21-6', molarMass: '35.05 g/mol', density: '0.90 g/cm³', appearance: '无色液体', storageCondition: '阴凉通风处' },
  { name: '硫酸亚铁', formula: 'FeSO₄·7H₂O', hazard: '刺激性', color: 'green', cas: '7782-63-0', molarMass: '278.01 g/mol', density: '1.90 g/cm³', appearance: '绿色晶体', storageCondition: '干燥处保存' },
  { name: '硫酸锌', formula: 'ZnSO₄·7H₂O', hazard: '刺激性', color: 'white', cas: '7446-20-0', molarMass: '287.56 g/mol', density: '1.96 g/cm³', appearance: '白色晶体', storageCondition: '干燥处保存' },
  { name: '氯化锌', formula: 'ZnCl₂', hazard: '腐蚀性', color: 'white', cas: '7646-85-7', molarMass: '136.30 g/mol', density: '2.91 g/cm³', appearance: '白色晶体', storageCondition: '密封干燥保存' },
  { name: '硝酸钾', formula: 'KNO₃', hazard: '氧化剂', color: 'white', cas: '7757-79-1', molarMass: '101.10 g/mol', density: '2.11 g/cm³', appearance: '白色晶体', storageCondition: '阴凉干燥处' },
  { name: '硫酸铝', formula: 'Al₂(SO₄)₃', hazard: '刺激性', color: 'white', cas: '10043-01-3', molarMass: '342.15 g/mol', density: '2.71 g/cm³', appearance: '白色粉末', storageCondition: '干燥处保存' },
  { name: '氯化铝', formula: 'AlCl₃', hazard: '腐蚀性', color: 'white', cas: '7446-70-0', molarMass: '133.34 g/mol', density: '2.44 g/cm³', appearance: '白色晶体', storageCondition: '密封干燥保存' },
  { name: '硫酸铵', formula: '(NH₄)₂SO₄', hazard: '无', color: 'white', cas: '7783-20-2', molarMass: '132.14 g/mol', density: '1.77 g/cm³', appearance: '白色晶体', storageCondition: '干燥处保存' },
  { name: '氯化铵', formula: 'NH₄Cl', hazard: '刺激性', color: 'white', cas: '12125-02-9', molarMass: '53.49 g/mol', density: '1.53 g/cm³', appearance: '白色晶体', storageCondition: '干燥处保存' },
  { name: '硝酸铵', formula: 'NH₄NO₃', hazard: '氧化剂', color: 'white', cas: '6484-52-2', molarMass: '80.04 g/mol', density: '1.72 g/cm³', appearance: '白色晶体', storageCondition: '阴凉干燥处' },
  { name: '碳酸钙', formula: 'CaCO₃', hazard: '无', color: 'white', cas: '471-34-1', molarMass: '100.09 g/mol', density: '2.71 g/cm³', appearance: '白色粉末', storageCondition: '干燥处保存' },
  { name: '氧化钙', formula: 'CaO', hazard: '腐蚀性', color: 'white', cas: '1305-78-8', molarMass: '56.08 g/mol', density: '3.34 g/cm³', appearance: '白色粉末', storageCondition: '密封干燥保存' },
  { name: '二氧化硅', formula: 'SiO₂', hazard: '无', color: 'white', cas: '7631-86-9', molarMass: '60.08 g/mol', density: '2.65 g/cm³', appearance: '白色粉末', storageCondition: '干燥处保存' },
  { name: '氧化铁', formula: 'Fe₂O₃', hazard: '无', color: 'red', cas: '1309-37-1', molarMass: '159.69 g/mol', density: '5.24 g/cm³', appearance: '红棕色粉末', storageCondition: '干燥处保存' },
  { name: '氧化铜', formula: 'CuO', hazard: '刺激性', color: 'black', cas: '1317-38-0', molarMass: '79.55 g/mol', density: '6.31 g/cm³', appearance: '黑色粉末', storageCondition: '干燥处保存' },
  { name: '氧化锌', formula: 'ZnO', hazard: '无', color: 'white', cas: '1314-13-2', molarMass: '81.38 g/mol', density: '5.61 g/cm³', appearance: '白色粉末', storageCondition: '干燥处保存' },
  { name: '氧化镁', formula: 'MgO', hazard: '刺激性', color: 'white', cas: '1309-48-4', molarMass: '40.30 g/mol', density: '3.58 g/cm³', appearance: '白色粉末', storageCondition: '干燥处保存' },
  { name: '氧化铝', formula: 'Al₂O₃', hazard: '无', color: 'white', cas: '1344-28-1', molarMass: '101.96 g/mol', density: '3.95 g/cm³', appearance: '白色粉末', storageCondition: '干燥处保存' },
  { name: '硫磺', formula: 'S', hazard: '易燃', color: 'yellow', cas: '7704-34-9', molarMass: '32.07 g/mol', density: '2.07 g/cm³', appearance: '黄色粉末', storageCondition: '阴凉干燥处，远离火源' },
  { name: '碘', formula: 'I₂', hazard: '刺激性', color: 'purple', cas: '7553-56-2', molarMass: '253.81 g/mol', density: '4.93 g/cm³', appearance: '紫黑色晶体', storageCondition: '避光密封保存' },
  { name: '溴', formula: 'Br₂', hazard: '强腐蚀性', color: 'red', cas: '7726-95-6', molarMass: '159.81 g/mol', density: '3.12 g/cm³', appearance: '红棕色液体', storageCondition: '阴凉通风处，密封保存' },
  { name: '氯气', formula: 'Cl₂', hazard: '有毒', color: 'yellow', cas: '7782-50-5', molarMass: '70.91 g/mol', density: '3.21 g/L', appearance: '黄绿色气体', storageCondition: '通风橱中，密封保存' },
  { name: '氢气', formula: 'H₂', hazard: '易燃', color: 'clear', cas: '1333-74-0', molarMass: '2.02 g/mol', density: '0.09 g/L', appearance: '无色气体', storageCondition: '通风处，远离火源' },
  { name: '氧气', formula: 'O₂', hazard: '氧化剂', color: 'clear', cas: '7782-44-7', molarMass: '32.00 g/mol', density: '1.43 g/L', appearance: '无色气体', storageCondition: '阴凉通风处' },
  { name: '氮气', formula: 'N₂', hazard: '无', color: 'clear', cas: '7727-37-9', molarMass: '28.01 g/mol', density: '1.25 g/L', appearance: '无色气体', storageCondition: '通风处保存' },
  { name: '二氧化碳', formula: 'CO₂', hazard: '窒息性', color: 'clear', cas: '124-38-9', molarMass: '44.01 g/mol', density: '1.98 g/L', appearance: '无色气体', storageCondition: '通风处保存' },
  { name: '一氧化碳', formula: 'CO', hazard: '有毒', color: 'clear', cas: '630-08-0', molarMass: '28.01 g/mol', density: '1.25 g/L', appearance: '无色气体', storageCondition: '通风橱中保存' },
  { name: '氨气', formula: 'NH₃', hazard: '腐蚀性', color: 'clear', cas: '7664-41-7', molarMass: '17.03 g/mol', density: '0.77 g/L', appearance: '无色气体', storageCondition: '通风橱中保存' },
  { name: '硫化氢', formula: 'H₂S', hazard: '有毒', color: 'clear', cas: '7783-06-4', molarMass: '34.08 g/mol', density: '1.54 g/L', appearance: '无色气体', storageCondition: '通风橱中保存' },
  { name: '二氧化硫', formula: 'SO₂', hazard: '有毒', color: 'clear', cas: '7446-09-5', molarMass: '64.07 g/mol', density: '2.93 g/L', appearance: '无色气体', storageCondition: '通风橱中保存' },
  { name: '氯化氢', formula: 'HCl', hazard: '腐蚀性', color: 'clear', cas: '7647-01-0', molarMass: '36.46 g/mol', density: '1.64 g/L', appearance: '无色气体', storageCondition: '通风橱中保存' },
  { name: '氟化氢', formula: 'HF', hazard: '强腐蚀性', color: 'clear', cas: '7664-39-3', molarMass: '20.01 g/mol', density: '0.91 g/L', appearance: '无色气体', storageCondition: '专用通风橱中保存' }
]

// 状态选项 - 优化后的状态逻辑
const statusOptions = [
  '在库',      // 试剂瓶在柜中，有剩余容量，可正常使用
  '已借出',    // 部分试剂已被借出使用
  '已过期'     // 超过有效期
]

// 容量选项 (ml)
const capacityOptions = [100, 250, 500, 1000, 2500, 5000]

// 存储室选项
const storageRooms = ['存储室1号', '存储室2号', '危化品室', '有机试剂室', '无机试剂室']

// 生成随机位置编号 (柜-层-排-位)
function generatePosition(cabinetIndex, shelfIndex, bottleIndex) {
  const cabinet = cabinetIndex + 1
  const shelf = shelfIndex + 1
  const row = Math.floor(bottleIndex / 5) + 1
  const position = (bottleIndex % 5) + 1
  return `${cabinet}-${shelf}-${row}-${position}`
}

// 生成随机日期
function generateDate(daysAgo) {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}

// 生成试剂数据
export function generateReagentData() {
  const reagents = []
  let id = 1
  
  // 容量选项
  const capacityOptions = [100, 250, 500, 1000, 2500]
  // 存储室选项
  const storageRooms = ['无机试剂室', '有机试剂室', '危化品室', '存储室1号', '存储室2号']
  
  // 药品柜UID映射 - 完整的柜子分布
  const cabinetUids = [
    '药品柜1号', '药品柜2号', '药品柜3号', '药品柜4号', 
    '腐蚀品柜1号', '腐蚀品柜2号', '腐蚀品柜3号', '腐蚀品柜4号',
    'PP安全柜1号', 'PP安全柜2号', 'PP安全柜3号'
  ]
  
  // 每个柜子的位置计数器，确保每个柜子内部依次排列
  const cabinetPositionCounters = {}
  cabinetUids.forEach(uid => {
    cabinetPositionCounters[uid] = 0
  })
  
  // 获取柜子的每层位置数
  const getPositionsPerShelf = (cabinetUid) => {
    if (cabinetUid.includes('药品柜')) return 5 // 普通药品柜每层5个
    return 4 // 腐蚀品柜和PP安全柜每层4个
  }
  
  // 生成恰好80个试剂，按指定分布
  for (let i = 0; i < 80; i++) {
    const reagent = reagentDatabase[i % reagentDatabase.length] // 循环使用试剂类型确保多样性
    const capacity = capacityOptions[Math.floor(Math.random() * capacityOptions.length)]
    
    let status
    let currentAmount
    let borrowedAmount = 0
    let borrowerInfo = null
    let expiryDate = new Date()
    let cabinetUid = null
    let position = null
    
    // 按指定数量分配状态
    // 总计80个：在库75个(包含部分借出) + 已过期5个 = 80个
    if (i < 75) {
      // 在库 75个 - 分配到具体柜子位置，其中一些可能有借出记录
      status = '在库'
      currentAmount = Math.floor(Math.random() * capacity * 0.6) + Math.floor(capacity * 0.3) // 30-90%容量
      expiryDate.setDate(expiryDate.getDate() + Math.floor(Math.random() * 365) + 30) // 未来30-395天过期
      
      // 前40个在库试剂设置为有借出记录
      if (i < 40) {
        borrowedAmount = Math.floor(Math.random() * (capacity - currentAmount) * 0.5) + 30 // 借出30-250ml
        borrowerInfo = {
          borrowerName: ['张三', '李四', '王五', '赵六', '陈七', '刘八'][i % 6],
          borrowerPhone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
          borrowDate: generateDate(Math.floor(Math.random() * 7)), // 最近7天内借出
          expectedReturnDate: generateDate(-Math.floor(Math.random() * 7) - 1), // 未来1-7天归还
          purpose: ['实验研究', '课程教学', '项目开发', '质量检测'][i % 4]
        }
      }
      
      // 轮流分配到各个柜子，确保均匀分布
      const cabinetIndex = i % cabinetUids.length
      cabinetUid = cabinetUids[cabinetIndex]
      
      // 获取该柜子当前的位置计数，然后递增
      const positionInCabinet = cabinetPositionCounters[cabinetUid]
      cabinetPositionCounters[cabinetUid]++
      
      // 计算层和位置（每个柜子内部从1-1开始依次排列）
      const positionsPerShelf = getPositionsPerShelf(cabinetUid)
      const shelf = Math.floor(positionInCabinet / positionsPerShelf) + 1
      const bottle = (positionInCabinet % positionsPerShelf) + 1
      position = `${shelf}-${bottle}`
      
    } else {
      // 已过期 5个 (75-79) - 不分配具体位置，需要清理
      status = '已过期'
      currentAmount = Math.floor(Math.random() * capacity * 0.8) + Math.floor(capacity * 0.1) // 10-90%容量
      expiryDate.setDate(expiryDate.getDate() - Math.floor(Math.random() * 60) - 1) // 过期1-60天
      position = `已过期-${id}`
    }
    
    const storageRoom = storageRooms[Math.floor(Math.random() * storageRooms.length)]
    
    reagents.push({
      id: `REG-${String(id).padStart(4, '0')}`,
      name: reagent.name,
      formula: reagent.formula,
      hazard: reagent.hazard,
      status: status,
      capacity: capacity,
      currentAmount: currentAmount,
      borrowedAmount: borrowedAmount,
      borrowerInfo: borrowerInfo,
      storageRoom: storageRoom,
      position: position,
      cabinetUid: cabinetUid,
      lastUpdated: generateDate(Math.floor(Math.random() * 30)),
      expiryDate: expiryDate.toISOString().split('T')[0],
      supplier: ['国药集团', '西陇科学', '阿拉丁', '麦克林'][Math.floor(Math.random() * 4)],
      purity: ['AR', 'CP', 'GR', 'HPLC'][Math.floor(Math.random() * 4)],
      // 物理性质
      cas: reagent.cas,
      molarMass: reagent.molarMass,
      density: reagent.density,
      meltingPoint: reagent.meltingPoint,
      boilingPoint: reagent.boilingPoint,
      solubility: reagent.solubility,
      appearance: reagent.appearance,
      storageCondition: reagent.storageCondition,
      ghsSymbols: reagent.ghsSymbols || [reagent.hazard],
    })
    id++
  }
  
  // 后处理：从在库试剂中设置库存不足和即将过期
  const today = new Date()
  
  // 从75个在库试剂中选择15个设置为库存不足（剩余量≤20%）
  let inStockReagents = reagents.filter(r => r.status === '在库')
  for (let i = 0; i < Math.min(15, inStockReagents.length); i++) {
    // 设置不同的库存不足量：5%-20%之间
    const lowStockPercent = Math.random() * 0.15 + 0.05 // 5%-20%
    inStockReagents[i].currentAmount = Math.floor(inStockReagents[i].capacity * lowStockPercent)
  }
  
  // 从75个在库试剂中选择10个设置为即将过期（30天内过期）
  for (let i = 15; i < Math.min(25, inStockReagents.length); i++) {
    const daysUntilExpiry = Math.floor(Math.random() * 25) + 1 // 1-25天后过期
    inStockReagents[i].expiryDate = new Date(today.getTime() + daysUntilExpiry * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }
  
  return reagents
}

// 位置管理功能
// 定义3D场景中的柜子配置
export const CABINET_CONFIG = {
  // 普通药品柜（左墙）
  regular: {
    count: 4,
    uids: ['药品柜1号', '药品柜2号', '药品柜3号', '药品柜4号'],
    bottlesPerCabinet: 20, // 每个柜子20个位置
    shelves: 4,
    bottlesPerShelf: 5
  },
  // 腐蚀品柜（右墙）
  corrosive: {
    count: 2,
    uids: ['腐蚀品柜1号', '腐蚀品柜2号'],
    bottlesPerCabinet: 20,
    shelves: 4,
    bottlesPerShelf: 5
  },
  // PP安全柜（后墙）
  safety: {
    count: 2,
    uids: ['PP安全柜1号', 'PP安全柜2号'],
    bottlesPerCabinet: 12, // 安全柜容量较小
    shelves: 3,
    bottlesPerShelf: 4
  }
}

// 获取下一个可用位置
export function getNextAvailablePosition(existingReagents) {
  const allCabinets = [
    ...CABINET_CONFIG.regular.uids,
    ...CABINET_CONFIG.corrosive.uids,
    ...CABINET_CONFIG.safety.uids
  ]
  
  // 统计每个柜子的使用情况
  const cabinetUsage = {}
  allCabinets.forEach(uid => {
    cabinetUsage[uid] = existingReagents.filter(r => r.cabinetUid === uid).length
  })
  
  // 找到使用率最低的柜子
  let targetCabinet = null
  let minUsage = Infinity
  
  for (const [cabinetUid, usage] of Object.entries(cabinetUsage)) {
    const maxCapacity = getCabinetCapacity(cabinetUid)
    if (usage < maxCapacity && usage < minUsage) {
      minUsage = usage
      targetCabinet = cabinetUid
    }
  }
  
  if (!targetCabinet) {
    // 所有柜子都满了，返回第一个柜子（会覆盖）
    targetCabinet = allCabinets[0]
  }
  
  // 生成该柜子的下一个位置编号
  const positionInCabinet = cabinetUsage[targetCabinet]
  const config = getCabinetConfig(targetCabinet)
  const shelf = Math.floor(positionInCabinet / config.bottlesPerShelf) + 1 // 层数从1开始
  const bottle = (positionInCabinet % config.bottlesPerShelf) + 1 // 位置从1开始
  
  return {
    cabinetUid: targetCabinet,
    position: `${shelf}-${bottle}`, // 简化的位置格式：层-位置
    storageRoom: getStorageRoomForCabinet(targetCabinet)
  }
}

// 获取柜子容量
function getCabinetCapacity(cabinetUid) {
  if (cabinetUid.includes('药品柜')) return CABINET_CONFIG.regular.bottlesPerCabinet
  if (cabinetUid.includes('腐蚀品柜')) return CABINET_CONFIG.corrosive.bottlesPerCabinet
  if (cabinetUid.includes('PP安全柜')) return CABINET_CONFIG.safety.bottlesPerCabinet
  return 20 // 默认容量
}

// 获取柜子配置
function getCabinetConfig(cabinetUid) {
  if (cabinetUid.includes('药品柜')) return CABINET_CONFIG.regular
  if (cabinetUid.includes('腐蚀品柜')) return CABINET_CONFIG.corrosive
  if (cabinetUid.includes('PP安全柜')) return CABINET_CONFIG.safety
  return CABINET_CONFIG.regular // 默认配置
}

// 获取柜子索引
function getCabinetIndex(cabinetUid) {
  const allCabinets = [
    ...CABINET_CONFIG.regular.uids,
    ...CABINET_CONFIG.corrosive.uids,
    ...CABINET_CONFIG.safety.uids
  ]
  return allCabinets.indexOf(cabinetUid)
}

// 根据柜子类型获取存储室
function getStorageRoomForCabinet(cabinetUid) {
  if (cabinetUid.includes('药品柜')) return '无机试剂室'
  if (cabinetUid.includes('腐蚀品柜')) return '危化品室'
  if (cabinetUid.includes('PP安全柜')) return '有机试剂室'
  return '存储室1号' // 默认存储室
}

// 创建新试剂
export function createNewReagent(reagentInfo, existingReagents) {
  const nextId = Math.max(...existingReagents.map(r => parseInt(r.id.replace('REG-', ''))), 0) + 1
  const position = getNextAvailablePosition(existingReagents)
  
  // 从数据库中随机选择一个试剂作为模板（如果没有提供完整信息）
  const template = reagentDatabase[Math.floor(Math.random() * reagentDatabase.length)]
  
  return {
    id: `REG-${String(nextId).padStart(4, '0')}`,
    name: reagentInfo.name || template.name,
    formula: reagentInfo.formula || template.formula,
    hazard: reagentInfo.hazard || template.hazard,
    status: reagentInfo.status || '在库',
    capacity: reagentInfo.capacity || 500,
    currentAmount: reagentInfo.currentAmount || reagentInfo.capacity || 500,
    storageRoom: position.storageRoom,
    position: position.position,
    cabinetUid: position.cabinetUid,
    lastUpdated: new Date().toISOString().split('T')[0],
    expiryDate: reagentInfo.expiryDate || generateDate(-365), // 1年后过期
    supplier: reagentInfo.supplier || '国药集团',
    purity: reagentInfo.purity || 'AR',
    // 物理性质
    cas: reagentInfo.cas || template.cas,
    molarMass: reagentInfo.molarMass || template.molarMass,
    density: reagentInfo.density || template.density,
    meltingPoint: reagentInfo.meltingPoint || template.meltingPoint,
    boilingPoint: reagentInfo.boilingPoint || template.boilingPoint,
    solubility: reagentInfo.solubility || template.solubility,
    appearance: reagentInfo.appearance || template.appearance,
    storageCondition: reagentInfo.storageCondition || template.storageCondition,
    ghsSymbols: reagentInfo.ghsSymbols || template.ghsSymbols || [template.hazard],
  }
}

export default reagentDatabase
