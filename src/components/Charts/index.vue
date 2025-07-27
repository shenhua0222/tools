<template>
  <div ref="chart" :style="{ width: '100%', height: height }"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as echarts from 'echarts';
import ResizeObserver from 'resize-observer-polyfill';

const props = defineProps({
  options: {
    type: Object,
    required: true
  },
  height: {
    type: String,
    default: '100%'
  }
});

const chart = ref(null);
let myChart = null;
let resizeObserver = null;

const hasData = (options) => {
  return options.series && 
         Array.isArray(options.series) && 
         options.series.some(s => s.data && s.data.length > 0);
};

const getEmptyChartOptions = (options) => {
  const baseOptions = {
    title: options.title,
    tooltip: options.tooltip,
    legend: options.legend,
    grid: options.grid,
    xAxis: options.xAxis,
    yAxis: options.yAxis,
    series: [],
    graphic: []  // Default empty graphic
  };
  console.log('options', options)

  if (!hasData(options)) {
    baseOptions.graphic = [{
      type: 'text',
      left: 'center',
      top: 'middle',
      style: {
        // text: '暂无数据',
        fontSize: 14,
        fill: '#999',
        fontWeight: 'normal'
      }
    }];
  }

  return baseOptions;
};

const resizeChart = () => {
  if (myChart) {
    myChart.resize();
  }
};

onMounted(() => {
  if (chart.value) {
    myChart = echarts.init(chart.value);
    if (hasData(props.options)) {
      myChart.setOption(props.options);
    } else {
      myChart.setOption(getEmptyChartOptions(props.options));
    }

    resizeObserver = new ResizeObserver(() => {
      resizeChart();
    });

    resizeObserver.observe(chart.value);
  }
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.unobserve(chart.value);
    resizeObserver.disconnect();
  }
  if (myChart) {
    myChart.dispose();
  }
});

watch(() => props.options, (newOptions) => {
  if (myChart) {
    if (hasData(newOptions)) {
      myChart.clear();
      myChart.setOption(newOptions);
    } else {
      myChart.clear();
      myChart.setOption(getEmptyChartOptions(newOptions));
    }
  }
}, { deep: true });
</script>

<style scoped>
</style>