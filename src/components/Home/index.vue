<template>
  <section
    ref="stage"
    class="stage"
    :style="cssVariables"
  >
    <img
      :src="HomeBgJpg"
      alt="背景"
      class="bg"
    />

    <div
      class="platform-wrapper"
      :style="wrapperTransform"
    >
      <div 
        ref="platform"
        class="platform-base-container"
        :class="getElementClasses('platforms', 'platform-base')"
        @mousedown="(e: MouseEvent) => handleMouseDown(e, 'platforms', 'platform-base')"
        @mouseenter="() => handleMouseEnter('platforms', 'platform-base')"
        @mouseleave="() => handleMouseLeave('platforms', 'platform-base')"
      >
        <h1 class="platform-title">智能算法演进平台</h1>
        
        <PlatformBase class="platform-base" />
        
        <div v-if="debuggerRef?.showDebugPanel" class="debug-label">
          Platform Base<br>
          <small>{{ platformConfig['platform-base'].offset.x }}, {{ platformConfig['platform-base'].offset.y }}</small>
        </div>
      </div>

      <BusinessModule
        ref="dataProcessingRef"
        id="data-processing-module"
        :config="businessModulesConfig['data-processing']"
        group-name="businessModules"
        item-key="data-processing"
      >
        <DataProcessing class="data-processing" /> 
      </BusinessModule>
      
      <BusinessModule
        ref="dataMartRef"
        id="data-mart-module"
        :config="businessModulesConfig['data-mart']"
        group-name="businessModules"
        item-key="data-mart"
      >
        <DataMart class="data-mart" :svg-size="80" />
      </BusinessModule>
      
      <BusinessModule
        ref="algoRepoRef"
        id="algo-repo-module"
        :config="businessModulesConfig['algo-repo']"
        group-name="businessModules"
        item-key="algo-repo"
      >
        <AlgoRepo class="algo-repo" :svg-size="80" />
      </BusinessModule>
      
      <BusinessModule
        ref="algoRuntimeRef"
        id="algo-runtime-module"
        :config="businessModulesConfig['algo-runtime']"
        group-name="businessModules"
        item-key="algo-runtime"
      >
        <AlgoRuntime class="algo-runtime" />
      </BusinessModule>

      <div 
        ref="edgePlatformRef"
        id="edge-platform-module"
        class="edge-platform"
        :class="getElementClasses('peripherals', 'edge-platform')"
        @mousedown="(e) => handleMouseDown(e, 'peripherals', 'edge-platform')"
        @mouseenter="() => handleMouseEnter('peripherals', 'edge-platform')"
        @mouseleave="() => handleMouseLeave('peripherals', 'edge-platform')"
      >
        <OuterBase class="outer-base" />
        <img 
          :src="EdgePlatformGif"
          alt="边缘平台"
          class="peripheral-component edge-platform-gif"
          :class="getElementClasses('components', 'edge-platform-component')"
          @mousedown="(e: MouseEvent) => handleComponentMouseDown(e, 'components', 'edge-platform-component')"
          @mouseenter="() => handleMouseEnter('components', 'edge-platform-component')"
          @mouseleave="() => handleMouseLeave('components', 'edge-platform-component')"
        />
        <h3 
          class="peripheral-title"
          @mouseenter="() => handleMouseEnter('peripherals', 'edge-platform')"
          @mouseleave="() => handleMouseLeave('peripherals', 'edge-platform')"
          @click="() => handleTitleClick('edge-platform', '边缘平台')"
        >边缘平台</h3>
        <div v-if="debuggerRef?.showDebugPanel" class="debug-label">
          Edge Platform<br>
          <small>{{ peripheralsConfig['edge-platform'].offset.x }}, {{ peripheralsConfig['edge-platform'].offset.y }}</small>
        </div>
        <div v-if="debuggerRef?.showDebugPanel" class="component-debug-label">
          Edge Component<br>
          <small>{{ peripheralsConfig['edge-platform'].component.x }}, {{ peripheralsConfig['edge-platform'].component.y }}</small>
        </div>
      </div>
      
      <div 
        ref="simulationPlatformRef"
        class="simulation-platform"
        :class="getElementClasses('peripherals', 'simulation-platform')"
        @mousedown="(e) => handleMouseDown(e, 'peripherals', 'simulation-platform')"
        @mouseenter="() => handleMouseEnter('peripherals', 'simulation-platform')"
        @mouseleave="() => handleMouseLeave('peripherals', 'simulation-platform')"
      >
        <OuterBase class="outer-base" />
        <img 
          :src="SimulationPlatformGif"
          alt="仿真平台"
          class="peripheral-component simulation-platform-gif"
          :class="getElementClasses('components', 'simulation-platform-component')"
          @mousedown="(e: MouseEvent) => handleComponentMouseDown(e, 'components', 'simulation-platform-component')"
          @mouseenter="() => handleMouseEnter('components', 'simulation-platform-component')"
          @mouseleave="() => handleMouseLeave('components', 'simulation-platform-component')"
        />
        <h3 
          class="peripheral-title"
          @mouseenter="() => handleMouseEnter('peripherals', 'simulation-platform')"
          @mouseleave="() => handleMouseLeave('peripherals', 'simulation-platform')"
          @click="() => handleTitleClick('simulation-platform', '仿真平台')"
        >仿真平台</h3>
        <div v-if="debuggerRef?.showDebugPanel" class="debug-label">
          Simulation Platform<br>
          <small>{{ peripheralsConfig['simulation-platform'].offset.x }}, {{ peripheralsConfig['simulation-platform'].offset.y }}</small>
        </div>
        <div
