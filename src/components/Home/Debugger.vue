<template>
  <div
v-if="isDevMode"
class="debug-panel-wrapper">
    <button
      class="debug-toggle"
      :class="{ active: showDebugPanel }"
      @click="toggleDebugPanel"
      :title="showDebugPanel ? '关闭调试面板' : '打开调试面板'"
    >
      <span v-if="showDebugPanel">✕</span>
      <span v-else>⚙️</span>
    </button>

    <div
v-if="showDebugPanel"
class="debug-panel"
:class="{ minimized: isMinimized }">
      <div class="debug-header">
        <h3>🛠️ 可视化布局调试器</h3>
        <div class="debug-actions">
          <button
@click="toggleMinimize"
:title="isMinimized ? '最大化面板' : '最小化面板'">
            {{ isMinimized ? '🔼' : '🔽' }}
          </button>
          <button
@click="toggleGrid"
:class="{ active: showGrid }"
title="显示/隐藏网格">
            📐
          </button>
          <button
@click="exportAllConfig"
title="导出所有配置">
            📋
          </button>
          <button
@click="resetAllConfig"
title="重置所有配置">
            🔄
          </button>
        </div>
      </div>

      <div
v-if="!isMinimized"
class="debug-content">
        <div class="usage-tips">
          <h4>💡 使用说明</h4>
          <ul>
            <li>🖱️ 拖拽元素调整位置</li>
            <li>📏 输入数值或使用 ±按钮精确调整尺寸</li>
            <li>⚡ 使用快捷按钮批量调整尺寸</li>
            <li>🎯 精细微调支持全局缩放和宽度调整</li>
            <li>📐 开启网格辅助对齐</li>
            <li>📋 一键复制配置代码</li>
            <li>🔄 重置为默认布局</li>
          </ul>
        </div>

        <div class="quick-size-tools">
          <h4>⚡ 快捷尺寸调整</h4>
          <div class="size-presets">
            <div class="preset-group">
              <span class="preset-label">外围系统:</span>
              <button @click="applyPresetSize('peripherals', 'small')" title="小尺寸 (200x150)">📱</button>
              <button @click="applyPresetSize('peripherals', 'medium')" title="中尺寸 (320x240)">💻</button>
              <button @click="applyPresetSize('peripherals', 'large')" title="大尺寸 (400x300)">🖥️</button>
            </div>
            <div class="preset-group">
              <span class="preset-label">业务模块:</span>
              <button @click="applyPresetSize('businessModules', 'small')" title="小尺寸 (280x200)">📱</button>
              <button @click="applyPresetSize('businessModules', 'medium')" title="中尺寸 (380x280)">💻</button>
              <button @click="applyPresetSize('businessModules', 'large')" title="大尺寸 (480x360)">🖥️</button>
            </div>
            <div class="preset-group">
              <span class="preset-label">平台:</span>
              <button @click="applyPresetSize('platforms', 'small')" title="小尺寸 (800x600)">📱</button>
              <button @click="applyPresetSize('platforms', 'medium')" title="中尺寸 (1080x900)">💻</button>
              <button @click="applyPresetSize('platforms', 'large')" title="大尺寸 (1400x1200)">🖥️</button>
            </div>
          </div>
          
          <div class="fine-adjustment-tools">
            <h5>🎯 精细微调</h5>
            <div class="adjustment-buttons">
              <div class="adjustment-group">
                <span class="adjustment-label">全局缩放:</span>
                <button @click="adjustAllSizes(-5)" title="缩小所有元素">🔻</button>
                <button @click="adjustAllSizes(5)" title="放大所有元素">🔺</button>
              </div>
              <div class="adjustment-group">
                <span class="adjustment-label">宽度微调:</span>
                <button @click="adjustAllWidths(-10)" title="减少所有宽度">⬅️</button>
                <button @click="adjustAllWidths(10)" title="增加所有宽度">➡️</button>
              </div>
            </div>
          </div>
        </div>

        <div
