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
} as const;

export const UNIFIED_BEAM_THEME = beamColorThemes.techBlue;

export const baseBeamConfig = {
  pathWidth: 4,
  curvature: 0.3,

  beamLength: 0.4,
  beamIntensity: 0.9,
  beamHeadWidth: 2,

  enableGlow: true,
  enableInnerBeam: true,
  enablePulse: false,

  pulseInterval: 3,
  pulseDuration: 3.0,
  pulseSize: 10,

  enableParticles: false,
  particleCount: 20,
  particleSize: 5,
  particleOpacity: 0.8,

  duration: 4,
  delay: 0.5,

  enableRightAngle: false,
  turnPosition: 1,
  cornerRadius: 25,
} as const;

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
} as const;

const createScenario = (
  connectionType: keyof typeof beamVariants,
  visualType: keyof typeof beamVariants,
  pulsePhase?: keyof typeof beamVariants,
  dataType?: keyof typeof beamVariants,
  customConfig: Record<string, any> = {}
) => ({
  ...baseBeamConfig,
  ...UNIFIED_BEAM_THEME,
  ...beamVariants[connectionType],
  ...beamVariants[visualType],
  ...(pulsePhase ? beamVariants[pulsePhase] : {}),
  ...(dataType ? beamVariants[dataType] : {}),
  ...customConfig,
});

export const beamScenarios = {
  algoToEdge: createScenario('rightAngle', 'standard', 'pulsePhase1', undefined, {
    endXOffset: 35,
    endYOffset: 140,
    startXOffset: -9,
    startYOffset: -50,
    className: 'algo-to-edge-beam',
  }),

  parentToRuntime: createScenario('straight', 'enhanced', 'pulsePhase2', undefined, {
    delay: 1,
    startXOffset: 45,
    startYOffset: -48,
    endXOffset: -86,
    endYOffset: 88,
    className: 'parent-to-runtime-beam',
  }),

  runtimeToSimulation: createScenario('rightAngle', 'standard', 'pulsePhase3', undefined, {
    delay: 1.5,
    startXOffset: 160,
    startYOffset: 80,
    endXOffset: -245,
    endYOffset: 135,
    turnDirection: 'vertical-first',
    className: 'runtime-to-simulation-beam',
  }),

  dataManageToProcessing: createScenario('rightAngle', 'standard', 'pulsePhase4', 'dataTransfer', {
    delay: 0.8,
    startXOffset: -70,
    startYOffset: 135,
    endXOffset: -30,
    endYOffset: 0,
    turnDirection: 'vertical-first',
    className: 'data-manage-to-processing-beam',
  }),

  dataManageToMart: createScenario('rightAngle', 'enhanced', 'pulsePhase1', undefined, {
    delay: 1.2,
    startXOffset: 60,
    startYOffset: 54,
    endXOffset: 324,
    endYOffset: 0,
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
    startXOffset: 50,
    startYOffset: -45,
    endXOffset: -65,
    endYOffset: 25,
    className: 'data-processing-to-mart-beam',
  }),

  runtimeToRepo: createScenario('straight', 'subtle', 'pulsePhase3', 'algorithmFlow', {
    delay: 2.0,
    startXOffset: 172,
    startYOffset: -80,
    endXOffset: 57,
    endYOffset: 25,
    className: 'runtime-to-repo-beam',
  }),

  dataProcessingToRuntime: createScenario('straight', 'enhanced', 'pulsePhase4', 'dataTransfer', {
    delay: 1.5,
    startXOffset: 70,
    startYOffset: 50,
    endXOffset: -85,
    endYOffset: -45,
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
} as const;

export function createBeamConfig(
  scenario: keyof typeof beamScenarios,
  customConfig: Partial<typeof baseBeamConfig & { className?: string }> = {}
) {
  return {
    ...beamScenarios[scenario],
    ...customConfig,
  };
}

export function createColoredBeamConfig(
  baseScenario: keyof typeof beamScenarios,
  colorTheme: keyof typeof beamColorThemes,
  customConfig: Partial<typeof baseBeamConfig> = {}
) {
  return {
    ...beamScenarios[baseScenario],
    ...beamColorThemes[colorTheme],
    ...customConfig,
  };
}

export function createUnifiedThemeScenarios(theme: keyof typeof beamColorThemes) {
  const themeColor = beamColorThemes[theme];

  const themedScenarios: Record<string, any> = {};

  Object.entries(beamScenarios).forEach(([key, config]) => {
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
} as const;

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
} as const;

export type BeamColorTheme = keyof typeof beamColorThemes;
export type BeamScenario = keyof typeof beamScenarios;
export type BeamVariant = keyof typeof beamVariants;
export type BeamConfig = typeof baseBeamConfig;
