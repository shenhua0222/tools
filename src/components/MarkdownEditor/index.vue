<template>
  <div class="markdown-editor-wrapper" :style="{ height: !isEdit ? '100%' : typeof height === 'number' ? `${height}px` : height }">
    <MdEditor
      v-if="isEdit"
      v-model="content"
      :height="height"
      :toolbars="toolbars"
      :style="{height: height}"
      :previewTheme="previewTheme"
      @onSave="handleSave"
      @onChange="handleChange"
    />
    <MdPreview
      v-else
      :modelValue="previewContent"
      :previewTheme="previewTheme"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { MdEditor, MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  height: {
    type: [String, Number],
    default: '600px'
  },
  toolbars: {
    type: Array,
    default: () => [
      'bold', 'underline', 'italic', 'strikeThrough', 'title', 'sub', 'sup', 'quote', 'unorderedList', 'orderedList', 'codeRow', 'code', 'link', 'image', 'table', 'mermaid', 'katex', 'save', 'prettier', 'pageFullscreen', 'fullscreen', 'preview', 'htmlPreview', 'catalog', 'github', 'settings'
    ]
  },
  previewTheme: {
    type: String,
    default: 'github'
  }
});

const emit = defineEmits(['update:modelValue', 'save', 'change']);

const content = ref(props.modelValue);

// 允许 html 字符串传入并渲染
const decodeHtmlEntities = (text) => {
  if (!text) return '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

const previewContent = computed(() => decodeHtmlEntities(content.value));

watch(() => props.modelValue, (newVal) => {
  if (newVal !== content.value) {
    content.value = newVal;
  }
});

watch(content, (newVal) => {
  emit('update:modelValue', newVal);
});

const handleSave = (val) => {
  emit('save', val);
};

const handleChange = (val) => {
  emit('change', val);
};
</script>

<style lang="scss" scoped>
.markdown-editor-wrapper {
  width: 100%;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  min-height: 600px;
}
:deep(.md-editor-preview-wrapper) {
  min-height: 600px;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
:deep(img) {
  max-width: 100%;
  height: auto;
}
:deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
}
:deep(th), :deep(td) {
  border: 1px solid var(--el-border-color);
  padding: 8px;
}
</style>