v-if="debuggerRef?.showDebugPanel"
class="component-debug-label">
          Simulation Component<br>
          <small>{{ peripheralsConfig['simulation-platform'].component.x }}, {{ peripheralsConfig['simulation-platform'].component.y }}</small>
        </div>
      </div>
      
      <div 
        ref="dataManagePlatformRef"
        class="data-manage-platform"
        :class="getElementClasses('peripherals', 'data-manage-platform')"
        @mousedown="(e) => handleMouseDown(e, 'peripherals', 'data-manage-platform')"
        @mouseenter="() => handleMouseEnter('peripherals', 'data-manage-platform')"
        @mouseleave="() => handleMouseLeave('peripherals', 'data-manage-platform')"
      >
        <OuterBase class="outer-base" />
        <img 
          :src="DataManagePlatformGif"
          alt="数据管理平台"
          class="peripheral-component data-manage-platform-gif"
          :class="getElementClasses('components', 'data-manage-platform-component')"
          @mousedown="(e: MouseEvent) => handleComponentMouseDown(e, 'components', 'data-manage-platform-component')"
          @mouseenter="() => handleMouseEnter('components', 'data-manage-platform-component')"
          @mouseleave="() => handleMouseLeave('components', 'data-manage-platform-component')"
        />
        <h3 
          class="peripheral-title"
          @mouseenter="() => handleMouseEnter('peripherals', 'data-manage-platform')"
          @mouseleave="() => handleMouseLeave('peripherals', 'data-manage-platform')"
          @click="() => handleTitleClick('data-manage-platform', '数据管理平台')"
        >数据管理平台</h3>
        <div
v-if="debuggerRef?.showDebugPanel"
class="debug-label">
          Data Manage Platform<br>
          <small>{{ peripheralsConfig['data-manage-platform'].offset.x }}, {{ peripheralsConfig['data-manage-platform'].offset.y }}</small>
        </div>
        <div
v-if="debuggerRef?.showDebugPanel"
class="component-debug-label">
          Data Component<br>
          <small>{{ peripheralsConfig['data-manage-platform'].component.x }}, {{ peripheralsConfig['data-manage-platform'].component.y }}</small>
        </div>
      </div>
      
      <div 
        ref="parentSystemRef"
        id="parent-system-module"
        class="parent-system"
        :class="getElementClasses('peripherals', 'parent-system')"
        @mousedown="(e) => handleMouseDown(e, 'peripherals', 'parent-system')"
        @mouseenter="() => handleMouseEnter('peripherals', 'parent-system')"
        @mouseleave="() => handleMouseLeave('peripherals', 'parent-system')"
      >
        <OuterBase class="outer-base" />
        <img 
          :src="ParentSystemGif"
          alt="上级系统"
          class="peripheral-component parent-system-gif"
          :class="getElementClasses('components', 'parent-system-component')"
          @mousedown="(e: MouseEvent) => handleComponentMouseDown(e, 'components', 'parent-system-component')"
          @mouseenter="() => handleMouseEnter('components', 'parent-system-component')"
          @mouseleave="() => handleMouseLeave('components', 'parent-system-component')"
        />
        <h3 
          class="peripheral-title"
          @mouseenter="() => handleMouseEnter('peripherals', 'parent-system')"
          @mouseleave="() => handleMouseLeave('peripherals', 'parent-system')"
          @click="() => handleTitleClick('parent-system', '上级系统')"
        >上级系统</h3>
        <div
