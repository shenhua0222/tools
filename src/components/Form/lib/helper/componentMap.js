/**
 * @file 组件映射配置文件
 * @description Element Plus组件映射关系配置
 * @author TD
 */
import { ElCascader, ElCheckboxGroup, ElColorPicker, ElDatePicker, ElInput, ElInputNumber, ElRadioGroup, ElRate, ElSelect, ElSelectV2, ElSlider, ElSwitch, ElTimePicker, ElTimeSelect, ElTransfer, ElAutocomplete, ElDivider, ElTreeSelect, ElUpload } from 'element-plus';
/**
 * 组件映射表
 * 将自定义组件名称映射到Element Plus的实际组件
 * @constant
 * @type {Object.<string, Component>}
 * @property {Component} RadioGroup - 单选框组
 * @property {Component} RadioButton - 按钮样式的单选框组
 * @property {Component} CheckboxGroup - 复选框组
 * @property {Component} CheckboxButton - 按钮样式的复选框组
 * @property {Component} Input - 输入框
 * @property {Component} Autocomplete - 自动完成输入框
 * @property {Component} InputNumber - 数字输入框
 * @property {Component} Select - 选择器
 * @property {Component} Cascader - 级联选择器
 * @property {Component} Switch - 开关
 * @property {Component} Slider - 滑块
 * @property {Component} TimePicker - 时间选择器
 * @property {Component} DatePicker - 日期选择器
 * @property {Component} Rate - 评分
 * @property {Component} ColorPicker - 颜色选择器
 * @property {Component} Transfer - 穿梭框
 * @property {Component} Divider - 分割线
 * @property {Component} TimeSelect - 时间选择
 * @property {Component} SelectV2 - 选择器V2
 * @property {Component} TreeSelect - 树选择器
 * @property {Component} Upload - 上传
 */
const componentMap = {
    RadioGroup: ElRadioGroup,
    RadioButton: ElRadioGroup,
    CheckboxGroup: ElCheckboxGroup,
    CheckboxButton: ElCheckboxGroup,
    Input: ElInput,
    Autocomplete: ElAutocomplete,
    InputNumber: ElInputNumber,
    Select: ElSelect,
    Cascader: ElCascader,
    Switch: ElSwitch,
    Slider: ElSlider,
    TimePicker: ElTimePicker,
    DatePicker: ElDatePicker,
    Rate: ElRate,
    ColorPicker: ElColorPicker,
    Transfer: ElTransfer,
    Divider: ElDivider,
    TimeSelect: ElTimeSelect,
    SelectV2: ElSelectV2,
    TreeSelect: ElTreeSelect,
    Upload: ElUpload
};
export { componentMap };
