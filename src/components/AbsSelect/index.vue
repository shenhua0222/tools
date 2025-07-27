<template>
  <TooltipOrPopover v-bind="tooltip" :disabled="isEmpty(tooltip)">
    <el-select
      v-bind="attrs"
      v-model="internalValue"
      :loading="loading"
      @change="handleChange"
      :class="selectClass"
    >
      <el-option
        v-for="option in selectOptions"
        :key="option[valueKey]"
        :label="option[labelKey]"
        :value="option[valueKey]"
      />
    </el-select>
  </TooltipOrPopover>
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue'
import { ElSelect, ElOption, ElLoading } from 'element-plus'
import { isEmpty } from 'lodash'
import { css } from '@emotion/css'

import TooltipOrPopover from '../TooltipOrPopover'

export default defineComponent({
  name: 'AbsSelect',
  components: {
    TooltipOrPopover,
    ElSelect,
    ElOption,
    ElLoading,
  },
  props: {
    modelValue: {
      type: [String, Number, Array],
      default: '',
    },
    options: {
      type: [Array, Function],
      required: true,
    },
    tooltip: {
      type: Object,
    },
    labelKey: {
      type: String,
      default: 'label',
    },
    valueKey: {
      type: String,
      default: 'value',
    },
    debounce: {
      type: Number,
      default: 300,
    },
    defaultFirstOption: {
      type: Boolean,
      default: false,
    },
    transform: {
      type: Function,
      default: data => data,
    },
    width: {
      type: String,
      default: '150px',
    },
  },
  setup(props, { emit, attrs }) {
    const internalOptions = ref([])
    const loading = ref(false)
    const internalValue = ref(props.modelValue)
    console.log('internalValue', internalValue)

    const loadOptions = async (params = {}) => {
      loading.value = true
      emit('startLoading')
      try {
        const data = typeof props.options === 'function' ? await props.options(params) : props.options
        internalOptions.value = props.transform(data)
        emit('success', data)
      } catch (error) {
        console.error('Error loading options:', error)
        emit('error', error)
      } finally {
        loading.value = false
        emit('endLoading')
      }
    }

    watch(() => props.options, () => {
      loadOptions()
    }, { immediate: true })

    watch(() => props.modelValue, (newValue) => {
      internalValue.value = newValue
    })

    const handleChange = (newValue) => {
      console.log('Selected value: ', newValue)
      internalValue.value = newValue
      const selectedOption = internalOptions.value.find(option => option[props.valueKey] === newValue)
      emit('update:modelValue', newValue)
      emit('change', newValue, selectedOption)
    }

    const selectOptions = computed(() => (internalOptions.value || []).map(option => ({
      label: option[props.labelKey],
      value: option[props.valueKey],
      ...option,
    })))
    console.log('selectOptions', selectOptions)

    const selectClass = css`
      width: ${props.width};
    `

    return {
      tooltip: props.tooltip,
      attrs,
      isEmpty,
      selectOptions,
      internalValue,
      loading,
      handleChange,
      labelKey: props.labelKey,
      valueKey: props.valueKey,
      selectClass,
    }
  },
})
</script>