v-if="debuggerRef?.showDebugPanel"
class="debug-label">
          Parent System<br>
          <small>{{ peripheralsConfig['parent-system'].offset.x }}, {{ peripheralsConfig['parent-system'].offset.y }}</small>
        </div>
        <div
v-if="debuggerRef?.showDebugPanel"
class="component-debug-label">
          Parent Component<br>
          <small>{{ peripheralsConfig['parent-system'].component.x }}, {{ peripheralsConfig['parent-system'].component.y }}</small>
        </div>
      </div>
      
      <div 
        class="operator"
        :class="getElementClasses('peripherals', 'operator')"
        @mousedown="(e) => handleMouseDown(e, 'peripherals', 'operator')"
        @mouseenter="() => handleMouseEnter('peripherals', 'operator')"
        @mouseleave="() => handleMouseLeave('peripherals', 'operator')"
      >
        <Operator class="operator-component" />
        <div
v-if="debuggerRef?.showDebugPanel"
class="debug-label">
          Operator<br>
          <small>{{ peripheralsConfig['operator'].offset.x }}, {{ peripheralsConfig['operator'].offset.y }}</small>
        </div>
      </div>
    </div>

    <AnimatedBeam
      v-if="algoRepoElement && edgePlatformElement && stage"
      :container-ref="stage"
      :from-ref="algoRepoElement"
      :to-ref="edgePlatformElement"
      v-bind="beamScenarios.algoToEdge"
    />

    <AnimatedBeam
      v-if="parentSystemElement && algoRuntimeElement && stage"
      :container-ref="stage"
      :from-ref="parentSystemElement"
      :to-ref="algoRuntimeElement"
      v-bind="beamScenarios.parentToRuntime"
    />

    <AnimatedBeam
      v-if="algoRuntimeElement && simulationPlatformElement && stage"
      :container-ref="stage"
      :from-ref="algoRuntimeElement"
      :to-ref="simulationPlatformElement"
      v-bind="beamScenarios.runtimeToSimulation"
    />

    <AnimatedBeam
      v-if="algoRuntimeElement && algoRepoElement && stage"
      :container-ref="stage"
      :from-ref="algoRuntimeElement"
      :to-ref="algoRepoElement"
      v-bind="beamScenarios.runtimeToRepo"
    />

    <AnimatedBeam
      v-if="dataManagePlatformElement && dataProcessingElement && stage"
      :container-ref="stage"
      :from-ref="dataManagePlatformElement"
      :to-ref="dataProcessingElement"
      v-bind="beamScenarios.dataManageToProcessing"
    />

    <AnimatedBeam
      v-if="dataManagePlatformElement && dataMartElement && stage"
      :container-ref="stage"
      :from-ref="dataMartElement"
      :to-ref="dataManagePlatformElement"
      v-bind="beamScenarios.dataManageToMart"
    />

    <AnimatedBeam
      v-if="dataProcessingElement && dataMartElement && stage"
      :container-ref="stage"
      :from-ref="dataProcessingElement"
      :to-ref="dataMartElement"
      v-bind="beamScenarios.dataProcessingToMart"
    />

    <AnimatedBeam
      v-if="dataProcessingElement && algoRuntimeElement && stage"
      :container-ref="stage"
      :from-ref="dataProcessingElement"
      :to-ref="algoRuntimeElement"
      v-bind="beamScenarios.dataProcessingToRuntime"
    />

    <Debugger
      ref="debuggerRef"
      :configs="debugConfigs as any"
      :get-scale="getScale"
      :is-dev-mode="isDevMode"
      @config-update="handleConfigUpdate"
      @start-drag="handleStartDrag"
      @export-config="handleExportConfig"
      @reset-config="handleResetConfig"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, provide, nextTick, withDefaults, defineProps } from 'vue';
import { useElementSize } from '@vueuse/core';
import gsap from 'gsap';
import { useResponsiveScale, getDynamicScaleFactor } from '@/utils/responsive';

import HomeBgJpg from '@/assets/svg/home-bg.jpg';
import PlatformBase from '@/assets/svg/platform-base.svg?component';
import EdgePlatformGif from '@/assets/svg/edge-platform.gif';
import SimulationPlatformGif from '@/assets/svg/simulation-platform.gif';
import DataManagePlatformGif from '@/assets/svg/data-manage-platform.gif';
import ParentSystemGif from '@/assets/svg/parent-system.gif';
import Operator from '@/assets/svg/operator.svg?component';
import OuterBase from '@/assets/svg/outer-base.svg?component';
import DataProcessing from '@/assets/svg/data-processing.svg?component';
import AlgoRuntime from '@/assets/svg/algo-runtime.svg?component';