v-for="group in configGroups"
:key="group.name"
class="config-group">
          <div class="group-header">
            <h4>{{ group.title }}</h4>
            <div class="group-actions">
              <button 
                @click="toggleGroupVisibility(group.name)"
                :class="{ active: group.visible }"
                title="显示/隐藏分组"
              >
                👁️
              </button>
              <button 
                @click="exportGroupConfig(group.name)"
                title="导出分组配置"
              >
                📋
              </button>
              <button 
                @click="resetGroupConfig(group.name)"
                title="重置分组配置"
              >
                🔄
              </button>
            </div>
          </div>

          <div
v-if="group.visible"
class="config-items">
            <div 
              v-for="(config, key) in group.items" 
              :key="key"
              class="config-item"
              :class="{ dragging: isDragging && dragTarget === key }"
            >
              <div class="config-name">{{ config.label || key }}</div>
              <div class="config-controls">
                <div
v-if="config.offset"
class="position-controls">
                  <div class="control-group">
                    <label>X:</label>
                    <div class="stepper-control">
                      <button
                        class="stepper-btn"
                        @click="adjustPosition(group.name, key, config, 'x', -10)"
                        title="左移"
                      >-</button>
                      <input 
                        type="number" 
                        v-model.number="config.offset.x"
                        @input="updateConfig(group.name, key, config)"
                        step="10"
                      >
                      <button
                        class="stepper-btn"
                        @click="adjustPosition(group.name, key, config, 'x', 10)"
                        title="右移"
                      >+</button>
                    </div>
                  </div>
                  <div class="control-group">
                    <label>Y:</label>
                    <div class="stepper-control">
                      <button
                        class="stepper-btn"
                        @click="adjustPosition(group.name, key, config, 'y', -10)"
                        title="上移"
                      >-</button>
                      <input 
                        type="number" 
                        v-model.number="config.offset.y"
                        @input="updateConfig(group.name, key, config)"
                        step="10"
                      >
                      <button
                        class="stepper-btn"
                        @click="adjustPosition(group.name, key, config, 'y', 10)"
                        title="下移"
                      >+</button>
                    </div>
                  </div>
                </div>

                <div
v-if="config.size"
class="size-controls">
                  <div class="control-group">
                    <label>W:</label>
                    <div class="stepper-control">
                      <button
                        class="stepper-btn"
                        @click="adjustSize(group.name, key, config, 'width', -10)"
                        title="减少宽度"
                      >-</button>
                      <input 
                        type="number" 
                        v-model.number="config.size.width"
                        @input="updateConfig(group.name, key, config)"
                        step="10"
                        min="50"
                      >
                      <button
                        class="stepper-btn"
                        @click="adjustSize(group.name, key, config, 'width', 10)"
                        title="增加宽度"
                      >+</button>
                    </div>
                  </div>
                  <div class="control-group">
                    <label>H:</label>
                    <div class="stepper-control">
                      <button
                        class="stepper-btn"
                        @click="adjustSize(group.name, key, config, 'height', -10)"
                        title="减少高度"
                      >-</button>
                      <input 
                        type="text" 
                        :value="config.size.height ?? ''"
                        @input="updateSizeHeight(group.name, key, config, $event)"
                        placeholder="auto"
                        title="输入数值或留空为自适应"
                      >
                      <button
                        class="stepper-btn"
                        @click="adjustSize(group.name, key, config, 'height', 10)"
                        title="增加高度"
                      >+</button>
                    </div>
                  </div>
                </div>

                <div
v-if="config.base"
class="base-controls">
                  <div class="control-label">底座:</div>
                  <div class="control-group">
                    <label>W:</label>
                    <div class="stepper-control">
                      <button
                        class="stepper-btn"
                        @click="adjustBase(group.name, key, config, 'width', -10)"
                        title="减少底座宽度"
                      >-</button>
                      <input 
                        type="number" 
                        v-model.number="config.base.width"
                        @input="updateConfig(group.name, key, config)"
                        step="10"
                        min="100"
                      >
                      <button
                        class="stepper-btn"
                        @click="adjustBase(group.name, key, config, 'width', 10)"
                        title="增加底座宽度"
                      >+</button>
                    </div>
                  </div>
                  <div class="control-group">
                    <label>H:</label>
                    <div class="stepper-control">
                      <button
                        class="stepper-btn"
                        @click="adjustBase(group.name, key, config, 'height', -10)"
                        title="减少底座高度"
                      >-</button>
                      <input 
                        type="text" 
                        :value="config.base.height ?? ''"
                        @input="updateBaseHeight(group.name, key, config, $event)"
                        placeholder="auto"
                        title="输入数值或留空为自适应"
                      >
                      <button
                        class="stepper-btn"
                        @click="adjustBase(group.name, key, config, 'height', 10)"
                        title="增加底座高度"
                      >+</button>
                    </div>
                  </div>
                </div>

                <div
