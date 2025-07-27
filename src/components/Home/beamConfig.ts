import { getAllResponsiveBeamOffsets } from '../../utils/responsiveBeamOffsets'

export const beamColorThemes = {
  techBlue: {
    pathColor: 'rgba(37, 113, 182, 0.2)',
    gradientStartColor: '#4ecdc4',
    gradientStopColor: '#45b7d1',
  },

  ecoGreen: {
    pathColor: 'rgba(76, 175, 80, 0.2)',
    gradientStartColor: '#4ecdc4',
    gradientStopColor: '#45b7d1',
  },

  mysteryPurple: {
    pathColor: 'rgba(156, 39, 176, 0.2)',
    gradientStartColor: '#9c27b0',
    gradientStopColor: '#e91e63',
  },

  energyOrange: {
    pathColor: 'rgba(255, 152, 0, 0.2)',
    gradientStartColor: '#ff9800',
    gradientStopColor: '#ff5722',
  },
};

export const UNIFIED_BEAM_THEME = beamColorThemes.techBlue;

export const baseBeamConfig = {
  pathWidth: 4,
  curvature: 0.3,

  beamLength: 0.4,
  beamIntensity: 0.9,
  beamHeadWidth: 2,

  enableGlow: false,  // 性能模式：关闭发光效果
  enableInnerBeam: true,
  enablePulse: true,

  pulseInterval: 5,  // 性能模式：降低脉冲频率
  pulseDuration: 3.0,
  pulseSize: 10,

  enableParticles: false,  // 性能模式：关闭粒子效果
  particleCount: 20,
  particleSize: 5,
  particleOpacity: 0.8,

  duration: 3,  // 性能模式：缩短动画时长
  delay: 0.5,

  enableRightAngle: false,
  turnPosition: 1,
  cornerRadius: 25,
  enableMotionBlur: false,  // 性能模式：关闭运动模糊
};

export const beamVariants = {
  straight: {
    curvature: 0,
    duration: 3,
  },

  curved: {
    curvature: 1,
    duration: 4,
  },

  rightAngle: {
    enableRightAngle: true,
    duration: 5,
  },

  standard: {
  },

  enhanced: {
    beamIntensity: 1.2,
    beamLength: 0.6,
    glowSize: 3.0,
  },

  subtle: {
    beamIntensity: 0.7,
    beamLength: 0.3,
    enablePulse: false,
  },

  pulsePhase1: {
    pulseInterval: 4,
    pulseDuration: 2.5,
    pulseDelay: 0,
  },

  pulsePhase2: {
    pulseInterval: 4,
    pulseDuration: 2.5,
    pulseDelay: 1.3,
  },

  pulsePhase3: {
    pulseInterval: 4,
    pulseDuration: 2.5,
    pulseDelay: 2.6,
  },

  pulsePhase4: {
    pulseInterval: 4,
    pulseDuration: 2.5,
    pulseDelay: 3.9,
  },

  dataTransfer: {
    particleCount: 20,
    particleSize: 5,
    particleSpeed: 0.8,
  },

  fastTransfer: {
    particleCount: 12,
    particleSize: 3,
    particleSpeed: 1.0,
  },

  algorithmFlow: {
    particleCount: 8,
    particleSize: 4,
    particleSpeed: 0.7,
  },
};

const createScenario = (
  connectionType,
  visualType,
  pulsePhase,
  dataType,
  customConfig = {}
) => ({
  ...baseBeamConfig,
  ...UNIFIED_BEAM_THEME,
  ...beamVariants[connectionType],
  ...beamVariants[visualType],
  ...(pulsePhase ? beamVariants[pulsePhase] : {}),
  ...(dataType ? beamVariants[dataType] : {}),
  ...customConfig,
});

/**
 * 创建响应式的 beam 场景配置
 * @param currentWidth - 当前屏幕宽度
 * @param scaleFactor - 当前缩放因子
 * @returns 响应式的 beam 场景配置
 */
