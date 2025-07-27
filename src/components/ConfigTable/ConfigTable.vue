<template>
  <div class="td-config-table-wrapper">
    <table class="td-config-table">
      <tr>
        <th v-for="(col, i) in cols" :key="i">{{ t(col.head) }}</th>
        <th v-if="!disabled" class="col-actions">{{ t('Actions') }}</th>
      </tr>
      <tr v-for="(row, i) in currentValue" :key="i">
        <td v-for="(col, ii) in cols" :key="ii">
          <span v-if="disabled" class="text">{{ row[col.prop] }}</span>
          <template v-else>
            <el-form-item 
              v-if="col.type === 'upload'" 
              class="special-error" 
              :prop="formName + '.' + i + '.' + col.prop" 
              :rules="col.rules || []" 
              label-width="0"
            >
              <el-upload v-model="row[col.prop]" :auto-upload="true" :show-name="true" />
            </el-form-item>
            <el-form-item 
              v-else-if="col.type === 'select'" 
              :prop="formName + '.' + i + '.' + col.prop" 
              :rules="col.rules || []" 
              label-width="0" 
              status-tooltip 
              :show-message="false"
            >
              <el-select v-model="row[col.prop]" :options="col.options" />
            </el-form-item>
            <el-form-item 
              v-else 
              :prop="formName + '.' + i + '.' + col.prop" 
              :rules="col.rules || []" 
              label-width="0" 
              status-tooltip 
              :show-message="false"
            >
              <el-input v-model.trim="row[col.prop]" />
            </el-form-item>
          </template>
        </td>
        <td v-if="!disabled" class="col-actions">
          <el-button type="primary" :icon="Delete" @click="del(i)" />
        </td>
      </tr>
      <tr></tr>
    </table>
    <div v-if="!disabled" class="td-config-table-row-add">
      <el-button type="primary" :icon="Plus" @click="add">{{ t('Add Row') }}</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
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
  cols: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'change'])
const { t } = useI18n()
const currentValue = ref([])

watch(() => props.modelValue, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    currentValue.value = newVal
  }
}, { immediate: true })

const add = () => {
  const item = {}
  props.cols.forEach(col => {
    item[col.prop] = col.default || ''
  })
  currentValue.value.push(item)
  emit('update:modelValue', currentValue.value)
  emit('change', currentValue.value)
}

const del = (i) => {
  currentValue.value.splice(i, 1)
  emit('update:modelValue', currentValue.value)
  emit('change', currentValue.value)
}
</script>

<style lang="scss">
@import './ConfigTable.scss';
</style>