v-if="config.component"
class="component-controls">
                  <div class="control-label">组件:</div>
                  <div class="control-group">
                    <label>W:</label>
                    <div class="stepper-control">
                      <button
                        class="stepper-btn"
                        @click="adjustComponent(group.name, key, config, 'width', -5)"
                        title="减少组件宽度"
                      >-</button>
                      <input 
                        type="number" 
                        v-model.number="config.component.width"
                        @input="updateConfig(group.name, key, config)"
                        step="10"
                        min="50"
                      >
                      <button
                        class="stepper-btn"
                        @click="adjustComponent(group.name, key, config, 'width', 5)"
                        title="增加组件宽度"
                      >+</button>
                    </div>
                  </div>
                  <div class="control-group">
                    <label>H:</label>
                    <div class="stepper-control">
                      <button
                        class="stepper-btn"
                        @click="adjustComponent(group.name, key, config, 'height', -5)"
                        title="减少组件高度"
                      >-</button>
                      <input 
                        type="text" 
                        :value="config.component.height ?? ''"
                        @input="updateComponentHeight(group.name, key, config, $event)"
                        placeholder="auto"
                        title="输入数值或留空为自适应"
                      >
                      <button
                        class="stepper-btn"
                        @click="adjustComponent(group.name, key, config, 'height', 5)"
                        title="增加组件高度"
                      >+</button>
                    </div>
                  </div>
                  <div class="control-group">
                    <label>X:</label>
                    <div class="stepper-control">
                      <button
                        class="stepper-btn"
                        @click="adjustComponent(group.name, key, config, 'x', -5)"
                        title="左移组件"
                      >-</button>
                      <input 
                        type="number" 
                        v-model.number="config.component.x"
                        @input="updateConfig(group.name, key, config)"
                        step="5"
                      >
                      <button
                        class="stepper-btn"
                        @click="adjustComponent(group.name, key, config, 'x', 5)"
                        title="右移组件"
                      >+</button>
                    </div>
                  </div>
                  <div class="control-group">
                    <label>Y:</label>
                    <div class="stepper-control">
                      <button
                        class="stepper-btn"
                        @click="adjustComponent(group.name, key, config, 'y', -5)"
                        title="上移组件"
                      >-</button>
                      <input 
                        type="number" 
                        v-model.number="config.component.y"
                        @input="updateConfig(group.name, key, config)"
                        step="5"
                      >
                      <button
                        class="stepper-btn"
                        @click="adjustComponent(group.name, key, config, 'y', 5)"
                        title="下移组件"
                      >+</button>
                    </div>
                  </div>
                </div>

                <div class="drag-indicator">🔀</div>
              </div>
            </div>
          </div>
        </div>

        <div class="config-preview">
          <h4>📄 当前配置</h4>
          <pre class="config-json">{{ formattedConfig }}</pre>
        </div>
      </div>
    </div>

    <div
v-if="showGrid"
class="debug-grid">
      <div class="center-cross"></div>
      <div class="grid-lines"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface ConfigItem {
  label?: string;
  offset?: { x: number; y: number };
  size?: { width: number; height?: number | undefined };
  base?: { width: number; height?: number | undefined };
  component?: { width: number; height?: number | undefined; x: number; y: number };
  visible?: boolean;
  [key: string]: any;
}

interface ConfigGroup {
  name: string;
  title: string;
  visible: boolean;
  items: Record<string, ConfigItem>;
}

const props = defineProps<{
  configs: Record<string, Record<string, ConfigItem>>;
  getScale?: () => number;
  isDevMode?: boolean;
}>();

