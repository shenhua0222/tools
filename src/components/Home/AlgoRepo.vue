<template>
  <div class="algo-repo">
    <div
      v-for="(algo, index) in algorithms"
      :key="index"
      class="algo-item"
      :class="`status-${algo.status}`"
      :style="getItemPosition(index)"
      @click="toggleAlgoStatus(index)"
      :title="`${algo.name} - ${getStatusText(algo.status)}`"
    >
      <component 
        :is="getStatusIcon(algo.status)" 
        class="status-svg" 
        :style="{ width: svgSize + 'px', height: svgSize + 'px' }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import StatusRunning from '@/assets/svg/status-running.svg?component';
import StatusIdle from '@/assets/svg/status-idle.svg?component';
import StatusError from '@/assets/svg/status-error.svg?component';

interface Props {
  svgSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  svgSize: 80
});

type AlgoStatus = 'running' | 'idle' | 'error';

interface Algorithm {
  name: string;
  version: string;
  status: AlgoStatus;
}

const algorithms = ref<Algorithm[]>([
  { name: 'DeepSort', version: '2.1.3', status: 'running' },
  { name: 'YOLO-v8', version: '1.0.2', status: 'running' },
  { name: 'ResNet', version: '3.2.1', status: 'idle' },
  { name: 'Transformer', version: '2.0.5', status: 'error' },
  { name: 'BERT', version: '1.5.0', status: 'idle' },
  { name: 'GPT-Mini', version: '0.9.1', status: 'running' }
]);

function getItemPosition(index: number): { left: string; top: string; zIndex: number } {
  const cols = 3;
  const col = index % cols;
  const row = Math.floor(index / cols);

  const s = props.svgSize;
  const cos30 = 0.866;
  const sin30 = 0.5;

  const gap = 0 * s;
  const stepX = s * cos30 + gap;
  const stepY = s * sin30 + gap;

  const isoX = (col - row) * stepX;
  const isoY = (col + row) * stepY;

  const startX = 1.3 * s;
  const startY = 0.5 * s;

  const zIndex = (row + col) * cols + (cols - col);

  return {
    left: `${startX + isoX}px`,
    top:  `${startY + isoY}px`,
    zIndex
  };
}

function getStatusIcon(status: AlgoStatus) {
  const iconMap = {
    running: StatusRunning,
    idle: StatusIdle,
    error: StatusError
  };
  return iconMap[status];
}

function getStatusText(status: AlgoStatus): string {
  const textMap = {
    running: '运行中',
    idle: '空闲',
    error: '异常'
  };
  return textMap[status];
}

function toggleAlgoStatus(index: number) {
}
</script>

<style scoped lang="scss">
.algo-repo {
  width: 100%;
  height: 100%;
  position: relative;
}

.algo-item {
  position: absolute;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-4px);
    
    .data-svg {
      filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4));
    }
  }
  
  &:active {
    transform: translateY(-2px);
  }
}

.status-svg {
  display: block;
  transition: all 0.3s ease;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.status-running {
  .status-svg {
    animation: pulse 2s infinite;
  }
}

.status-error {
  .status-svg {
    animation: pulse-warning 2s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes pulse-warning {
  0%, 100% { 
    opacity: 1;
    transform: scale(1);
  }
  50% { 
    opacity: 0.7;
    transform: scale(1.05);
  }
}
</style>
