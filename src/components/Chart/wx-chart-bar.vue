<template>
    <div class="wx-chart-bar" ref="wxChartBar"></div>
</template>
<script>
import * as echarts from "echarts";
import { cloneDeep, throttle } from "lodash";
import { mergeObject } from "@/utils/spod";
import { useCssVar } from "@vueuse/core";
const SERIES_ITEM = {
    type: "bar",
    data: [],
    barMaxWidth: 30,
    barMinWidth: 20,
    barWidth: 20,
};
export default {
    name: "WxChartBar",
    components: {},
    props: {
        /**
         * 柱状图数据
         * 
         */
        data: {
            type: Array,
            default: () => [],
        },
        // 类别，['name1','name2']
        categories: {
            type: Array,
            default: () => [],
        },
        // 配置项
        options: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    data() {
        const colorPrimary = useCssVar("--el-color-primary").value;
        const colorSuccess = useCssVar("--el-color-success").value;
        const colorText = useCssVar("--el-text-color").value;
        return {
            chart: null,
            option: {
                color: [colorPrimary, colorSuccess],
                legend: {
                    show: false,
                },
                grid: {
                    top: "10%",
                    bottom: "10%",
                },
                 /**
                 * 柱状图数据 - x轴
                 * 
                 */
                xAxis: {
                    type: "category",
                    data: [],
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        show: false,
                    },
                },
                /**
                 * 柱状图数据 - y轴
                 * 
                 */
                yAxis: {
                    type: "value",
                    axisLabel: {
                        color: colorText,
                    },
                    axisLine: {
                        lineStyle: {
                            color: colorPrimary,
                            opacity: 0.3,
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            color: colorPrimary,
                            opacity: 0.3,
                        },
                    },
                },
                series: [],
            },
        };
    },
    computed: {},
    watch: {
         /**
         * 数据改变
         * 
         */
        data: {
            handler() {
                this.$nextTick(() => {
                    this.init();
                });
            },
            immediate: true,
            deep: true,
        },
        /**
         * 类型改变
         * 
         */
        categories: {
            handler() {
                this.$nextTick(() => {
                    this.init();
                });
            },
            immediate: true,
            deep: true,
        },
        /**
         * 配置改变
         * 
         */
        options: {
            handler() {
                this.$nextTick(() => {
                    this.init();
                });
            },
            immediate: true,
            deep: true,
        },
    },
     /**
     * 创建时
     * 
     */
    created() {},
    /**
     * 挂载
     * 
     */
    mounted() {
        this.observeContainerSize();
    },
    /**
     * 销毁前
     * 
     */
    beforeUnmount() {
        if (this.chart) {
            this.chart.clear();
            this.chart = null;
        }
    },
    /**
     * 函数
     * 
     */
    methods: {
        /**
         * 监听容器大小改变
         */
        observeContainerSize() {
            const { wxChartBar } = this.$refs;
            if (wxChartBar && window.ResizeObserver) {
                this.obs = new window.ResizeObserver(
                    throttle(() => {
                        this.resize();
                    }, 100)
                );
                this.obs.observe(wxChartBar);
            }
        },
        /**
         * 初始化加载
         * 
         */
        init() {
            if (!this.chart) {
                this.chart = echarts.init(this.$refs.wxChartBar);
            }
            this.option.xAxis.data = this.categories;
            this.option.legend.data = this.categories;
            this.option.series = [];
            if (this.data.length > 0) {
                this.data.forEach((item, index) => {
                    const seriesItem = cloneDeep(SERIES_ITEM);
                    seriesItem.data = item;
                    seriesItem.name = this.categories[index];
                    this.option.series.push(seriesItem);
                });
            } else {
                const seriesItem = cloneDeep(SERIES_ITEM);
                this.option.series.push(seriesItem);
            }
            if (this.options.dataZoom && this.options.dataZoom[0]) {
                const len = this.categories.length;
                const showLength = Math.ceil(((this.options.dataZoom[0].showLength || 0) / 100) * len) || (9 / len) * 100;
                // eslint-disable-next-line vue/no-mutating-props
                this.options.dataZoom[0].end = len > 9 ? showLength : 100;
            }
            this.option = mergeObject(this.option, this.options);
            this.chart.setOption(this.option);
        },
        /**
         * 适合画布
         * 
         */
        resize() {
            if (this.chart) {
                this.chart.resize();
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.wx-chart-bar {
    width: 100%;
    height: 100%;
}
</style>
