<template>
  <div 
    ref="moduleRef"
    class="business-module" 
    :class="elementClasses"
    :style="moduleStyle"
    @mousedown="handleMouseDown"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <BusinessFoundation class="module-base" />
    
    <div class="module-title">{{ config.label }}</div>
    
    <slot />
    
    <div
v-if="debuggerRef?.showDebugPanel"
class="debug-label">
      {{ config.label }}<br>
      <small>{{ config.offset.x }}, {{ config.offset.y }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import BusinessFoundation from '@/assets/svg/business-foundation.svg?component';

const moduleRef = ref<HTMLElement>();

interface Props {
  config: {
    label: string
    offset: { x: number; y: number }
    size: { width: number; height?: number }
    visible: boolean
  }
  groupName: string
  itemKey: string
}

const props = defineProps<Props>();

const getElementClasses = inject('getElementClasses') as ((group: string, key: string) => string[]) | undefined;
const handleMouseDownFn = inject('handleMouseDown') as ((e: MouseEvent, group: string, key: string) => void) | undefined;
const handleMouseEnterFn = inject('handleMouseEnter') as ((group: string, key: string) => void) | undefined;
const handleMouseLeaveFn = inject('handleMouseLeave') as ((group: string, key: string) => void) | undefined;
const debuggerRef = inject('debuggerRef') as { showDebugPanel?: boolean } | undefined;

const moduleStyle = computed(() => {
  // console.log('📦 Business Module Style:', {
  //   position: 'absolute',
  //   left: `${props.config.offset.x}px`,
  //   top: `${props.config.offset.y}px`,
  //   width: `${props.config.size.width}px`,
  //   height: `${props.config.size.height}px`,
  //   visibility: props.config.visible ? 'visible' : 'hidden'
  // });
  
  return {
    position: 'absolute' as const,
    left: `${props.config.offset.x}px`,
    top: `${props.config.offset.y}px`,
    width: `${props.config.size.width}px`,
    height: `${props.config.size.height}px`,
    visibility: (props.config.visible ? 'visible' : 'hidden') as 'visible' | 'hidden'
  };
});

const elementClasses = computed(() => {
  const classes = getElementClasses?.(props.groupName, props.itemKey) || [];
  classes.push(`business-module-${props.itemKey}`);
  return classes;
});

const handleMouseDown = (e: MouseEvent) => {
  handleMouseDownFn?.(e, props.groupName, props.itemKey);
};

const handleMouseEnter = () => {
  handleMouseEnterFn?.(props.groupName, props.itemKey);
};

const handleMouseLeave = () => {
  handleMouseLeaveFn?.(props.groupName, props.itemKey);
};

defineExpose({
  getElement: () => moduleRef.value
});
</script>

<style scoped lang="scss">
.business-module {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(1);
  z-index: 5;
  perspective: 800px;
  
  .module-base {
    width: 100%;
    height: 100%;
    
    :deep(svg) {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .module-title {
    position: absolute;
    top: 55%;
    left: 23%;
    transform: translate(0, 0) skew(-3deg, 25deg);
    transform-origin: center bottom;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    text-align: center;
    opacity: 1;
    text-shadow: 
      0 1px 2px rgba(0, 0, 0, 0.8),
      0 2px 4px rgba(0, 0, 0, 0.4),
      1px 1px 0px rgba(0, 0, 0, 0.6);
    white-space: nowrap;
    letter-spacing: 1px;
    z-index: 10;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .module-content {
    &:hover {
      background: rgba(0, 229, 255, 0.2);
      border-color: rgba(0, 229, 255, 0.6);
    }
  }
  
  &:not(.debug-draggable) {
    &.js-hover,
    &:hover {
      filter: brightness(1.15);
      transform: translateY(-3px);
      
      .module-title {
        color: #00e5ff;
        font-size: 17px;
        letter-spacing: 1.5px;
      }
    }
  }
  
  &.debug-draggable {
    cursor: move;
    outline: 2px dashed rgba(0, 229, 255, 0.5);
    outline-offset: 4px;
    filter: brightness(1);
    
    &.js-hover:not(.debug-dragging) {
      outline-color: rgba(0, 229, 255, 0.8);
      outline-width: 3px;
      filter: brightness(1.25);
      box-shadow: 0 8px 25px rgba(0, 229, 255, 0.2);
    }
    
    &.debug-dragging {
      outline: 3px solid #ff4757;
      outline-offset: 8px;
      z-index: 9999 !important;
      filter: brightness(1.5);
      transform: translateY(-8px) scale(1.05);
      box-shadow: 0 15px 40px rgba(255, 71, 87, 0.3);
    }
  }
  
  .debug-label {
    position: absolute;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: #00e5ff;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
    pointer-events: none;
    z-index: 1000;
    
    small {
      color: rgba(255, 255, 255, 0.7);
      font-size: 9px;
    }
  }
}
</style>
