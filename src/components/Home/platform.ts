// 外围系统配置
export const peripheralsConfig = {
  'edge-platform': {
    label: 'Edge Platform',
    offset: { x: 326, y: -575 },
    base: { width: 260, height: 240 },
    component: { width: 140, height: 160, x: 55, y: -37 },
    visible: true
  },
  'simulation-platform': {
    label: 'Simulation Platform',
    offset: { x: 431, y: 150 },
    base: { width: 260, height: 240 },
    component: { width: 160, height: 180, x: 53, y: -21 },
    visible: true
  },
  'data-manage-platform': {
    label: 'Data Management Platform',
    offset: { x: -736, y: -562 },
    base: { width: 260, height: 240 },
    component: { width: 150, height: 140, x: 52, y: 0 },
    visible: true
  },
  'parent-system': {
    label: 'Parent System',
    offset: { x: -626, y: 210 },
    base: { width: 260, height: 240 },
    component: { width: 130, height: 140, x: 49, y: -26 },
    visible: true
  },
  'operator': {
    label: 'Operator',
    offset: { x: -703, y: 313 },
    component: { width: 120, height: 120 },
    visible: true
  }
};

// 主平台配置
export const platformConfig = {
  'platform-base': {
    label: 'Platform Base',
    size: { width: 1080, height: 900 },
    offset: { x: -42, y: -24 },
    visible: true
  }
};

// 业务模块配置
export const businessModulesConfig = {
  'data-processing': {
    label: '数据处理',
    size: { width: 380, height: undefined },
    offset: { x: 32, y: 107 },
    visible: true
  },
  'data-mart': {
    label: '数据集',
    size: { width: 380, height: undefined },
    offset: { x: 266, y: -32 },
    visible: true
  },
  'algo-runtime': {
    label: '算法演进',
    size: { width: 380, height: undefined },
    offset: { x: 313, y: 276 },
    visible: true
  },
  'algo-repo': {
    label: '算法仓',
    size: { width: 380, height: undefined },
    offset: { x: 546, y: 135 },
    visible: true
  }
};