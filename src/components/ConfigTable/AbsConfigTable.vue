<template>
  <div class="td-config-table-wrapper">
    <div v-if="!disabled&&adderPosition==='top'" class="td-config-table-top-add">
      <slot name="adder"></slot>
    </div>
    <!-- <span v-if="disabled&&currentValue.length===0">{{''|emptyFilter}}</span> -->
    <el-table :data="currentValue" class="v-config-table" :row-class-name="rowClassName" :cell-class-name="cellClassName" border :show-overflow-tooltip="showOverflowTooltip">
      <template v-if="!$slots.default">
        <el-table-column v-for="(col, i) in colsMap" :key="i" :label="col.head" :width="col.width" :prop="col.prop" :resizable="true">
          <template #default="{ row, $index }">
            <span v-if="disabled || row.disabled">{{formatText(row, col)}}</span>
            <template v-else>
              <el-form-item v-if="col.type==='upload'" class="special-error" :prop="`${formName}.${$index}.${col.prop}`" :rules="col.rules||[]" label-width="0">
                <el-upload v-model="row[col.prop]" :auto-upload="true" :show-name="true" :disabled="row.disabled" />
              </el-form-item>
              <el-form-item v-else-if="col.type==='select'" :prop="`${formName}.${$index}.${col.prop}`" :rules="col.rules||[]" status-tooltip :show-message="false">
                <el-select v-model="row[col.prop]" v-bind="col.props" class="v-form--ctl" :disabled="row.disabled">
                  <el-option
                    v-for="option in col.options"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-else-if="col.type==='textarea'" :prop="`${formName}.${$index}.${col.prop}`" :rules="col.rules||[]" status-tooltip :show-message="false">
                <el-input v-model.trim="row[col.prop]" type="textarea" :placeholder="col.placeholder||''" :rows="1" class="v-form--ctl" :disabled="row.disabled" />
              </el-form-item>
              <el-form-item v-else-if="col.type==='number'" :prop="`${formName}.${$index}.${col.prop}`" :rules="col.rules||[]" status-tooltip :show-message="false">
                <el-input-number v-model="row[col.prop]" :min="col.min||0" :max="col.max" :placeholder="col.placeholder||''" class="v-form--ctl" :disabled="row.disabled" />
              </el-form-item>
              <el-form-item v-else :prop="`${formName}.${$index}.${col.prop}`" :rules="col.rules||[]" status-tooltip :show-message="false">
                <el-input v-model.trim="row[col.prop]" v-bind="col.props" class="v-form--ctl" :disabled="row.disabled" />
              </el-form-item>
            </template>
          </template>
        </el-table-column>
      </template>
      <slot></slot>
      <el-table-column v-if="!disabled&&enableAction" label="操作" :width="actionColWidth">
        <template #default="{ row, $index }">
          <slot name="actions" :index="$index" :item="row"></slot>
          <el-button v-if="!hideDel" class="v-config-table-action-btn" type="text" icon="Delete" :disabled="disableDel(row, $index) || row.disabled" @click="del($index)" />
        </template>
      </el-table-column>
      <template v-if="!disabled&&adderPosition==='bottom'&&enableAction" #append>
        <slot name="adder">
          <div class="v-config-table-adder-bottom">
            <el-button type="text" icon="Plus" @click="add">添加</el-button>
          </div>
        </slot>
      </template>
    </el-table>
  </div>
</template>
<script setup>
import { ref, watch, computed } from 'vue'
import { isFunction } from '@/views/business/TD/utils'
import './ConfigTable.scss'

const props = defineProps({
  formName: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  enableAction: {
    type: Boolean,
    default: true
  },
  modelValue: {
    type: Array,
    default: () => []
  },
  adderPosition: {
    type: String,
    default: 'bottom'
  },
  colsMap: {
    type: Array,
    default: () => []
  },
  actionColWidth: {
    type: [String, Number],
    default: 50
  },
  rowClassName: {
    type: Function,
    default: () => ''
  },
  cellClassName: {
    type: Function,
    default: () => ''
  },
  onAdd: {
    type: Function,
    default: null
  },
  onDelete: {
    type: Function,
    default: null
  },
  beforeDelete: {
    type: Function,
    default: null
  },
  disableDelete: {
    type: Function,
    default: null
  },
  afterDelete: {
    type: Function,
    default: null
  },
  hideDel: {
    type: Boolean,
    default: false
  },
  showOverflowTooltip: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const currentValue = ref([])

watch(() => props.modelValue, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    currentValue.value = newVal
  }
}, { immediate: true })

const formatText = (row, col) => {
  let text = row[col.prop]
  if (col.type === 'select' && col.options) {
    col.options.forEach(v => {
      if (v.value === text && v.label) {
        text = v.label
      }
    })
  }
  return text
}

const disableDel = (item, i) => {
  return isFunction(props.disableDelete) && props.disableDelete(item, i)
}

const add = () => {
  if (typeof props.onAdd === 'function') {
    props.onAdd()
  } else {
    const item = {}
    props.colsMap.forEach(col => {
      item[col.prop] = col.default || ''
    })
    currentValue.value.push(item)
    emit('update:modelValue', currentValue.value)
    emit('change', currentValue.value)
  }
}

const del = (i) => {
  if (typeof props.onDelete === 'function') {
    props.onDelete(i)
    return
  }
  if (typeof props.beforeDelete === 'function' && !props.beforeDelete()) return
  currentValue.value.splice(i, 1)
  emit('update:modelValue', currentValue.value)
  emit('change', currentValue.value)
  if (typeof props.afterDelete === 'function') {
    props.afterDelete()
  }
}
</script>
<style lang="scss">
@use './ConfigTable.scss' as *;
</style>
