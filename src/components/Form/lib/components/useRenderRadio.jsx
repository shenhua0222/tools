/**
 * @file useRenderRadio.jsx
 * @description Radio组件渲染钩子
 * @author TD
 */

import { ComponentNameEnum } from '../types';
import { ElRadio, ElRadioButton } from 'element-plus';
 /**
  * Radio组件渲染钩子
  * @returns {Object} 包含渲染Radio选项的方法
  */
export const useRenderRadio = () => {
     /**
     * 渲染Radio组件的选项
     * @param {Object} item - 表单项配置对象
     * @returns {Array} 渲染后的Radio选项节点数组
     */
    const renderRadioOptions = (item) => {
        /**   
         *  如果有别名，就取别名
         *  
         */
        const componentProps = item?.componentProps;
        const valueAlias = componentProps?.props?.value || 'value';
        const labelAlias = componentProps?.props?.label || 'label';
        const disabledAlias = componentProps?.props?.disabled || 'disabled';
        /**
         * 根据组件类型决定使用Radio还是RadioButton
         */
        const Com = (item.component === ComponentNameEnum.RADIO_GROUP ? ElRadio : ElRadioButton);
        return componentProps?.options?.map((option) => {
            const { ...other } = option;
            return (<Com {...other} disabled={option[disabledAlias || 'disabled']} label={option[labelAlias || 'label']} value={option[valueAlias || 'value']}></Com>);
        });
    };
    return {
        renderRadioOptions
    };
};
