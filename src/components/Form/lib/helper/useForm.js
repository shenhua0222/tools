import { ref, unref, nextTick } from 'vue';
import { isEmptyVal, isObject } from './util';
export const useForm = () => {
    /**       
     * From实例
     *  
     */
    const formRef = ref();
    /**       
     * ElForm实例
     *  
     */
    const elFormRef = ref();
    /**
     * @param ref Form实例
     * @param elRef ElForm实例
     */
    const register = (ref, elRef) => {
        formRef.value = ref;
        elFormRef.value = elRef;
    };
    const getForm = async () => {
        await nextTick();
        const form = unref(formRef);
        if (!form) {
            console.error('The form is not registered. Please use the register method to register');
        }
        return form;
    };
    /**       
     * 一些内置的方法
     *  
     */
    const methods = {
        /**
         * @description 设置form组件的props
         * @param props form组件的props
         */
        setProps: async (props = {}) => {
            const form = await getForm();
            form?.setProps(props);
            if (props.model) {
                form?.setValues(props.model);
            }
        },
        /**
         * @description 设置form的值
         * @param data 需要设置的数据
         */
        setValues: async (data) => {
            const form = await getForm();
            form?.setValues(data);
        },
        /**
         * @description 设置schema
         * @param schemaProps 需要设置的schemaProps
         */
        setSchema: async (schemaProps) => {
            const form = await getForm();
            form?.setSchema(schemaProps);
        },
        /**
         * @description 新增schema
         * @param formSchema 需要新增数据
         * @param index 在哪里新增
         */
        addSchema: async (formSchema, index) => {
            const form = await getForm();
            form?.addSchema(formSchema, index);
        },
        /**
         * @description 删除schema
         * @param field 删除哪个数据
         */
        delSchema: async (field) => {
            const form = await getForm();
            form?.delSchema(field);
        },
        /**
         * @description 获取表单数据
         * @returns form data
         */
        getFormData: async (filterEmptyVal = true) => {
            const form = await getForm();
            const model = form?.formModel;
            if (filterEmptyVal) {
                // 使用reduce过滤空值，并返回一个新对象
                return Object.keys(model).reduce((prev, next) => {
                    const value = model[next];
                    if (!isEmptyVal(value)) {
                        if (isObject(value)) {
                            if (Object.keys(value).length > 0) {
                                prev[next] = value;
                            }
                        }
                        else {
                            prev[next] = value;
                        }
                    }
                    return prev;
                }, {});
            }
            else {
                return model;
            }
        },
        /**
         * @description 获取表单组件的实例
         * @param field 表单项唯一标识
         * @returns component instance
         */
        getComponentExpose: async (field) => {
            const form = await getForm();
            return form?.getComponentExpose(field);
        },
        /**
         * @description 获取formItem组件的实例
         * @param field 表单项唯一标识
         * @returns formItem instance
         */
        getFormItemExpose: async (field) => {
            const form = await getForm();
            return form?.getFormItemExpose(field);
        },
        /**
         * @description 获取ElForm组件的实例
         * @returns ElForm instance
         */
        getElFormExpose: async () => {
            await getForm();
            return unref(elFormRef);
        },
        getFormExpose: async () => {
            await getForm();
            return unref(formRef);
        }
    };
    return {
        formRegister: register,
        formMethods: methods
    };
};