const emit = defineEmits<{
  configUpdate: [groupName: string, itemKey: string, config: ConfigItem];
  startDrag: [event: MouseEvent, groupName: string, itemKey: string];
  exportConfig: [groupName?: string];
  resetConfig: [groupName?: string];
}>();

const isDevMode = ref(props.isDevMode ?? import.meta.env.DEV);
const showDebugPanel = ref(false);
const showGrid = ref(false);
const isDragging = ref(false);
const dragTarget = ref<string | null>(null);
const isMinimized = ref(false);

const configGroups = computed<ConfigGroup[]>(() => {
  return Object.entries(props.configs).map(([groupName, items]) => ({
    name: groupName,
    title: getGroupTitle(groupName),
    visible: true,
    items
  }));
});

const formattedConfig = computed(() => {
  const simplified = Object.fromEntries(
    Object.entries(props.configs).map(([groupName, items]) => [
      groupName,
      Object.fromEntries(
        Object.entries(items).map(([key, config]) => [
          key,
          {
            offset: config.offset,
            size: config.size,
            visible: config.visible
          }
        ])
      )
    ])
  );
  return JSON.stringify(simplified, null, 2);
});

function getGroupTitle(groupName: string): string {
  const titleMap: Record<string, string> = {
    peripherals: '🌐 外围系统',
    platforms: '🏗️ 平台组件',
    businessModules: '💼 业务模块',
    modules: '📦 功能模块',
    animations: '🎬 动画配置'
  };
  return titleMap[groupName] || groupName.charAt(0).toUpperCase() + groupName.slice(1);
}

function toggleDebugPanel() {
  showDebugPanel.value = !showDebugPanel.value;
  if (!showDebugPanel.value) {
    isMinimized.value = false;
  }
}

function toggleMinimize() {
  isMinimized.value = !isMinimized.value;
}

function toggleGrid() {
  showGrid.value = !showGrid.value;
}

function toggleGroupVisibility(groupName: string) {
  const group = configGroups.value.find(g => g.name === groupName);
  if (group) {
    group.visible = !group.visible;
  }
}

function updateConfig(groupName: string, itemKey: string, config: ConfigItem) {
  emit('configUpdate', groupName, itemKey, config);
}

function startDrag(event: MouseEvent, groupName: string, itemKey: string) {
  if (!showDebugPanel.value) {return;}
  
  isDragging.value = true;
  dragTarget.value = `${groupName}-${itemKey}`;
  
  emit('startDrag', event, groupName, itemKey);
  
  const stopDrag = () => {
    isDragging.value = false;
    dragTarget.value = null;
    document.removeEventListener('mouseup', stopDrag);
  };
  
  document.addEventListener('mouseup', stopDrag);
}

function exportGroupConfig(groupName: string) {
  emit('exportConfig', groupName);
}

function exportAllConfig() {
  emit('exportConfig');
}

function resetGroupConfig(groupName: string) {
  emit('resetConfig', groupName);
}

function resetAllConfig() {
  emit('resetConfig');
}

function applyPresetSize(groupName: string, sizeType: 'small' | 'medium' | 'large') {
  const group = configGroups.value.find(g => g.name === groupName);
  if (!group) return;

  const sizePresets = {
    peripherals: {
      small: { base: { width: 200, height: 150 }, component: { width: 120, height: 80 } },
      medium: { base: { width: 320, height: 240 }, component: { width: 200, height: 140 } },
      large: { base: { width: 400, height: 300 }, component: { width: 280, height: 200 } }
    },
    businessModules: {
      small: { size: { width: 280, height: 200 } },
      medium: { size: { width: 380, height: 280 } },
      large: { size: { width: 480, height: 360 } }
    },
    platforms: {
      small: { size: { width: 800, height: 600 } },
      medium: { size: { width: 1080, height: 900 } },
      large: { size: { width: 1400, height: 1200 } }
    }
  };

  const preset = sizePresets[groupName]?.[sizeType];
  if (!preset) return;

  Object.entries(group.items).forEach(([key, config]) => {
    const updatedConfig = { ...config };
    
    if (preset.size && config.size) {
      updatedConfig.size = { ...config.size, ...preset.size };
    }
    
    if (preset.base && config.base) {
      updatedConfig.base = { ...config.base, ...preset.base };
    }
    
    if (preset.component && config.component) {
      updatedConfig.component = { 
        ...config.component, 
        width: preset.component.width,
        height: preset.component.height
      };
    }
    
    emit('configUpdate', groupName, key, updatedConfig);
  });
}

