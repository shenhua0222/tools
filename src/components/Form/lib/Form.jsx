/**
 * @file Form.jsx
 * @description 动态表单组件，支持通过schema配置生成表单
 * @author TD
 */
import { defineComponent, ref, computed, unref, watch, onMounted } from "vue";
import propTypes from "vue-types";
import { ElForm, ElFormItem, ElRow, ElCol } from "element-plus";
import { componentMap } from "./helper/componentMap";
import { getSlot } from "./helper/util";
import {
    setTextPlaceholder,
    setGridProp,
    setComponentProps,
    setItemComponentSlots,
    initModel,
} from "./helper";
import { useRenderSelect } from "./components/useRenderSelect";
import { useRenderRadio } from "./components/useRenderRadio";
import { useRenderCheckbox } from "./components/useRenderCheckbox";
import { findIndex } from "./helper/util";
import { get, set, isEmpty, merge } from "lodash-es";
import "./Form.scss";
import { ComponentNameEnum } from "./types";
const { renderSelectOptions } = useRenderSelect();
const { renderRadioOptions } = useRenderRadio();
const { renderCheckboxOptions } = useRenderCheckbox();
const prefixCls = "el-form";
/**
 * 定义动态表单组件，支持通过schema配置生成表单
 */
export default defineComponent({
    name: "Form",
    props: {
        /**
         * 生成Form的布局结构数组
         * 
         */
        schema: {
            type: Array,
            default: () => [],
        },
        /**
         * 是否需要栅格布局
         * 
         */
        isCol: propTypes.bool.def(true),
        /**
         * 表单数据对象
         * 
         */
        model: {
            type: Object,
            default: () => ({}),
        },
        /**
         * 是否自动设置placeholder
         * 
         */
        autoSetPlaceholder: propTypes.bool.def(true),
        /**
         * 是否自定义内容
         * 
         */
        isCustom: propTypes.bool.def(false),
        /**
         * 表单label宽度
         * 
         */
        labelWidth: propTypes.oneOfType([String, Number]).def("auto"),
        rules: {
            type: Object,
            default: () => ({}),
        },
        labelPosition: propTypes.oneOf(["left", "right", "top"]).def("right"),
        labelSuffix: propTypes.string.def(""),
        hideRequiredAsterisk: propTypes.bool.def(false),
        requireAsteriskPosition: propTypes.oneOf(["left", "right"]).def("left"),
        showMessage: propTypes.bool.def(true),
        inlineMessage: propTypes.bool.def(false),
        statusIcon: propTypes.bool.def(false),
        validateOnRuleChange: propTypes.bool.def(true),
        size: {
            type: String,
            default: undefined,
        },
        disabled: propTypes.bool.def(false),
        scrollToError: propTypes.bool.def(false),
        scrollToErrorOffset: propTypes
            .oneOfType([Boolean, Object])
            .def(undefined),
        // onValidate: {
        //   type: Function as PropType<(prop: FormItemProp, isValid: boolean, message: string) => void>,
        //   default: () => {}
        // }
    },
    emits: ["register", "update:model"],
    setup(props, { slots, expose, emit }) {
        /**
         * element form 实例
         * 
         */
        const elFormRef = ref();
        /**
         * 存储合并后的props
         */
        const mergeProps = ref({});
        /**
         * 计算属性，用于合并默认props和动态props
         */
        const getProps = computed(() => {
            const propsObj = { ...props };
            Object.assign(propsObj, unref(mergeProps));
            return propsObj;
        });
        /**
         * 存储表单实例
         * 
         */
        const formComponents = ref({});
        /**
         * 存储form-item实例
         * 
         */
        const formItemComponents = ref({});
        /**
         * 表单数据
         * 
         */
        const formModel = ref({ ...props.model });
        /**
         * 监听formModel变化
         * 
         */
        watch(
            formModel.value,
            () => {
                emit("update:model", unref(formModel));
            },
            { deep: true },
        );
        /**
         * 表单挂载后注册实例
         */
        onMounted(() => {
            emit("register", unref(elFormRef)?.$parent, unref(elFormRef));
        });
        /**
         * 表单操作方法
         */
        /**
         * 设置表单值
         */
        const setValues = (data = {}) => {
            formModel.value = Object.assign(unref(formModel), data);
        };
        /**
         * 更新指定字段的值
         */
        const updateModelByKey = (key, data) => {
            set(formModel.value, key, data);
        };
        /**
         * 动态更新表单属性
         */
        const setProps = (props = {}) => {
            mergeProps.value = Object.assign(unref(mergeProps), props);
        };
        /**
         * schema操作方法集合
         */
        /**
         * 删除指定字段的schema
         */
        const delSchema = (field) => {
            const { schema } = unref(getProps);
            const index = findIndex(schema, (v) => v.field === field);
            if (index > -1) {
                schema.splice(index, 1);
            }
        };
        /**
         * 添加新的schema
         */
        const addSchema = (formSchema, index) => {
            const { schema } = unref(getProps);
            if (index !== void 0) {
                schema.splice(index, 0, formSchema);
                return;
            }
            schema.push(formSchema);
        };
        /**
         * 设置schema属性
         */
        const setSchema = (schemaProps) => {
            const { schema } = unref(getProps);
            for (const v of schema) {
                for (const item of schemaProps) {
                    if (v.field === item.field) {
                        console.log(v, item)
                        set(v, item.path, item.value);
                    }
                }
            }
        };
        /**
         * 处理选项数据获取
         */
        const getOptions = async (fn, item) => {
            const params = item?.params || {};
            const options = await fn({ ...unref(formModel), ...params });
            setSchema([
                {
                    field: item.field,
                    path:
                        item.component === ComponentNameEnum.TREE_SELECT ||
                        item.component === ComponentNameEnum.TRANSFER
                            ? "componentProps.data"
                            : "componentProps.options",
                    value: options,
                },
            ]);
        };

        /**
         * @description: 获取getMapSchema
         * @param prop 表单字段
         */
        const getMapSchema = () => {
            const { schema = unref(getProps).schema } = unref(mergeProps)
            return new Map(schema.map((item) => [item.field, item]))
        }

        /**
         * 修改联动字段
         * 
         */
        const changeLinkage = (field) => {
            const mapSchema = getMapSchema();
            let currentItem = mapSchema.get(field);

            if (
                !currentItem ||
                !currentItem.nextField ||
                !mapSchema.has(currentItem.nextField)
            )
                return;

            const behindKeys = {};
            const behindSchemas = [];

            /**
             * 遍历联动链条
             * 
             */
            while (currentItem?.nextField) {
                const nextField = currentItem.nextField;
                const nextItem = mapSchema.get(nextField);

                if (!nextItem) break;

                if (!isEmpty(get(unref(formModel), nextField))) {
                    behindKeys[nextField] = undefined;
                }
                // if (nextItem.optionApi && nextItem.componentProps?.pending) {
                //     behindSchemas.push(
                //         {
                //             field: nextField,
                //             path: "componentProps.pending",
                //             value: false,
                //         },
                //         {
                //             field: nextField,
                //             path: "componentProps.options",
                //             value: [],
                //         }
                //     );
                // }

                /**
                 * 重新请求接口
                 * 
                 */
                if (nextItem.optionApi && !isEmpty(get(unref(formModel), currentItem.field))) { // 当前字段有值，则重新请求接口
                    getOptions(nextItem.optionApi, nextItem)
                }

                /**
                 * 更新 currentItem 继续遍历
                 * 
                 */
                currentItem = nextItem;
            }

            if (!isEmpty(behindKeys)) {
                setValues(behindKeys);
            }
            // if (!isEmpty(behindSchemas)) {
            //     setSchema(behindSchemas);
            // }
        };
        /**
         * @description: 获取表单组件实例
         * @param filed 表单字段
         */
        const getComponentExpose = (filed) => {
            return unref(formComponents)[filed];
        };
        /**
         * @description: 获取formItem实例
         * @param filed 表单字段
         */
        const getFormItemExpose = (filed) => {
            return unref(formItemComponents)[filed];
        };
        /**
         * 设置组件引用映射
         */
        const setComponentRefMap = (ref, filed) => {
            formComponents.value[filed] = ref;
        };
        /**
         * 设置表单项引用映射
         */
        const setFormItemRefMap = (ref, filed) => {
            formItemComponents.value[filed] = ref;
        };
        /**
         * 重新加载API选项数据
         */
        const reloadApiOptions = async (field) => {
            const { schema } = unref(getProps);

            const fieldsToReload = field
                ? schema.filter((item) => item.field === field && item.optionApi)
                : schema.filter((item) => item.optionApi);

            if (!fieldsToReload.length) return;

            for (const item of fieldsToReload) {
                await getOptions(item.optionApi, item);
            }
        };
        /**
         * 对外暴露的方法和属性
         */
        expose({
            setValues,
            updateModelByKey,
            formModel,
            setProps,
            delSchema,
            addSchema,
            setSchema,
            getComponentExpose,
            getFormItemExpose,
            reloadApiOptions
        });
        /**
         * 监听表单结构化数组，重新生成formModel
         * 
         */
        watch(
            () => unref(getProps).schema,
            (schema = []) => {
                formModel.value = initModel(schema, unref(formModel));
            },
            {
                immediate: true,
                deep: true,
            }
        );
        /**
         * 渲染包裹标签，是否使用栅格布局
         * 
         */
        const renderWrap = () => {
            const { isCol } = unref(getProps);
            const content = isCol ? (
                <ElRow gutter={20}>{renderFormItemWrap()}</ElRow>
            ) : (
                renderFormItemWrap()
            );
            return content;
        };
        /**
         * 是否要渲染el-col
         * 
         */
        const renderFormItemWrap = () => {
            /**
             * hidden属性表示隐藏，不做渲染
             * 
             */
            const { schema = [], isCol } = unref(getProps);
            return schema
                .filter((v) => {
                    /**
                     * 当前prevProp为空 && remove属性为true，则不渲染
                     * 
                     */
                    return (
                        !(v.prevField && isEmpty(get(unref(formModel), v.prevField))) &&
                        !v.remove
                    );
                })
                .map((item) => {
                    /**
                     * 如果是 Divider 组件，需要自己占用一行
                     * 
                     */
                    const isDivider = item.component === "Divider";
                    const Com = componentMap["Divider"];
                    return isDivider ? (
                        <Com
                            {...{
                                contentPosition: "left",
                                ...item.componentProps,
                            }}
                        >
                            {item?.label}
                        </Com>
                    ) : isCol ? (
                    /**
                     * 如果需要栅格，需要包裹 ElCol
                     * 
                     */
                        <ElCol {...setGridProp(item.colProps)}>
                            {renderFormItem(item)}
                        </ElCol>
                    ) : (
                        renderFormItem(item)
                    );
                });
        };
        /**
         * 渲染formItem
         * 
         */
        const renderFormItem = (item) => {
            /**
             * 如果有optionApi，优先使用optionApi, 并且options不存在或者为空数组
             * 
             */
            if (
                item.optionApi &&
                (!item.componentProps?.options ||
                    !item.componentProps?.options.length)
            ) {
            /**
             * 内部自动调用接口，不影响其它渲染
             * 
             */
                getOptions(item.optionApi, item);
            }
            const formItemSlots = {
                default: () => {
                    if (item?.formItemProps?.slots?.default) {
                        return item?.formItemProps?.slots?.default(
                            formModel.value,
                            unref(item?.componentProps?.options),
                            item
                        );
                    } else {
                        const Com = componentMap[item.component];
                        const { autoSetPlaceholder } = unref(getProps);
                        const componentSlots =
                            item?.componentProps?.slots || {};
                        const slotsMap = {
                            ...setItemComponentSlots(componentSlots),
                        };
                        /**
                         * 如果是select组件，并且没有自定义模板，自动渲染options
                         * 
                         */
                        if (item.component === ComponentNameEnum.SELECT) {
                            slotsMap.default = !componentSlots.default
                                ? () => renderSelectOptions(item)
                                : () => {
                                      return componentSlots.default(
                                          unref(item?.componentProps?.options)
                                      );
                                  };
                        }
                        /**
                         * 虚拟列表
                         * 
                         */
                        if (
                            item.component === ComponentNameEnum.SELECT_V2 &&
                            componentSlots.default
                        ) {
                            slotsMap.default = ({ item }) => {
                                return componentSlots.default(item);
                            };
                        }
                        /**
                         * 单选框组和按钮样式
                         * 
                         */
                        if (
                            item.component === ComponentNameEnum.RADIO_GROUP ||
                            item.component === ComponentNameEnum.RADIO_BUTTON
                        ) {
                            slotsMap.default = !componentSlots.default
                                ? () => renderRadioOptions(item)
                                : () => {
                                      return componentSlots.default(
                                          unref(item?.componentProps?.options)
                                      );
                                  };
                        }
                        /**
                         * 多选框组和按钮样式
                         * 
                         */
                        if (
                            item.component ===
                                ComponentNameEnum.CHECKBOX_GROUP ||
                            item.component === ComponentNameEnum.CHECKBOX_BUTTON
                        ) {
                            slotsMap.default = !componentSlots.default
                                ? () => renderCheckboxOptions(item)
                                : () => {
                                      return componentSlots.default(
                                          unref(item?.componentProps?.options)
                                      );
                                  };
                        }
                        const Comp = () => {
                            /**
                             *  如果field是多层路径，需要转换成对象
                             * 
                             */
                            const itemVal = computed({
                                get: () => {
                                    return get(formModel.value, item.field);
                                },
                                set: (val) => {
                                    set(formModel.value, item.field, val);
                                    changeLinkage(item.field);
                                },
                            });
                            return item.component ===
                                ComponentNameEnum.UPLOAD ? (
                                <Com
                                    vModel:file-list={itemVal.value}
                                    ref={(el) =>
                                        setComponentRefMap(el, item.field)
                                    }
                                    {...(autoSetPlaceholder &&
                                        setTextPlaceholder(item))}
                                    {...setComponentProps(item)}
                                    style={
                                        item.componentProps?.style || {
                                            width: "100%",
                                        }
                                    }
                                >
                                    {{ ...slotsMap }}
                                </Com>
                            ) : (
                                <Com
                                    vModel={itemVal.value}
                                    ref={(el) =>
                                        setComponentRefMap(el, item.field)
                                    }
                                    {...(autoSetPlaceholder &&
                                        setTextPlaceholder(item))}
                                    {...setComponentProps(item)}
                                    style={
                                        item.componentProps?.style || {
                                            width: "100%",
                                        }
                                    }
                                >
                                    {{ ...slotsMap }}
                                </Com>
                            );
                        };
                        return <>{Comp()}</>;
                    }
                },
            };
            if (item?.formItemProps?.slots?.label) {
                formItemSlots.label = (...args) => {
                    return item?.formItemProps?.slots?.label(...args);
                };
            }
            if (item?.formItemProps?.slots?.error) {
                formItemSlots.error = (...args) => {
                    return item?.formItemProps?.slots?.error(...args);
                };
            }
            return (
                <ElFormItem
                    v-show={!item.hidden}
                    ref={(el) => setFormItemRefMap(el, item.field)}
                    {...(item.formItemProps || {})}
                    prop={item.field}
                    label={item.label || ""}
                >
                    {formItemSlots}
                </ElFormItem>
            );
        };
        /**
         *  过滤传入Form组件的属性
         * 
         */
        const getFormBindValue = () => {
            /**
             *  避免在标签上出现多余的属性
             * 
             */
            const delKeys = [
                "schema",
                "isCol",
                "autoSetPlaceholder",
                "isCustom",
                "model",
            ];
            const props = { ...unref(getProps) };
            for (const key in props) {
                if (delKeys.indexOf(key) !== -1) {
                    delete props[key];
                }
            }
            return props;
        };
        return () => (
            <ElForm
                ref={elFormRef}
                {...getFormBindValue()}
                model={
                    unref(getProps).isCustom ? unref(getProps).model : formModel
                }
                class={prefixCls}
                // @ts-ignore
                onSubmit={(e) => {
                    e.preventDefault();
                }}
            >
                {{
                    /**
                     *  如果需要自定义，就什么都不渲染，而是提供默认插槽
                     * 
                     */
                    default: () => {
                        const { isCustom } = unref(getProps);
                        return isCustom
                            ? getSlot(slots, "default")
                            : renderWrap();
                    },
                }}
            </ElForm>
        );
    },
});
