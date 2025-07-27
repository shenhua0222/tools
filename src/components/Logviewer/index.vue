<template>
    <div class="v-log-viewer">
        <!-- <Toolbar
            ref="toolbar"
            @mounted="toolbarMounted"
            :copyMessage="logList.join('')"
            :context="this"
            v-model="settings"
            :prefs="{ enableSearch }"
        />
        <Search
            v-model="keyword"
            :matchCount="matchCount"
            @prev="searchPrev"
            @next="searchNext"
            @enter="searchNext"
            @close="settings.searchOpen = false"
            v-if="settings.searchOpen"
        /> -->
        <el-scrollbar height="300px">
            <div class="log-box" :style="{ marginLeft: `${lineWidth}px` }">
                <ul class="wrap" :class="{ hl: enableClick }">
                    <template v-if="logList.length > 0">
                        <li
                            v-for="(message, index) in logList"
                            :key="index"
                            class="line"
                            :class="{ plain: !message }"
                        >
                            <div
                                class="gutter-wrapper"
                                :style="{ left: `${position[0] - lineWidth}px` }"
                            >
                                <div
                                    class="linenumber"
                                    :style="{ width: `${lineWidth}px` }"
                                >
                                    {{ getLineNum(index) }}
                                </div>
                            </div>
                            <div
                                class="txt"
                                v-html="message || '<br />'"
                            />
                        </li>
                    </template>
                    <template v-else>
                        <li class="line">暂无日志</li>
                    </template>
                </ul>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
// import Toolbar from './Toolbar';
// import Search from './Search';
import { get, isEmpty, cloneDeep } from "lodash";

const CLASS_NAME = "search-hightlight";

export default {
    // components: {
    //     Toolbar,
    //     Search,
    // },
    props: {
        logArr: {
            type: Array,
            default: () => [],
        },
        logStr: {
            type: String,
        },
        enableSearch: {
            type: Boolean,
            default: true,
        },
        enableClick: {
            type: Boolean,
            default: false,
        },
        height: {
            type: [String, Number],
            default: "",
        },
        noDataTxt: {
            type: String,
            default: "No Data",
        },
    },
    setup(props) {
        const logList = ref([]);
        const keyword = ref("");
        const matchCount = ref(0);
        const settings = ref({
            autoWrap: false,
            searchOpen: false,
        });

        const position = ref([0, 0]);
        const backupLog = ref([]);
        const lineDomArr = ref([]);
        const lineWidth = ref(40);
        /**
         *  监听
         */
        watch(
            () => props.logArr,
            (val) => {
                if (!isEmpty(val)) {
                    const arr = cloneDeep(val);
                    logList.value = arr;
                } else {
                    logList.value = []
                }
            },{ immediate: true },
        )

        const getLineNum = (index) => {
            return (index || index === 0) && logList.value.length
                ? index + 1
                : "";
        };

        return {
            logList,
            keyword,
            matchCount,
            settings,
            position,
            backupLog,
            lineDomArr,
            lineWidth,
            getLineNum,
        };
    },
};
</script>
<style lang="scss" scoped>
.v-log-viewer {
    position: relative;
    width: 100%;
    max-height: 800px;
    color: #fff;
    background-color: var(--td-color-process-bg);
    .log-box {
        ul {
            margin: 16px 0;
            font-family: monospace;
            list-style-type: none;
            .line {
                line-height: 8px;
                white-space: pre-line;
                position: relative;
                .gutter-wrapper {
                    position: absolute;
                    height: 100%;
                    z-index: 4;
                    top: 2px;
                }
                .linenumber {
                    position: absolute;
                    line-height: 16px;
                    height: 100%;
                    padding-right: 4px;
                    text-align: right;
                    // background-color: #262f3a;
                    cursor: default;
                    z-index: 4;
                    color: #888;;
                }
                .txt {
                    min-width: 100%;
                    line-height: 16px;
                    display: inline-block;
                    overflow: hidden;
                    padding: 1px 2px;
                }
            }
        }
    }
}
</style>
