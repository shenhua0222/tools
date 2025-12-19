<script setup lang="ts">
import { computed } from "vue";

interface Props {
  name: string;
  size?: number | string;
  color?: string;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: "currentColor",
});

const iconStyle = computed(() => {
  const sizeValue =
    typeof props.size === "number" ? `${props.size}px` : props.size;
  return {
    width: sizeValue,
    height: sizeValue,
    color: props.color,
  };
});

const symbolId = computed(() => {
  return `#icon-${props.name}`;
});
</script>

<template>
  <span class="svg-icon" :style="iconStyle" :class="class">
    <svg>
      <use :xlink:href="symbolId" />
    </svg>
  </span>
</template>

<style scoped>
.svg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: -0.125em;
  flex-shrink: 0;
}

.svg-icon svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}
</style>