import BusinessModule from './BusinessModule.vue';

import AlgoRepo from './AlgoRepo.vue';
import DataMart from './DataMart.vue';

import Debugger from './Debugger.vue';

import AnimatedBeam from './AnimatedBeam.vue';

import { createResponsiveBeamScenarios, createBeamConfig, createColoredBeamConfig } from './beamConfig';

import { peripheralsConfig as peripheralsData, platformConfig as platformData, businessModulesConfig as businessModulesData } from './platform';

const props = withDefaults(defineProps<{
  debugMode?: boolean;
  enableEntranceAnimation?: boolean;
}>(), {
  debugMode: false,
  enableEntranceAnimation: true
});

const isDevMode = ref(import.meta.env.DEV);
const debuggerRef = ref<InstanceType<typeof Debugger>>();

const algoRepoRef = ref<InstanceType<typeof BusinessModule>>();
const algoRuntimeRef = ref<InstanceType<typeof BusinessModule>>();
const dataProcessingRef = ref<InstanceType<typeof BusinessModule>>();
const dataMartRef = ref<InstanceType<typeof BusinessModule>>();
const edgePlatformRef = ref<HTMLElement>();
const dataManagePlatformRef = ref<HTMLElement>();
const parentSystemRef = ref<HTMLElement>();
const simulationPlatformRef = ref<HTMLElement>();

const algoRepoElement = computed(() => {
  const component = algoRepoRef.value;
  if (component) {
    const element = component.getElement?.();
    if (element) return element;
  }
  
  const fallbackElement = document.getElementById('algo-repo-module');
  return fallbackElement;
});

const edgePlatformElement = computed(() => {
  const element = edgePlatformRef.value || document.getElementById('edge-platform-module');
  return element;
});

const dataManagePlatformElement = computed(() => {
  const element = dataManagePlatformRef.value;
  return element;
});

const algoRuntimeElement = computed(() => {
  const component = algoRuntimeRef.value;
  if (component) {
    const element = component.getElement?.();
    if (element) return element;
  }
  
  const fallbackElement = document.getElementById('algo-runtime-module');
  return fallbackElement;
});

const parentSystemElement = computed(() => {
  const element = parentSystemRef.value || document.getElementById('parent-system-module');
  return element;
});

const simulationPlatformElement = computed(() => {
  const element = simulationPlatformRef.value || document.getElementById('simulation-platform-module');
  return element;
});

const dataProcessingElement = computed(() => {
  const component = dataProcessingRef.value;
  if (component) {
    const element = component.getElement?.();
    if (element) return element;
  }
  
  const fallbackElement = document.getElementById('data-processing-module');
  return fallbackElement;
});

const dataMartElement = computed(() => {
  const component = dataMartRef.value;
  if (component) {
    const element = component.getElement?.();
    if (element) return element;
  }
  
  const fallbackElement = document.getElementById('data-mart-module');
  return fallbackElement;
});

const peripheralsConfig = reactive(peripheralsData);

const platformConfig = reactive(platformData);

const businessModulesConfig = reactive(businessModulesData);

const debugConfigs = computed(() => ({
  peripherals: peripheralsConfig,
  platforms: platformConfig,
  businessModules: businessModulesConfig
}));

const createCustomBeamConfig = () => {
  return createBeamConfig('algoToEdge', {
    duration: 5,
    beamIntensity: 1.1,
    className: 'custom-beam'
  }, currentWidth.value, responsiveScaleFactor.value);
};

const createDataFlowBeam = (intensity = 1.0) => {
  return createBeamConfig('dataFlow', {
    beamIntensity: intensity,
    duration: 2 + Math.random(),
  }, currentWidth.value, responsiveScaleFactor.value);
};

const createPerformanceBeam = () => {
  return {
    ...beamScenarios.value.algoToEdge,
    enableGlow: false,
    enableParticles: false,
    enableMotionBlur: false,
    pulseInterval: 8,
    duration: 8,
  };
};

const hoverStates = reactive<{
  peripherals: Record<string, boolean>;
  platforms: Record<string, boolean>;
  components: Record<string, boolean>;
}>({
  peripherals: {},
  platforms: {},
  components: {}
});

const setHoverState = (group: string, key: string, isHovered: boolean) => {
  if (!(hoverStates as any)[group]) {
    (hoverStates as any)[group] = {};
  }
  (hoverStates as any)[group][key] = isHovered;
};

const isHovered = (group: string, key: string) => {
  return (hoverStates as any)[group]?.[key] || false;
};

