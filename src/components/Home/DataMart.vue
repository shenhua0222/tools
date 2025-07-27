<template>
  <div class="data-mart">
    <div
      v-for="(dataset, index) in datasets"
      :key="index"
      class="data-item"
      :style="getItemPosition(index)"
      @click="selectDataset(index)"
      :title="`${dataset.name} - ${dataset.size}`"
    >
      <component 
        :is="DataMartIcon" 
        class="data-svg" 
        :style="{ width: svgSize + 'px', height: svgSize + 'px' }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DataMartIcon from '@/assets/svg/data-mart.svg?component';

interface Props {
  svgSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  svgSize: 80
});

interface Dataset {
  name: string;
  size: string;
  type: string;
}

const datasets = ref<Dataset[]>([
  { name: 'UserData', size: '2.3GB', type: 'CSV' },
  { name: 'ImageSet', size: '856MB', type: 'JPG' },
  { name: 'LogFiles', size: '4.1GB', type: 'JSON' },
  { name: 'ModelData', size: '1.7GB', type: 'PKL' },
  { name: 'VideoSet', size: '12.5GB', type: 'MP4' },
  { name: 'TextCorpus', size: '3.2GB', type: 'TXT' }
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

function selectDataset(index: number) {
  console.log(`选择了数据集: ${datasets.value[index].name}`);
}
</script>

<style scoped lang="scss">
.data-mart {
  width: 100%;
  height: 100%;
  position: relative;
}

.data-item {
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

.data-svg {
  display: block;
  transition: all 0.3s ease;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  animation: breathe 4s ease-in-out infinite;
  
  &:hover {
    filter: drop-shadow(0 8px 16px rgba(6, 182, 212, 0.3));
  }
}

@keyframes breathe {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.9;
  }
}

.data-item:nth-child(1) .data-svg { animation-delay: 0s; }
.data-item:nth-child(2) .data-svg { animation-delay: 0.5s; }
.data-item:nth-child(3) .data-svg { animation-delay: 1s; }
.data-item:nth-child(4) .data-svg { animation-delay: 1.5s; }
.data-item:nth-child(5) .data-svg { animation-delay: 2s; }
.data-item:nth-child(6) .data-svg { animation-delay: 2.5s; }
</style>
