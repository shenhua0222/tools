/**
 * @file index.js
 * @description 表单组件类型枚举定义
 * @author TD
 */

/**
 * 表单组件类型枚举
 * 用于表单渲染时的组件映射
 * @enum {string}
 */
export var ComponentNameEnum;
(function (ComponentNameEnum) {
    /*
     * 基础输入组件
     */
    ComponentNameEnum["RADIO_GROUP"] = "RadioGroup";
    ComponentNameEnum["RADIO_BUTTON"] = "RadioButton";
    ComponentNameEnum["CHECKBOX_GROUP"] = "CheckboxGroup";
    ComponentNameEnum["CHECKBOX_BUTTON"] = "CheckboxButton";
    ComponentNameEnum["INPUT"] = "Input";
    ComponentNameEnum["AUTOCOMPLETE"] = "Autocomplete";
    /*
     * 数字和选择类组件
     */
    ComponentNameEnum["INPUT_NUMBER"] = "InputNumber";
    ComponentNameEnum["SELECT"] = "Select";
    ComponentNameEnum["CASCADER"] = "Cascader";
    ComponentNameEnum["SWITCH"] = "Switch";
    ComponentNameEnum["SLIDER"] = "Slider";
    /*
     * 日期和时间组件
     */
    ComponentNameEnum["TIME_PICKER"] = "TimePicker";
    ComponentNameEnum["DATE_PICKER"] = "DatePicker";
     /*
     * 高级输入组件
     */
    ComponentNameEnum["RATE"] = "Rate";
    ComponentNameEnum["COLOR_PICKER"] = "ColorPicker";
    ComponentNameEnum["TRANSFER"] = "Transfer";
    ComponentNameEnum["DIVIDER"] = "Divider";
    ComponentNameEnum["TIME_SELECT"] = "TimeSelect";
    ComponentNameEnum["SELECT_V2"] = "SelectV2";
    ComponentNameEnum["INPUT_PASSWORD"] = "InputPassword";
    ComponentNameEnum["EDITOR"] = "Editor";
    ComponentNameEnum["TREE_SELECT"] = "TreeSelect";
    ComponentNameEnum["UPLOAD"] = "Upload";
    //   JSON_EDITOR = 'JsonEditor',
    //   ICON_PICKER = 'IconPicker',
    //   I_AGREE = 'IAgree'
})(ComponentNameEnum || (ComponentNameEnum = {}));