function adjustPosition(groupName: string, itemKey: string, config: ConfigItem, axis: 'x' | 'y', step: number) {
  if (!config.offset) return;
  
  const updatedConfig = { ...config };
  updatedConfig.offset = { ...config.offset };
  updatedConfig.offset[axis] += step;
  
  emit('configUpdate', groupName, itemKey, updatedConfig);
}

function adjustSize(groupName: string, itemKey: string, config: ConfigItem, dimension: 'width' | 'height', step: number) {
  if (!config.size) return;
  
  const updatedConfig = { ...config };
  updatedConfig.size = { ...config.size };
  
  if (dimension === 'height') {
    const currentHeight = updatedConfig.size.height ?? 200;
    const newValue = currentHeight + step;
    updatedConfig.size.height = Math.max(newValue, 50);
  } else {
    const newValue = updatedConfig.size[dimension] + step;
    updatedConfig.size[dimension] = Math.max(newValue, 50);
  }
  
  emit('configUpdate', groupName, itemKey, updatedConfig);
}

function adjustBase(groupName: string, itemKey: string, config: ConfigItem, dimension: 'width' | 'height', step: number) {
  if (!config.base) return;
  
  const updatedConfig = { ...config };
  updatedConfig.base = { ...config.base };
  
  if (dimension === 'height') {
    const currentHeight = updatedConfig.base.height ?? 240;
    const newValue = currentHeight + step;
    updatedConfig.base.height = Math.max(newValue, 100);
  } else {
    const newValue = updatedConfig.base[dimension] + step;
    updatedConfig.base[dimension] = Math.max(newValue, 100);
  }
  
  emit('configUpdate', groupName, itemKey, updatedConfig);
}

function adjustComponent(groupName: string, itemKey: string, config: ConfigItem, property: 'width' | 'height' | 'x' | 'y', step: number) {
  if (!config.component) return;
  
  const updatedConfig = { ...config };
  updatedConfig.component = { ...config.component };
  
  if (property === 'width') {
    const newValue = updatedConfig.component[property] + step;
    updatedConfig.component[property] = Math.max(newValue, 50);
  } else if (property === 'height') {
    const currentHeight = updatedConfig.component.height ?? 140;
    const newValue = currentHeight + step;
    updatedConfig.component.height = Math.max(newValue, 50);
  } else {
    updatedConfig.component[property] += step;
  }
  
  emit('configUpdate', groupName, itemKey, updatedConfig);
}

function updateSizeHeight(groupName: string, itemKey: string, config: ConfigItem, event: Event) {
  if (!config.size) return;
  
  const target = event.target as HTMLInputElement;
  const value = target.value.trim();
  
  const updatedConfig = { ...config };
  updatedConfig.size = { ...config.size };
  
  if (value === '' || value === 'auto') {
    updatedConfig.size.height = undefined;
  } else {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      updatedConfig.size.height = numValue;
    } else {
      target.value = config.size.height?.toString() ?? '';
      return;
    }
  }
  
  emit('configUpdate', groupName, itemKey, updatedConfig);
}

function updateBaseHeight(groupName: string, itemKey: string, config: ConfigItem, event: Event) {
  if (!config.base) return;
  
  const target = event.target as HTMLInputElement;
  const value = target.value.trim();
  
  const updatedConfig = { ...config };
  updatedConfig.base = { ...config.base };
  
  if (value === '' || value === 'auto') {
    updatedConfig.base.height = undefined;
  } else {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      updatedConfig.base.height = numValue;
    } else {
      target.value = config.base.height?.toString() ?? '';
      return;
    }
  }
  
  emit('configUpdate', groupName, itemKey, updatedConfig);
}