const isDragging = (group: string, key: string) => {
  return debuggerRef.value?.isDragging && 
         debuggerRef.value?.dragTarget === `${group}-${key}`;
};

const getElementClasses = (group: string, key: string) => {
  const classes = [];
  
  if (debuggerRef.value?.showDebugPanel) {
    classes.push('debug-draggable');
  }
  
  if (isDragging(group, key)) {
    classes.push('debug-dragging');
  }
  
  if (isHovered(group, key) && !isDragging(group, key)) {
    classes.push('js-hover');
  }
  
  return classes;
};

const handleMouseEnter = (group: string, key: string) => {
  if (!isDragging(group, key)) {
    setHoverState(group, key, true);
  }
};

const handleTitleClick = (platformKey: string, platformName: string) => {
  
  const titleElement = document.querySelector(`.${platformKey} .peripheral-title`) as HTMLElement;
  if (titleElement) {
    titleElement.style.transform = 'translate(-50%, -50%) skew(-5deg, 30deg) scale(0.95)';
    setTimeout(() => {
      titleElement.style.transform = 'translate(-50%, -50%) skew(-5deg, 30deg)';
    }, 100);
  }
};

const handleMouseLeave = (group: string, key: string) => {
  setHoverState(group, key, false);
};

const handleMouseDown = (event: MouseEvent, group: string, key: string) => {
  if (!debuggerRef.value?.showDebugPanel) {
    return;
  }
  
  setHoverState(group, key, false);
  
  event.preventDefault();
  event.stopPropagation();
  
  const config = (debugConfigs.value as any)[group]?.[key];
  if (!config || !config.offset) {
    console.error(`❌ 配置不存在: ${group}.${key}`, debugConfigs.value);
    return;
  }
  
  const startX = event.clientX;
  const startY = event.clientY;
  const startConfig = { x: config.offset.x, y: config.offset.y };
  
  const onMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    const scale = getScale();
    const adjustedDeltaX = deltaX / scale;
    const adjustedDeltaY = deltaY / scale;
    
    config.offset.x = Math.round(startConfig.x + adjustedDeltaX);
    config.offset.y = Math.round(startConfig.y + adjustedDeltaY);
  };
  
  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    
  };
  
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

const handleComponentMouseDown = (event: MouseEvent, group: string, key: string) => {
  if (!debuggerRef.value?.showDebugPanel) {
    return;
  }
  
  
  setHoverState(group, key, false);
  
  event.preventDefault();
  event.stopPropagation();
  
  const platformKey = key.replace('-component', '');
  const config = (peripheralsConfig as any)[platformKey];
  if (!config || !config.component) {
    console.error(`❌ Component配置不存在: ${platformKey}`, config);
    return;
  }
  
  const startX = event.clientX;
  const startY = event.clientY;
  const startConfig = { x: config.component.x || 0, y: config.component.y || 0 };
  
  const onMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    const scale = getScale();
    const adjustedDeltaX = deltaX / scale;
    const adjustedDeltaY = deltaY / scale;
    
    const newX = Math.round(startConfig.x + adjustedDeltaX);
    const newY = Math.round(startConfig.y + adjustedDeltaY);
    
    if ('x' in config.component && 'y' in config.component) {
      config.component.x = newX;
      config.component.y = newY;
    }
    
  };
  
  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };
  
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

const handleStartDrag = (event: MouseEvent, group: string, key: string) => {
  const config = (debugConfigs.value as any)[group]?.[key];
  if (!config || !config.offset) {
    console.error(`❌ 配置不存在: ${group}.${key}`);
    return;
  }
  
  const startX = event.clientX;
  const startY = event.clientY;
  const startConfig = { x: config.offset.x, y: config.offset.y };
  
  const onMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    const scale = getScale();
    const adjustedDeltaX = deltaX / scale;
    const adjustedDeltaY = deltaY / scale;
    
    config.offset.x = Math.round(startConfig.x + adjustedDeltaX);
    config.offset.y = Math.round(startConfig.y + adjustedDeltaY);
  };
  
  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };
  
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

const handleConfigUpdate = (groupName: string, itemKey: string, config: any) => {
};

const handleExportConfig = (groupName?: string) => {
  if (groupName) {
    const config = (debugConfigs.value as any)[groupName];
    const configText = JSON.stringify(config, null, 2);
    navigator.clipboard.writeText(configText).then(() => {
      alert(`✅ ${groupName} 配置已复制到剪贴板！`);
    });
  } else {
    generateReplaceCode();
  }
};

