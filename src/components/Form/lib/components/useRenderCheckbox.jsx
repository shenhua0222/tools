/**
 * @file useRenderCheckbox.jsx
 * @description Checkbox组件渲染钩子
 * @author TD
 */
import { ComponentNameEnum } from '../types';
import { ElCheckbox, ElCheckboxButton } from 'element-plus';
 /**
  * Checkbox组件渲染钩子
  * @returns {Object} 包含渲染Checkbox选项的方法
  */
export const useRenderCheckbox = () => {
    /**
     * 渲染Checkbox组件的选项
     * @param {Object} item - 表单项配置对象
     * @returns {Array} 渲染后的Checkbox选项节点数组
     */
    const renderCheckboxOptions = (item) => {
        /**   
         *  如果有别名，就取别名
         *  
         */
        const componentProps = item?.componentProps;
         /**
         * 配置选项的值、标签和禁用状态的别名
         */
        const valueAlias = componentProps?.props?.value || 'value';
        const labelAlias = componentProps?.props?.label || 'label';
        const disabledAlias = componentProps?.props?.disabled || 'disabled';
         /**
         * 根据组件类型决定使用Checkbox还是CheckboxButton
         */
        const Com = (item.component === ComponentNameEnum.CHECKBOX_GROUP ? ElCheckbox : ElCheckboxButton);
        return componentProps?.options?.map((option) => {
            const { ...other } = option;
            return (<Com {...other} disabled={option[disabledAlias || 'disabled']} label={option[labelAlias || 'label']} value={option[valueAlias || 'value']}></Com>);
        });
    };
    return {
        renderCheckboxOptions
    };
};
