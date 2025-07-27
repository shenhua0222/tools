<template>
    <span>
        <el-tooltip v-if="tooltip && !isEmpty(tooltip.content)" v-bind="tooltip">
            <span class="v-text">{{ truncatedText }}</span>
        </el-tooltip>
        <el-tooltip v-if="tooltip && !tooltip.content" v-bind="tooltip">{{
            tooltipText
        }}</el-tooltip>
        <el-tooltip v-if="showCopy" content="复制" placement="top">
            <!-- <Icon
                iconName="el-icon-copy-document"
                class="copyBtn"
                style="margin-left: 4px"
                :data-clipboard-text="tooltipText"
                @click="copyText"
            /> -->
            <el-icon
                class="copyBtn"
                style="margin-left: 4px"
                :data-clipboard-text="tooltipText"
                @click="copyText"
            >
                <CopyDocument />
            </el-icon>
        </el-tooltip>
    </span>
</template>

<script>
import { ref, computed } from "vue";
import Clipboard from "clipboard";
import { ElMessage } from "element-plus";
import { isObject, pick, isEmpty } from "lodash";
/**
 *  复制
 */
function doCopy(selector) {
    const clipboard = new Clipboard(selector);
    const destroy = () => {
        clipboard.off("error");
        clipboard.off("success");
        clipboard.destroy();
    };
    clipboard.on("success", () => {
        ElMessage({ type: "success", message: "复制成功" });
        destroy();
    });
    clipboard.on("error", () => {
        destroy();
    });
    return destroy;
}

function truncate(s, option = {}) {
    s = s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const l = option.isUnicodeLength ? byteLength(s) : s.length;
    const textLength = option.textLength || 12;
    let truncateStr = s;
    if (l > textLength) {
        truncateStr = s.substr(0, textLength);
        if (truncateStr.length < s.length) {
            truncateStr += "...";
        }
    }
    return truncateStr;
}

// const pick = function (o, props) {
//     return props.reduce(function (p, k) {
//         return p[k] = o[k], p
//     }, {})
// }

/**
 *  清理
 */
function cleanup(obj) {
    for (let key in obj) {
        if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
            delete obj[key]; // 删除空属性
        }
        // 可以添加其他清理逻辑，根据需要进行格式转换或验证
    }
    return obj;
}

/**
 *  提示语
 */
function extractTooltip(props) {
    const tooltipProp = props.tooltip;
    // tooltip is disabled manually
    if (tooltipProp === false) {
        return null;
    }
    let tooltip = tooltipProp;
    if (!isObject(tooltip)) {
        tooltip = {
            content: "",
            placement: "top",
        };
        if (typeof tooltipProp === "string") {
            tooltip.content = tooltipProp;
        }
    }
    return Object.assign(
        tooltip,
        cleanup(pick(props, ["tooltipClass", "popperClass", "placement"]))
    );
}

export default {
    props: {
        text: String,
        placement: { type: String, default: "top" },
        truncateLength: { type: [String, Number], default: -1 },
        isUnicodeLength: { type: Boolean, default: false },
        tooltip: { type: [Object, String, Boolean] },
        tooltipClass: { type: String, default: "v-text" },
        popperClass: { type: String, default: "v-text--tooltip" },
        showCopy: { type: Boolean, default: false },
    },
    setup(props, { slots }) {
        const text = ref("");
        const tooltip = extractTooltip(props);
        const tooltipText = ref("");

        const getText = () => {
            let txt = props.text;
            if (!txt) {
                const slot = slots.default;
                txt = (slot && slot[0].text) || "";
            }
            return txt;
        };

        text.value = getText();

        const showCopy = computed(() => {
            return props.showCopy && tooltipText.value;
        });

        const truncatedText = computed(() => {
            let txt = text.value;
            const truncateLength = parseInt(props.truncateLength, 10);
            if (truncateLength !== -1) {
                tooltipText.value = txt;
                txt = truncate(txt, {
                    textLength: truncateLength,
                    isUnicodeLength: props.isUnicodeLength,
                });
            } else {
                tooltipText.value = txt;
            }
            return txt;
        });
        /**
         *  复制文字
         */
        const copyText = () => {
            doCopy(".copyBtn");
        };

        return { truncatedText, tooltip, tooltipText, showCopy, copyText, isEmpty };
    },
};
</script>