const handleResetConfig = (groupName?: string) => {
  if (groupName) {
    console.log(`Reset ${groupName} config`);
  } else {
    resetConfig();
  }
};

const stage = ref<HTMLElement>();
const { width } = useElementSize(stage);

// 使用响应式缩放工具
const { 
  scaleFactor: responsiveScaleFactor, 
  currentWidth, 
  updateWidth,
  currentScreenType 
} = useResponsiveScale();

// 手动设置的缩放因子（保持向后兼容）
const manualScaleFactor = ref(0.72);

// 动态监听窗口大小变化
onMounted(() => {
  const handleResize = () => {
    updateWidth();
  };
  
  window.addEventListener('resize', handleResize);
  
  // 初始化
  updateWidth();
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
});

const getScale = () => {
  const currentWidth = width.value;
  const designWidth = 1920;
  
  // 使用响应式缩放因子，但保持原有的设计宽度比例逻辑
  const baseScale = responsiveScaleFactor.value;
  const ratioScale = Math.min(currentWidth / designWidth, 1.2);
  
  return Math.max(baseScale, ratioScale);
};

const wrapperTransform = computed(() => {
  const currentWidth = width.value;
  const designWidth = 1920;
  
  const scale = getScale() * 0.7; // 首页布局调整，动画画布缩小至70%
  
  const offsetY = currentWidth < 768 ? '5%' : '0';
  
  return {
    transform: `translate(-50%, calc(-50% + ${offsetY})) scale(${scale})`,
    transformOrigin: 'center center',
    '--scale-factor': scale
  };
});

// 添加调试信息和手动控制方法
const setCustomScaleFactor = (factor: number) => {
  manualScaleFactor.value = factor;
};

const getCurrentScaleInfo = () => {
  return {
    screenType: currentScreenType.value,
    currentWidth: currentWidth.value,
    scaleFactor: responsiveScaleFactor.value,
    actualScale: getScale()
  };
};

console.log('getCurrentScaleInfo', getCurrentScaleInfo())

// 创建响应式的 beam scenarios，添加防抖和缓存机制
const beamScenarios = computed(() => {
  const width = currentWidth.value;
  const scale = responsiveScaleFactor.value;
  
  // 添加调试日志，显示调用原因
  if (isDevMode.value) {
    console.log('🔄 beamScenarios computed triggered:', {
      width,
      scale,
      screenType: currentScreenType.value,
      reason: width !== currentWidth.value ? 'width changed' : 'scale changed'
    });
  }
  
  return createResponsiveBeamScenarios(width, scale);
});

// 暴露方法供外部调用
provide('scaleUtils', {
  setCustomScaleFactor,
  getCurrentScaleInfo,
  responsiveScaleFactor,
  currentScreenType
});

const cssVariables = computed(() => {
  const vars: Record<string, string> = {};
  
  Object.entries(peripheralsConfig).forEach(([key, config]) => {
    vars[`--${key}-offset-x`] = `${config.offset.x}px`;
    vars[`--${key}-offset-y`] = `${config.offset.y}px`;
    
    if ('base' in config && config.base) {
      vars[`--${key}-base-width`] = `${config.base.width}px`;
      vars[`--${key}-base-height`] = `${config.base.height}px`;
    }
    
    if (config.component) {
      vars[`--${key}-component-width`] = `${config.component.width}px`;
      vars[`--${key}-component-height`] = `${config.component.height}px`;
      
      if ('x' in config.component && 'y' in config.component) {
        vars[`--${key}-component-x`] = `${config.component.x}px`;
        vars[`--${key}-component-y`] = `${config.component.y}px`;
      }
    }
  });
  
  Object.entries(platformConfig).forEach(([key, config]) => {
    vars[`--platform-${key}-offset-x`] = `${config.offset.x}px`;
    vars[`--platform-${key}-offset-y`] = `${config.offset.y}px`;
    
    if (config.size) {
      vars[`--platform-${key}-width`] = `${config.size.width}px`;
      vars[`--platform-${key}-height`] = `${config.size.height}px`;
    }
  });
  
  Object.entries(businessModulesConfig).forEach(([key, config]) => {
    vars[`--business-${key}-offset-x`] = `${config.offset.x}px`;
    vars[`--business-${key}-offset-y`] = `${config.offset.y}px`;
    vars[`--business-${key}-width`] = `${config.size.width}px`;
    vars[`--business-${key}-height`] = `${config.size.height}px`;
  });
  
  return vars;
});

const platform = ref<HTMLElement>();
const repo = ref<HTMLElement>();