function updateComponentHeight(groupName: string, itemKey: string, config: ConfigItem, event: Event) {
  if (!config.component) return;
  
  const target = event.target as HTMLInputElement;
  const value = target.value.trim();
  
  const updatedConfig = { ...config };
  updatedConfig.component = { ...config.component };
  
  if (value === '' || value === 'auto') {
    updatedConfig.component.height = undefined;
  } else {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      updatedConfig.component.height = numValue;
    } else {
      target.value = config.component.height?.toString() ?? '';
      return;
    }
  }
  
  emit('configUpdate', groupName, itemKey, updatedConfig);
}

function adjustAllSizes(step: number) {
  configGroups.value.forEach(group => {
    Object.entries(group.items).forEach(([key, config]) => {
      const updatedConfig = { ...config };
      
      if (config.size) {
        updatedConfig.size = {
          width: Math.max(config.size.width + step, 50),
          height: config.size.height !== undefined 
            ? Math.max(config.size.height + step, 50) 
            : undefined
        };
      }
      
      if (config.base) {
        updatedConfig.base = {
          width: Math.max(config.base.width + step, 100),
          height: config.base.height !== undefined 
            ? Math.max(config.base.height + step, 100) 
            : undefined
        };
      }
      
      if (config.component) {
        updatedConfig.component = {
          ...config.component,
          width: Math.max(config.component.width + step, 50),
          height: config.component.height !== undefined 
            ? Math.max(config.component.height + step, 50) 
            : undefined
        };
      }
      
      emit('configUpdate', group.name, key, updatedConfig);
    });
  });
}

function adjustAllWidths(step: number) {
  configGroups.value.forEach(group => {
    Object.entries(group.items).forEach(([key, config]) => {
      const updatedConfig = { ...config };
      
      if (config.size) {
        updatedConfig.size = {
          ...config.size,
          width: Math.max(config.size.width + step, 50)
        };
      }
      
      if (config.base) {
        updatedConfig.base = {
          ...config.base,
          width: Math.max(config.base.width + step, 100)
        };
      }
      
      if (config.component) {
        updatedConfig.component = {
          ...config.component,
          width: Math.max(config.component.width + step, 50)
        };
      }
      
      emit('configUpdate', group.name, key, updatedConfig);
    });
  });
}

defineExpose({
  showDebugPanel,
  showGrid,
  isDragging,
  dragTarget,
  startDrag,
  toggleDebugPanel,
  toggleGrid
});
</script>

<style scoped lang="scss">
$panel-bg: rgba(30, 30, 30, 0.95);
$panel-border: rgba(255, 255, 255, 0.1);
$primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
$grid-color: rgba(0, 229, 255, 0.1);
$transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

.debug-panel-wrapper {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 12px;
}

.debug-toggle {
  position: relative;
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background: $primary-gradient;
  color: white;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: $transition-smooth;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
  
  &.active {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    transform: rotate(90deg);
  }
}

.debug-panel {
  position: absolute;
  top: 60px;
  right: 0;
  width: 450px;
  max-height: calc(100vh - 100px);
  background: $panel-bg;
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid $panel-border;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: slideInFromRight 0.3s ease-out;
  transition: $transition-smooth;
  
  &.minimized {
    max-height: 60px;
    
    .debug-header h3 {
      font-size: 12px;
    }
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.debug-header {
  padding: 20px;
  background: $primary-gradient;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
  }
}

.debug-actions {
  display: flex;
  gap: 8px;
  
  button {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    cursor: pointer;
    transition: $transition-smooth;
    font-size: 12px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }
    
    &.active {
      background: rgba(255, 255, 255, 0.4);
    }
  }
}

.debug-content {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  color: white;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
}

.usage-tips {
  padding: 16px 20px;
  border-bottom: 1px solid $panel-border;
  
  h4 {
    margin: 0 0 12px 0;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.9);
  }
  
  ul {
    margin: 0;
    padding-left: 16px;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.7);
    
    li {
      margin-bottom: 4px;
    }
  }
}

.quick-size-tools {
  padding: 16px 20px;
  border-bottom: 1px solid $panel-border;
  background: rgba(0, 229, 255, 0.05);
  
  h4 {
    margin: 0 0 12px 0;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.9);
  }
}

