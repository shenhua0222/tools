<template>
  <div ref="chartRef" class="m-pie-chart"></div>
</template>

<script setup>
import * as echarts from "echarts";
import { ref, onMounted } from "vue";
import { getAlgoTypeStatisticsForHome } from "@/api/TD/algorithm";
defineOptions({ name: "PieChart" });

const chartRef = ref(null);
let chartInstance = null;

const option = {
  title: {
    show: false,
  },
  // tooltip: {
  //   trigger: "item",
  // },
  legend: {
    right: "10px",
    textStyle: {
      color: "#fff",
    }
  },
  color: ["#2369FF", "#00FFFB "],
  series: [
    {
      type: "pie",
      radius: "50%",
      center: ["50%", "55%"],
      data: [
        { value: 16, name: "深度学习" },
        { value: 17, name: "强化学习" }
      ],
      label: {
        color: "#fff",
        show: true,
        formatter: "{b} {c} ({d}%)"
      }
    }
  ]
};

const initChart = async () => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
    const res = await getAlgoTypeStatisticsForHome();
    const seriesData = (res.data.result_dict || []).map((i) => ({
      value: i.count || 0,
      name: i.comment,
    }));
    option.series[0].data = seriesData;
    chartInstance.setOption(option);
  }
};

onMounted(() => {
  initChart();
});
</script>

<style scoped lang="scss">
.m-pie-chart {
  background-image: url("../../../images/home/algorithm-upgrade-bg.png");
  background-size: 100% 100%;
  height: 100%;
}
</style>