provide('getElementClasses', getElementClasses);
provide('handleMouseDown', handleMouseDown);
provide('handleMouseEnter', handleMouseEnter);
provide('handleMouseLeave', handleMouseLeave);
provide('platformConfig', platformConfig);
provide('peripheralsConfig', peripheralsConfig);
provide('debuggerRef', debuggerRef);

onMounted(async () => {
  await nextTick();
  
  if (props.enableEntranceAnimation) {
    await startEntranceAnimation();
  }
});

const startEntranceAnimation = async () => {
  const stage = document.querySelector('.stage');
  const platformContainer = document.querySelector('.platform-base-container');
  const platformTitle = document.querySelector('.platform-title');
  const businessModules = document.querySelectorAll('#data-processing-module, #data-mart-module, #algo-repo-module, #algo-runtime-module');
  const peripheralSystems = document.querySelectorAll('.edge-platform, .simulation-platform, .data-manage-platform, .parent-system, .operator');
  const beamElements = document.querySelectorAll('.animated-beam');
  
  if (!stage) return;
  
  // 首先隐藏所有beam元素，防止它们在入场动画期间显示
  gsap.set(beamElements, { opacity: 0 });
  
  // 创建入场时间线
  const entranceTL = gsap.timeline({
    onComplete: () => {
      // 动画完成后清除所有变换，确保元素回到CSS定义的位置
      gsap.set([platformContainer, platformTitle, businessModules, peripheralSystems], {
        clearProps: "transform,opacity"
      });
      
      // 所有入场动画完成后，启动连线动画
      startBeamAnimation();
    }
  });

  // 1. 舞台整体淡入
  entranceTL.fromTo(stage, {
    opacity: 0
  }, {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out'
  })
  // 2. 平台基座淡入（不移动位置）
  .fromTo(platformContainer, {
    opacity: 0,
    scale: 0.98
  }, {
    opacity: 1,
    scale: 1,
    duration: 0.8,
    ease: 'power2.out'
  }, 0.2)
  // 3. 标题淡入（不移动位置）
  .fromTo(platformTitle, {
    opacity: 0
  }, {
    opacity: 1,
    duration: 0.7,
    ease: 'power2.out'
  }, 0.4)
  // 4. 业务模块依次淡入扩展
  .fromTo(businessModules, {
    scale: 0.9,
    opacity: 0
  }, {
    scale: 1,
    opacity: 1,
    duration: 0.6,
    ease: 'back.out(1.7)',
    stagger: 0.1
  }, 0.8)
  // 5. 外围系统淡入扩展
  .fromTo(peripheralSystems, {
    scale: 0.9,
    opacity: 0
  }, {
    scale: 1,
    opacity: 1,
    duration: 0.7,
    ease: 'back.out(1.7)',
    stagger: 0.08
  }, 1.0);

  // 6. 算法仓特殊旋转动画
  if (repo.value) {
    entranceTL.fromTo(repo.value, {
      scale: 0,
      rotation: -180,
      opacity: 0
    }, {
      scale: 1,
      rotation: 0,
      opacity: 1,
      duration: 1.0,
      ease: 'back.out(1.7)'
    }, 1.5);
  }

};

// 独立的连线动画函数
const startBeamAnimation = () => {
  const beamElements = document.querySelectorAll('.animated-beam');
  if (beamElements.length > 0) {
    gsap.fromTo(beamElements, {
      opacity: 0
    }, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.12
    });
  }
};