.size-presets {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preset-group {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .preset-label {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.7);
    min-width: 70px;
  }
  
  button {
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    cursor: pointer;
    transition: $transition-smooth;
    font-size: 12px;
    
    &:hover {
      background: rgba(0, 229, 255, 0.3);
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
}

.fine-adjustment-tools {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  h5 {
    margin: 0 0 8px 0;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 600;
  }
}

.adjustment-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.adjustment-group {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .adjustment-label {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.7);
    min-width: 70px;
  }
  
  button {
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    cursor: pointer;
    transition: $transition-smooth;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background: rgba(255, 193, 7, 0.3);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(255, 193, 7, 0.2);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
}

.config-group {
  border-bottom: 1px solid $panel-border;
}

.group-header {
  padding: 16px 20px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  
  h4 {
    margin: 0;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.9);
  }
}

.group-actions {
  display: flex;
  gap: 6px;
  
  button {
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    cursor: pointer;
    transition: $transition-smooth;
    font-size: 10px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    
    &.active {
      background: rgba(0, 229, 255, 0.3);
    }
  }
}

.config-items {
  padding: 0 20px 16px;
}

.config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: $transition-smooth;
  
  &:last-child {
    border-bottom: none;
  }
  
  &.dragging {
    background: rgba(0, 229, 255, 0.1);
    border-radius: 4px;
    padding: 8px;
  }
}

.config-name {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-transform: capitalize;
  min-width: 80px;
}

.config-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.position-controls,
.size-controls,
.base-controls,
.component-controls {
  display: flex;
  gap: 8px;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.05);
}

.base-controls {
  border-color: rgba(0, 229, 255, 0.3);
  background: rgba(0, 229, 255, 0.05);
}

.component-controls {
  border-color: rgba(255, 193, 7, 0.3);
  background: rgba(255, 193, 7, 0.05);
}

.control-label {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  margin-right: 4px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 4px;
  
  label {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.6);
    min-width: 12px;
  }
  
  input {
    width: 50px;
    height: 20px;
    padding: 2px 4px;
    border: none;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 10px;
    text-align: center;
    
    &:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.2);
    }
  }
  
  .stepper-control input {
    border-radius: 0;
    background: transparent;
    
    &:focus {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}

.drag-indicator {
  font-size: 12px;
  cursor: grab;
  opacity: 0.6;
  transition: $transition-smooth;
  
  &:hover {
    opacity: 1;
    transform: scale(1.2);
  }
  
  &:active {
    cursor: grabbing;
  }
}

.config-preview {
  padding: 16px 20px;
  border-top: 1px solid $panel-border;
  
  h4 {
    margin: 0 0 12px 0;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.9);
  }
}

.config-json {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 12px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 10px;
  color: #00e5ff;
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.debug-grid {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: -2;
  opacity: 0.3;
}

.center-cross {
  position: absolute;
  left: 50%;
  top: 50%;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    background: rgba(255, 0, 0, 0.5);
  }
  
  &::before {
    width: 100vw;
    height: 1px;
    left: -50vw;
    top: 0;
  }
  
  &::after {
    width: 1px;
    height: 100vh;
    left: 0;
    top: -50vh;
  }
}

.grid-lines {
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(90deg, $grid-color 1px, transparent 1px),
    linear-gradient(0deg, $grid-color 1px, transparent 1px);
  background-size: 50px 50px;
  background-position: -1px -1px;
}

.stepper-control {
  display: flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
}

.stepper-btn {
  width: 20px;
  height: 20px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: $transition-smooth;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
    background: rgba(0, 229, 255, 0.3);
  }
  
  &:first-child {
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  &:last-child {
    border-left: 1px solid rgba(255, 255, 255, 0.1);
  }
}

.stepper-control input {
  border: none;
  background: transparent;
  margin: 0;
  border-radius: 0;
  
  &:focus {
    background: rgba(255, 255, 255, 0.1);
  }
}

.stepper-control input[placeholder="auto"] {
  font-style: italic;
  
  &:placeholder-shown {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:empty {
    &::before {
      content: "auto";
      color: rgba(255, 255, 255, 0.5);
      font-style: italic;
    }
  }
}
</style>