export function createResponsiveBeamScenarios(currentWidth, scaleFactor) {
  const responsiveOffsets = getAllResponsiveBeamOffsets(currentWidth, scaleFactor);

  console.log('createResponsiveBeamScenarios called with:', { currentWidth, scaleFactor });
  console.log('responsiveOffsets.algoToEdge', responsiveOffsets.algoToEdge);

  return {
    algoToEdge: createScenario('rightAngle', 'standard', 'pulsePhase1', undefined, {
      ...responsiveOffsets.algoToEdge,
      className: 'algo-to-edge-beam',
    }),

    parentToRuntime: createScenario('straight', 'enhanced', 'pulsePhase2', undefined, {
      delay: 1,
      ...responsiveOffsets.parentToRuntime,
      className: 'parent-to-runtime-beam',
    }),

    runtimeToSimulation: createScenario('rightAngle', 'standard', 'pulsePhase3', undefined, {
      delay: 1.5,
      ...responsiveOffsets.runtimeToSimulation,
      turnDirection: 'vertical-first',
      className: 'runtime-to-simulation-beam',
    }),

    dataManageToProcessing: createScenario('rightAngle', 'standard', 'pulsePhase4', 'dataTransfer', {
      delay: 0.8,
      ...responsiveOffsets.dataManageToProcessing,
      turnDirection: 'vertical-first',
      className: 'data-manage-to-processing-beam',
    }),

    dataManageToMart: createScenario('rightAngle', 'enhanced', 'pulsePhase1', undefined, {
      delay: 1.2,
      ...responsiveOffsets.dataManageToMart,
      turnDirection: 'vertical-first',
      enableParticles: true,
      particleCount: 6,
      particleSize: 5,
      particleOpacity: 1.0,
      particleSpeed: 0.6,
      glowSize: 2.5,
      className: 'data-manage-to-mart-beam',
    }),

    dataProcessingToMart: createScenario('straight', 'subtle', 'pulsePhase2', 'fastTransfer', {
      delay: 2.0,
      ...responsiveOffsets.dataProcessingToMart,
      className: 'data-processing-to-mart-beam',
    }),

    runtimeToRepo: createScenario('straight', 'subtle', 'pulsePhase3', 'algorithmFlow', {
      delay: 2.0,
      ...responsiveOffsets.runtimeToRepo,
      className: 'runtime-to-repo-beam',
    }),

    dataProcessingToRuntime: createScenario('straight', 'enhanced', 'pulsePhase4', 'dataTransfer', {
      delay: 1.5,
      ...responsiveOffsets.dataProcessingToRuntime,
      enablePulse: false,
      beamIntensity: 0.7,
      beamLength: 0.3,
      className: 'data-processing-to-runtime-beam',
    }),

    dataFlow: createScenario('straight', 'enhanced', 'pulsePhase4', 'fastTransfer', {
      className: 'data-flow-beam',
    }),

    controlSignal: createScenario('straight', 'enhanced', 'pulsePhase1', undefined, {
      pathWidth: 2,
      enableMotionBlur: true,
      className: 'control-signal-beam',
    }),
  };
}

// 注意：beamScenarios 现在应该在需要时动态创建，而不是静态导出
// export const beamScenarios = createResponsiveBeamScenarios(1920, 0.72);

export function createBeamConfig(
  scenario: keyof ReturnType<typeof createResponsiveBeamScenarios>,
  customConfig: Partial<typeof baseBeamConfig & { className?: string }> = {},
  currentWidth?: number,
  scaleFactor?: number
) {
  const scenarios = createResponsiveBeamScenarios(currentWidth, scaleFactor);
  return {
    ...scenarios[scenario],
    ...customConfig,
  };
}

export function createColoredBeamConfig(
  baseScenario: keyof ReturnType<typeof createResponsiveBeamScenarios>,
  colorTheme: keyof typeof beamColorThemes,
  customConfig: Partial<typeof baseBeamConfig> = {},
  currentWidth?: number,
  scaleFactor?: number
) {
  const scenarios = createResponsiveBeamScenarios(currentWidth, scaleFactor);
  return {
    ...scenarios[baseScenario],
    ...beamColorThemes[colorTheme],
    ...customConfig,
  };
}

export function createUnifiedThemeScenarios(
  theme: keyof typeof beamColorThemes,
  currentWidth?: number,
  scaleFactor?: number
) {
  const themeColor = beamColorThemes[theme];
  const scenarios = createResponsiveBeamScenarios(currentWidth, scaleFactor);

  const themedScenarios: Record<string, any> = {};

  Object.entries(scenarios).forEach(([key, config]) => {
    themedScenarios[key] = {
      ...config,
      ...themeColor,
    };
  });

  return themedScenarios;
}

export const performanceBeamConfig = {
  ...baseBeamConfig,
  enableGlow: false,
  enableParticles: false,
  enableMotionBlur: false,
  pulseInterval: 5,
  duration: 3,
};

export const enhancedBeamConfig = {
  ...baseBeamConfig,
  enableGlow: true,
  enableParticles: true,
  enableMotionBlur: true,
  enablePulse: true,
  beamIntensity: 1.2,
  glowSize: 3.0,
  particleCount: 15,
  pulseInterval: 1,
  motionBlurIntensity: 15,
};

export type BeamColorTheme = keyof typeof beamColorThemes;
export type BeamScenario = keyof ReturnType<typeof createResponsiveBeamScenarios>;
export type BeamVariant = keyof typeof beamVariants;
export type BeamConfig = typeof baseBeamConfig;