const generateReplaceCode = () => {
  const peripheralsJsConfig = Object.entries(peripheralsConfig)
    .map(([name, config]) => {
      if (name === 'operator') {
        return `  '${name}': {
    label: '${config.label}',
    offset: { x: ${config.offset.x}, y: ${config.offset.y} },
    component: { width: ${config.component.width}, height: ${config.component.height} },
    visible: ${config.visible}
  }`;
      } else {
        const standardConfig = config as any;
        return `  '${name}': {
    label: '${standardConfig.label}',
    offset: { x: ${standardConfig.offset.x}, y: ${standardConfig.offset.y} },
    base: { width: ${standardConfig.base.width}, height: ${standardConfig.base.height} },
    component: { width: ${standardConfig.component.width}, height: ${standardConfig.component.height}, x: ${standardConfig.component.x}, y: ${standardConfig.component.y} },
    visible: ${standardConfig.visible}
  }`;
      }
    }).join(',\n');
  
  const platformJsConfig = Object.entries(platformConfig)
    .map(([name, config]) => {
      return `  '${name}': {
    label: '${config.label}',
    size: { width: ${config.size.width}, height: ${config.size.height} },
    offset: { x: ${config.offset.x}, y: ${config.offset.y} },
    visible: ${config.visible}
  }`;
    }).join(',\n');
    
  const fullPeripheralsConfig = `export const peripheralsConfig = {\n${peripheralsJsConfig}\n};`;
  const fullPlatformConfig = `export const platformConfig = {\n${platformJsConfig}\n};`;
  
  const businessJsConfig = Object.entries(businessModulesConfig)
    .map(([name, config]) => {
      return `  '${name}': {
    label: '${config.label}',
    size: { width: ${config.size.width}, height: ${config.size.height} },
    offset: { x: ${config.offset.x}, y: ${config.offset.y} },
    visible: ${config.visible}
  }`;
    }).join(',\n');
    
  const fullBusinessConfig = `export const businessModulesConfig = {\n${businessJsConfig}\n};`;
  
  const scssConfig = Object.entries(peripheralsConfig)
    .map(([name, config]) => {
      if (name === 'operator') {
        return `  ${name}: (
    offset: (${config.offset.x}px, ${config.offset.y}px),
    component: (${config.component.width}px, ${config.component.height}px)
  )`;
      } else {
        const standardConfig = config as any;
        return `  ${name}: (
    offset: (${standardConfig.offset.x}px, ${standardConfig.offset.y}px),
    base: (${standardConfig.base.width}px, ${standardConfig.base.height}px),
    component: (${standardConfig.component.width}px, ${standardConfig.component.height}px, ${standardConfig.component.x}px, ${standardConfig.component.y}px)
  )`;
      }
    }).join(',\n');
    
  const fullScssConfig = `$peripherals: (\n${scssConfig}\n);`;
  
  const replaceInstructions = `
🔄 **完整配置替换流程**：

✅ **第1步：替换外围系统配置**
1️⃣ 在 \`src/components/Home/platform.ts\` 中找到 \`export const peripheralsConfig\`：
\`\`\`javascript
${fullPeripheralsConfig}
\`\`\`

✅ **第2步：替换主平台配置**
2️⃣ 在同一文件中找到 \`export const platformConfig\`：
\`\`\`javascript
${fullPlatformConfig}
\`\`\`

✅ **第3步：替换业务模块配置**
3️⃣ 在同一文件中找到 \`export const businessModulesConfig\`：
\`\`\`javascript
${fullBusinessConfig}
\`\`\`

✅ **第4步：同步SCSS配置（可选）**
4️⃣ 在 index.vue 中找到 \`$peripherals\`：
\`\`\`scss
${fullScssConfig}
\`\`\`

📝 **快速定位**：
   - 外围系统：搜索 "export const peripheralsConfig"
   - 主平台：搜索 "export const platformConfig"
   - 业务模块：搜索 "export const businessModulesConfig"
   - SCSS配置：搜索 "$peripherals"

⚠️ **重要提醒**：
   - 所有配置都支持拖拽调试
   - 业务模块新增了完整的调试功能
   - 保存后立即生效
  `;
  
  const fullExportConfig = `// 外围系统配置\n${fullPeripheralsConfig}\n\n// 主平台配置\n${fullPlatformConfig}\n\n// 业务模块配置\n${fullBusinessConfig}`;
  
  navigator.clipboard.writeText(fullExportConfig).then(() => {
    alert('✅ 完整配置已复制到剪贴板！\n\n' + replaceInstructions);
  });
};

const resetConfig = () => {
  Object.assign(peripheralsConfig, {
    'edge-platform': {
      label: 'Edge Platform',
      offset: { x: 500, y: -420 },
      base: { width: 260 },
      component: { width: 240, height: 160, x: 40, y: 40 },
      visible: true
    },
    'simulation-platform': {
      label: 'Simulation Platform',
      offset: { x: 600, y: 280 },
      base: { width: 260 },
      component: { width: 260, height: 180, x: 30, y: 30 },
      visible: true
    },
    'data-manage-platform': {
      label: 'Data Management Platform',
      offset: { x: -60, y: -450 },
      base: { width: 260 },
      component: { width: 280, height: 140, x: 20, y: 50 },
      visible: true
    },
    'parent-system': {
      label: 'Parent System',
      offset: { x: -600, y: 280 },
      base: { width: 260 },
      component: { width: 220, height: 140, x: 50, y: 50 },
      visible: true
    },
  'operator': {
    label: 'Operator',
    offset: { x: -400, y: 450 },
    component: { width: 160, height: 120 },
    visible: true
  }
  });
};
</script>

<style scoped lang="scss">
@import './home-visualization.scss';
</style>
