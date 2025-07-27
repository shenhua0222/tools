<template>
    <div class="wx-chart-radar" ref="wxRadar"></div>
</template>
<script>
import { useCssVar } from "@vueuse/core";
import * as echarts from "echarts";
import { throttle } from "lodash";
export default {
    name: "WxChartRadar",
    components: {},
    props: {
        // 雷达图数据，[{value: []},{value: []}]
        data: {
            type: Array,
            default: () => [],
        },
        // 类别
        categories: {
            type: Array,
            default: () => [],
        },
        // 配置项
        options: {
            type: Object,
            default: () => Object.create({}),
        },
    },
    data() {
        const colorPrimary = useCssVar("--el-color-primary").value;
        const colorError = useCssVar("--el-color-error").value;
        const colorText = useCssVar("--el-text-color").value;
        return {
            option: {
                radar: {
                    shape: "polygon",
                    splitNumber: 4,
                    radius: 105,
                    center: ["50%", "50%"],
                    // 区域分割射线
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: colorPrimary,
                        },
                    },
                    // 区域包围线
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: colorPrimary,
                        },
                    },
                    splitArea: {
                        show: false,
                    },
                    // 数据类别项
                    indicator: [],
                    axisNameGap: 4,
                    axisName: {
                        show: true,
                        rich: {
                            a: {
                                color: colorText,
                                lineHeight: 14,
                                align: "left",
                            },
                            b: {
                                align: "left",
                                padding: [0, 2],
                                lineHeight: 14,
                                color: colorError,
                            },
                            c: {
                                color: colorText,
                                width: 12,
                                height: 12,
                                lineHeight: 14,
                                align: "center",
                            },
                            d: {
                                align: "left",
                                color: colorText,
                                padding: [-20, 0, 0, -30],
                                lineHeight: 14,
                            },
                            e: {
                                color: colorError,
                                padding: [-20, 0, 0, 2],
                            },
                            f: {
                                align: "right",
                                color: colorText,
                                padding: [-20, 0, 0, 0],
                                lineHeight: 14,
                            },
                            g: {
                                color: colorError,
                                align: "right",
                                padding: [-20, -30, 0, 2],
                            },
                        },
                        formatter: (a, b) => {
                            const index = this.categories.findIndex((item) => item.name === a);
                            if ([1, 2, 4, 5].includes(index)) {
                                const i = String(a).indexOf("(");
                                const nameArr = String(a)
                                    .slice(0, i)
                                    .split("")
                                    .map((str) => `{c|${str}}`)
                                    .join("\n");
                                return `${nameArr}\n{c|${String(a).slice(i)}}\n{b|${Number(b.value).toFixed(2)}}`;
                            }
                            return `{a|${a}}{b|${Number(b.value).toFixed(2)}}`;
                        },
                    },
                },
                series: [
                    {
                        type: "radar",
                        smooth: true,
                        // 数据区域顶点
                        itemStyle: {
                            color: colorPrimary,
                            opacity: 0,
                        },
                        // 数据区域边线
                        lineStyle: {
                            color: colorPrimary,
                            width: 1,
                            opacity: 1,
                            smooth: true,
                        },
                        legend: {
                            show: false,
                        },
                        // 数据区域
                        areaStyle: {
                            color: colorPrimary,
                            opacity: 0.382,
                        },
                        data: [],
                    },
                ],
            },
        };
    },
    computed: {},
    watch: {
        /**
         * 数据改变, [{value: [1,2,3]}]
         * 
         */
        data: {
            handler() {
                this.init();
            },
            immediate: true,
            deep: true,
        },
        /**
         * 类型改变, [{name: '',max: 100, value: 1}]
         * 
         */
        categories: {
            handler() {
                this.init();
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
                this.init();
            },
            immediate: true,
            deep: true,
        },
    },
    /**
     * 创建前
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
     *卸载前
     * 
     */
    beforeUnmount() {
        if(this.chart){
            this.chart.clear()
            this.chart = null;
        }
    },
     /**
     * 方法
     * 
     */
    methods: {
        /**
         * 监听容器大小改变
         * 
         */
        observeContainerSize() {
            const { wxRadar } = this.$refs;
            if (wxRadar && window.ResizeObserver) {
                this.obs = new window.ResizeObserver(
                    throttle(() => {
                        this.resize();
                    }, 100)
                );
                this.obs.observe(wxRadar);
            }
        },
        /**
         * 初始化
         * 
         */
        init() {
            this.$nextTick().then(() => {
                if (!this.chart) {
                    this.chart = echarts.init(this.$refs.wxRadar);
                }
                // this.option = Object.assign(this.option, this.options)
                this.option.radar.indicator = this.categories;
                this.option.series[0].data = this.data;
                this.chart.setOption(this.option);
            });
        },
        /**
         * 重新调整布局
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
.wx-chart-radar {
    width: 100%;
    height: 100%;
}
</style>
